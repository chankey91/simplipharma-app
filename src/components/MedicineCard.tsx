import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Medicine, Order } from '../types';
import { useCartStore } from '../context/CartContext';
import { shouldShowReorderBadge } from '../utils/recommendations';

interface MedicineCardProps {
  medicine: Medicine;
  userOrders?: Order[];
  showReorderBadge?: boolean;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({ 
  medicine, 
  userOrders = [],
  showReorderBadge = false 
}) => {
  const addToCart = useCartStore((state) => state.addToCart);
  
  const handleAddToCart = () => {
    if (medicine.stock <= 0) {
      Alert.alert('Out of Stock', 'This medicine is currently out of stock');
      return;
    }
    addToCart(medicine, 1);
    Alert.alert('Success', `${medicine.name} added to cart`);
  };

  const needsReorder = showReorderBadge && userOrders.length > 0 && 
    shouldShowReorderBadge(medicine.id, userOrders);
  
  return (
    <View style={styles.card}>
      {needsReorder && (
        <View style={styles.reorderBadge}>
          <Ionicons name="time" size={12} color="#fff" />
          <Text style={styles.reorderBadgeText}> Time to Reorder</Text>
        </View>
      )}
      <View style={styles.header}>
        <Text style={styles.name}>{medicine.name}</Text>
        <Text style={styles.price}>₹{medicine.price.toFixed(2)}</Text>
      </View>
      
      {(medicine.manufacturer || medicine.company) && (
        <Text style={styles.manufacturer}>
          {medicine.manufacturer || medicine.company}
        </Text>
      )}
      {medicine.code && (
        <Text style={styles.code}>Code: {medicine.code}</Text>
      )}
      <Text style={styles.category}>Category: {medicine.category}</Text>
      
      <View style={styles.footer}>
        <Text style={[
          styles.stock,
          medicine.stock <= 0 ? styles.outOfStock : styles.inStock
        ]}>
          {medicine.stock > 0 ? `Stock: ${medicine.stock}` : 'Out of Stock'}
        </Text>
        
        <TouchableOpacity
          style={[
            styles.addButton,
            medicine.stock <= 0 && styles.disabledButton
          ]}
          onPress={handleAddToCart}
          disabled={medicine.stock <= 0}
        >
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  reorderBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  reorderBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2196F3',
  },
  manufacturer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  code: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stock: {
    fontSize: 12,
    fontWeight: '500',
  },
  inStock: {
    color: '#4CAF50',
  },
  outOfStock: {
    color: '#F44336',
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

