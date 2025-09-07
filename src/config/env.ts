import Constants from 'expo-constants';
// Prefer build-time injected EXPO_PUBLIC_* (SDK 53). Fallback to expo.extra if present.
const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? (Constants?.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL as string | undefined);
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? (Constants?.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY as string | undefined);

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

export const EXPO_PUBLIC_SUPABASE_URL = url;
export const EXPO_PUBLIC_SUPABASE_ANON_KEY = key;