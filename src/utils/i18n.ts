import type { SupportedLocale } from '../i18n-config';
import { SUPPORTED_LOCALES } from '../i18n-config';

export type TranslationData = Record<string, any>;

// Static imports of all translation files
import enTranslations from '../locales/en.json';
import arTranslations from '../locales/ar.json';
import deTranslations from '../locales/de.json';
import esTranslations from '../locales/es.json';
import frTranslations from '../locales/fr.json';
import hiTranslations from '../locales/hi.json';
import idTranslations from '../locales/id.json';
import itTranslations from '../locales/it.json';
import roTranslations from '../locales/ro.json';
import zhTranslations from '../locales/zh.json';

const translationMap: Record<SupportedLocale, TranslationData> = {
  en: enTranslations,
  ar: arTranslations,
  de: deTranslations,
  es: esTranslations,
  fr: frTranslations,
  hi: hiTranslations,
  id: idTranslations,
  it: itTranslations,
  ro: roTranslations,
  zh: zhTranslations,
};

/**
 * Load translations for a given locale
 * Returns translations synchronously from static imports
 */
export function getTranslations(locale: string): TranslationData {
  // Validate locale
  if (!SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    console.warn(`Unsupported locale: ${locale}, falling back to 'en'`);
    locale = 'en';
  }

  return translationMap[locale as SupportedLocale] || translationMap.en;
}

/**
 * Get a nested translation value by dot-notation path
 * Example: getTranslationKey(translations, 'home.hero.title')
 */
export function getTranslationKey(
  translations: TranslationData,
  keyPath: string,
  fallback?: string
): string {
  const keys = keyPath.split('.');
  let value: any = translations;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return fallback || keyPath;
    }
  }

  if (typeof value === 'string') {
    return value;
  }

  return fallback || keyPath;
}

/**
 * Get current locale from Astro params or URL
 */
export function getLocaleFromParams(params: Record<string, string | undefined>): SupportedLocale {
  const lang = params.lang;
  
  if (lang && SUPPORTED_LOCALES.includes(lang as SupportedLocale)) {
    return lang as SupportedLocale;
  }
  
  return 'en'; // Default locale
}

/**
 * Get locale from URL pathname
 */
export function getLocaleFromPath(pathname: string): SupportedLocale {
  // Remove leading/trailing slashes
  const cleanPath = pathname.replace(/^\/+|\/+$/g, '');
  
  // Check if path starts with a locale code
  for (const locale of SUPPORTED_LOCALES) {
    if (locale !== 'en' && cleanPath.startsWith(`${locale}/`)) {
      return locale;
    }
  }
  
  return 'en'; // Default locale
}

/**
 * Get the language prefix for URLs (empty for English, /{lang}/ for others)
 */
export function getLangPrefix(locale: SupportedLocale): string {
  return locale === 'en' ? '' : `/${locale}`;
}

/**
 * Get the full path with language prefix
 */
export function getLocalizedPath(locale: SupportedLocale, path: string): string {
  const langPrefix = getLangPrefix(locale);
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${langPrefix}${cleanPath}`;
}

