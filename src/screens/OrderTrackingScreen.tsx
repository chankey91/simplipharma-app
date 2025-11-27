import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

type OrderTrackingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OrderTracking'
>;

type OrderTrackingScreenRouteProp = RouteProp<RootStackParamList, 'OrderTracking'>;

interface Props {
  navigation: OrderTrackingScreenNavigationProp;
  route: OrderTrackingScreenRouteProp;
}

export const OrderTrackingScreen: React.FC<Props> = ({ navigation, route }) => {
  const { order } = route.params;
  const [currentLocation, setCurrentLocation] = useState<any>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return '#FF9800';
      case 'Dispatched':
        return '#2196F3';
      case 'Delivered':
        return '#4CAF50';
      case 'Cancelled':
        return '#F44336';
      default:
        return '#999';
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Dispatched':
        return 1;
      case 'Delivered':
        return 2;
      default:
        return 0;
    }
  };

  const currentStep = getStatusStep(order.status);
  const steps = ['Order Placed', 'Dispatched', 'Delivered'];

  // Default location (you can customize this)
  const defaultLocation = order.trackingLocation || {
    latitude: currentLocation?.latitude || 19.0760,
    longitude: currentLocation?.longitude || 72.8777,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: defaultLocation.latitude,
            longitude: defaultLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={defaultLocation}
            title="Delivery Location"
            description={order.deliveryAddress}
          >
            <View style={styles.markerContainer}>
              <Ionicons name="location" size={40} color="#F44336" />
            </View>
          </Marker>
        </MapView>
      </View>

      <View style={styles.content}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order #{order.id.substring(0, 8)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
        </View>

        <View style={styles.timeline}>
          {steps.map((step, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View
                  style={[
                    styles.timelineDot,
                    index <= currentStep && styles.timelineDotActive,
                  ]}
                >
                  {index < currentStep && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                {index < steps.length - 1 && (
                  <View
                    style={[
                      styles.timelineLine,
                      index < currentStep && styles.timelineLineActive,
                    ]}
                  />
                )}
              </View>
              <View style={styles.timelineRight}>
                <Text
                  style={[
                    styles.timelineStep,
                    index <= currentStep && styles.timelineStepActive,
                  ]}
                >
                  {step}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <Text style={styles.sectionContent}>{order.deliveryAddress}</Text>
        </View>

        {order.estimatedDelivery && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estimated Delivery</Text>
            <Text style={styles.sectionContent}>{order.estimatedDelivery}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.medicines.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>₹{order.totalAmount.toFixed(2)}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mapContainer: {
    height: 300,
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: 300,
  },
  markerContainer: {
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  timeline: {
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotActive: {
    backgroundColor: '#4CAF50',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
  },
  timelineLineActive: {
    backgroundColor: '#4CAF50',
  },
  timelineRight: {
    flex: 1,
    justifyContent: 'center',
  },
  timelineStep: {
    fontSize: 16,
    color: '#999',
  },
  timelineStepActive: {
    color: '#333',
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
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
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
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
});

