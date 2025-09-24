// Direct process.env access with validation for required variables

// Direct process.env access for Supabase configuration
const url = "https://wrqntpypzgkzrzqmkhhk.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndycW50cHlwemdrenJ6cW1raGhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNjIwMjIsImV4cCI6MjA3MjgzODAyMn0.9NdRg2QMAaxdtD-BBG0sJZ7_7quqQfZ7t-b5-qaqgnw";

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