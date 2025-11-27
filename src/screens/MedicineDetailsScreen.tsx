import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useCartStore } from '../context/CartContext';
import { useFavoritesStore } from '../context/FavoritesContext';
import { auth, addToFavorites, removeFromFavorites } from '../api/firebase';

type MedicineDetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MedicineDetails'
>;

type MedicineDetailsScreenRouteProp = RouteProp<RootStackParamList, 'MedicineDetails'>;

interface Props {
  navigation: MedicineDetailsScreenNavigationProp;
  route: MedicineDetailsScreenRouteProp;
}

export const MedicineDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { medicine } = route.params;
  const addToCart = useCartStore((state) => state.addToCart);
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const [favorite, setFavorite] = useState(isFavorite(medicine.id));

  const handleAddToCart = () => {
    if (medicine.stock <= 0) {
      Alert.alert('Out of Stock', 'This medicine is currently out of stock');
      return;
    }
    addToCart(medicine, 1);
    Alert.alert('Success', `${medicine.name} added to cart`, [
      { text: 'Continue Shopping', style: 'cancel' },
      { text: 'Go to Cart', onPress: () => navigation.navigate('MainTabs') },
    ]);
  };

  const handleToggleFavorite = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'Please login to add favorites');
      return;
    }

    try {
      if (favorite) {
        await removeFromFavorites(user.uid, medicine.id);
        removeFavorite(medicine.id);
        setFavorite(false);
        Alert.alert('Removed', 'Removed from favorites');
      } else {
        await addToFavorites(user.uid, medicine.id);
        addFavorite(medicine.id);
        setFavorite(true);
        Alert.alert('Added', 'Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {medicine.imageUrl ? (
          <Image source={{ uri: medicine.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="medical" size={80} color="#ccc" />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.name}>{medicine.name}</Text>
            <Text style={styles.manufacturer}>{medicine.manufacturer}</Text>
          </View>
          <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteButton}>
            <Ionicons
              name={favorite ? 'heart' : 'heart-outline'}
              size={28}
              color={favorite ? '#F44336' : '#666'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.priceSection}>
          <Text style={styles.price}>₹{medicine.price.toFixed(2)}</Text>
          <View style={[
            styles.stockBadge,
            medicine.stock <= 0 ? styles.outOfStock : styles.inStock
          ]}>
            <Text style={styles.stockText}>
              {medicine.stock > 0 ? `${medicine.stock} in stock` : 'Out of Stock'}
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Category</Text>
          <Text style={styles.sectionContent}>{medicine.category}</Text>
        </View>

        {medicine.dosage && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Dosage</Text>
            <Text style={styles.sectionContent}>{medicine.dosage}</Text>
          </View>
        )}

        {medicine.composition && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Composition</Text>
            <Text style={styles.sectionContent}>{medicine.composition}</Text>
          </View>
        )}

        {medicine.description && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.sectionContent}>{medicine.description}</Text>
          </View>
        )}

        {medicine.sideEffects && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Side Effects</Text>
            <Text style={styles.sectionContent}>{medicine.sideEffects}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.addButton, medicine.stock <= 0 && styles.disabledButton]}
          onPress={handleAddToCart}
          disabled={medicine.stock <= 0}
        >
          <Ionicons name="cart" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  placeholderImage: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  manufacturer: {
    fontSize: 16,
    color: '#666',
  },
  favoriteButton: {
    padding: 8,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2196F3',
  },
  stockBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  inStock: {
    backgroundColor: '#E8F5E9',
  },
  outOfStock: {
    backgroundColor: '#FFEBEE',
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  infoSection: {
    marginBottom: 20,
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
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});

