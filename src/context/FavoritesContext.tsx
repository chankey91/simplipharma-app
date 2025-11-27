import { create } from 'zustand';

interface FavoritesStore {
  favorites: string[]; // Array of medicine IDs
  searchHistory: string[]; // Array of search queries
  addFavorite: (medicineId: string) => void;
  removeFavorite: (medicineId: string) => void;
  isFavorite: (medicineId: string) => boolean;
  setFavorites: (favorites: string[]) => void;
  addSearch: (query: string) => void;
  clearSearchHistory: () => void;
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: [],
  searchHistory: [],
  
  addFavorite: (medicineId: string) => {
    set((state) => ({
      favorites: [...state.favorites, medicineId],
    }));
  },
  
  removeFavorite: (medicineId: string) => {
    set((state) => ({
      favorites: state.favorites.filter((id) => id !== medicineId),
    }));
  },
  
  isFavorite: (medicineId: string) => {
    return get().favorites.includes(medicineId);
  },
  
  setFavorites: (favorites: string[]) => {
    set({ favorites });
  },
  
  addSearch: (query: string) => {
    if (!query.trim()) return;
    set((state) => {
      const newHistory = [query, ...state.searchHistory.filter(q => q !== query)].slice(0, 10);
      return { searchHistory: newHistory };
    });
  },
  
  clearSearchHistory: () => {
    set({ searchHistory: [] });
  },
}));

