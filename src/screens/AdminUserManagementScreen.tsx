import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, createUserAccount, updateUserProfile, getAllUsers } from '../api/firebase';

interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  shopName?: string;
  phoneNumber?: string;
  address?: string;
  createdAt?: any;
}

export const AdminUserManagementScreen: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [shopName, setShopName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setEmail('');
    setPassword('');
    setDisplayName('');
    setShopName('');
    setPhoneNumber('');
    setAddress('');
    setIsAdminUser(false);
    setModalVisible(true);
  };

  const openEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setEmail(user.email);
    setPassword('');
    setDisplayName(user.displayName || '');
    setShopName(user.shopName || '');
    setPhoneNumber(user.phoneNumber || '');
    setAddress(user.address || '');
    setIsAdminUser((user as any).role === 'admin');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }

    if (!editingUser && !password.trim()) {
      Alert.alert('Error', 'Password is required for new users');
      return;
    }

    if (!editingUser && password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    try {
      if (editingUser) {
        // Update existing user
        await updateUserProfile(editingUser.id, {
          displayName,
          shopName,
          phoneNumber,
          address,
          role: isAdminUser ? 'admin' : 'retailer',
        });
        Alert.alert('Success', 'User profile updated successfully');
      } else {
        // Create new user
        const userId = await createUserAccount(email, password, {
          displayName,
          shopName,
          phoneNumber,
          address,
          role: isAdminUser ? 'admin' : 'retailer',
        });
        Alert.alert('Success', `User account created successfully`);
      }
      
      setModalVisible(false);
      loadUsers();
    } catch (error: any) {
      console.error('Save error:', error);
      Alert.alert('Error', error.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const renderUserCard = ({ item }: { item: UserProfile }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={(item as any).role === 'admin' ? 'shield' : 'person-circle'} 
            size={40} 
            color={(item as any).role === 'admin' ? '#4CAF50' : '#2196F3'} 
          />
        </View>
        <View style={styles.cardInfo}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.cardTitle}>{item.displayName || 'Unnamed User'}</Text>
            {(item as any).role === 'admin' && (
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>ADMIN</Text>
              </View>
            )}
          </View>
          <Text style={styles.cardEmail}>{item.email}</Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => openEditModal(item)}
        >
          <Ionicons name="create-outline" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      {(item.shopName || item.phoneNumber) && (
        <View style={styles.cardDetails}>
          {item.shopName && (
            <View style={styles.detailRow}>
              <Ionicons name="storefront-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{item.shopName}</Text>
            </View>
          )}
          {item.phoneNumber && (
            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{item.phoneNumber}</Text>
            </View>
          )}
        </View>
      )}
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
        <Text style={styles.headerTitle}>User Management</Text>
        <Text style={styles.headerSubtitle}>{users.length} total users</Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUserCard}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No users yet</Text>
            <Text style={styles.emptySubtext}>Create your first user account</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity style={styles.fab} onPress={openCreateModal}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Create/Edit User Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingUser ? 'Edit User' : 'Create New User'}
            </Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={[styles.input, editingUser && styles.disabledInput]}
              placeholder="user@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!editingUser}
            />

            {!editingUser && (
              <>
                <Text style={styles.label}>Password *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </>
            )}

            <Text style={styles.label}>Display Name</Text>
            <TextInput
              style={styles.input}
              placeholder="User's full name"
              value={displayName}
              onChangeText={setDisplayName}
            />

            <Text style={styles.label}>Shop Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Shop or business name"
              value={shopName}
              onChangeText={setShopName}
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Contact number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Full address"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.switchContainer}>
              <View style={styles.switchTextContainer}>
                <Text style={styles.switchLabel}>Admin Access</Text>
                <Text style={styles.switchDescription}>
                  {isAdminUser 
                    ? 'User will have admin panel access' 
                    : 'Regular retailer account'}
                </Text>
              </View>
              <Switch
                value={isAdminUser}
                onValueChange={setIsAdminUser}
                trackColor={{ false: '#ccc', true: '#4CAF50' }}
                thumbColor={isAdminUser ? '#fff' : '#f4f3f4'}
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {editingUser ? 'Update User' : 'Create User'}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
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
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  adminBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adminBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  editButton: {
    padding: 8,
  },
  cardDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#999',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  switchTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 13,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

