/**
 * Email Waitlist Form Handler
 */

interface WaitlistResponse {
  success: boolean;
  message: string;
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
 * Gets localized messages
 */
function getMessages(lang: string) {
  const messages: Record<string, Record<string, string>> = {
    en: {
      floatButton: 'Join Waitlist',
      title: '🚀 Get Early Access',
      subtitle: 'Be the first to know when FlickAI launches on Android & iOS!',
      placeholder: 'Enter your email',
      button: 'Join Waitlist',
      success: 'Thank you! We\'ll notify you when we launch. 🎉',
      error: 'Please enter a valid email address',
      networkError: 'Something went wrong. Please try again.',
      alreadyJoined: 'You\'re already on the waitlist!',
    },
    es: {
      floatButton: 'Unirse a Lista',
      title: '🚀 Acceso Anticipado',
      subtitle: '¡Sé el primero en saber cuando FlickAI lance en Android e iOS!',
      placeholder: 'Ingresa tu correo',
      button: 'Unirse a la Lista',
      success: '¡Gracias! Te notificaremos cuando lancemos. 🎉',
      error: 'Por favor ingresa un correo válido',
      networkError: 'Algo salió mal. Por favor intenta de nuevo.',
      alreadyJoined: '¡Ya estás en la lista de espera!',
    },
    fr: {
      floatButton: 'Rejoindre Liste',
      title: '🚀 Accès Anticipé',
      subtitle: 'Soyez le premier informé du lancement de FlickAI sur Android et iOS!',
      placeholder: 'Entrez votre email',
      button: 'Rejoindre la Liste',
      success: 'Merci! Nous vous informerons lors du lancement. 🎉',
      error: 'Veuillez entrer une adresse email valide',
      networkError: 'Une erreur s\'est produite. Veuillez réessayer.',
      alreadyJoined: 'Vous êtes déjà sur la liste d\'attente!',
    },
    ro: {
      floatButton: 'Alătură-te',
      title: '🚀 Acces Anticipat',
      subtitle: 'Fii primul care află când FlickAI lansează pe Android și iOS!',
      placeholder: 'Introdu emailul',
      button: 'Alătură-te Listei',
      success: 'Mulțumim! Te vom anunța când lansăm. 🎉',
      error: 'Te rugăm să introduci un email valid',
      networkError: 'Ceva nu a mers bine. Te rugăm să încerci din nou.',
      alreadyJoined: 'Ești deja pe lista de așteptare!',
    },
  };

  return messages[lang] || messages.en;
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
export function createWaitlistModal(): void {
  // Detect language from URL
  const lang = window.location.pathname.startsWith('/es/') ? 'es'
    : window.location.pathname.startsWith('/fr/') ? 'fr'
      : window.location.pathname.startsWith('/ro/') ? 'ro'
        : 'en';

  const messages = getMessages(lang);

  // Create floating button
  const floatButton = document.createElement('button');
  floatButton.className = 'waitlist-float-button';
  floatButton.textContent = messages.floatButton;

  // Create modal overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'waitlist-modal-overlay';

  // Create modal
  const modal = document.createElement('div');
  modal.className = 'waitlist-modal';
  modal.innerHTML = `
    <button class="waitlist-modal-close">×</button>
    <h3 class="waitlist-title">${messages.title}</h3>
    <p class="waitlist-subtitle">${messages.subtitle}</p>
    <form class="waitlist-form">
      <input type="email" class="waitlist-input" placeholder="${messages.placeholder}" required>
      <button type="submit" class="waitlist-button">${messages.button}</button>
      <div class="waitlist-message"></div>
    </form>
  `;

  modalOverlay.appendChild(modal);

  // Add to body
  document.body.appendChild(floatButton);
  document.body.appendChild(modalOverlay);

  // Get form elements
  const form = modal.querySelector('.waitlist-form') as HTMLFormElement;
  const input = modal.querySelector('.waitlist-input') as HTMLInputElement;
  const button = modal.querySelector('.waitlist-button') as HTMLButtonElement;
  const message = modal.querySelector('.waitlist-message') as HTMLDivElement;
  const closeButton = modal.querySelector('.waitlist-modal-close') as HTMLButtonElement;

  // Open modal
  floatButton.addEventListener('click', () => {
    modalOverlay.classList.add('active');
    setTimeout(() => input.focus(), 300);
  });

  // Close modal
  const closeModal = () => {
    modalOverlay.classList.remove('active');
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

  // Expose open function globally or return it
  (window as any).openWaitlistModal = () => {
    modalOverlay.classList.add('active');
    setTimeout(() => input.focus(), 300);
  };
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
    const floatButton = document.querySelector('.waitlist-float-button') as HTMLButtonElement;
    if (floatButton) floatButton.click();
  }
}

/**
 * Initializes waitlist form (legacy support for embedded forms)
 */
export function initWaitlistForm(): void {
  // This is now handled by the modal
  createWaitlistModal();
}

/**
 * Shows message to user
 */
function showMessage(element: HTMLElement, text: string, type: 'success' | 'error'): void {
  element.textContent = text;
  element.className = `waitlist-message ${type}`;
  element.style.display = 'block';

  // Hide after 5 seconds
  setTimeout(() => {
    element.style.display = 'none';
  }, 5000);
}

// Add CSS for waitlist form
const style = document.createElement('style');
style.textContent = `
  /* Sticky Floating Button */
  .waitlist-float-button {
    position: fixed;
    bottom: 80px;
    right: 20px;
    z-index: 9998;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    border: none;
    border-radius: 2rem;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(37, 99, 235, 0.4);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-sans);
  }

  .waitlist-float-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 25px rgba(37, 99, 235, 0.5);
  }

  .waitlist-float-button::before {
    content: "🚀";
    font-size: 1.2rem;
  }

  /* Modal Overlay */
  .waitlist-modal-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 9999;
    justify-content: center;
    align-items: center;
    padding: 1rem;
  }

  .waitlist-modal-overlay.active {
    display: flex;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* Modal Container */
  .waitlist-modal {
    background: var(--background);
    border-radius: 1.5rem;
    padding: 2.5rem;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    position: relative;
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }

  .waitlist-modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-muted);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;
  }

  .waitlist-modal-close:hover {
    background: var(--surface);
    color: var(--text-main);
  }

  .waitlist-title {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--text-main);
    text-align: center;
  }

  .waitlist-subtitle {
    color: var(--text-muted);
    margin-bottom: 2rem;
    text-align: center;
    font-size: 1rem;
    line-height: 1.5;
  }

  .waitlist-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .waitlist-input {
    width: 100%;
    padding: 1rem 1.25rem;
    border: 2px solid var(--border-color);
    border-radius: 0.75rem;
    font-size: 1rem;
    font-family: var(--font-sans);
    background: var(--background);
    color: var(--text-main);
    transition: all 0.2s;
  }

  .waitlist-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  }

  .waitlist-button {
    width: 100%;
    padding: 1rem 2rem;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-weight: 600;
    font-size: 1.05rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .waitlist-button:hover:not(:disabled) {
    background: var(--primary-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }

  .waitlist-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .waitlist-message {
    display: none;
    width: 100%;
    padding: 1rem 1.25rem;
    border-radius: 0.75rem;
    font-size: 0.95rem;
    text-align: center;
    font-weight: 500;
  }

  .waitlist-message.success {
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #6ee7b7;
  }

  .waitlist-message.error {
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fca5a5;
  }

  @media (prefers-color-scheme: dark) {
    .waitlist-modal {
      background: var(--surface);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
    }

    .waitlist-message.success {
      background: rgba(16, 185, 129, 0.15);
      color: #6ee7b7;
      border-color: rgba(16, 185, 129, 0.3);
    }

    .waitlist-message.error {
      background: rgba(239, 68, 68, 0.15);
      color: #fca5a5;
      border-color: rgba(239, 68, 68, 0.3);
    }
  }

  @media (max-width: 768px) {
    .waitlist-float-button {
      bottom: 70px;
      right: 10px;
      padding: 0.875rem 1.25rem;
      font-size: 0.9rem;
    }

    .waitlist-modal {
      padding: 2rem 1.5rem;
      border-radius: 1.25rem;
      margin: 1rem;
    }

    .waitlist-title {
      font-size: 1.5rem;
    }
  }
`;
document.head.appendChild(style);

