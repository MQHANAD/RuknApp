// Environment variables with validation for required variables

// Supabase configuration from environment variables
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Supabase config missing. URL present:', Boolean(url), 'KEY present:', Boolean(key));
  throw new Error('Missing Supabase env. Provide EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env');
}

try {
  const host = new URL(url).host;
  console.log('Supabase URL host:', host);
  console.log('Supabase key prefix:', key.slice(0, 4) + '…');
} catch {
  // If URL malformed, throw for clear feedback
  throw new Error('Invalid EXPO_PUBLIC_SUPABASE_URL format');
}

export const EXPO_PUBLIC_SUPABASE_URL: string = url;
export const EXPO_PUBLIC_SUPABASE_ANON_KEY: string = key;

// Direct process.env access with defaults for optional variables
export const PLACEHOLDER_IMAGE_URL: string = process.env.EXPO_PUBLIC_PLACEHOLDER_IMAGE_URL || 'https://images.aqar.fm/webp/350x0/props/placeholder.jpg';

export const GOOGLE_MAPS_CUSTOM_URL: string = process.env.EXPO_PUBLIC_GOOGLE_MAPS_CUSTOM_URL || 'https://www.google.com/maps/d/u/0/viewer?mid=1kpPnbLmYdaQIlFee8vTxr2_LNHS43UE&usp=sharing';

export const RANDOM_AVATAR_BASE_URL: string = process.env.EXPO_PUBLIC_RANDOM_AVATAR_BASE_URL || 'https://picsum.photos/500/500?random=';

export const HELP_DOCS_URL: string = process.env.EXPO_PUBLIC_HELP_DOCS_URL || 'https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet';

// Firebase Analytics Configuration
export const EXPO_PUBLIC_FIREBASE_API_KEY: string = process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '';
export const EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: string = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '';
export const EXPO_PUBLIC_FIREBASE_PROJECT_ID: string = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '';
export const EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: string = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '';
export const EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string = process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '';
export const EXPO_PUBLIC_FIREBASE_APP_ID: string = process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '';
export const EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID: string = process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || '';