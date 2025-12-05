/**
 * i18n Redirect System
 * Automatically redirects users to their preferred language version
 */

import { SUPPORTED_LOCALES, LANGUAGE_INFO, getLocalePath, getLocaleFromPath, isValidLocale, type SupportedLocale } from './i18n-config';

const LANGUAGE_PREFERENCE_KEY = 'flickai_language_preference';

/**
 * Gets the user's preferred language from various sources
 * Priority: 1. Saved preference, 2. Browser language
 */
function getUserLanguage(): SupportedLocale {
  // Check if user has a saved preference
  const savedPreference = localStorage.getItem(LANGUAGE_PREFERENCE_KEY);
  if (savedPreference && isValidLocale(savedPreference)) {
    return savedPreference;
  }

  // Get browser languages (returns array like ['en-US', 'en', 'es'])
  const browserLanguages = navigator.languages || [navigator.language];

  // Find first matching supported language
  for (const browserLang of browserLanguages) {
    // Extract base language code (e.g., 'en' from 'en-US')
    const langCode = browserLang.split('-')[0].toLowerCase();

    if (isValidLocale(langCode)) {
      return langCode;
    }
  }

  // Default to English
  return 'en';
}

/**
 * Detects current page language from URL
 */
function getCurrentLanguage(): SupportedLocale {
  return getLocaleFromPath(window.location.pathname);
}

/**
 * Gets the equivalent path in target language
 */
function getLocalizedPath(currentPath: string, targetLang: SupportedLocale): string {
  // Remove current language prefix if exists
  let basePath = currentPath;

  for (const locale of SUPPORTED_LOCALES) {
    if (locale !== 'en') {
      const prefix = getLocalePath(locale);
      if (currentPath.startsWith(prefix)) {
        basePath = currentPath.slice(prefix.length - 1); // Keep leading slash
        break;
      }
    }
  }

  // Add target language prefix
  if (targetLang === 'en') {
    return basePath;
  } else {
    return getLocalePath(targetLang) + basePath.slice(1); // Remove leading slash from basePath
  }
}

/**
 * Redirects user to their preferred language version
 */
export function initLanguageRedirect(): void {
  // Only run on main pages, not on policy/terms pages
  const path = window.location.pathname;
  const isPolicyPage = path.includes('privacy') || path.includes('terms') ||
    path.includes('cookie') || path.includes('accessibility') ||
    path.includes('gdpr');

  if (isPolicyPage) {
    console.log('Policy page detected, skipping language redirect');
    return;
  }

  const currentLang = getCurrentLanguage();
  const preferredLang = getUserLanguage();

  console.log(`Current language: ${currentLang}, Preferred: ${preferredLang}`);

  // Only redirect if on English version and user prefers another language
  // Or if on a language version that doesn't match preference
  if (currentLang !== preferredLang && currentLang === 'en' && preferredLang !== 'en') {
    const targetPath = getLocalizedPath(window.location.pathname, preferredLang);
    console.log(`Redirecting to: ${targetPath}`);
    window.location.href = targetPath;
  }
}

/**
 * Sets user language preference and redirects
 */
export function setLanguagePreference(lang: SupportedLocale): void {
  localStorage.setItem(LANGUAGE_PREFERENCE_KEY, lang);
  const targetPath = getLocalizedPath(window.location.pathname, lang);
  window.location.href = targetPath;
}

/**
 * Creates a language switcher UI
 */
export function createLanguageSwitcher(): HTMLElement {
  const currentLang = getCurrentLanguage();

  const switcher = document.createElement('div');
  switcher.className = 'fixed bottom-5 right-5 z-50';

  // Generate options dynamically from config
  const options = SUPPORTED_LOCALES.map(locale => {
    const info = LANGUAGE_INFO[locale];
    const selected = currentLang === locale ? 'selected' : '';
    return `<option value="${locale}" ${selected}>${info.flag} ${info.nativeName}</option>`;
  }).join('\n        ');

  // Using appearance-none with a custom SVG arrow for consistent cross-browser styling
  switcher.innerHTML = `
    <div class="relative">
      <select id="language-select" class="appearance-none bg-surface dark:bg-dark-surface text-text-main dark:text-dark-text border border-border-color dark:border-dark-border rounded-lg pl-4 pr-10 py-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer font-body text-sm transition-all hover:-translate-y-0.5 hover:shadow-xl" aria-label="Select language">
        ${options}
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-muted dark:text-dark-muted">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
  `;

  const select = switcher.querySelector('#language-select') as HTMLSelectElement;
  select.addEventListener('change', (e) => {
    const target = e.target as HTMLSelectElement;
    if (isValidLocale(target.value)) {
      setLanguagePreference(target.value);
    }
  });

  return switcher;
}

