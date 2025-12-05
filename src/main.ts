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

  // Link "Download App" buttons to waitlist
  const downloadButtons = document.querySelectorAll('a[href="#download"], .store-button');
  downloadButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      import('./waitlist').then(({ openWaitlistModal }) => {
        openWaitlistModal();
      });
    });
  });
});

console.log('FlickAI Web App Initialized');
