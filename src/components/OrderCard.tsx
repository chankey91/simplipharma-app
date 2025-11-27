import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Order, OrderStatus } from '../types';

interface OrderCardProps {
  order: Order;
  isAdmin?: boolean;
  onUpdateStatus?: (orderId: string, newStatus: OrderStatus) => void;
  onReorder?: () => void;
  onCancel?: () => void;
  onTrack?: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ 
  order, 
  isAdmin = false, 
  onUpdateStatus,
  onReorder,
  onCancel,
  onTrack
}) => {
  const getStatusColor = (status: OrderStatus) => {
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
  
  const formatDate = (date: Date | any) => {
    if (!date) return 'N/A';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case 'Pending':
        return 'Dispatched';
      case 'Dispatched':
        return 'Delivered';
      default:
        return null;
    }
  };
  
  const nextStatus = getNextStatus(order.status);
  
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.orderId}>Order #{order.id.substring(0, 8)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>
      
      {isAdmin && order.retailerEmail && (
        <Text style={styles.retailer}>Retailer: {order.retailerEmail}</Text>
      )}
      
      <Text style={styles.date}>{formatDate(order.orderDate)}</Text>
      
      <View style={styles.divider} />
      
      <Text style={styles.itemsTitle}>Items:</Text>
      {order.medicines.map((item, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemQuantity}>x{item.quantity}</Text>
          <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</Text>
        </View>
      ))}
      
      <View style={styles.divider} />
      
      <View style={styles.footer}>
        <Text style={styles.totalLabel}>Total Amount:</Text>
        <Text style={styles.totalAmount}>₹{order.totalAmount.toFixed(2)}</Text>
      </View>
      
      {isAdmin && onUpdateStatus && nextStatus && (
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => onUpdateStatus(order.id, nextStatus)}
        >
          <Text style={styles.updateButtonText}>
            Mark as {nextStatus}
          </Text>
        </TouchableOpacity>
      )}

      {!isAdmin && (
        <View style={styles.actionButtons}>
          {onTrack && (order.status === 'Dispatched' || order.status === 'Pending') && (
            <TouchableOpacity style={styles.actionButton} onPress={onTrack}>
              <Text style={styles.actionButtonText}>Track Order</Text>
            </TouchableOpacity>
          )}
          {onReorder && order.status === 'Delivered' && (
            <TouchableOpacity style={[styles.actionButton, styles.reorderButton]} onPress={onReorder}>
              <Text style={styles.actionButtonText}>Reorder</Text>
            </TouchableOpacity>
          )}
          {onCancel && order.status === 'Pending' && (
            <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={onCancel}>
              <Text style={styles.actionButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  retailer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
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
    color: '#333',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2196F3',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  reorderButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});

