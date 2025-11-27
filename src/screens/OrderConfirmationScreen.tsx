import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, OrderMedicine } from '../types';
import { createOrder, auth, getUserProfile } from '../api/firebase';
import { useCartStore } from '../context/CartContext';

type OrderConfirmationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OrderConfirmation'
>;

type OrderConfirmationScreenRouteProp = RouteProp<RootStackParamList, 'OrderConfirmation'>;

interface Props {
  navigation: OrderConfirmationScreenNavigationProp;
  route: OrderConfirmationScreenRouteProp;
}

export const OrderConfirmationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { cartItems, totalAmount } = route.params;
  const clearCart = useCartStore((state) => state.clearCart);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    const user = auth.currentUser;
    if (!user) {
      setLoadingProfile(false);
      return;
    }

    try {
      const profile = await getUserProfile(user.uid);
      if (profile?.address) {
        setDeliveryAddress(profile.address);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      Alert.alert('Error', 'Please enter delivery address');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'Please login to place order');
      return;
    }

    setLoading(true);
    try {
      const orderMedicines: OrderMedicine[] = cartItems.map((item) => ({
        medicineId: item.medicine.id,
        name: item.medicine.name,
        price: item.medicine.price,
        quantity: item.quantity,
      }));

      const orderId = await createOrder(
        user.uid,
        user.email || '',
        orderMedicines,
        totalAmount,
        deliveryAddress
      );

      clearCart();
      Alert.alert(
        'Order Placed Successfully!',
        `Your order #${orderId.substring(0, 8)} has been placed.`,
        [
          {
            text: 'View Orders',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [
                  { 
                    name: 'MainTabs',
                    state: {
                      routes: [
                        { name: 'MedicineList' },
                        { name: 'Favorites' },
                        { name: 'Cart' },
                        { name: 'Orders' }, // Navigate to Orders tab
                      ],
                      index: 3, // Set Orders tab as active (0-indexed)
                    },
                  },
                ],
              });
            },
          },
          {
            text: 'Continue Shopping',
            onPress: () => navigation.navigate('MainTabs'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Order Failed', error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Order Confirmation</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {cartItems.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemName}>{item.medicine.name}</Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              <Text style={styles.itemPrice}>
                ₹{(item.medicine.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          {loadingProfile ? (
            <View style={styles.loadingAddress}>
              <ActivityIndicator size="small" color="#2196F3" />
              <Text style={styles.loadingText}>Loading address...</Text>
            </View>
          ) : (
            <TextInput
              style={styles.addressInput}
              placeholder="Enter your delivery address"
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          )}
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalAmount}>₹{totalAmount.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.placeOrderButtonText}>Place Order</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  itemName: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#999',
    marginHorizontal: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  addressInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  loadingAddress: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  totalSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2196F3',
  },
  placeOrderButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

