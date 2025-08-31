// app.ts - Comprehensive TypeScript definitions for RuknApp

// User-related types
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  avatar_url?: string;
  dob?: string;
  gender?: string;
  address?: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export type UserRole = 'entrepreneur' | 'owner';

// Auth-related types
export interface SignUpData {
  name: string;
  phone?: string;
  city?: string;
  country?: string;
  role: UserRole;
  dob?: string;
  gender?: string;
  address?: string;
  avatar_url?: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: any; // This will be replaced with proper User type from Supabase
  isLegacyUser?: boolean;
  offline?: boolean;
  message?: string;
}

// Marketplace and Listing types
export interface MarketplaceItem {
  id: string;
  title: string;
  price: string;
  size: string | null;
  location: string;
  image: string;
  businessName: string;
  businessType: string;
  latitude?: string;
  longitude?: string;
  zone_id?: string;
  originalData?: SupabaseBusinessData;
}

export interface SupabaseBusinessData {
  business_id?: number;
  name?: string;
  rating?: number;
  user_ratings_total?: string;
  business_type?: string;
  business_status?: string;
  zone_id?: string;
  popularity_score?: string;
  latitude?: string;
  longitude?: string;
  processedImages?: string[];
}

// Map-related types
export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface Listing {
  Listing_ID: string | number;
  Title?: string;
  Price?: number;
  Area?: number;
  zone_id: string | number;
  Latitude: number;
  Longitude: number;
  Images?: string[];
  zoneColor?: string;
}

export interface Zone {
  zone_id: number;
  district_name?: string;
  latitude_center?: number;
  longitude_center?: number;
}

// Event types
export interface ScrollEvent {
  nativeEvent: {
    contentOffset: {
      x: number;
      y: number;
    };
    contentSize: {
      width: number;
      height: number;
    };
    layoutMeasurement: {
      width: number;
      height: number;
    };
  };
}

// Navigation types
export interface TabIconProps {
  icon: number | { uri: string }; // Image source type
  color: string;
  name: string;
  focused: boolean;
}

// Onboarding types
export interface OnboardingItem {
  image: number; // require() returns number
  title: string;
  subtitle: string;
  height: number;
  bottom: number;
}

// Error handling types
export interface ErrorDetails {
  message: string;
  code?: string;
  stack?: string;
}

// DateTimePicker event types
export interface DateTimePickerEvent {
  type: string;
  nativeEvent: {
    timestamp: number;
  };
}

// Image processing types
export type ImageSource = string | string[] | null | undefined;

// Business types for filtering
export type BusinessType = 
  | 'all' 
  | 'barber' 
  | 'gym' 
  | 'gas_station' 
  | 'laundry' 
  | 'pharmacy' 
  | 'supermarket' 
  | 'restaurant' 
  | 'cafe' 
  | 'store';

// Filter context types
export interface FilterState {
  selectedBusinessType: BusinessType;
  priceRange: [number, number];
  location: string;
  sortBy: 'price' | 'rating' | 'popularity';
}

// Favorites context types
export interface FavoritesContextType {
  favorites: MarketplaceItem[];
  addFavorite: (item: MarketplaceItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

// Response types for API calls
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

// Supabase error types
export interface SupabaseErrorDetails {
  code: string;
  details: string;
  hint: string;
  message: string;
}

// Chat-related types
export interface ConversationItem {
  id: string;
  name: string;
  lastMessage: string;
}