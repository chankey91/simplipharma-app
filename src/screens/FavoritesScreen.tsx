import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Medicine } from '../types';
import { fetchMedicines, auth, getFavorites } from '../api/firebase';
import { MedicineCard } from '../components/MedicineCard';
import { useFavoritesStore } from '../context/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';

export const FavoritesScreen: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { favorites, setFavorites } = useFavoritesStore();

  const loadFavorites = async () => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const favoriteIds = await getFavorites(user.uid);
      setFavorites(favoriteIds);
      
      const allMedicines = await fetchMedicines();
      const favoriteMedicines = allMedicines.filter(m => favoriteIds.includes(m.id));
      setMedicines(favoriteMedicines);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (medicines.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="heart-outline" size={80} color="#ccc" />
        <Text style={styles.emptyText}>No Favorites Yet</Text>
        <Text style={styles.emptySubtext}>Add medicines to your favorites to see them here</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={medicines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MedicineCard medicine={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});

