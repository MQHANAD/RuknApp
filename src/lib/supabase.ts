// Canonical Supabase module
// - Exports Supabase JS client as "supabase" (migrated from src/utils/supabase.ts)
// - Re-exports helper API "supabaseApi" and related types (migrated from lib/supabase.ts)
// - Re-exports setupSupabase and getMockMarketplaces (migrated from lib/supabaseSetup.ts)

import '../utils/polyfills';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY, PLACEHOLDER_IMAGE_URL } from '@config/env';
import { images } from '../../components/types';

// 1) Supabase client (from src/utils/supabase.ts) - Client-only initialization
let supabaseClient: ReturnType<typeof createClient> | null = null;

const createSupabaseClient = () => {
  // Only create client on client side to prevent SSR issues
  if (typeof window === 'undefined') {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(
      EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      }
    );
  }
  return supabaseClient;
};

// Export a getter that ensures client-only initialization
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    const client = createSupabaseClient();
    if (!client) {
      throw new Error('Supabase client is not available on server side');
    }
    return (client as any)[prop];
  }
});

// 2) Types and supabaseApi (from lib/supabase.ts)
export type UserRole = 'entrepreneur' | 'owner';

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

// In-memory session storage (mirrors lib/supabase.ts behavior)
let currentSession: { access_token: string; user: UserProfile | null } | null = null;

// Basic fetch wrapper for Supabase REST API (verbatim from lib/supabase.ts, with env alias updates)
export const supabaseApi = {
  getDefaultHeaders() {
    return {
      'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
      'Content-Type': 'application/json'
    };
  },

  async fetchMarketplaces(page = 1, pageSize = 20) {
    try {
      console.log('Directly fetching from Businesses table without any fallback');
      return await this.fetchBusinesses(page, pageSize);
    } catch (error) {
      console.error('Error fetching from Businesses table:', error);
      throw error;
    }
  },

  async fetchListings(page = 1, pageSize = 20) {
    try {
      const startRange = (page - 1) * pageSize;

      console.log('Fetching data from Listings table');
      console.log('Page:', page, 'Page size:', pageSize, 'Offset:', startRange);

      const response = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/Listings?select=Listing_ID,Title,Price,Area,Images,zone_id,Latitude,Longitude&order=Listing_ID.asc&limit=${pageSize}&offset=${startRange}`,
        {
          method: 'GET',
          headers: {
            'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Prefer': 'return=representation'
          }
        }
      );

      console.log('Listings data response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching from Listings table:', errorText);
        throw new Error(`Error fetching listings data: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Fetched listings count:', data.length);

      if (data.length > 0) {
        console.log('Listing data example:', JSON.stringify(data[0]));
        console.log('Images field type:', typeof data[0].Images);
        console.log('Images field value:', data[0].Images);
        if (data[0].Images) {
          console.log('Is Images an array?', Array.isArray(data[0].Images));
          if (Array.isArray(data[0].Images)) {
            console.log('Images array length:', data[0].Images.length);
            console.log('First image value:', data[0].Images[0]);
          } else if (typeof data[0].Images === 'string') {
            console.log('Images is a string value');
          }
        }

        interface ListingData {
          Listing_ID: number;
          Title?: string;
          Price?: number;
          Area?: number;
          Images?: string[] | string | any;
          processedImages?: string[];
          zone_id?: string;
          Latitude?: string;
          Longitude?: string;
        }

        return data.map((listing: ListingData) => {
          let imageSource: string;

          console.log(`Listing ${listing.Listing_ID} Images field:`, listing.Images);

          try {
            if (listing.Images) {
              if (Array.isArray(listing.Images) && listing.Images.length > 0) {
                imageSource = listing.Images[0];
                console.log(`Using image from array for listing ${listing.Listing_ID}:`, imageSource);
              }
              else if (typeof listing.Images === 'string') {
                const imagesString = listing.Images as string;
                if (imagesString.includes(' | ') || imagesString.includes('|')) {
                  const imageUrls = imagesString.split(/\s*\|\s*/).filter(url => url.includes('http'));
                  if (imageUrls.length > 0) {
                    (listing as any).processedImages = imageUrls;
                    imageSource = imageUrls[0];
                    console.log(`Found ${imageUrls.length} pipe-separated images for listing ${listing.Listing_ID}, using first:`, imageSource);
                  } else {
                    imageSource = PLACEHOLDER_IMAGE_URL;
                  }
                }
                else if (imagesString.startsWith('[') && imagesString.includes('"')) {
                  try {
                    const parsedImages = JSON.parse(imagesString);
                    if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                      (listing as any).processedImages = parsedImages;
                      imageSource = parsedImages[0];
                      console.log(`Using image from parsed JSON for listing ${listing.Listing_ID}:`, imageSource);
                    } else {
                      imageSource = imagesString.includes('http') ? imagesString : PLACEHOLDER_IMAGE_URL;
                      console.log(`Using direct string for listing ${listing.Listing_ID}:`, imageSource);
                    }
                  } catch (e) {
                    imageSource = imagesString.includes('http') ? imagesString : PLACEHOLDER_IMAGE_URL;
                    console.log(`Failed to parse JSON, using direct string for listing ${listing.Listing_ID}:`, imageSource);
                  }
                } else {
                  imageSource = imagesString.includes('http') ? imagesString : PLACEHOLDER_IMAGE_URL;
                  console.log(`Using direct string for listing ${listing.Listing_ID}:`, imageSource);
                }
              }
              else if (typeof listing.Images === 'object' && listing.Images !== null) {
                try {
                  const imagesObject = listing.Images as Record<string, any>;
                  const possibleImageUrl = Object.values(imagesObject).find(val =>
                    typeof val === 'string' && val.includes('http'));

                  if (possibleImageUrl && typeof possibleImageUrl === 'string') {
                    imageSource = possibleImageUrl;
                    console.log(`Using image from object for listing ${listing.Listing_ID}:`, imageSource);
                  } else {
                    imageSource = PLACEHOLDER_IMAGE_URL;
                    console.log(`No valid image URL in object for listing ${listing.Listing_ID}`);
                  }
                } catch (error) {
                  console.error(`Error extracting image from object for listing ${listing.Listing_ID}:`, error);
                  imageSource = PLACEHOLDER_IMAGE_URL;
                }
              } else {
                imageSource = PLACEHOLDER_IMAGE_URL;
                console.log(`Unknown Images field format for listing ${listing.Listing_ID}`);
              }
            } else {
              imageSource = PLACEHOLDER_IMAGE_URL;
              console.log(`No Images field for listing ${listing.Listing_ID}`);
            }
          } catch (error) {
            console.error(`Error processing image for listing ${listing.Listing_ID}:`, error);
            imageSource = PLACEHOLDER_IMAGE_URL;
          }

          if (!imageSource || !imageSource.includes('http')) {
            imageSource = PLACEHOLDER_IMAGE_URL;
            console.log(`Using fallback image for listing ${listing.Listing_ID} as the extracted URL is invalid`);
          }

          return {
            id: listing.Listing_ID.toString(),
            title: listing.Title || '',
            price: listing.Price ? `${listing.Price} ريال` : '',
            size: listing.Area ? `${listing.Area} م²` : null,
            location: listing.zone_id ? `منطقة ${listing.zone_id}` : '',
            image: imageSource,
            businessName: listing.Title || '',
            businessType: 'property',
            latitude: listing.Latitude,
            longitude: listing.Longitude,
            zone_id: listing.zone_id,
            originalData: listing
          };
        });
      } else {
        console.warn('No listings data returned from Supabase');
        return [];
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      throw error;
    }
  },

  async fetchBusinesses(page = 1, pageSize = 20): Promise<any[]> {
    try {
      const startRange = (page - 1) * pageSize;

      console.log('Directly fetching actual data from Businesses table');
      console.log('Page:', page, 'Page size:', pageSize, 'Offset:', startRange);

      const response = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/Businesses?select=business_id,name,rating,user_ratings_total,business_status,latitude,longitude,business_type,popularity_score,zone_id&order=business_id.asc&limit=${pageSize}&offset=${startRange}`,
        {
          method: 'GET',
          headers: {
            'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Prefer': 'return=representation'
          }
        }
      );

      console.log('Business data response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching from Businesses table:', errorText);
        throw new Error(`Error fetching business data: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Fetched real businesses count:', data.length);

      if (data.length > 0) {
        console.log('Real business data example:', JSON.stringify(data[0]));
        console.log('Database column names in response:', Object.keys(data[0]).join(', '));
      } else {
        console.error('No business data returned from Supabase - table may be empty');
        console.log('Attempting to query Supabase to see if the Businesses table exists...');

        try {
          const tableInfoResponse = await fetch(
            `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/Businesses?limit=1`,
            {
              method: 'GET',
              headers: {
                'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
              }
            }
          );

          console.log('Table check status:', tableInfoResponse.status);

          if (tableInfoResponse.ok) {
            console.log('Businesses table exists but may be empty');
            console.log('Attempting to add a sample business record...');
            const insertResponse = await fetch(
              `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/Businesses`,
              {
                method: 'POST',
                headers: {
                  'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
                  'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
                  'Content-Type': 'application/json',
                  'Prefer': 'return=representation'
                },
                body: JSON.stringify({
                  "name": 'نضارة الأسطورة للحلاقة',
                  "rating": '4.5',
                  "user_ratings_total": '82',
                  "business_status": 'OPERATIONAL',
                  "latitude": '24.5254774',
                  "longitude": '46.6611376',
                  "business_type": 'barber',
                  "popularity_score": '369',
                  "zone_id": '2',
                  "business_id": '3'
                })
              }
            );

            if (insertResponse.ok) {
              console.log('Successfully added sample business');
              return await this.fetchBusinesses(page, pageSize);
            } else {
              console.error('Failed to add sample business:', await insertResponse.text());
            }
          } else {
            console.error('Businesses table may not exist or cannot be accessed');
          }
        } catch (checkError) {
          console.error('Error checking Businesses table:', checkError);
        }
      }

      const formattedData = data.map((business: any) => {
        console.log(`Business record ${business.business_id}:`, JSON.stringify(business));

        const businessTypeImages: { [key: string]: string } = {
          'barber': '../assets/images/dummy1.png',
          'restaurant': '../assets/images/dummy2.png',
          'cafe': '../assets/images/dummy3.png',
          'store': '../assets/images/dummy4.png'
        };

        const imageKey = business.business_type && businessTypeImages[business.business_type]
          ? businessTypeImages[business.business_type]
          : `../assets/images/dummy${Math.floor(Math.random() * 4) + 1}.png`;

        const randomPrice = Math.floor(Math.random() * (100000 - 25000 + 1)) + 25000;
        const formattedPrice = new Intl.NumberFormat('ar-SA').format(randomPrice);

        return {
          id: business.business_id ? business.business_id.toString() : Math.random().toString(),
          title: business.rating || '0.0',
          price: `${formattedPrice} ريال / سنة`,
          size: business.user_ratings_total ? `تقييمات المستخدمين: ${business.user_ratings_total}` : null,
          location: `منطقة ${business.zone_id || '1'}`,
          image: imageKey,
          businessName: business.name || 'Business',
          businessType: business.business_type || 'متجر',
          businessStatus: business.business_status || 'OPERATIONAL',
          user_ratings_total: business.user_ratings_total,
          zone_id: business.zone_id,
          popularity_score: business.popularity_score,
          latitude: business.latitude,
          longitude: business.longitude,
          originalData: business
        };
      });

      console.log(`Successfully formatted ${formattedData.length} business items from real database data`);
      return formattedData;
    } catch (error) {
      console.error('Error fetching from Businesses table:', error);
      throw error;
    }
  },

  getDurationType(durationType: string): string {
    switch (durationType) {
      case 'daily': return 'يومي';
      case 'weekly': return 'أسبوعي';
      case 'monthly': return 'شهري';
      case 'yearly': return 'سنوي';
      default: return durationType;
    }
  },

  async testConnection() {
    try {
      console.log('Testing Supabase connectivity to host:', new URL(EXPO_PUBLIC_SUPABASE_URL).host);
      const response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/Businesses?select=business_id&limit=1`, {
        method: 'GET',
        headers: {
          'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`
        }
      });
      console.log('Test connection status:', response.status);
      return true;
    } catch (error) {
      console.log('Fetch error type:', (error as any)?.name || typeof error);
      console.error('Connection test error:', error);
      return false;
    }
  },

  async signUp(email: string, password: string, userData: Partial<UserProfile> & { role: UserRole }) {
    try {
      console.log('Starting sign-up process for:', email, 'with role:', userData.role);
      console.log('User data received:', JSON.stringify({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        dob: userData.dob,
        gender: userData.gender,
        city: userData.city,
        country: userData.country,
        address: userData.address,
        role: userData.role
      }));

      const hashPassword = (password: string): string => {
        const hash = `hash_${password}_${new Date().getTime()}`;
        console.log('Password hash created (masked):', 'hash_****_' + new Date().getTime());
        return hash;
      };

      const passwordHash = hashPassword(password);

      let profileResult;

      if (userData.role === 'entrepreneur') {
        const entrepreneurData = {
          name: userData.name!,
          email: userData.email || email,
          city: userData.city || '',
          country: userData.country || 'Saudi Arabia',
          avatar_url: userData.avatar_url,
          dob: userData.dob || '',
          gender: userData.gender || '',
          address: userData.address || '',
          password_hash: passwordHash
        };

        console.log('Creating entrepreneur profile directly:', JSON.stringify({
          ...entrepreneurData,
          password_hash: '[REDACTED]'
        }));
        profileResult = await this.createEntrepreneurProfileDirectly(entrepreneurData);
        console.log('Entrepreneur profile created with ID:', profileResult?.id);

        console.log('Note: In production, would store hashed password for user ID:', profileResult?.id);
      } else if (userData.role === 'owner') {
        const ownerData = {
          name: userData.name!,
          email: userData.email || email,
          phone: userData.phone || '',
          city: userData.city || '',
          country: userData.country || 'Saudi Arabia',
          avatar_url: userData.avatar_url,
          dob: userData.dob || '',
          gender: userData.gender || '',
          address: userData.address || '',
          password_hash: passwordHash
        };

        console.log('Creating owner profile directly:', JSON.stringify({
          ...ownerData,
          password_hash: '[REDACTED]'
        }));
        profileResult = await this.createOwnerProfileDirectly(ownerData);
        console.log('Owner profile created with ID:', profileResult?.id);

        console.log('Note: In production, would store hashed password for user ID:', profileResult?.id);
      } else {
        throw new Error(`Invalid role: ${userData.role}`);
      }

      const userProfileId = profileResult?.id || null;
      if (!userProfileId) {
        throw new Error('Failed to get user profile ID');
      }

      const simpleToken = 'dummy_access_token_' + new Date().getTime();

      currentSession = {
        access_token: simpleToken,
        user: {
          ...userData,
          id: userProfileId,
          email: email,
          name: userData.name!,
          role: userData.role
        } as UserProfile
      };

      return { success: true, user: currentSession.user };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  },

  async signIn(email: string, password: string) {
    try {
      console.log('Attempting to sign in with email:', email);

      let userRole: UserRole = 'entrepreneur';
      let userWithPassword = await this.findUserWithPasswordByEmail(email, userRole);

      if (!userWithPassword) {
        userRole = 'owner';
        userWithPassword = await this.findUserWithPasswordByEmail(email, userRole);
      }

      if (!userWithPassword) {
        throw new Error('User not found. Please check your email or sign up.');
      }

      let passwordValid = false;

      if (!userWithPassword.password_hash) {
        console.error(`Security issue: User ${email} has no password hash set`);
        passwordValid = true;
        console.log('WARNING: User logged in without password verification (legacy account)');
      } else {
        passwordValid = this.verifyPassword(password, userWithPassword.password_hash);
        console.log('Password validation result:', passwordValid);
      }

      if (!passwordValid) {
        throw new Error('Invalid password. Please try again.');
      }

      const user: UserProfile = {
        id: userWithPassword.id,
        name: userWithPassword.name,
        email: userWithPassword.email,
        phone: userWithPassword.phone,
        city: userWithPassword.city,
        country: userWithPassword.country,
        avatar_url: userWithPassword.avatar_url,
        dob: userWithPassword.dob,
        gender: userWithPassword.gender,
        address: userWithPassword.address,
        created_at: userWithPassword.created_at,
        updated_at: userWithPassword.updated_at,
        role: userRole as UserRole
      };

      const simpleToken = 'dummy_access_token_' + new Date().getTime();

      currentSession = {
        access_token: simpleToken,
        user
      };

      console.log('Sign-in successful for user:', user.name);

      return {
        success: true,
        user
      };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  },

  verifyPassword(password: string, storedHash: string): boolean {
    try {
      if (!storedHash) {
        console.error('Empty or null password hash provided for verification');
        return false;
      }

      if (storedHash.startsWith('hash_')) {
        const hashParts = storedHash.split('_');
        if (hashParts.length < 2) {
          console.error('Invalid hash format detected');
          return false;
        }
        const result = hashParts[1] === password;
        return result;
      }

      console.error('Unrecognized password hash format');
      return false;
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  },

  async findUserWithPasswordByEmail(email: string, role: UserRole): Promise<any> {
    try {
      const tableName = role === 'entrepreneur' ? 'entrepreneurs' : 'owners';
      console.log(`Searching for user with email ${email} in ${tableName} table`);

      console.log(`Retrieving user data from ${tableName} table with email: ${email}`);

      const response = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/${tableName}?email=eq.${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        console.error(`Error searching ${tableName}:`, await response.text());
        return null;
      }

      const users = await response.json();
      console.log(`Found ${users.length} users in ${tableName} table`);

      if (users && users.length > 0) {
        if (users[0].password_hash) {
          console.log(`User ${email} has a password hash`);
        } else {
          console.warn(`WARNING: User ${email} has NO password hash`);
        }
        return users[0];
      }

      return null;
    } catch (error) {
      console.error(`Error finding user in ${role} table:`, error);
      return null;
    }
  },

  async findUserByEmail(email: string, role: UserRole): Promise<UserProfile | null> {
    try {
      const tableName = role === 'entrepreneur' ? 'entrepreneurs' : 'owners';
      console.log(`Searching for user with email ${email} in ${tableName} table`);

      const response = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/${tableName}?email=eq.${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        console.error(`Error searching ${tableName}:`, await response.text());
        return null;
      }

      const users = await response.json();
      console.log(`Found ${users.length} users in ${tableName} table:`, JSON.stringify(users));

      if (users && users.length > 0) {
        const userData = users[0];

        return {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          city: userData.city,
          country: userData.country,
          avatar_url: userData.avatar_url,
          created_at: userData.created_at,
          updated_at: userData.updated_at,
          role: role
        };
      }

      return null;
    } catch (error) {
      console.error(`Error finding user in ${role} table:`, error);
      return null;
    }
  },

  async signOut() {
    try {
      console.log('Signing out user...');

      if (currentSession?.access_token) {
        try {
          const response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/auth/v1/logout`, {
            method: 'POST',
            headers: {
              'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${currentSession.access_token}`,
              'Content-Type': 'application/json'
            }
          });

          console.log('Logout API response status:', response.status);
        } catch (apiError) {
          console.error('Error calling logout API:', apiError);
        }
      } else {
        console.log('No active session token found, still proceeding with local logout');
      }

      console.log('Clearing session data');
      currentSession = null;

      console.log('User successfully signed out');
      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      currentSession = null;
      return { success: false, error: error.message };
    }
  },

  getCurrentSession() {
    return currentSession;
  },

  setSession(session: { access_token: string; user: UserProfile | null }) {
    currentSession = session;
    return currentSession;
  },

  async createEntrepreneurProfile(profileData: {
    name: string;
    email: string;
    city: string;
    country: string;
    avatar_url?: string;
  }, token: string) {
    try {
      const entrepreneurData = {
        name: profileData.name,
        email: profileData.email,
        city: profileData.city || 'Riyadh',
        country: profileData.country || 'Saudi Arabia',
        avatar_url: profileData.avatar_url
      };

      const response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/entrepreneurs`, {
        method: 'POST',
        headers: {
          'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(entrepreneurData)
      });

      const responseText = await response.text();
      console.log('Create entrepreneur response status:', response.status);
      console.log('Create entrepreneur response:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to create entrepreneur profile: ${responseText}`);
      }

      try {
        const parsed = JSON.parse(responseText);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0];
        }
        return parsed;
      } catch (e) {
        console.log('Error parsing entrepreneur response:', e);
        return { ...entrepreneurData };
      }
    } catch (error: any) {
      console.error('Create entrepreneur profile error:', error);
      throw error;
    }
  },

  async createEntrepreneurProfileDirectly(profileData: {
    name: string;
    email: string;
    city: string;
    country: string;
    avatar_url?: string;
    password_hash?: string;
    dob?: string | null;
    gender?: string | null;
    address?: string | null;
  }) {
    try {
      if (!profileData.name || !profileData.email) {
        throw new Error('Name and email are required fields for entrepreneur profiles');
      }

      if (!profileData.password_hash) {
        throw new Error('Password hash is required for entrepreneur account creation');
      }

      console.log('Processing entrepreneur profile data:', {
        name: profileData.name,
        email: profileData.email,
        city: profileData.city,
        country: profileData.country,
        dob: profileData.dob ? 'provided' : 'not provided',
        gender: profileData.gender ? 'provided' : 'not provided',
        address: profileData.address ? 'provided' : 'not provided',
        password_hash: profileData.password_hash ? 'provided' : 'not provided'
      });

      const entrepreneurData = {
        name: profileData.name,
        email: profileData.email,
        city: profileData.city || 'Riyadh',
        country: profileData.country || 'Saudi Arabia',
        avatar_url: profileData.avatar_url,
        dob: profileData.dob || '',
        gender: profileData.gender || '',
        address: profileData.address || '',
        password_hash: profileData.password_hash
      };

      console.log('Sending entrepreneur data to Supabase:', JSON.stringify({
        ...entrepreneurData,
        password_hash: '[REDACTED]'
      }));

      const response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/entrepreneurs`, {
        method: 'POST',
        headers: {
          'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(entrepreneurData)
      });

      const responseText = await response.text();
      console.log('Direct entrepreneur creation status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to create entrepreneur profile directly: ${responseText}`);
      }

      try {
        const parsed = JSON.parse(responseText);
        console.log('Entrepreneur profile created successfully. Response:', JSON.stringify(parsed));

        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0];
        }
        return parsed;
      } catch (e) {
        console.log('Error parsing entrepreneur response:', e);
        return { id: new Date().getTime(), ...entrepreneurData };
      }
    } catch (error: any) {
      console.error('Direct entrepreneur profile creation error:', error);
      throw error;
    }
  },

  async createOwnerProfile(profileData: {
    name: string;
    email: string;
    phone?: string;
    city: string;
    country: string;
    avatar_url?: string;
  }, token: string) {
    try {
      const ownerData = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone || '',
        city: profileData.city || 'Riyadh',
        country: profileData.country || 'Saudi Arabia',
        avatar_url: profileData.avatar_url
      };

      const response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/owners`, {
        method: 'POST',
        headers: {
          'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(ownerData)
      });

      const responseText = await response.text();
      console.log('Create owner response status:', response.status);
      console.log('Create owner response:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to create owner profile: ${responseText}`);
      }

      try {
        return JSON.parse(responseText);
      } catch (e) {
        console.log('Error parsing owner response:', e);
        return [{ id: 0, ...ownerData }];
      }
    } catch (error: any) {
      console.error('Create owner profile error:', error);
      throw error;
    }
  },

  async createOwnerProfileDirectly(profileData: {
    name: string;
    email: string;
    phone?: string;
    city: string;
    country: string;
    avatar_url?: string;
    password_hash?: string;
    dob?: string | null;
    gender?: string | null;
    address?: string | null;
  }) {
    try {
      if (!profileData.password_hash) {
        throw new Error('Password hash is required for owner account creation');
      }

      const ownerData = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone || '',
        city: profileData.city || 'Riyadh',
        country: profileData.country || 'Saudi Arabia',
        avatar_url: profileData.avatar_url,
        dob: profileData.dob || '',
        gender: profileData.gender || '',
        address: profileData.address || '',
        password_hash: profileData.password_hash
      };

      console.log('Creating owner account with data:', {
        ...ownerData,
        password_hash: '[REDACTED]'
      });

      const response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/owners`, {
        method: 'POST',
        headers: {
          'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(ownerData)
      });

      const responseText = await response.text();
      console.log('Direct owner creation status:', response.status);
      console.log('Direct owner creation response:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to create owner profile directly: ${responseText}`);
      }

      console.log('Owner profile created with password hash');

      try {
        const parsed = JSON.parse(responseText);
        console.log('Owner profile created successfully with fields:', Object.keys(parsed[0] || parsed).join(', '));

        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0];
        }
        return parsed;
      } catch (e) {
        console.log('Error parsing owner response:', e);
        return { ...ownerData };
      }
    } catch (error: any) {
      console.error('Direct owner profile creation error:', error);
      throw error;
    }
  },

  async getUserProfile(token: string) {
    try {
      let response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/entrepreneurs?select=*`, {
        method: 'GET',
        headers: {
          'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const entrepreneurs = await response.json();
        if (entrepreneurs && entrepreneurs.length > 0) {
          const userData = entrepreneurs[0];
          return {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            city: userData.city,
            country: userData.country,
            avatar_url: userData.avatar_url,
            created_at: userData.created_at,
            updated_at: userData.updated_at,
            role: 'entrepreneur' as UserRole
          };
        }
      }

      response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/owners?select=*`, {
        method: 'GET',
        headers: {
          'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const owners = await response.json();
        if (owners && owners.length > 0) {
          const userData = owners[0];
          return {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            city: userData.city,
            country: userData.country,
            avatar_url: userData.avatar_url,
            created_at: userData.created_at,
            updated_at: userData.updated_at,
            role: 'owner' as UserRole
          };
        }
      }

      throw new Error('User profile not found');
    } catch (error: any) {
      console.error('Get user profile error:', error);
      throw error;
    }
  },

  async updateProfileAvatar(id: number, role: UserRole, avatarUrl: string) {
    try {
      const tableName = role === 'entrepreneur' ? 'entrepreneurs' : 'owners';
      const updateData = { avatar_url: avatarUrl, updated_at: new Date().toISOString() };

      const response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/${tableName}?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update avatar: ${errorText}`);
      }

      if (currentSession && currentSession.user) {
        currentSession.user.avatar_url = avatarUrl;
      }

      return true;
    } catch (error: any) {
      console.error('Update avatar error:', error);
      throw error;
    }
  },

  async updateEntrepreneurProfile(id: number, profileData: Partial<UserProfile>, token: string) {
    try {
      const response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/entrepreneurs?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update entrepreneur profile: ${errorText}`);
      }

      if (currentSession?.user) {
        currentSession.user = { ...currentSession.user, ...profileData };
      }

      return await response.json();
    } catch (error: any) {
      console.error('Update entrepreneur profile error:', error);
      throw error;
    }
  },

  async updateOwnerProfile(id: number, profileData: Partial<UserProfile>, token: string) {
    try {
      const response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/owners?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update owner profile: ${errorText}`);
      }

      if (currentSession?.user) {
        currentSession.user = { ...currentSession.user, ...profileData };
      }

      return await response.json();
    } catch (error: any) {
      console.error('Update owner profile error:', error);
      throw error;
    }
  },

  async addToFavorites(userId: number, businessId: number) {
    if (!userId || !businessId) {
      throw new Error('User ID and Business ID are required');
    }

    try {
      const exists = await this.checkFavoriteExists(userId, businessId);
      if (exists) {
        return { success: true, message: 'Already in favorites' };
      }

      const response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/favorites`, {
        method: 'POST',
        headers: {
          ...this.getDefaultHeaders(),
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          entrepreneur_id: userId,
          shop_id: businessId,
          created_at: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to add favorite: ${response.statusText}`);
      }

      await this.incrementBusinessFavoritesCount(businessId);

      return { success: true };
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  async removeFromFavorites(userId: number, businessId: number) {
    if (!userId || !businessId) {
      throw new Error('User ID and Business ID are required');
    }

    try {
      const response = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/favorites?entrepreneur_id=eq.${userId}&shop_id=eq.${businessId}`,
        {
          method: 'DELETE',
          headers: this.getDefaultHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to remove favorite: ${response.statusText}`);
      }

      await this.decrementBusinessFavoritesCount(businessId);

      return { success: true };
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  async checkFavoriteExists(userId: number, businessId: number): Promise<boolean> {
    try {
      const response = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/favorites?entrepreneur_id=eq.${userId}&shop_id=eq.${businessId}`,
        {
          method: 'GET',
          headers: this.getDefaultHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to check favorite: ${response.statusText}`);
      }

      const data = await response.json();
      return data.length > 0;
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  },

  async getUserFavorites(userId: number) {
    try {
      const favoritesResponse = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/favorites?entrepreneur_id=eq.${userId}&select=shop_id`,
        {
          method: 'GET',
          headers: this.getDefaultHeaders()
        }
      );

      if (!favoritesResponse.ok) {
        throw new Error(`Failed to fetch favorites: ${favoritesResponse.statusText}`);
      }

      const favorites = await favoritesResponse.json();
      const businessIds = favorites.map((fav: any) => fav.shop_id);

      if (businessIds.length === 0) {
        return [];
      }

      const businessesQuery = businessIds.map((id: number) => `business_id=eq.${id}`).join(',');
      const businessesResponse = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/businesses?${businessesQuery}`,
        {
          method: 'GET',
          headers: this.getDefaultHeaders()
        }
      );

      if (!businessesResponse.ok) {
        throw new Error(`Failed to fetch business details: ${businessesResponse.statusText}`);
      }

      return await businessesResponse.json();
    } catch (error) {
      console.error('Error getting user favorites:', error);
      throw error;
    }
  },

  async getBusinessFavoritesCount(businessId: number): Promise<number> {
    try {
      try {
        const response = await fetch(
          `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/shops?shop_id=eq.${businessId}&select=favorites_count`,
          {
            method: 'GET',
            headers: this.getDefaultHeaders()
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.length > 0 && data[0].favorites_count !== undefined) {
            return data[0].favorites_count || 0;
          }
        }
      } catch (innerError) {
        console.log('Could not get favorites_count from shops table, falling back to count method');
      }

      const countResponse = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/favorites?shop_id=eq.${businessId}&select=shop_id`,
        {
          method: 'GET',
          headers: this.getDefaultHeaders()
        }
      );

      if (!countResponse.ok) {
        throw new Error(`Failed to count favorites: ${countResponse.statusText}`);
      }

      const favoritesData = await countResponse.json();
      return favoritesData.length;
    } catch (error) {
      console.error('Error getting business favorites count:', error);
      return 0;
    }
  },

  async incrementBusinessFavoritesCount(businessId: number) {
    try {
      const currentCount = await this.getBusinessFavoritesCount(businessId);

      const response = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/shops?shop_id=eq.${businessId}`,
        {
          method: 'PATCH',
          headers: {
            ...this.getDefaultHeaders(),
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            favorites_count: currentCount + 1
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to increment favorites count: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error incrementing favorites count:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  async decrementBusinessFavoritesCount(businessId: number) {
    try {
      const currentCount = await this.getBusinessFavoritesCount(businessId);
      const newCount = Math.max(0, currentCount - 1);

      const response = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/shops?shop_id=eq.${businessId}`,
        {
          method: 'PATCH',
          headers: {
            ...this.getDefaultHeaders(),
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            favorites_count: newCount
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to decrement favorites count: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error decrementing favorites count:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },
};

// 3) Re-export of setup helpers (from lib/supabaseSetup.ts)
export interface MarketplaceCreate {
  title: string;
  price: string;
  size: string;
  location: string;
  image: string;
}

export const setupSupabase = async () => {
  try {
    console.log('Setting up Supabase connection and tables...');

    const connected = await supabaseApi.testConnection();
    if (!connected) {
      throw new Error('Could not connect to Supabase');
    }

    const checkTableResponse = await fetch(
      `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/Businesses?limit=1`,
      {
        method: 'GET',
        headers: {
          'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Business table check status:', checkTableResponse.status);

    if (checkTableResponse.status === 404 || checkTableResponse.status === 400) {
      console.log('Businesses table might not exist, attempting to load mock data...');
      return false;
    }

    const businessData = await checkTableResponse.json();
    if (!businessData || businessData.length === 0) {
      console.log('No business data found in the table, attempting to load mock data...');
      return false;
    }

    console.log('Supabase setup completed successfully. Business data available.');
    return true;
  } catch (error) {
    console.error('Error setting up Supabase:', error);
    return false;
  }
};

export const getMockMarketplaces = () => {
  return [
    {
      id: '1',
      title: 'مناسب لفكرتك بنسبة 96%',
      price: '30,000 ريال / سنة',
      size: '400 متر مربع',
      location: 'الخبر, السعودية',
      image: "../assets/images/dummy3.png" as keyof typeof images,
    },
    {
      id: '2',
      title: 'مناسب لفكرتك بنسبة 97%',
      price: '30,000 ريال / سنة',
      size: '420 متر مربع',
      location: 'الدمام, السعودية',
      image: "../assets/images/dummy2.png" as keyof typeof images,
    },
    {
      id: '3',
      title: 'مناسب لفكرتك بنسبة 90%',
      price: '25,000 ريال / سنة',
      size: '380 متر مربع',
      location: 'الرياض, السعودية',
      image: "../assets/images/dummy1.png" as keyof typeof images,
    },
    {
      id: '4',
      title: 'مناسب لفكرتك بنسبة 90%',
      price: '25,000 ريال / سنة',
      size: '380 متر مربع',
      location: 'الرياض, السعودية',
      image: "../assets/images/dummy4.png" as keyof typeof images,
    },
    {
      id: '5',
      title: 'مناسب لفكرتك بنسبة 92%',
      price: '27,000 ريال / سنة',
      size: '350 متر مربع',
      location: 'جدة, السعودية',
      image: "../assets/images/dummy2.png" as keyof typeof images,
    },
    {
      id: '6',
      title: 'مناسب لفكرتك بنسبة 88%',
      price: '22,000 ريال / سنة',
      size: '320 متر مربع',
      location: 'الطائف, السعودية',
      image: "../assets/images/dummy1.png" as keyof typeof images,
    },
  ];
};