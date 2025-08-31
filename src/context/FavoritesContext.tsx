import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MarketplaceItem } from '../../components/types';
import { useAuth } from './AuthContext';
import { useNetwork } from './NetworkContext';
import { useOfflineQueue, QueuedAction, ActionHandler, OfflineQueueProvider } from './OfflineQueueContext';
import { supabase } from '../../lib/supabaseClient';

// Define the shape of our context
type FavoritesContextType = {
  favorites: MarketplaceItem[];
  addFavorite: (item: MarketplaceItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  isOfflineMode: boolean;
  syncStatus: 'idle' | 'syncing' | 'error';
};

// Create the context with a default value
const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
  isOfflineMode: false,
  syncStatus: 'idle',
});

// Base storage key for AsyncStorage
const FAVORITES_BASE_STORAGE_KEY = 'ruknapp_favorites';

// Provider component
// Favorite action handlers for offline queue
const createFavoriteActionHandlers = (
  setFavorites: React.Dispatch<React.SetStateAction<MarketplaceItem[]>>,
  setSyncStatus: React.Dispatch<React.SetStateAction<'idle' | 'syncing' | 'error'>>
): Record<string, ActionHandler> => ({
  SYNC_FAVORITES: async (action: QueuedAction) => {
    try {
      setSyncStatus('syncing');
      const { userId, favorites } = action.payload;
      
      // Sync favorites with backend
      const { error } = await supabase
        .from('user_favorites')
        .upsert(
          favorites.map((fav: MarketplaceItem) => ({
            user_id: userId,
            listing_id: fav.id,
            listing_data: fav,
            created_at: new Date().toISOString()
          })),
          { onConflict: 'user_id,listing_id' }
        );

      if (error) {
        console.error('Error syncing favorites:', error);
        setSyncStatus('error');
        return false;
      }

      setSyncStatus('idle');
      return true;
    } catch (error) {
      console.error('Error processing favorite sync:', error);
      setSyncStatus('error');
      return false;
    }
  },

  ADD_FAVORITE: async (action: QueuedAction) => {
    try {
      const { userId, item } = action.payload;
      
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: userId,
          listing_id: item.id,
          listing_data: item,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error adding favorite to backend:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error processing favorite addition:', error);
      return false;
    }
  },

  REMOVE_FAVORITE: async (action: QueuedAction) => {
    try {
      const { userId, itemId } = action.payload;
      
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('listing_id', itemId);

      if (error) {
        console.error('Error removing favorite from backend:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error processing favorite removal:', error);
      return false;
    }
  }
});

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<MarketplaceItem[]>([]);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
  const { user, isAuthenticated } = useAuth();
  const { networkState } = useNetwork();
  const { addToQueue } = useOfflineQueue();

  const isOfflineMode = useMemo(() => !networkState.isInternetReachable, [networkState.isInternetReachable]);
  
  // Create a user-specific storage key
  const getUserStorageKey = useCallback(() => {
    if (!user || !user.id) return null;
    return `${FAVORITES_BASE_STORAGE_KEY}_${user.id}`;
  }, [user]);

  // Load favorites from AsyncStorage when user changes or on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        // Clear favorites first to prevent showing previous user's favorites temporarily
        setFavorites([]);
        
        // Only load favorites if we have an authenticated user
        if (isAuthenticated && user && user.id) {
          const storageKey = getUserStorageKey();
          if (storageKey) {
            const storedFavorites = await AsyncStorage.getItem(storageKey);
            if (storedFavorites) {
              setFavorites(JSON.parse(storedFavorites));
            }
          }
        }
      } catch (error) {
        console.error('Error loading favorites from storage:', error);
      }
    };

    loadFavorites();
  }, [user, isAuthenticated, getUserStorageKey]);

  // Save favorites to AsyncStorage whenever they change
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        // Only save if we have an authenticated user
        if (isAuthenticated && user) {
          const storageKey = getUserStorageKey();
          if (storageKey) {
            await AsyncStorage.setItem(storageKey, JSON.stringify(favorites));
          }
        }
      } catch (error) {
        console.error('Error saving favorites to storage:', error);
      }
    };

    saveFavorites();
  }, [favorites, user, isAuthenticated, getUserStorageKey]);

  // Add a new favorite
  const addFavorite = useCallback((item: MarketplaceItem) => {
    // Only proceed if user is authenticated
    if (!isAuthenticated || !user || !user.id) {
      console.log('User must be authenticated to add favorites');
      return;
    }
    
    // Update local state immediately for offline experience
    setFavorites((prevFavorites) => {
      // Check if already in favorites
      if (prevFavorites.some((fav) => fav.id === item.id)) {
        return prevFavorites;
      }
      return [...prevFavorites, item];
    });

    // If online, sync with backend immediately
    if (networkState.isInternetReachable) {
      addToQueue({
        type: 'ADD_FAVORITE',
        payload: { userId: user.id, item },
        maxRetries: 3
      });
    } else {
      // If offline, queue for later sync
      addToQueue({
        type: 'ADD_FAVORITE',
        payload: { userId: user.id, item },
        maxRetries: 3
      });
    }
  }, [isAuthenticated, user, networkState.isInternetReachable, addToQueue]);

  // Remove a favorite by ID
  const removeFavorite = useCallback((id: string) => {
    // Only proceed if user is authenticated
    if (!isAuthenticated || !user || !user.id) {
      console.log('User must be authenticated to remove favorites');
      return;
    }
    
    // Update local state immediately for offline experience
    setFavorites((prevFavorites) =>
      prevFavorites.filter((item) => item.id !== id)
    );

    // If online, sync with backend immediately
    if (networkState.isInternetReachable) {
      addToQueue({
        type: 'REMOVE_FAVORITE',
        payload: { userId: user.id, itemId: id },
        maxRetries: 3
      });
    } else {
      // If offline, queue for later sync
      addToQueue({
        type: 'REMOVE_FAVORITE',
        payload: { userId: user.id, itemId: id },
        maxRetries: 3
      });
    }
  }, [isAuthenticated, user, networkState.isInternetReachable, addToQueue]);

  // Check if an item is a favorite
  const isFavorite = useCallback((id: string) => {
    return favorites.some((item) => item.id === id);
  }, [favorites]);

  // Sync favorites with backend when coming online
  useEffect(() => {
    if (networkState.isInternetReachable && isAuthenticated && user && favorites.length > 0) {
      addToQueue({
        type: 'SYNC_FAVORITES',
        payload: { userId: user.id, favorites },
        maxRetries: 3
      });
    }
  }, [networkState.isInternetReachable, isAuthenticated, user, favorites, addToQueue]);

  // Memoized context value
  const contextValue = useMemo(() => ({
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    isOfflineMode,
    syncStatus
  }), [favorites, addFavorite, removeFavorite, isFavorite, isOfflineMode, syncStatus]);

  // Provide the context value
  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook to use the favorites context
export const useFavorites = () => useContext(FavoritesContext);

// Create a wrapper provider that includes the offline queue with favorite handlers
export const FavoritesProviderWithOffline: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<MarketplaceItem[]>([]);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
  
  const favoriteActionHandlers = useMemo(() =>
    createFavoriteActionHandlers(setFavorites, setSyncStatus),
    [setFavorites, setSyncStatus]
  );

  return (
    <OfflineQueueProvider actionHandlers={favoriteActionHandlers}>
      <FavoritesProvider>{children}</FavoritesProvider>
    </OfflineQueueProvider>
  );
};
