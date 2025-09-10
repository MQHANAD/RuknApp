import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';

// Import translation files
import en from '../locales/en.json';
import ar from '../locales/ar.json';

// Define supported languages
export const supportedLanguages = {
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    direction: 'ltr',
  },
  ar: {
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    direction: 'rtl',
  },
} as const;

export type SupportedLanguage = keyof typeof supportedLanguages;

// Configure i18next
i18n
  .use(initReactI18next)
  .init({
    // Default language
    lng: 'ar',

    // Fallback language
    fallbackLng: 'en',

    // Supported languages
    supportedLngs: Object.keys(supportedLanguages),

    // Translation resources
    resources: {
      en: {
        translation: en,
      },
      ar: {
        translation: ar,
      },
    },

    // React options
    react: {
      useSuspense: false,
    },

    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // Detection options (for future language detection)
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

// Function to change language and update RTL
export const changeLanguage = async (language: SupportedLanguage) => {
  try {
    await i18n.changeLanguage(language);

    // Update RTL based on language direction
    const isRTL = supportedLanguages[language].direction === 'rtl';
    const currentRTL = I18nManager.isRTL;

    if (isRTL !== currentRTL) {
      I18nManager.forceRTL(isRTL);
      // Note: RTL change requires app restart on native platforms
      if (__DEV__) {
        console.log(`Language changed to ${language}, RTL: ${isRTL}`);
      }
    }
  } catch (error) {
    console.error('Error changing language:', error);
  }
};

// Function to get current language info
export const getCurrentLanguage = (): SupportedLanguage => {
  return (i18n.language as SupportedLanguage) || 'ar';
};

// Function to get current language info object
export const getCurrentLanguageInfo = () => {
  const currentLang = getCurrentLanguage();
  return supportedLanguages[currentLang];
};

// Function to check if current language is RTL
export const isCurrentLanguageRTL = (): boolean => {
  const currentLang = getCurrentLanguage();
  return supportedLanguages[currentLang].direction === 'rtl';
};

export default i18n;