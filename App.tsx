import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from './src/api/firebase';
import { RootStackParamList, MainTabParamList } from './src/types';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useCartStore } from './src/context/CartContext';

// Screens
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { MedicineListScreen } from './src/screens/MedicineListScreen';
import { CartScreen } from './src/screens/CartScreen';
import { OrderConfirmationScreen } from './src/screens/OrderConfirmationScreen';
import { OrdersScreen } from './src/screens/OrdersScreen';
import { AdminOrdersScreen } from './src/screens/AdminOrdersScreen';
import { AdminUserManagementScreen } from './src/screens/AdminUserManagementScreen';
import { AdminProductsScreen } from './src/screens/AdminProductsScreen';
import { AdminAccountingScreen } from './src/screens/AdminAccountingScreen';
import { AdminBannersScreen } from './src/screens/AdminBannersScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { MedicineDetailsScreen } from './src/screens/MedicineDetailsScreen';
import { FavoritesScreen } from './src/screens/FavoritesScreen';
import { OrderTrackingScreen } from './src/screens/OrderTrackingScreen';
import { logout, isUserAdmin } from './src/api/firebase';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Global navigation ref
export const navigationRef = React.createRef<NavigationContainerRef<RootStackParamList>>();

interface MainTabsProps {
  isAdmin: boolean;
}

function MainTabs({ isAdmin }: MainTabsProps) {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        },
      ]
    );
  };

  const handleProfile = () => {
    console.log('Profile button pressed!');
    console.log('Navigation ref:', navigationRef.current);
    
    // Use global navigation ref to navigate to Profile
    if (navigationRef.current) {
      console.log('Navigating to Profile...');
      navigationRef.current.navigate('Profile');
    } else {
      console.error('Navigation ref is null!');
      Alert.alert('Error', 'Navigation not ready. Please try again.');
    }
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home';

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'MedicineList') {
              iconName = focused ? 'medical' : 'medical-outline';
            } else if (route.name === 'Favorites') {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === 'Cart') {
              iconName = focused ? 'cart' : 'cart-outline';
            } else if (route.name === 'Orders') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'AdminOrders') {
              iconName = focused ? 'clipboard' : 'clipboard-outline';
            } else if (route.name === 'AdminUsers') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'AdminProducts') {
              iconName = focused ? 'medical' : 'medical-outline';
            } else if (route.name === 'AdminAccounting') {
              iconName = focused ? 'cash' : 'cash-outline';
            } else if (route.name === 'AdminBanners') {
              iconName = focused ? 'megaphone' : 'megaphone-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2196F3',
          tabBarInactiveTintColor: 'gray',
          headerRight: ({ navigation }) => (
            <View style={{ flexDirection: 'row', marginRight: 15 }}>
              {!isAdminMode && (
                <TouchableOpacity 
                  onPress={() => {
                    console.log('Profile button tapped!');
                    try {
                      navigation.navigate('Profile' as never);
                      console.log('Navigation called successfully');
                    } catch (error) {
                      console.error('Navigation error:', error);
                      handleProfile();
                    }
                  }} 
                  style={styles.headerButton}
                >
                  <Ionicons name="person-circle-outline" size={24} color="#666" />
                </TouchableOpacity>
              )}
              {isAdmin && (
                <TouchableOpacity
                  onPress={() => setIsAdminMode(!isAdminMode)}
                  style={styles.headerButton}
                >
                  <Ionicons
                    name={isAdminMode ? 'shield' : 'shield-outline'}
                    size={24}
                    color={isAdminMode ? '#4CAF50' : '#666'}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
                <Ionicons name="log-out-outline" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          ),
        })}
      >
        {!isAdminMode ? (
          <>
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{ 
                title: 'Home',
                headerTitle: 'SimpliPharma',
                headerShown: true
              }}
            />
            <Tab.Screen
              name="MedicineList"
              component={MedicineListScreen}
              options={{ 
                title: 'Browse',
                headerTitle: 'All Medicines'
              }}
            />
            <Tab.Screen
              name="Cart"
              component={CartScreen}
              options={{
                title: 'Cart',
                tabBarBadge: totalItems > 0 ? totalItems : undefined,
              }}
            />
            <Tab.Screen
              name="Orders"
              component={OrdersScreen}
              options={{ title: 'Orders' }}
            />
          </>
        ) : (
          <>
            <Tab.Screen
              name="AdminOrders"
              component={AdminOrdersScreen}
              options={{ 
                title: 'Orders',
                headerTitle: 'Admin - All Orders'
              }}
            />
            <Tab.Screen
              name="AdminUsers"
              component={AdminUserManagementScreen}
              options={{ 
                title: 'Users',
                headerTitle: 'Admin - User Management'
              }}
            />
            <Tab.Screen
              name="AdminProducts"
              component={AdminProductsScreen}
              options={{ 
                title: 'Products',
                headerTitle: 'Admin - Inventory Management'
              }}
            />
            <Tab.Screen
              name="AdminAccounting"
              component={AdminAccountingScreen}
              options={{ 
                title: 'Accounting',
                headerTitle: 'Admin - Accounting & Payments'
              }}
            />
            <Tab.Screen
              name="AdminBanners"
              component={AdminBannersScreen}
              options={{ 
                title: 'Banners',
                headerTitle: 'Admin - Banner Management'
              }}
            />
          </>
        )}
      </Tab.Navigator>
    </>
  );
}

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Check if user is admin
        const adminStatus = await isUserAdmin(user.uid);
        setIsAdmin(adminStatus);
        console.log('User admin status:', adminStatus);
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen
              name="MainTabs"
              options={{ headerShown: false }}
            >
              {() => <MainTabs isAdmin={isAdmin} />}
            </Stack.Screen>
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ 
                title: 'My Profile',
                headerBackTitle: 'Back',
                presentation: 'modal'
              }}
            />
            <Stack.Screen
              name="OrderConfirmation"
              component={OrderConfirmationScreen}
              options={{ 
                title: 'Confirm Order',
                headerBackTitle: 'Back'
              }}
            />
            <Stack.Screen
              name="MedicineDetails"
              component={MedicineDetailsScreen}
              options={{ 
                title: 'Medicine Details',
                headerBackTitle: 'Back'
              }}
            />
            <Stack.Screen
              name="OrderTracking"
              component={OrderTrackingScreen}
              options={{ 
                title: 'Track Order',
                headerBackTitle: 'Back'
              }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  headerButton: {
    marginLeft: 15,
  },
});

