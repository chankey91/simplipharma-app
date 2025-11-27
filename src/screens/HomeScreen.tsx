import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Medicine, Order } from '../types';
import { collection, query, limit, getDocs, orderBy, where } from 'firebase/firestore';
import { db, auth, getActiveBanners } from '../api/firebase';
import { Banner } from '../types';
import { generateRecommendations, shouldShowReorderBadge } from '../utils/recommendations';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState<Medicine[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Medicine[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout>();
  const bannerIntervalRef = React.useRef<NodeJS.Timeout>();

  // Fallback banners if none in database
  const fallbackBanners: Banner[] = [
    {
      id: '1',
      title: '🔥 Flash Sale!',
      subtitle: 'Up to 50% OFF on selected items',
      color: '#FF6B6B',
      icon: 'flash',
      isActive: true,
      order: 1,
      createdAt: new Date(),
    },
    {
      id: '2',
      title: '💊 New Arrivals',
      subtitle: 'Fresh stock just arrived',
      color: '#4ECDC4',
      icon: 'medical',
      isActive: true,
      order: 2,
      createdAt: new Date(),
    },
    {
      id: '3',
      title: '🎁 Special Offer',
      subtitle: 'Buy 2 Get 1 Free on vitamins',
      color: '#FFD93D',
      icon: 'gift',
      isActive: true,
      order: 3,
      createdAt: new Date(),
    },
    {
      id: '4',
      title: '⚡ Quick Delivery',
      subtitle: 'Same day delivery available',
      color: '#95E1D3',
      icon: 'rocket',
      isActive: true,
      order: 4,
      createdAt: new Date(),
    },
  ];

  useEffect(() => {
    loadBanners();
    loadProducts();
    
    // Cleanup
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (bannerIntervalRef.current) {
        clearInterval(bannerIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Start banner auto-slide only when banners are loaded
    if (banners.length > 0) {
      startBannerAutoSlide();
    }
  }, [banners]);

  const loadBanners = async () => {
    try {
      const activeBanners = await getActiveBanners();
      if (activeBanners.length > 0) {
        setBanners(activeBanners);
      } else {
        // Use fallback banners if no banners in database
        setBanners(fallbackBanners);
      }
    } catch (error) {
      console.error('Error loading banners:', error);
      // Use fallback banners on error
      setBanners(fallbackBanners);
    } finally {
      setBannersLoading(false);
    }
  };

  const startBannerAutoSlide = () => {
    // Clear existing interval if any
    if (bannerIntervalRef.current) {
      clearInterval(bannerIntervalRef.current);
    }
    
    bannerIntervalRef.current = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 3000); // Change every 3 seconds
  };

  const loadProducts = async () => {
    try {
      const userId = auth.currentUser?.uid;
      
      // Load all medicines (limited to first 100 for performance)
      const medicinesQuery = query(
        collection(db, 'medicines'),
        orderBy('name'),
        limit(100)
      );
      const medicinesSnapshot = await getDocs(medicinesQuery);
      const allMedicines = medicinesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Medicine[];
      
      if (userId) {
        // Load user's order history (no orderBy to avoid composite index requirement)
        const ordersQuery = query(
          collection(db, 'orders'),
          where('userId', '==', userId)
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        const orders = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        
        setUserOrders(orders);
        
        // Generate personalized recommendations
        const recommended = generateRecommendations(allMedicines, orders, 6);
        setRecommendedProducts(recommended);
        
        console.log(`✨ Generated ${recommended.length} personalized recommendations`);
      } else {
        // New users: show first 6 medicines as recommendations
        setRecommendedProducts(allMedicines.slice(0, 6));
      }
      
      // Featured products (last 6 from the list)
      setFeaturedProducts(allMedicines.slice(6, 12));
      
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery && trimmedQuery.length >= 3) {
      // Navigate to browse screen (search will happen there)
      navigation.navigate('MedicineList' as any);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Auto-navigate if user types 3+ characters and waits
    if (text.trim().length >= 3) {
      searchTimeoutRef.current = setTimeout(() => {
        navigation.navigate('MedicineList' as any);
      }, 1000); // Navigate after 1 second of no typing
    }
  };

  const categories = [
    { name: 'Pain Relief', icon: 'medical', color: '#FF6B6B' },
    { name: 'Antibiotics', icon: 'shield-checkmark', color: '#4ECDC4' },
    { name: 'Vitamins', icon: 'fitness', color: '#FFD93D' },
    { name: 'First Aid', icon: 'bandage', color: '#95E1D3' },
    { name: 'Supplements', icon: 'nutrition', color: '#FFA07A' },
    { name: 'Personal Care', icon: 'heart', color: '#DDA15E' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search medicines (min 3 chars)..."
            value={searchQuery}
            onChangeText={handleSearchChange}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => navigation.navigate('MedicineList' as any)}
        >
          <Ionicons name="options" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Promotional Banner - Auto Sliding */}
      {banners.length > 0 && (
        <View style={styles.bannerSection}>
          <View style={[styles.banner, { backgroundColor: banners[currentBannerIndex].color }]}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>{banners[currentBannerIndex].title}</Text>
              <Text style={styles.bannerSubtitle}>{banners[currentBannerIndex].subtitle}</Text>
              <TouchableOpacity style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>Shop Now</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.bannerImage}>
              <Ionicons 
                name={banners[currentBannerIndex].icon as any} 
                size={80} 
                color="rgba(255,255,255,0.3)" 
              />
            </View>
          </View>
        
        {/* Banner Indicators */}
        <View style={styles.bannerIndicators}>
          {banners.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setCurrentBannerIndex(index)}
            >
              <View
                style={[
                  styles.indicator,
                  currentBannerIndex === index && styles.indicatorActive,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('MedicineList' as any)}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="list" size={24} color="#2196F3" />
            </View>
            <Text style={styles.actionText}>Browse All</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Orders' as any)}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="receipt" size={24} color="#FF9800" />
            </View>
            <Text style={styles.actionText}>My Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Cart' as any)}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#F3E5F5' }]}>
              <Ionicons name="cart" size={24} color="#9C27B0" />
            </View>
            <Text style={styles.actionText}>Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Profile' as any)}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="person" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.actionText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MedicineList' as any)}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryCard}
              onPress={() => navigation.navigate('MedicineList' as any)}
            >
              <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                <Ionicons name={category.icon as any} size={28} color="#fff" />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Recommended Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⭐ Recommended for You</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MedicineList' as any)}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.productsGrid}>
            {recommendedProducts.map((product) => {
              const needsReorder = shouldShowReorderBadge(product.id, userOrders);
              return (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productCard}
                  onPress={() => navigation.navigate('MedicineList' as any)}
                >
                  <View style={[
                    styles.productBadge,
                    needsReorder && styles.reorderBadge
                  ]}>
                    {needsReorder ? (
                      <>
                        <Ionicons name="time" size={12} color="#fff" />
                        <Text style={styles.productBadgeText}> Reorder</Text>
                      </>
                    ) : (
                      <Text style={styles.productBadgeText}>For You</Text>
                    )}
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {product.name}
                    </Text>
                    <Text style={styles.productManufacturer} numberOfLines={1}>
                      {product.manufacturer || product.company || 'Generic'}
                    </Text>
                    <Text style={styles.productPrice}>₹{product.price.toFixed(2)}</Text>
                  </View>
                  <TouchableOpacity style={styles.addButton}>
                    <Ionicons name="add" size={20} color="#fff" />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* Featured Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔥 Featured Products</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MedicineList' as any)}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.productsGrid}>
            {featuredProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.productCard}
                onPress={() => navigation.navigate('MedicineList' as any)}
              >
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <Text style={styles.productManufacturer} numberOfLines={1}>
                    {product.manufacturer || product.company || 'Generic'}
                  </Text>
                  <Text style={styles.productPrice}>₹{product.price.toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={styles.addButton}>
                  <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Ionicons name="information-circle" size={24} color="#2196F3" />
        <View style={styles.infoBannerText}>
          <Text style={styles.infoBannerTitle}>Need Help?</Text>
          <Text style={styles.infoBannerSubtitle}>
            Use search to quickly find medicines from our catalog
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    width: 50,
    height: 50,
    backgroundColor: '#2196F3',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  banner: {
    height: 160,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 16,
  },
  bannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 4,
  },
  bannerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  bannerImage: {
    marginLeft: 16,
  },
  bannerIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  indicatorActive: {
    backgroundColor: '#2196F3',
    width: 24,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  categoriesContainer: {
    gap: 12,
  },
  categoryCard: {
    alignItems: 'center',
    gap: 8,
    width: 80,
  },
  categoryIcon: {
    width: 70,
    height: 70,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    position: 'relative',
  },
  productBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  reorderBadge: {
    backgroundColor: '#FF9800',
  },
  productBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productManufacturer: {
    fontSize: 11,
    color: '#999',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2196F3',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoBannerText: {
    flex: 1,
  },
  infoBannerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 4,
  },
  infoBannerSubtitle: {
    fontSize: 12,
    color: '#666',
  },
});

