import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Environment variables should be loaded via Expo Constants or react-native-config
// These will be overridden by actual environment variables at build time
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://vnvbjphwulwpdzfieyyo.supabase.co'
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudmJqcGh3dWx3cGR6ZmlleXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NDA2ODcsImV4cCI6MjA2MTUxNjY4N30.qfTs0f4Y5dZIc4hlmitfhe0TOI1fFbdEAK1_9wxzTxY'

// Create the Supabase client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
})

// Database types for TypeScript support
export interface UserProfile {
  id: number
  name: string
  email: string
  phone?: string
  city?: string
  country?: string
  avatar_url?: string
  dob?: string
  gender?: string
  address?: string
  role: UserRole
  created_at?: string
  updated_at?: string
}

export type UserRole = 'entrepreneur' | 'owner'

export interface MarketplaceItem {
  id: string
  title: string
  price: string
  size: string | null
  location: string
  image: string
  businessName: string
  businessType: string
  latitude?: string
  longitude?: string
  zone_id?: string
  originalData?: any
}

// Error handling utility
export class SupabaseError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: any
  ) {
    super(message)
    this.name = 'SupabaseError'
  }
}

// API functions with proper error handling
export const supabaseApi = {
  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      const { error } = await supabase.from('Businesses').select('count').limit(1)
      return !error
    } catch (error) {
      console.error('Connection test error:', error)
      return false
    }
  },

  // Fetch marketplaces with proper typing
  async fetchMarketplaces(page = 1, pageSize = 20): Promise<MarketplaceItem[]> {
    try {
      const start = (page - 1) * pageSize
      
      const { data, error } = await supabase
        .from('Businesses')
        .select('*')
        .range(start, start + pageSize - 1)
        .order('business_id', { ascending: true })

      if (error) {
        throw new SupabaseError('Failed to fetch businesses', error.code, error)
      }

      return data.map(business => ({
        id: business.business_id?.toString() || Math.random().toString(),
        title: business.rating?.toString() || '0.0',
        price: `${Math.floor(Math.random() * (100000 - 25000 + 1)) + 25000} ريال / سنة`,
        size: business.user_ratings_total ? `تقييمات المستخدمين: ${business.user_ratings_total}` : null,
        location: `منطقة ${business.zone_id || '1'}`,
        image: this.getBusinessTypeImage(business.business_type),
        businessName: business.name || 'Business',
        businessType: business.business_type || 'متجر',
        latitude: business.latitude,
        longitude: business.longitude,
        zone_id: business.zone_id,
        originalData: business
      }))
    } catch (error) {
      console.error('Error fetching marketplaces:', error)
      throw error
    }
  },

  // Fetch listings with proper typing
  async fetchListings(page = 1, pageSize = 20): Promise<MarketplaceItem[]> {
    try {
      const start = (page - 1) * pageSize
      
      const { data, error } = await supabase
        .from('Listings')
        .select('Listing_ID, Title, Price, Area, Images, zone_id, Latitude, Longitude')
        .range(start, start + pageSize - 1)
        .order('Listing_ID', { ascending: true })

      if (error) {
        throw new SupabaseError('Failed to fetch listings', error.code, error)
      }

      return data.map(listing => ({
        id: listing.Listing_ID.toString(),
        title: listing.Title || '',
        price: listing.Price ? `${listing.Price} ريال` : '',
        size: listing.Area ? `${listing.Area} م²` : null,
        location: listing.zone_id ? `منطقة ${listing.zone_id}` : '',
        image: this.processListingImage(listing.Images),
        businessName: listing.Title || '',
        businessType: 'property',
        latitude: listing.Latitude,
        longitude: listing.Longitude,
        zone_id: listing.zone_id,
        originalData: listing
      }))
    } catch (error) {
      console.error('Error fetching listings:', error)
      throw error
    }
  },

  // Authentication methods
  async signUp(email: string, password: string, userData: Partial<UserProfile> & { role: UserRole }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
            phone: userData.phone,
            city: userData.city,
            country: userData.country
          }
        }
      })

      if (error) {
        throw new SupabaseError('Sign up failed', error.code, error)
      }

      return { success: true, user: data.user }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw new SupabaseError('Sign in failed', error.code, error)
      }

      return { success: true, user: data.user }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw new SupabaseError('Sign out failed', error.code, error)
      }
      return { success: true }
    } catch (error) {
      console.error('Sign out error:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  // Helper methods
  getBusinessTypeImage(businessType?: string): string {
    const businessTypeImages: Record<string, string> = {
      'barber': '../assets/images/dummy1.png',
      'restaurant': '../assets/images/dummy2.png',
      'cafe': '../assets/images/dummy3.png',
      'store': '../assets/images/dummy4.png'
    }

    return businessType && businessTypeImages[businessType]
      ? businessTypeImages[businessType]
      : `../assets/images/dummy${Math.floor(Math.random() * 4) + 1}.png`
  },

  processListingImage(images: any): string {
    if (!images) return 'https://images.aqar.fm/webp/350x0/props/placeholder.jpg'
    
    if (Array.isArray(images) && images.length > 0) {
      return images[0]
    }
    
    if (typeof images === 'string') {
      if (images.includes(' | ') || images.includes('|')) {
        const imageUrls = images.split(/\s*\|\s*/).filter((url: string) => url.includes('http'))
        return imageUrls.length > 0 ? imageUrls[0] : 'https://images.aqar.fm/webp/350x0/props/placeholder.jpg'
      }
      
      if (images.startsWith('[')) {
        try {
          const parsed = JSON.parse(images)
          return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : images
        } catch {
          return images.includes('http') ? images : 'https://images.aqar.fm/webp/350x0/props/placeholder.jpg'
        }
      }
      
      return images.includes('http') ? images : 'https://images.aqar.fm/webp/350x0/props/placeholder.jpg'
    }
    
    return 'https://images.aqar.fm/webp/350x0/props/placeholder.jpg'
  }
}
export default supabase

// Dev-only: run a quick connection test at module initialization to surface network errors early
try {
  // Use __DEV__ guard available in React Native
  // @ts-ignore
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    (async () => {
      try {
        const ok = await supabaseApi.testConnection()
        // eslint-disable-next-line no-console
        console.log('[supabaseClient] testConnection result:', ok)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[supabaseClient] testConnection failed:', err)
      }
    })()
  }
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('[supabaseClient] runtime check failed:', err)
}