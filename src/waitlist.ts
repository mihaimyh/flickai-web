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
        platform: 'both',
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
    const data = await response.json();
    
    // Extract waitlist translations from the JSON structure
    return {
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
  } catch (error) {
    console.error('Failed to load translations:', error);
    // Fallback to English
    return {
      floatButton: 'Join Waitlist',
      title: '🚀 Get Early Access',
      subtitle: 'Be the first to know when FlickAI launches on Android & iOS!',
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
  // Detect language from URL
  const lang = getLocaleFromPath(window.location.pathname);

  // Load translations from JSON
  const messages = await loadTranslations(lang);

  // Create floating button
  const floatButton = document.createElement('button');
  floatButton.className = 'fixed bottom-20 right-5 z-[9998] px-6 py-4 bg-gradient-to-br from-primary to-primary-dark text-white border-none rounded-full font-semibold text-base cursor-pointer shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-body md:bottom-20 md:right-5';
  floatButton.innerHTML = `<span>🚀</span> ${messages.floatButton}`;

  // Create modal overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] justify-center items-center p-4 opacity-0 transition-opacity duration-300';

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

  // Add to body
  document.body.appendChild(floatButton);
  document.body.appendChild(modalOverlay);

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
