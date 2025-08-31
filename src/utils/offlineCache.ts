import AsyncStorage from '@react-native-async-storage/async-storage';
import { MarketplaceItem } from '../../components/types';

const CACHE_PREFIX = 'ruknapp_cache_';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export interface CachedData<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

export const getCacheKey = (key: string): string => {
  return `${CACHE_PREFIX}${key}`;
};

export const setCache = async <T>(key: string, data: T, expiry: number = CACHE_EXPIRY): Promise<void> => {
  try {
    const cacheKey = getCacheKey(key);
    const cachedData: CachedData<T> = {
      data,
      timestamp: Date.now(),
      expiry
    };
    await AsyncStorage.setItem(cacheKey, JSON.stringify(cachedData));
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};

export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const cacheKey = getCacheKey(key);
    const cachedItem = await AsyncStorage.getItem(cacheKey);
    
    if (!cachedItem) {
      return null;
    }

    const cachedData: CachedData<T> = JSON.parse(cachedItem);
    
    // Check if cache is expired
    if (Date.now() - cachedData.timestamp > cachedData.expiry) {
      await AsyncStorage.removeItem(cacheKey);
      return null;
    }

    return cachedData.data;
  } catch (error) {
    console.error('Error getting cache:', error);
    return null;
  }
};

export const removeCache = async (key: string): Promise<void> => {
  try {
    const cacheKey = getCacheKey(key);
    await AsyncStorage.removeItem(cacheKey);
  } catch (error) {
    console.error('Error removing cache:', error);
  }
};

export const clearAllCache = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

// Specific cache keys for the app
export const CACHE_KEYS = {
  MARKETPLACE_LISTINGS: 'marketplace_listings',
  USER_PROFILE: 'user_profile',
  FAVORITES: 'favorites',
  ZONE_RECOMMENDATIONS: 'zone_recommendations',
  BUSINESS_TYPES: 'business_types'
};

// Helper function to cache marketplace listings
export const cacheMarketplaceListings = async (listings: MarketplaceItem[]): Promise<void> => {
  await setCache(CACHE_KEYS.MARKETPLACE_LISTINGS, listings);
};

// Helper function to get cached marketplace listings
export const getCachedMarketplaceListings = async (): Promise<MarketplaceItem[] | null> => {
  return await getCache<MarketplaceItem[]>(CACHE_KEYS.MARKETPLACE_LISTINGS);
};

// Helper function to cache user profile
export const cacheUserProfile = async (profile: any): Promise<void> => {
  await setCache(CACHE_KEYS.USER_PROFILE, profile);
};

// Helper function to get cached user profile
export const getCachedUserProfile = async (): Promise<any | null> => {
  return await getCache<any>(CACHE_KEYS.USER_PROFILE);
};

// Helper function to cache favorites
export const cacheFavorites = async (favorites: MarketplaceItem[]): Promise<void> => {
  await setCache(CACHE_KEYS.FAVORITES, favorites);
};

// Helper function to get cached favorites
export const getCachedFavorites = async (): Promise<MarketplaceItem[] | null> => {
  return await getCache<MarketplaceItem[]>(CACHE_KEYS.FAVORITES);
};