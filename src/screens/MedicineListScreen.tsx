import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Medicine } from '../types';
import { fetchMedicines } from '../api/firebase';
import { MedicineCard } from '../components/MedicineCard';
import { useFavoritesStore } from '../context/FavoritesContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ITEMS_PER_PAGE = 50; // Load 50 items at a time

export const MedicineListScreen: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [displayedMedicines, setDisplayedMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const { searchHistory, addSearch, clearSearchHistory } = useFavoritesStore();
  const navigation = useNavigation<any>();
  const searchTimeoutRef = React.useRef<NodeJS.Timeout>();

  const loadMedicines = async () => {
    try {
      const data = await fetchMedicines();
      
      // Filter out any invalid medicines (must have id and name at minimum)
      const validMedicines = data.filter(m => 
        m && 
        m.id && 
        m.name && 
        typeof m.name === 'string' &&
        m.category &&
        typeof m.category === 'string'
      );
      
      setMedicines(validMedicines);
      setFilteredMedicines(validMedicines);
      
      // Load first page
      const firstPage = validMedicines.slice(0, ITEMS_PER_PAGE);
      setDisplayedMedicines(firstPage);
      setHasMore(validMedicines.length > ITEMS_PER_PAGE);
      setCurrentPage(1);
      
      // Extract unique categories (filter out any undefined/null categories)
      const uniqueCategories = ['All', ...new Set(
        validMedicines
          .map(m => m.category)
          .filter(cat => cat && typeof cat === 'string')
      )];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading medicines:', error);
      // Set empty arrays on error to prevent crashes
      setMedicines([]);
      setFilteredMedicines([]);
      setDisplayedMedicines([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMoreMedicines = () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = currentPage * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newItems = filteredMedicines.slice(startIndex, endIndex);
      
      if (newItems.length > 0) {
        setDisplayedMedicines(prev => [...prev, ...newItems]);
        setCurrentPage(nextPage);
        setHasMore(endIndex < filteredMedicines.length);
      } else {
        setHasMore(false);
      }
      
      setLoadingMore(false);
    }, 300); // Small delay for smooth loading
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  // Debounce search query
  useEffect(() => {
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = undefined;
    }

    // Handle empty query immediately
    if (searchQuery.length === 0) {
      setSearching(false);
      setDebouncedSearchQuery('');
      return;
    }

    // Only search if query is 3+ characters
    if (searchQuery.length >= 3) {
      setSearching(true);
      const trimmedQuery = searchQuery.trim();
      searchTimeoutRef.current = setTimeout(() => {
        setDebouncedSearchQuery(trimmedQuery);
        setSearching(false);
        // Add to search history when search actually executes
        if (trimmedQuery.length >= 3) {
          addSearch(trimmedQuery);
        }
      }, 300); // 300ms delay
    } else {
      // If less than 3 characters, clear the debounced query but don't search
      setSearching(false);
      setDebouncedSearchQuery('');
    }

    // Cleanup
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = undefined;
      }
    };
  }, [searchQuery, addSearch]);

  useEffect(() => {
    filterMedicines();
  }, [debouncedSearchQuery, selectedCategory, medicines]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Only add to search history when query is 3+ characters (actual search)
    // This will be handled by the debounce effect when search executes
    if (query.trim().length >= 3) {
      setShowSearchHistory(false);
    }
  };

  const handleSearchHistorySelect = (query: string) => {
    setSearchQuery(query);
    addSearch(query);
    setShowSearchHistory(false);
  };

  const filterMedicines = () => {
    try {
      let filtered = medicines.filter(m => m && m.id); // Filter out any invalid medicines

      // Filter by category first (faster)
      if (selectedCategory !== 'All') {
        filtered = filtered.filter(m => m.category && m.category === selectedCategory);
      }

      // Filter by search query (optimized)
      if (debouncedSearchQuery && debouncedSearchQuery.trim().length >= 3) {
        const searchLower = debouncedSearchQuery.toLowerCase().trim();
        
        filtered = filtered.filter(m => {
          try {
            // Search in name (most common) - safe check
            if (m.name && typeof m.name === 'string' && m.name.toLowerCase().includes(searchLower)) {
              return true;
            }
            
            // Search in code - safe check
            if (m.code && typeof m.code === 'string' && m.code.toLowerCase().includes(searchLower)) {
              return true;
            }
            
            // Search in company - safe check
            if (m.company && typeof m.company === 'string' && m.company.toLowerCase().includes(searchLower)) {
              return true;
            }
            
            // Search in manufacturer - safe check
            if (m.manufacturer && typeof m.manufacturer === 'string' && m.manufacturer.toLowerCase().includes(searchLower)) {
              return true;
            }
            
            return false;
          } catch (error) {
            console.error('Error filtering medicine:', error, m);
            return false; // Skip this medicine if there's an error
          }
        });
      }

      setFilteredMedicines(filtered);
      
      // Reset pagination and load first page of filtered results
      const firstPage = filtered.slice(0, ITEMS_PER_PAGE);
      setDisplayedMedicines(firstPage);
      setCurrentPage(1);
      setHasMore(filtered.length > ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error in filterMedicines:', error);
      // Fallback to showing all medicines if filtering fails
      setFilteredMedicines(medicines);
      const firstPage = medicines.slice(0, ITEMS_PER_PAGE);
      setDisplayedMedicines(firstPage);
      setCurrentPage(1);
      setHasMore(medicines.length > ITEMS_PER_PAGE);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMedicines();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  const renderMedicineCard = ({ item }: { item: Medicine }) => (
    <TouchableOpacity onPress={() => navigation.navigate('MedicineDetails', { medicine: item })}>
      <MedicineCard medicine={item} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons 
            name={searching ? "hourglass-outline" : "search"} 
            size={20} 
            color={searching ? "#2196F3" : "#999"} 
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchBar}
            placeholder="Search medicines (min 3 characters)..."
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={() => setShowSearchHistory(true)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        {searchQuery.length > 0 && searchQuery.length < 3 && (
          <Text style={styles.searchHint}>
            Type at least 3 characters to search
          </Text>
        )}
        {searching && (
          <Text style={styles.searchingText}>Searching...</Text>
        )}
      </View>

      {showSearchHistory && searchHistory.length > 0 && (
        <View style={styles.searchHistoryContainer}>
          <View style={styles.searchHistoryHeader}>
            <Text style={styles.searchHistoryTitle}>Recent Searches</Text>
            <TouchableOpacity onPress={() => { clearSearchHistory(); setShowSearchHistory(false); }}>
              <Text style={styles.clearHistoryText}>Clear</Text>
            </TouchableOpacity>
          </View>
          {searchHistory.map((query, index) => (
            <TouchableOpacity
              key={index}
              style={styles.searchHistoryItem}
              onPress={() => handleSearchHistorySelect(query)}
            >
              <Ionicons name="time-outline" size={18} color="#666" />
              <Text style={styles.searchHistoryText}>{query}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item && styles.categoryTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          Showing {displayedMedicines.length} of {filteredMedicines.length} medicines
        </Text>
      </View>

      <FlatList
        data={displayedMedicines}
        keyExtractor={(item) => item.id}
        renderItem={renderMedicineCard}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No medicines found</Text>
          </View>
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" color="#2196F3" />
              <Text style={styles.loadingMoreText}>Loading more...</Text>
            </View>
          ) : hasMore ? (
            <TouchableOpacity 
              style={styles.loadMoreButton}
              onPress={loadMoreMedicines}
            >
              <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>
          ) : displayedMedicines.length > 0 ? (
            <View style={styles.endMessage}>
              <Text style={styles.endMessageText}>You've reached the end</Text>
            </View>
          ) : null
        }
        onEndReached={loadMoreMedicines}
        onEndReachedThreshold={0.3}
        onScrollBeginDrag={() => setShowSearchHistory(false)}
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
  searchContainer: {
    margin: 16,
    marginBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  searchHint: {
    fontSize: 12,
    color: '#FF9800',
    marginTop: 4,
    marginLeft: 4,
  },
  searchingText: {
    fontSize: 12,
    color: '#2196F3',
    marginTop: 4,
    marginLeft: 4,
  },
  searchHistoryContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchHistoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  clearHistoryText: {
    fontSize: 12,
    color: '#2196F3',
  },
  searchHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  searchHistoryText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  resultsText: {
    fontSize: 12,
    color: '#666',
  },
  loadingMore: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  loadingMoreText: {
    fontSize: 12,
    color: '#666',
  },
  loadMoreButton: {
    margin: 16,
    padding: 12,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
  },
  loadMoreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  endMessage: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  endMessageText: {
    fontSize: 12,
    color: '#999',
  },
});

