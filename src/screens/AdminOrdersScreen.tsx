import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import { Order, OrderStatus } from '../types';
import { fetchAllOrders, updateOrderStatus } from '../api/firebase';
import { OrderCard } from '../components/OrderCard';

type DateFilter = 'today' | 'week' | 'month' | 'custom' | 'all';

export const AdminOrdersScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  // Date filter states
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [datePickerMode, setDatePickerMode] = useState<'start' | 'end'>('start');
  
  // Export modal
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrdersByDate();
  }, [orders, dateFilter, startDate, endDate]);

  const loadOrders = async () => {
    try {
      const data = await fetchAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const filterOrdersByDate = () => {
    let filtered = [...orders];
    const now = new Date();
    
    switch (dateFilter) {
      case 'today':
        filtered = orders.filter(order => {
          const orderDate = order.orderDate instanceof Date ? order.orderDate : new Date(order.orderDate);
          return isSameDay(orderDate, now);
        });
        break;
        
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - 7);
        filtered = orders.filter(order => {
          const orderDate = order.orderDate instanceof Date ? order.orderDate : new Date(order.orderDate);
          return orderDate >= weekStart && orderDate <= now;
        });
        break;
        
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = orders.filter(order => {
          const orderDate = order.orderDate instanceof Date ? order.orderDate : new Date(order.orderDate);
          return orderDate >= monthStart && orderDate <= now;
        });
        break;
        
      case 'custom':
        const customStart = new Date(startDate);
        customStart.setHours(0, 0, 0, 0);
        const customEnd = new Date(endDate);
        customEnd.setHours(23, 59, 59, 999);
        
        filtered = orders.filter(order => {
          const orderDate = order.orderDate instanceof Date ? order.orderDate : new Date(order.orderDate);
          return orderDate >= customStart && orderDate <= customEnd;
        });
        break;
        
      case 'all':
      default:
        filtered = orders;
    }
    
    setFilteredOrders(filtered);
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      if (datePickerMode === 'start') {
        setStartDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      Alert.alert('Success', `Order status updated to ${newStatus}`);
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const handleExportExcel = async () => {
    setShowExportModal(false);
    setExporting(true);

    try {
      if (filteredOrders.length === 0) {
        Alert.alert('Info', 'No orders to export for selected date range');
        setExporting(false);
        return;
      }

      // Prepare data for Excel
      const exportData = filteredOrders.map((order, index) => ({
        'Sr No': index + 1,
        'Order ID': order.id.substring(0, 8),
        'Order Date': new Date(order.orderDate).toLocaleDateString(),
        'Retailer Email': order.retailerEmail || 'N/A',
        'Status': order.status,
        'Items Count': order.medicines.length,
        'Total Amount': `₹${order.totalAmount.toFixed(2)}`,
        'Delivery Address': order.deliveryAddress || 'N/A',
        'Medicines': order.medicines.map(m => `${m.name} (${m.quantity})`).join(', '),
      }));

      // Create workbook
      const ws = XLSX.utils.json_to_sheet(exportData);
      
      // Set column widths
      ws['!cols'] = [
        { wch: 8 },  // Sr No
        { wch: 15 }, // Order ID
        { wch: 12 }, // Order Date
        { wch: 25 }, // Retailer Email
        { wch: 12 }, // Status
        { wch: 12 }, // Items Count
        { wch: 15 }, // Total Amount
        { wch: 30 }, // Delivery Address
        { wch: 50 }, // Medicines
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Orders');

      // Generate Excel file
      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
      const fileName = `orders_${dateFilter}_${new Date().toISOString().split('T')[0]}.xlsx`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Share file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: 'Save Orders Report',
        });
        Alert.alert('Success', `Exported ${filteredOrders.length} orders to Excel!`);
      } else {
        Alert.alert('Success', `File saved at: ${fileUri}`);
      }
    } catch (error: any) {
      console.error('Export error:', error);
      Alert.alert('Error', error.message || 'Failed to export to Excel');
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setShowExportModal(false);
    setExporting(true);

    try {
      if (filteredOrders.length === 0) {
        Alert.alert('Info', 'No orders to export for selected date range');
        setExporting(false);
        return;
      }

      // Calculate totals
      const totalOrders = filteredOrders.length;
      const totalAmount = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      const statusCounts = {
        Pending: filteredOrders.filter(o => o.status === 'Pending').length,
        Dispatched: filteredOrders.filter(o => o.status === 'Dispatched').length,
        Delivered: filteredOrders.filter(o => o.status === 'Delivered').length,
        Cancelled: filteredOrders.filter(o => o.status === 'Cancelled').length,
      };

      // Generate HTML for PDF
      const html = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
                font-size: 12px;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 3px solid #2196F3;
                padding-bottom: 15px;
              }
              .header h1 {
                color: #2196F3;
                margin: 0 0 10px 0;
              }
              .summary {
                background: #f5f5f5;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
              }
              .summary-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
              }
              .summary-item {
                padding: 8px;
              }
              .summary-label {
                color: #666;
                font-size: 11px;
                margin-bottom: 3px;
              }
              .summary-value {
                font-weight: bold;
                font-size: 14px;
                color: #333;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              th {
                background-color: #2196F3;
                color: white;
                padding: 10px;
                text-align: left;
                font-size: 11px;
              }
              td {
                padding: 8px;
                border-bottom: 1px solid #ddd;
                font-size: 10px;
              }
              tr:nth-child(even) {
                background-color: #f9f9f9;
              }
              .status {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 4px;
                font-size: 9px;
                font-weight: bold;
              }
              .status-pending { background: #FFF3E0; color: #F57C00; }
              .status-dispatched { background: #E3F2FD; color: #1976D2; }
              .status-delivered { background: #E8F5E9; color: #388E3C; }
              .status-cancelled { background: #FFEBEE; color: #D32F2F; }
              .footer {
                margin-top: 30px;
                text-align: center;
                color: #999;
                font-size: 10px;
                border-top: 1px solid #ddd;
                padding-top: 15px;
              }
              .medicines-list {
                font-size: 9px;
                color: #666;
                line-height: 1.4;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>SimpliPharma</h1>
              <h2>Orders Report</h2>
              <p><strong>Period:</strong> ${getDateRangeLabel()}</p>
              <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="summary">
              <h3 style="margin-top: 0;">Summary</h3>
              <div class="summary-grid">
                <div class="summary-item">
                  <div class="summary-label">Total Orders</div>
                  <div class="summary-value">${totalOrders}</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">Total Amount</div>
                  <div class="summary-value">₹${totalAmount.toFixed(2)}</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">Pending</div>
                  <div class="summary-value">${statusCounts.Pending}</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">Dispatched</div>
                  <div class="summary-value">${statusCounts.Dispatched}</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">Delivered</div>
                  <div class="summary-value">${statusCounts.Delivered}</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">Cancelled</div>
                  <div class="summary-value">${statusCounts.Cancelled}</div>
                </div>
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Retailer</th>
                  <th>Status</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Medicines</th>
                </tr>
              </thead>
              <tbody>
                ${filteredOrders.map((order, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${order.id.substring(0, 8)}</td>
                    <td>${new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>${order.retailerEmail || 'N/A'}</td>
                    <td>
                      <span class="status status-${order.status.toLowerCase()}">
                        ${order.status}
                      </span>
                    </td>
                    <td>${order.medicines.length}</td>
                    <td>₹${order.totalAmount.toFixed(2)}</td>
                    <td>
                      <div class="medicines-list">
                        ${order.medicines.map(m => `• ${m.name} (${m.quantity})`).join('<br>')}
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="footer">
              <p>This is a system-generated report from SimpliPharma Admin Panel</p>
              <p>For dispatching and tracking purposes</p>
            </div>
          </body>
        </html>
      `;

      // Generate PDF
      const { uri } = await Print.printToFileAsync({ html });
      const fileName = `orders_report_${dateFilter}_${new Date().toISOString().split('T')[0]}.pdf`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

      // Move file to cache directory
      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });

      // Share file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Save Orders Report',
        });
        Alert.alert('Success', `Exported ${filteredOrders.length} orders to PDF!`);
      } else {
        Alert.alert('Success', `File saved at: ${fileUri}`);
      }
    } catch (error: any) {
      console.error('PDF export error:', error);
      Alert.alert('Error', error.message || 'Failed to export to PDF');
    } finally {
      setExporting(false);
    }
  };

  const getDateRangeLabel = (): string => {
    switch (dateFilter) {
      case 'today':
        return 'Today';
      case 'week':
        return 'Last 7 Days';
      case 'month':
        return 'This Month';
      case 'custom':
        return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
      default:
        return 'All Time';
    }
  };

  const renderDateFilter = () => (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.filterButton, dateFilter === 'all' && styles.filterButtonActive]}
          onPress={() => setDateFilter('all')}
        >
          <Text style={[styles.filterText, dateFilter === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, dateFilter === 'today' && styles.filterButtonActive]}
          onPress={() => setDateFilter('today')}
        >
          <Text style={[styles.filterText, dateFilter === 'today' && styles.filterTextActive]}>
            Today
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, dateFilter === 'week' && styles.filterButtonActive]}
          onPress={() => setDateFilter('week')}
        >
          <Text style={[styles.filterText, dateFilter === 'week' && styles.filterTextActive]}>
            This Week
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, dateFilter === 'month' && styles.filterButtonActive]}
          onPress={() => setDateFilter('month')}
        >
          <Text style={[styles.filterText, dateFilter === 'month' && styles.filterTextActive]}>
            This Month
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, dateFilter === 'custom' && styles.filterButtonActive]}
          onPress={() => {
            setDateFilter('custom');
            setDatePickerMode('start');
            setShowDatePicker(true);
          }}
        >
          <Ionicons name="calendar-outline" size={16} color={dateFilter === 'custom' ? '#fff' : '#2196F3'} />
          <Text style={[styles.filterText, dateFilter === 'custom' && styles.filterTextActive, { marginLeft: 4 }]}>
            Custom
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>All Orders</Text>
          <Text style={styles.headerSubtitle}>
            {filteredOrders.length} orders {dateFilter !== 'all' && `(${getDateRangeLabel()})`}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={() => setShowExportModal(true)}
          disabled={exporting || filteredOrders.length === 0}
        >
          {exporting ? (
            <ActivityIndicator size="small" color="#4CAF50" />
          ) : (
            <Ionicons name="download-outline" size={24} color={filteredOrders.length > 0 ? "#4CAF50" : "#ccc"} />
          )}
        </TouchableOpacity>
      </View>

      {renderDateFilter()}

      {dateFilter === 'custom' && (
        <View style={styles.customDateContainer}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setDatePickerMode('start');
              setShowDatePicker(true);
            }}
          >
            <Ionicons name="calendar" size={16} color="#2196F3" />
            <Text style={styles.dateButtonText}>From: {startDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setDatePickerMode('end');
              setShowDatePicker(true);
            }}
          >
            <Ionicons name="calendar" size={16} color="#2196F3" />
            <Text style={styles.dateButtonText}>To: {endDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>
      )}

      {filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No orders found</Text>
          <Text style={styles.emptySubtext}>
            {dateFilter !== 'all' 
              ? 'Try selecting a different date range'
              : 'Orders from retailers will appear here'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderCard order={item} isAdmin onUpdateStatus={handleUpdateStatus} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={datePickerMode === 'start' ? startDate : endDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* Export Modal */}
      <Modal
        visible={showExportModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Export Orders Report</Text>
            <Text style={styles.modalSubtitle}>
              {filteredOrders.length} orders • {getDateRangeLabel()}
            </Text>

            <TouchableOpacity
              style={styles.exportOption}
              onPress={handleExportExcel}
            >
              <View style={styles.exportIcon}>
                <Ionicons name="document-text" size={32} color="#217346" />
              </View>
              <View style={styles.exportInfo}>
                <Text style={styles.exportTitle}>Excel Format</Text>
                <Text style={styles.exportDesc}>Spreadsheet with all order details</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.exportOption}
              onPress={handleExportPDF}
            >
              <View style={styles.exportIcon}>
                <Ionicons name="document" size={32} color="#D32F2F" />
              </View>
              <View style={styles.exportInfo}>
                <Text style={styles.exportTitle}>PDF Format</Text>
                <Text style={styles.exportDesc}>Professional report for printing</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowExportModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
  },
  filterText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  customDateContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    gap: 12,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateButtonText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#333',
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
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  listContent: {
    paddingVertical: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  exportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 12,
  },
  exportIcon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  exportInfo: {
    flex: 1,
    marginLeft: 16,
  },
  exportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  exportDesc: {
    fontSize: 13,
    color: '#666',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});
