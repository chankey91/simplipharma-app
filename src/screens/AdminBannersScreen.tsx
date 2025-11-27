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
import { getAllBanners, addBanner, updateBanner, deleteBanner } from '../api/firebase';
import { Banner } from '../types';

export const AdminBannersScreen: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [color, setColor] = useState('#FF6B6B');
  const [icon, setIcon] = useState('gift');
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState('1');
  const [linkTo, setLinkTo] = useState('');
  
  const [saving, setSaving] = useState(false);

  // Predefined colors
  const colorOptions = [
    { name: 'Red', value: '#FF6B6B' },
    { name: 'Teal', value: '#4ECDC4' },
    { name: 'Yellow', value: '#FFD93D' },
    { name: 'Green', value: '#95E1D3' },
    { name: 'Purple', value: '#9B59B6' },
    { name: 'Orange', value: '#E67E22' },
    { name: 'Blue', value: '#3498DB' },
    { name: 'Pink', value: '#FFC0CB' },
  ];

  // Predefined icons
  const iconOptions = [
    'gift', 'flash', 'star', 'heart', 'rocket', 'trophy', 
    'medal', 'flame', 'sparkles', 'notifications', 'megaphone'
  ];

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const data = await getAllBanners();
      setBanners(data);
    } catch (error) {
      console.error('Error loading banners:', error);
      Alert.alert('Error', 'Failed to load banners');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadBanners();
  };

  const openCreateModal = () => {
    setEditingBanner(null);
    clearForm();
    setModalVisible(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setTitle(banner.title);
    setSubtitle(banner.subtitle);
    setColor(banner.color);
    setIcon(banner.icon);
    setIsActive(banner.isActive);
    setOrder(banner.order.toString());
    setLinkTo(banner.linkTo || '');
    setModalVisible(true);
  };

  const clearForm = () => {
    setTitle('');
    setSubtitle('');
    setColor('#FF6B6B');
    setIcon('gift');
    setIsActive(true);
    setOrder('1');
    setLinkTo('');
  };

  const handleSave = async () => {
    if (!title.trim() || !subtitle.trim()) {
      Alert.alert('Error', 'Please fill in title and subtitle');
      return;
    }

    setSaving(true);
    try {
      const bannerData: any = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        color,
        icon,
        isActive,
        order: parseInt(order) || 1,
      };
      
      // Only add linkTo if it has a value
      if (linkTo && linkTo.trim()) {
        bannerData.linkTo = linkTo.trim();
      }

      if (editingBanner) {
        await updateBanner(editingBanner.id, bannerData);
        Alert.alert('Success', 'Banner updated successfully');
      } else {
        await addBanner(bannerData);
        Alert.alert('Success', 'Banner added successfully');
      }
      
      setModalVisible(false);
      loadBanners();
    } catch (error: any) {
      console.error('Save error:', error);
      Alert.alert('Error', error.message || 'Failed to save banner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (banner: Banner) => {
    Alert.alert(
      'Delete Banner',
      `Are you sure you want to delete "${banner.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBanner(banner.id);
              Alert.alert('Success', 'Banner deleted successfully');
              loadBanners();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete banner');
            }
          },
        },
      ]
    );
  };

  const renderBannerCard = ({ item }: { item: Banner }) => (
    <View style={[styles.card, { borderLeftColor: item.color, borderLeftWidth: 4 }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <View style={styles.cardTitleRow}>
            <Ionicons name={item.icon as any} size={20} color={item.color} />
            <Text style={styles.cardTitle}>{item.title}</Text>
            {item.isActive && (
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>Active</Text>
              </View>
            )}
          </View>
          <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          <Text style={styles.cardOrder}>Order: {item.order}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => openEditModal(item)}
          >
            <Ionicons name="create-outline" size={24} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item)}
          >
            <Ionicons name="trash-outline" size={24} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>
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
          <Text style={styles.headerTitle}>Banner Management</Text>
          <Text style={styles.headerSubtitle}>{banners.length} total banners</Text>
        </View>
      </View>

      <FlatList
        data={banners}
        keyExtractor={(item) => item.id}
        renderItem={renderBannerCard}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="megaphone-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No banners yet</Text>
            <Text style={styles.emptySubtext}>Create your first promotional banner</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity style={styles.fab} onPress={openCreateModal}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Add/Edit Banner Modal */}
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
              {editingBanner ? 'Edit Banner' : 'Add New Banner'}
            </Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.sectionHeader}>📝 Banner Content</Text>
            
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Flash Sale!"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Subtitle *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Up to 50% OFF on selected items"
              value={subtitle}
              onChangeText={setSubtitle}
            />

            <Text style={styles.sectionHeader}>🎨 Design</Text>

            <Text style={styles.label}>Background Color</Text>
            <View style={styles.colorGrid}>
              {colorOptions.map((colorOption) => (
                <TouchableOpacity
                  key={colorOption.value}
                  style={[
                    styles.colorOption,
                    { backgroundColor: colorOption.value },
                    color === colorOption.value && styles.colorOptionSelected,
                  ]}
                  onPress={() => setColor(colorOption.value)}
                >
                  {color === colorOption.value && (
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Icon</Text>
            <View style={styles.iconGrid}>
              {iconOptions.map((iconOption) => (
                <TouchableOpacity
                  key={iconOption}
                  style={[
                    styles.iconOption,
                    icon === iconOption && styles.iconOptionSelected,
                  ]}
                  onPress={() => setIcon(iconOption)}
                >
                  <Ionicons name={iconOption as any} size={24} color="#333" />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionHeader}>⚙️ Settings</Text>

            <Text style={styles.label}>Display Order</Text>
            <TextInput
              style={styles.input}
              placeholder="1, 2, 3, etc."
              value={order}
              onChangeText={setOrder}
              keyboardType="number-pad"
            />

            <Text style={styles.label}>Link To (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., MedicineList"
              value={linkTo}
              onChangeText={setLinkTo}
            />

            <View style={styles.switchRow}>
              <View>
                <Text style={styles.switchLabel}>Banner Active</Text>
                <Text style={styles.switchDescription}>
                  {isActive ? 'Visible on home screen' : 'Hidden from users'}
                </Text>
              </View>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: '#ccc', true: '#4CAF50' }}
                thumbColor={isActive ? '#fff' : '#f4f3f4'}
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
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
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
    justifyContent: 'space-between',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  activeBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activeBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  cardOrder: {
    fontSize: 12,
    color: '#999',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
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
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#333',
    borderWidth: 3,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconOptionSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  switchDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

