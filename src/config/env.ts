import Constants from 'expo-constants';

type Extra = {
  EXPO_PUBLIC_SUPABASE_URL?: string;
  EXPO_PUBLIC_SUPABASE_ANON_KEY?: string;
  PLACEHOLDER_IMAGE_URL?: string;
  GOOGLE_MAPS_CUSTOM_URL?: string;
  RANDOM_AVATAR_BASE_URL?: string;
  HELP_DOCS_URL?: string;
};

// Prefer reading from expoConfig.extra first (newer SDKs), then manifest.extra (older SDKs)
const extra: Extra =
  (Constants?.expoConfig?.extra as Extra) ??
  ((Constants as any)?.manifest?.extra as Extra) ??
  {};

const getString = (
  envName: string,
  extraKey?: keyof Extra,
  defaultValue?: string
): string | undefined => {
  const fromEnv = process.env[envName];
  if (typeof fromEnv === 'string' && fromEnv.length > 0) return fromEnv;

  const key = extraKey ?? (envName as keyof Extra);
  const fromExtra = (extra as Record<string, unknown>)?.[key as string];
  if (typeof fromExtra === 'string' && fromExtra.length > 0) return fromExtra;

  return defaultValue;
};

// Keep existing exports/names to avoid churn
const url = getString('EXPO_PUBLIC_SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_URL');
const key = getString('EXPO_PUBLIC_SUPABASE_ANON_KEY', 'EXPO_PUBLIC_SUPABASE_ANON_KEY');

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

// New centralized external values (safe defaults preserve current behavior)
export const PLACEHOLDER_IMAGE_URL: string = getString(
  'EXPO_PUBLIC_PLACEHOLDER_IMAGE_URL',
  'PLACEHOLDER_IMAGE_URL',
  'https://images.aqar.fm/webp/350x0/props/placeholder.jpg'
)!;

export const GOOGLE_MAPS_CUSTOM_URL: string = getString(
  'EXPO_PUBLIC_GOOGLE_MAPS_CUSTOM_URL',
  'GOOGLE_MAPS_CUSTOM_URL',
  'https://www.google.com/maps/d/u/0/viewer?mid=1kpPnbLmYdaQIlFee8vTxr2_LNHS43UE&usp=sharing'
)!;

export const RANDOM_AVATAR_BASE_URL: string = getString(
  'EXPO_PUBLIC_RANDOM_AVATAR_BASE_URL',
  'RANDOM_AVATAR_BASE_URL',
  'https://picsum.photos/500/500?random='
)!;

export const HELP_DOCS_URL: string = getString(
  'EXPO_PUBLIC_HELP_DOCS_URL',
  'HELP_DOCS_URL',
  'https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet'
)!;