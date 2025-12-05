/**
 * i18n Redirect System
 * Automatically redirects users to their preferred language version
 */

// Supported languages with their paths
const SUPPORTED_LANGUAGES = {
  en: '/',
  es: '/es/',
  fr: '/fr/',
  ro: '/ro/',
} as const;

type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

const LANGUAGE_PREFERENCE_KEY = 'flickai_language_preference';

/**
 * Gets the user's preferred language from various sources
 * Priority: 1. Saved preference, 2. Browser language
 */
function getUserLanguage(): SupportedLanguage {
  // Check if user has a saved preference
  const savedPreference = localStorage.getItem(LANGUAGE_PREFERENCE_KEY);
  if (savedPreference && savedPreference in SUPPORTED_LANGUAGES) {
    return savedPreference as SupportedLanguage;
  }

  // Get browser languages (returns array like ['en-US', 'en', 'es'])
  const browserLanguages = navigator.languages || [navigator.language];

  // Find first matching supported language
  for (const browserLang of browserLanguages) {
    // Extract base language code (e.g., 'en' from 'en-US')
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    if (langCode in SUPPORTED_LANGUAGES) {
      return langCode as SupportedLanguage;
    }
  }

  // Default to English
  return 'en';
}

/**
 * Detects current page language from URL
 */
function getCurrentLanguage(): SupportedLanguage | null {
  const path = window.location.pathname;
  
  if (path.startsWith('/es/')) return 'es';
  if (path.startsWith('/fr/')) return 'fr';
  if (path.startsWith('/ro/')) return 'ro';
  if (path === '/' || path.startsWith('/features/') || path.startsWith('/privacy') || path.startsWith('/terms') || path.startsWith('/cookie')) return 'en';
  
  return null;
}

/**
 * Gets the equivalent path in target language
 */
function getLocalizedPath(currentPath: string, targetLang: SupportedLanguage): string {
  // Remove current language prefix if exists
  let basePath = currentPath;
  
  for (const [lang, prefix] of Object.entries(SUPPORTED_LANGUAGES)) {
    if (lang !== 'en' && currentPath.startsWith(prefix)) {
      basePath = currentPath.slice(prefix.length - 1); // Keep leading slash
      break;
    }
  }

  // Add target language prefix
  if (targetLang === 'en') {
    return basePath;
  } else {
    return SUPPORTED_LANGUAGES[targetLang] + basePath.slice(1); // Remove leading slash from basePath
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
export function setLanguagePreference(lang: SupportedLanguage): void {
  localStorage.setItem(LANGUAGE_PREFERENCE_KEY, lang);
  const targetPath = getLocalizedPath(window.location.pathname, lang);
  window.location.href = targetPath;
}

/**
 * Creates a language switcher UI
 */
export function createLanguageSwitcher(): HTMLElement {
  const currentLang = getCurrentLanguage() || 'en';
  
  const switcher = document.createElement('div');
  switcher.className = 'language-switcher';
  switcher.innerHTML = `
    <select id="language-select" class="language-select" aria-label="Select language">
      <option value="en" ${currentLang === 'en' ? 'selected' : ''}>🇬🇧 English</option>
      <option value="es" ${currentLang === 'es' ? 'selected' : ''}>🇪🇸 Español</option>
      <option value="fr" ${currentLang === 'fr' ? 'selected' : ''}>🇫🇷 Français</option>
      <option value="ro" ${currentLang === 'ro' ? 'selected' : ''}>🇷🇴 Română</option>
    </select>
  `;

  const select = switcher.querySelector('#language-select') as HTMLSelectElement;
  select.addEventListener('change', (e) => {
    const target = e.target as HTMLSelectElement;
    setLanguagePreference(target.value as SupportedLanguage);
  });

  return switcher;
}

// Add CSS for language switcher
const style = document.createElement('style');
style.textContent = `
  .language-switcher {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
  }

  .language-select {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid var(--border-color);
    background-color: var(--background);
    color: var(--text-main);
    font-family: var(--font-sans);
    font-size: 0.9rem;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
  }

  .language-select:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }

  .language-select:focus {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    .language-switcher {
      bottom: 10px;
      right: 10px;
    }
    
    .language-select {
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
    }
  }
`;
document.head.appendChild(style);

