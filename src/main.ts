import './style.css'
import { initLanguageRedirect, createLanguageSwitcher } from './i18n-redirect'
import { initWaitlistForm } from './waitlist'

// Animation Observer
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  // Initialize animations
  const animatedElements = document.querySelectorAll('.fade-in');
  animatedElements.forEach(el => observer.observe(el));

  // Initialize language redirect (only on first visit to English version)
  initLanguageRedirect();

  // Add language switcher to the page
  const body = document.querySelector('body');
  if (body) {
    body.appendChild(createLanguageSwitcher());
  }

  // Initialize waitlist form
  initWaitlistForm();

  // Link "Download App" buttons to download options dialog (exclude store buttons with external links)
  const downloadButtons = document.querySelectorAll('a[href="#download"]');
  downloadButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      import('./waitlist').then(({ openDownloadOptionsDialog }) => {
        openDownloadOptionsDialog();
      });
    });
  });
  
  // Link disabled store buttons (App Store) to download options dialog
  const disabledStoreButtons = document.querySelectorAll('.store-button.disabled, .store-button.app-store');
  disabledStoreButtons.forEach(btn => {
    // Skip if it's an anchor with an external link
    if (btn instanceof HTMLAnchorElement) {
      const href = btn.getAttribute('href');
      if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
        return; // Allow external links to work normally
      }
    }
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      import('./waitlist').then(({ openDownloadOptionsDialog }) => {
        openDownloadOptionsDialog();
      });
    });
  });
});

console.log('FlickAI Web App Initialized');
