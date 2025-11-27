import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import {
  getAccountingSummary,
  fetchAllOrders,
  getAllUsers,
  getRetailerAccountStatement,
  recordPayment,
  getOrderPayments,
} from '../api/firebase';
import { Order, PaymentMethod, Payment } from '../types';

export const AdminAccountingScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Summary data
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalPaid: 0,
    totalDue: 0,
    totalOrders: 0,
    paidOrders: 0,
    unpaidOrders: 0,
    partialOrders: 0,
  });
  
  // Orders and retailers
  const [orders, setOrders] = useState<Order[]>([]);
  const [retailers, setRetailers] = useState<any[]>([]);
  
  // Payment collection modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [recordingPayment, setRecordingPayment] = useState(false);
  
  // Payment history modal
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [orderPayments, setOrderPayments] = useState<Payment[]>([]);
  
  // Retailer statement modal
  const [showRetailerStatement, setShowRetailerStatement] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState<any>(null);
  const [retailerStatement, setRetailerStatement] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [summaryData, ordersData, retailersData] = await Promise.all([
        getAccountingSummary(),
        fetchAllOrders(),
        getAllUsers(),
      ]);
      
      setSummary(summaryData);
      setOrders(ordersData);
      setRetailers(retailersData);
    } catch (error) {
      console.error('Error loading accounting data:', error);
      Alert.alert('Error', 'Failed to load accounting data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleCollectPayment = (order: Order) => {
    setSelectedOrder(order);
    const dueAmount = order.dueAmount || order.totalAmount;
    setPaymentAmount(dueAmount.toString());
    setPaymentMethod('Cash');
    setPaymentNotes('');
    setShowPaymentModal(true);
  };

  const handleRecordPayment = async () => {
    if (!selectedOrder) return;
    
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    const dueAmount = selectedOrder.dueAmount || selectedOrder.totalAmount;
    if (amount > dueAmount) {
      Alert.alert('Error', `Amount cannot exceed due amount of ₹${dueAmount.toFixed(2)}`);
      return;
    }
    
    setRecordingPayment(true);
    try {
      await recordPayment(
        selectedOrder.id,
        amount,
        paymentMethod,
        paymentNotes,
        'Admin'
      );
      
      Alert.alert('Success', `Payment of ₹${amount.toFixed(2)} recorded successfully!`);
      setShowPaymentModal(false);
      loadData();
    } catch (error: any) {
      console.error('Error recording payment:', error);
      Alert.alert('Error', error.message || 'Failed to record payment');
    } finally {
      setRecordingPayment(false);
    }
  };

  const handleViewPaymentHistory = async (order: Order) => {
    try {
      const payments = await getOrderPayments(order.id);
      setSelectedOrder(order);
      setOrderPayments(payments);
      setShowPaymentHistory(true);
    } catch (error) {
      console.error('Error loading payment history:', error);
      Alert.alert('Error', 'Failed to load payment history');
    }
  };

  const handleViewRetailerStatement = async (retailer: any) => {
    try {
      const statement = await getRetailerAccountStatement(retailer.id);
      setSelectedRetailer(retailer);
      setRetailerStatement(statement);
      setShowRetailerStatement(true);
    } catch (error) {
      console.error('Error loading retailer statement:', error);
      Alert.alert('Error', 'Failed to load retailer statement');
    }
  };

  const handleExportLedger = async () => {
    try {
      if (orders.length === 0) {
        Alert.alert('Info', 'No data to export');
        return;
      }

      // Prepare ledger data
      const ledgerData = orders.map((order, index) => ({
        'Sr No': index + 1,
        'Date': new Date(order.orderDate).toLocaleDateString(),
        'Order ID': order.id.substring(0, 8),
        'Retailer': order.retailerEmail || 'N/A',
        'Order Amount': order.totalAmount.toFixed(2),
        'Paid Amount': (order.paidAmount || 0).toFixed(2),
        'Due Amount': (order.dueAmount || order.totalAmount).toFixed(2),
        'Payment Status': order.paymentStatus || 'Unpaid',
        'Order Status': order.status,
      }));

      // Add summary row
      ledgerData.push({
        'Sr No': '',
        'Date': 'TOTAL',
        'Order ID': '',
        'Retailer': '',
        'Order Amount': summary.totalRevenue.toFixed(2),
        'Paid Amount': summary.totalPaid.toFixed(2),
        'Due Amount': summary.totalDue.toFixed(2),
        'Payment Status': '',
        'Order Status': '',
      });

      // Create workbook
      const ws = XLSX.utils.json_to_sheet(ledgerData);
      ws['!cols'] = [
        { wch: 8 },
        { wch: 12 },
        { wch: 15 },
        { wch: 25 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Ledger');

      // Generate Excel file
      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
      const fileName = `accounting_ledger_${new Date().toISOString().split('T')[0]}.xlsx`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Share file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: 'Save Accounting Ledger',
        });
        Alert.alert('Success', 'Ledger exported successfully!');
      } else {
        Alert.alert('Success', `File saved at: ${fileUri}`);
      }
    } catch (error: any) {
      console.error('Export error:', error);
      Alert.alert('Error', error.message || 'Failed to export ledger');
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case 'Paid': return '#4CAF50';
      case 'Partial': return '#FF9800';
      case 'Unpaid': return '#F44336';
      default: return '#999';
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Accounting & Payments</Text>
          <Text style={styles.headerSubtitle}>Financial Overview</Text>
        </View>
        <TouchableOpacity style={styles.exportButton} onPress={handleExportLedger}>
          <Ionicons name="download-outline" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: '#E3F2FD' }]}>
          <Ionicons name="cash-outline" size={32} color="#2196F3" />
          <Text style={styles.summaryValue}>₹{summary.totalRevenue.toFixed(2)}</Text>
          <Text style={styles.summaryLabel}>Total Revenue</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: '#E8F5E9' }]}>
          <Ionicons name="checkmark-circle-outline" size={32} color="#4CAF50" />
          <Text style={styles.summaryValue}>₹{summary.totalPaid.toFixed(2)}</Text>
          <Text style={styles.summaryLabel}>Collected</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: '#FFEBEE' }]}>
          <Ionicons name="alert-circle-outline" size={32} color="#F44336" />
          <Text style={styles.summaryValue}>₹{summary.totalDue.toFixed(2)}</Text>
          <Text style={styles.summaryLabel}>Outstanding</Text>
        </View>
      </View>

      {/* Payment Status Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Status</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{summary.paidOrders}</Text>
            <Text style={styles.statLabel}>Paid</Text>
            <View style={[styles.statBar, { backgroundColor: '#4CAF50' }]} />
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{summary.partialOrders}</Text>
            <Text style={styles.statLabel}>Partial</Text>
            <View style={[styles.statBar, { backgroundColor: '#FF9800' }]} />
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{summary.unpaidOrders}</Text>
            <Text style={styles.statLabel}>Unpaid</Text>
            <View style={[styles.statBar, { backgroundColor: '#F44336' }]} />
          </View>
        </View>
      </View>

      {/* Outstanding Orders */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Outstanding Payments</Text>
        {orders
          .filter(o => o.paymentStatus !== 'Paid')
          .slice(0, 10)
          .map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderTitle}>#{order.id.substring(0, 8)}</Text>
                  <Text style={styles.orderEmail}>{order.retailerEmail}</Text>
                  <Text style={styles.orderDate}>
                    {new Date(order.orderDate).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.orderAmounts}>
                  <Text style={styles.orderTotal}>₹{order.totalAmount.toFixed(2)}</Text>
                  <Text style={styles.orderPaid}>
                    Paid: ₹{(order.paidAmount || 0).toFixed(2)}
                  </Text>
                  <Text style={[styles.orderDue, { color: getPaymentStatusColor(order.paymentStatus) }]}>
                    Due: ₹{(order.dueAmount || order.totalAmount).toFixed(2)}
                  </Text>
                </View>
              </View>
              <View style={styles.orderActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleCollectPayment(order)}
                >
                  <Ionicons name="cash" size={16} color="#4CAF50" />
                  <Text style={[styles.actionText, { color: '#4CAF50' }]}>Collect</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleViewPaymentHistory(order)}
                >
                  <Ionicons name="list" size={16} color="#2196F3" />
                  <Text style={[styles.actionText, { color: '#2196F3' }]}>History</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </View>

      {/* Retailer Accounts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Retailer Accounts</Text>
        {retailers.slice(0, 10).map((retailer) => {
          const retailerOrders = orders.filter(o => o.retailerId === retailer.id);
          const totalOrdered = retailerOrders.reduce((sum, o) => sum + o.totalAmount, 0);
          const totalDue = retailerOrders.reduce((sum, o) => sum + (o.dueAmount || o.totalAmount), 0);
          
          if (totalOrdered === 0) return null;
          
          return (
            <TouchableOpacity
              key={retailer.id}
              style={styles.retailerCard}
              onPress={() => handleViewRetailerStatement(retailer)}
            >
              <View style={styles.retailerInfo}>
                <Text style={styles.retailerName}>{retailer.displayName || 'Unnamed'}</Text>
                <Text style={styles.retailerEmail}>{retailer.email}</Text>
              </View>
              <View style={styles.retailerAmounts}>
                <Text style={styles.retailerTotal}>₹{totalOrdered.toFixed(2)}</Text>
                {totalDue > 0 && (
                  <Text style={styles.retailerDue}>Due: ₹{totalDue.toFixed(2)}</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Payment Collection Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Collect Payment</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedOrder && (
              <>
                <View style={styles.modalInfo}>
                  <Text style={styles.modalLabel}>Order: #{selectedOrder.id.substring(0, 8)}</Text>
                  <Text style={styles.modalLabel}>
                    Total: ₹{selectedOrder.totalAmount.toFixed(2)}
                  </Text>
                  <Text style={styles.modalLabel}>
                    Paid: ₹{(selectedOrder.paidAmount || 0).toFixed(2)}
                  </Text>
                  <Text style={[styles.modalLabel, { color: '#F44336', fontWeight: 'bold' }]}>
                    Due: ₹{(selectedOrder.dueAmount || selectedOrder.totalAmount).toFixed(2)}
                  </Text>
                </View>

                <Text style={styles.inputLabel}>Payment Amount *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter amount"
                  value={paymentAmount}
                  onChangeText={setPaymentAmount}
                  keyboardType="decimal-pad"
                />

                <Text style={styles.inputLabel}>Payment Method *</Text>
                <View style={styles.methodsContainer}>
                  {(['Cash', 'Card', 'UPI', 'Bank Transfer', 'Cheque'] as PaymentMethod[]).map((method) => (
                    <TouchableOpacity
                      key={method}
                      style={[
                        styles.methodButton,
                        paymentMethod === method && styles.methodButtonActive,
                      ]}
                      onPress={() => setPaymentMethod(method)}
                    >
                      <Text
                        style={[
                          styles.methodText,
                          paymentMethod === method && styles.methodTextActive,
                        ]}
                      >
                        {method}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>Notes (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Add notes..."
                  value={paymentNotes}
                  onChangeText={setPaymentNotes}
                  multiline
                  numberOfLines={3}
                />

                <TouchableOpacity
                  style={styles.recordButton}
                  onPress={handleRecordPayment}
                  disabled={recordingPayment}
                >
                  {recordingPayment ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.recordButtonText}>Record Payment</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Payment History Modal */}
      <Modal
        visible={showPaymentHistory}
        animationType="slide"
        transparent
        onRequestClose={() => setShowPaymentHistory(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Payment History</Text>
              <TouchableOpacity onPress={() => setShowPaymentHistory(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.paymentsList}>
              {orderPayments.length === 0 ? (
                <Text style={styles.emptyText}>No payments recorded</Text>
              ) : (
                orderPayments.map((payment) => (
                  <View key={payment.id} style={styles.paymentItem}>
                    <View style={styles.paymentInfo}>
                      <Text style={styles.paymentAmount}>₹{payment.amount.toFixed(2)}</Text>
                      <Text style={styles.paymentMethod}>{payment.paymentMethod}</Text>
                      <Text style={styles.paymentDate}>
                        {new Date(payment.paymentDate).toLocaleString()}
                      </Text>
                      {payment.notes && (
                        <Text style={styles.paymentNotes}>{payment.notes}</Text>
                      )}
                    </View>
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Retailer Statement Modal */}
      <Modal
        visible={showRetailerStatement}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowRetailerStatement(false)}
      >
        <View style={styles.statementContainer}>
          <View style={styles.statementHeader}>
            <TouchableOpacity onPress={() => setShowRetailerStatement(false)}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.statementTitle}>Account Statement</Text>
            <View style={{ width: 24 }} />
          </View>

          {selectedRetailer && retailerStatement && (
            <ScrollView style={styles.statementContent}>
              <View style={styles.statementInfo}>
                <Text style={styles.statementName}>{selectedRetailer.displayName}</Text>
                <Text style={styles.statementEmail}>{selectedRetailer.email}</Text>
              </View>

              <View style={styles.statementSummary}>
                <View style={styles.statementSummaryItem}>
                  <Text style={styles.statementSummaryLabel}>Total Ordered</Text>
                  <Text style={styles.statementSummaryValue}>
                    ₹{retailerStatement.totalOrdered.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.statementSummaryItem}>
                  <Text style={styles.statementSummaryLabel}>Total Paid</Text>
                  <Text style={[styles.statementSummaryValue, { color: '#4CAF50' }]}>
                    ₹{retailerStatement.totalPaid.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.statementSummaryItem}>
                  <Text style={styles.statementSummaryLabel}>Outstanding</Text>
                  <Text style={[styles.statementSummaryValue, { color: '#F44336' }]}>
                    ₹{retailerStatement.totalDue.toFixed(2)}
                  </Text>
                </View>
              </View>

              <Text style={styles.statementSubtitle}>Order History</Text>
              {retailerStatement.orders.map((order: Order) => (
                <View key={order.id} style={styles.statementOrderCard}>
                  <View style={styles.statementOrderHeader}>
                    <Text style={styles.statementOrderId}>#{order.id.substring(0, 8)}</Text>
                    <Text style={styles.statementOrderDate}>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.statementOrderDetails}>
                    <Text style={styles.statementOrderAmount}>₹{order.totalAmount.toFixed(2)}</Text>
                    <Text style={[
                      styles.statementOrderStatus,
                      { color: getPaymentStatusColor(order.paymentStatus) }
                    ]}>
                      {order.paymentStatus || 'Unpaid'}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>
    </ScrollView>
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
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  exportButton: {
    padding: 8,
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    marginTop: 8,
  },
  orderCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  orderEmail: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  orderDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  orderAmounts: {
    alignItems: 'flex-end',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  orderPaid: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
  },
  orderDue: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  orderActions: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  retailerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  retailerInfo: {
    flex: 1,
  },
  retailerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  retailerEmail: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  retailerAmounts: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  retailerTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  retailerDue: {
    fontSize: 12,
    color: '#F44336',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  modalInfo: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  methodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  methodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  methodButtonActive: {
    backgroundColor: '#2196F3',
  },
  methodText: {
    fontSize: 13,
    color: '#2196F3',
  },
  methodTextActive: {
    color: '#fff',
  },
  recordButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  recordButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentsList: {
    maxHeight: 400,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  paymentMethod: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  paymentDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  paymentNotes: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    padding: 20,
  },
  statementContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statementTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  statementContent: {
    flex: 1,
  },
  statementInfo: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  statementName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  statementEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statementSummary: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statementSummaryItem: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    alignItems: 'center',
  },
  statementSummaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statementSummaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  statementSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    padding: 16,
    paddingBottom: 8,
  },
  statementOrderCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  statementOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statementOrderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  statementOrderDate: {
    fontSize: 12,
    color: '#999',
  },
  statementOrderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statementOrderAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  statementOrderStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
});

