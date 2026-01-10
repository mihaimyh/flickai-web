import { getLocaleFromPath } from './i18n-config';

/**
 * Email Waitlist Form Handler with i18n support
 */

interface WaitlistResponse {
  success: boolean;
  message: string;
}

interface WaitlistTranslations {
  floatButton: string;
  title: string;
  subtitle: string;
  placeholder: string;
  button: string;
  success: string;
  error: string;
  networkError: string;
  alreadyJoined: string;
}

// Configuration - Google Sheets endpoint
const WAITLIST_CONFIG = {
  endpoint: 'https://script.google.com/macros/s/AKfycbzsGUDmeikZe0A9HdmRHAX6bAx-h61ht9HQkOSUR8z7P9qSan1QwWV1H65PkpTowLLNng/exec',
};

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Submits email to waitlist
 */
async function submitToWaitlist(email: string, language: string = 'en'): Promise<WaitlistResponse> {
  try {
    const response = await fetch(WAITLIST_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        email,
        platform: 'ios',
        language,
        timestamp: new Date().toISOString(),
        source: 'website',
      }),
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Thank you for joining! We\'ll notify you when we launch.',
      };
    } else {
      throw new Error('Failed to submit');
    }
  } catch (error) {
    console.error('Waitlist submission error:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}

/**
 * Stores email locally as backup
 */
function storeEmailLocally(email: string): void {
  try {
    const emails = JSON.parse(localStorage.getItem('waitlist_emails') || '[]');
    emails.push({
      email,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('waitlist_emails', JSON.stringify(emails));
  } catch (error) {
    console.error('Error storing email locally:', error);
  }
}

/**
 * Loads translations from JSON files dynamically
 */
async function loadTranslations(lang: string): Promise<WaitlistTranslations> {
  try {
    const response = await fetch(`/locales/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch translations: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    
    // Extract waitlist translations from the JSON structure
    const translations = {
      floatButton: data.waitlist?.floatButton || 'Join Waitlist',
      title: data.waitlist?.title || '🚀 Get Early Access',
      subtitle: data.waitlist?.subtitle || 'Be the first to know when FlickAI launches!',
      placeholder: data.waitlist?.placeholder || 'Enter your email',
      button: data.waitlist?.button || 'Join Waitlist',
      success: data.waitlist?.success || 'Thank you! We\'ll notify you when we launch. 🎉',
      error: data.waitlist?.error || 'Please enter a valid email address',
      networkError: data.waitlist?.networkError || 'Something went wrong. Please try again.',
      alreadyJoined: data.waitlist?.alreadyJoined || 'You\'re already on the waitlist!',
    };
    
    console.log(`[Waitlist] Loaded translations for language: ${lang}`, translations);
    return translations;
  } catch (error) {
    console.error(`[Waitlist] Failed to load translations for ${lang}:`, error);
    // Fallback to English
    return {
      floatButton: 'Join Waitlist',
      title: '🚀 Get Early Access',
      subtitle: 'Be the first to know when FlickAI launches on iOS!',
      placeholder: 'Enter your email',
      button: 'Join Waitlist',
      success: 'Thank you! We\'ll notify you when we launch. 🎉',
      error: 'Please enter a valid email address',
      networkError: 'Something went wrong. Please try again.',
      alreadyJoined: 'You\'re already on the waitlist!',
    };
  }
}

/**
 * Checks if email already submitted
 */
function isAlreadySubmitted(email: string): boolean {
  try {
    const submitted = localStorage.getItem('waitlist_submitted');
    return submitted === email;
  } catch {
    return false;
  }
}

/**
 * Creates floating waitlist button and modal
 */
export async function createWaitlistModal(): Promise<void> {
  // Wait for DOM to be fully ready
  if (document.readyState === 'loading') {
    await new Promise(resolve => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
      } else {
        resolve(null);
      }
    });
  }

  // Detect language from URL
  const currentPath = window.location.pathname;
  const lang = getLocaleFromPath(currentPath);
  console.log(`[Waitlist] Creating modal for language: ${lang}, path: ${currentPath}`);

  // Load translations from JSON
  const messages = await loadTranslations(lang);
  
  if (!messages.floatButton) {
    console.error(`[Waitlist] Translation for floatButton not found for language: ${lang}`);
  }

  // Always remove existing button and modal to ensure clean state (important when language changes)
  const existingButton = document.getElementById('waitlist-fab-button');
  if (existingButton) {
    existingButton.remove();
    console.log(`[Waitlist] Removed existing button before creating new one`);
  }

  const existingModal = document.querySelector('.waitlist-modal-overlay');
  if (existingModal) {
    existingModal.remove();
  }

  // Create new floating button with correct language text
  const floatButton = document.createElement('button');
  floatButton.id = 'waitlist-fab-button';
  floatButton.className = 'fixed bottom-24 right-5 z-[9998] px-6 py-4 bg-gradient-to-br from-primary to-primary-dark text-white border-none rounded-full font-semibold text-base cursor-pointer shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-body md:bottom-24 md:right-5';
  floatButton.innerHTML = `<span>🚀</span> ${messages.floatButton}`;
  console.log(`[Waitlist] Created button with text: "${messages.floatButton}" for language: ${lang}`);

  // Create modal overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'waitlist-modal-overlay hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] justify-center items-center p-4 opacity-0 transition-opacity duration-300';

  // Create modal
  const modal = document.createElement('div');
  modal.className = 'bg-background dark:bg-dark-surface rounded-3xl p-10 max-w-[500px] w-full shadow-2xl relative transform translate-y-5 transition-transform duration-300 border border-border-color dark:border-dark-border';
  modal.innerHTML = `
    <button class="absolute top-4 right-4 bg-transparent border-none text-2xl cursor-pointer text-text-muted hover:text-text-main dark:text-dark-muted dark:hover:text-dark-text w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface dark:hover:bg-dark-highlight transition-colors">×</button>
    <h3 class="text-3xl font-bold mb-2 text-text-main dark:text-dark-text text-center font-display">${messages.title}</h3>
    <p class="text-text-muted dark:text-dark-muted mb-8 text-center text-base leading-relaxed">${messages.subtitle}</p>
    <form class="flex flex-col gap-4">
      <input type="email" class="w-full p-4 border-2 border-border-color dark:border-dark-border rounded-xl text-base font-body bg-background dark:bg-dark-background text-text-main dark:text-dark-text transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" placeholder="${messages.placeholder}" required>
      <button type="submit" class="w-full p-4 bg-primary text-white border-none rounded-xl font-semibold text-lg cursor-pointer transition-all hover:bg-primary-dark hover:-translate-y-px hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed">${messages.button}</button>
      <div class="hidden w-full p-4 rounded-xl text-sm text-center font-medium"></div>
    </form>
  `;

  modalOverlay.appendChild(modal);

  // Add to body (only append if not already in DOM)
  if (!document.body.contains(floatButton)) {
    document.body.appendChild(floatButton);
  }
  if (!document.body.contains(modalOverlay)) {
    document.body.appendChild(modalOverlay);
  }

  // Get form elements
  const form = modal.querySelector('form') as HTMLFormElement;
  const input = modal.querySelector('input') as HTMLInputElement;
  const button = modal.querySelector('button[type="submit"]') as HTMLButtonElement;
  const message = modal.querySelector('div:last-child') as HTMLDivElement;
  const closeButton = modal.querySelector('button:first-child') as HTMLButtonElement;

  // Open modal
  const openModal = () => {
    modalOverlay.classList.remove('hidden');
    // Trigger reflow
    void modalOverlay.offsetWidth;
    modalOverlay.classList.remove('opacity-0');
    modalOverlay.classList.add('flex', 'opacity-100');
    modal.classList.remove('translate-y-5');
    modal.classList.add('translate-y-0');
    setTimeout(() => input.focus(), 300);
  };

  floatButton.addEventListener('click', openModal);

  // Close modal
  const closeModal = () => {
    modalOverlay.classList.remove('opacity-100');
    modalOverlay.classList.add('opacity-0');
    modal.classList.remove('translate-y-0');
    modal.classList.add('translate-y-5');
    setTimeout(() => {
      modalOverlay.classList.remove('flex');
      modalOverlay.classList.add('hidden');
    }, 300);
  };

  closeButton.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = input.value.trim();

    // Validate email
    if (!isValidEmail(email)) {
      showMessage(message, messages.error, 'error');
      return;
    }

    // Check if already submitted
    if (isAlreadySubmitted(email)) {
      showMessage(message, messages.alreadyJoined, 'success');
      return;
    }

    // Disable form while submitting
    button.disabled = true;
    button.textContent = '...';

    // Submit to waitlist
    const result = await submitToWaitlist(email, lang);

    if (result.success) {
      showMessage(message, messages.success, 'success');
      localStorage.setItem('waitlist_submitted', email);
      storeEmailLocally(email);
      input.value = '';

      // Close modal after 2 seconds
      setTimeout(closeModal, 2000);

      // Track conversion (if you have analytics)
      if (typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'waitlist_signup', {
          event_category: 'engagement',
          event_label: lang,
        });
      }
    } else {
      showMessage(message, messages.networkError, 'error');
    }

    // Re-enable form
    button.disabled = false;
    button.textContent = messages.button;
  });

  // Expose open function globally
  (window as any).openWaitlistModal = openModal;
}

/**
 * Opens the waitlist modal
 */
export function openWaitlistModal(): void {
  const openFn = (window as any).openWaitlistModal;
  if (openFn) {
    openFn();
  } else {
    // Fallback if not initialized yet
    const floatButton = document.querySelector('button.fixed.bottom-20') as HTMLButtonElement;
    if (floatButton) floatButton.click();
  }
}

/**
 * Creates and shows a download options dialog with Google Play and iOS waitlist options
 */
export async function openDownloadOptionsDialog(): Promise<void> {
  // Detect language from URL
  const lang = getLocaleFromPath(window.location.pathname);
  
  // Load translations
  const messages = await loadTranslations(lang);
  
  // Get download section translations
  let downloadTitle = 'Start Tracking Today';
  let downloadSubtitle = 'Join thousands of users taking control of their finances with FlickAI.';
  let googlePlayText = 'Google Play';
  let appStoreText = 'App Store (Join Waitlist)';
  
  try {
    const response = await fetch(`/locales/${lang}.json`);
    const data = await response.json();
    downloadTitle = data.home?.download?.title || downloadTitle;
    downloadSubtitle = data.home?.download?.subtitle || downloadSubtitle;
    googlePlayText = data.home?.download?.googlePlay || googlePlayText;
    const waitlistButtonText = data.waitlist?.button || 'Join Waitlist';
    appStoreText = `${data.home?.download?.appStore || 'App Store'} (${waitlistButtonText})`;
  } catch (error) {
    console.error('Failed to load download translations:', error);
  }

  // Create modal overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex justify-center items-center p-4 opacity-0 transition-opacity duration-300';
  
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'bg-background dark:bg-dark-surface rounded-3xl p-10 max-w-[500px] w-full shadow-2xl relative transform translate-y-5 transition-transform duration-300 border border-border-color dark:border-dark-border';
  modal.innerHTML = `
    <button class="absolute top-4 right-4 bg-transparent border-none text-2xl cursor-pointer text-text-muted hover:text-text-main dark:text-dark-muted dark:hover:text-dark-text w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface dark:hover:bg-dark-highlight transition-colors">×</button>
    <h3 class="text-3xl font-bold mb-2 text-text-main dark:text-dark-text text-center font-display">${downloadTitle}</h3>
    <p class="text-text-muted dark:text-dark-muted mb-8 text-center text-base leading-relaxed">${downloadSubtitle}</p>
    <div class="flex flex-col gap-4">
      <a href="https://play.google.com/store/apps/details?id=com.snapspendai" 
         target="_blank" 
         rel="noopener noreferrer"
         class="w-full p-4 bg-primary text-white border-none rounded-xl font-semibold text-lg cursor-pointer transition-all hover:bg-primary-dark hover:-translate-y-px hover:shadow-lg flex items-center justify-center gap-3">
        <svg class="store-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.84L14.5,12.81L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.16L16.81,8.88L14.5,11.19L6.05,2.16Z" />
        </svg>
        ${googlePlayText}
      </a>
      <button type="button" class="download-ios-waitlist w-full p-4 bg-surface dark:bg-dark-surface text-text-main dark:text-dark-text border-2 border-border-color dark:border-dark-border rounded-xl font-semibold text-lg cursor-pointer transition-all hover:bg-surface-highlight dark:hover:bg-dark-highlight hover:-translate-y-px hover:shadow-lg flex items-center justify-center gap-3">
        <svg class="store-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.37 12.36,4.26 13,3.5Z" />
        </svg>
        ${appStoreText}
      </button>
    </div>
  `;

  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);

  // Animate in
  requestAnimationFrame(() => {
    modalOverlay.classList.remove('opacity-0');
    modalOverlay.classList.add('opacity-100');
    modal.classList.remove('translate-y-5');
    modal.classList.add('translate-y-0');
  });

  // Close modal function
  const closeModal = () => {
    modalOverlay.classList.remove('opacity-100');
    modalOverlay.classList.add('opacity-0');
    modal.classList.remove('translate-y-0');
    modal.classList.add('translate-y-5');
    setTimeout(() => {
      document.body.removeChild(modalOverlay);
    }, 300);
  };

  // Close button
  const closeButton = modal.querySelector('button:first-child') as HTMLButtonElement;
  closeButton.addEventListener('click', closeModal);

  // Close on overlay click
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // iOS waitlist button
  const iosButton = modal.querySelector('.download-ios-waitlist') as HTMLButtonElement;
  iosButton.addEventListener('click', () => {
    closeModal();
    setTimeout(() => {
      openWaitlistModal();
    }, 300);
  });
}

/**
 * Initializes waitlist form
 */
export function initWaitlistForm(): void {
  createWaitlistModal();
}

/**
 * Shows message to user
 */
function showMessage(element: HTMLElement, text: string, type: 'success' | 'error'): void {
  element.textContent = text;
  element.className = type === 'success'
    ? 'w-full p-4 rounded-xl text-sm text-center font-medium bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30'
    : 'w-full p-4 rounded-xl text-sm text-center font-medium bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30';

  element.style.display = 'block';

  // Hide after 5 seconds
  setTimeout(() => {
    element.style.display = 'none';
  }, 5000);
}
