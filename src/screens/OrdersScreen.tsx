import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Order, OrderStatus } from '../types';
import { fetchRetailerOrders, auth, cancelOrder } from '../api/firebase';
import { OrderCard } from '../components/OrderCard';
import { useCartStore } from '../context/CartContext';

export const OrdersScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'All' | OrderStatus>('All');
  const { addToCart, clearCart } = useCartStore();
  const navigation = useNavigation<any>();

  const filters: Array<'All' | OrderStatus> = ['All', 'Pending', 'Dispatched', 'Delivered', 'Cancelled'];

  const loadOrders = async () => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const data = await fetchRetailerOrders(user.uid);
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Refresh orders when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadOrders();
    }, [])
  );

  useEffect(() => {
    filterOrders();
  }, [selectedFilter, orders]);

  const filterOrders = () => {
    if (selectedFilter === 'All') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(o => o.status === selectedFilter));
    }
  };

  const handleReorder = (order: Order) => {
    Alert.alert(
      'Reorder',
      'Add all items from this order to cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reorder',
          onPress: () => {
            clearCart();
            order.medicines.forEach((item) => {
              // Find medicine and add to cart
              addToCart({
                id: item.medicineId,
                name: item.name,
                price: item.price,
                stock: 100, // Default stock
                category: '',
                manufacturer: ''
              }, item.quantity);
            });
            Alert.alert('Success', 'Items added to cart!');
            navigation.navigate('Cart');
          },
        },
      ]
    );
  };

  const handleCancelOrder = async (orderId: string) => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelOrder(orderId, 'Cancelled by customer');
              Alert.alert('Success', 'Order cancelled successfully');
              loadOrders();
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel order');
            }
          },
        },
      ]
    );
  };

  const handleTrackOrder = (order: Order) => {
    navigation.navigate('OrderTracking', { order });
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No orders yet</Text>
        <Text style={styles.emptySubtext}>Your orders will appear here</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onReorder={() => handleReorder(item)}
            onCancel={() => handleCancelOrder(item.id)}
            onTrack={() => handleTrackOrder(item)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  listContent: {
    paddingVertical: 8,
  },
  filterContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});

