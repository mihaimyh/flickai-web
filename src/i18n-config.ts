/**
 * i18n Configuration
 * Single source of truth for all supported languages
 * 
 * To add a new language:
 * 1. Add the language code to SUPPORTED_LOCALES array
 * 2. Create the translation file: src/locales/{code}.json
 * 3. Run: npm run build:i18n
 * 
 * That's it! Everything else updates automatically:
 * - Language selector dropdown
 * - URL routing
 * - Language detection
 * - Sitemap generation
 * - Hreflang tags
 */

/**
 * List of all supported language codes
 * Order determines display order in language selector
 */
export const SUPPORTED_LOCALES = ['en', 'ar', 'de', 'es', 'fr', 'ro', 'zh', 'id', 'hi', 'it'] as const;

export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

/**
 * Language metadata for display purposes
 */
export const LANGUAGE_INFO: Record<SupportedLocale, {
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean; // Right-to-left languages
}> = {
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  ro: { name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  zh: { name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳' },
  id: { name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  it: { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
};

/**
 * Get URL path for a given locale
 * English uses root path, others use /{locale}/ prefix
 */
export function getLocalePath(locale: SupportedLocale): string {
  return locale === 'en' ? '/' : `/${locale}/`;
}

/**
 * Check if a locale is supported
 */
export function isValidLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

/**
 * Get locale from URL path
 */
export function getLocaleFromPath(path: string): SupportedLocale {
  for (const locale of SUPPORTED_LOCALES) {
    if (locale !== 'en' && path.startsWith(`/${locale}/`)) {
      return locale;
    }
  }
  return 'en';
}
