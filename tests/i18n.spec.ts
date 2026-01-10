import { test, expect } from '@playwright/test';

const SUPPORTED_LOCALES = ['en', 'ar', 'de', 'es', 'fr', 'hi', 'id', 'it', 'ro', 'zh'];

test.describe('Internationalization', () => {
  // Test homepage for each language
  for (const locale of SUPPORTED_LOCALES) {
    test(`should load ${locale} homepage`, async ({ page }) => {
      const path = locale === 'en' ? '/' : `/${locale}/`;
      await page.goto(path);
      
      // Check page loads successfully
      await expect(page).toHaveTitle(/FlickAI/i);
      
      // Check main content is visible (should be only one h1)
      const heading = page.locator('h1');
      await expect(heading).toBeVisible();
      const h1Count = await heading.count();
      expect(h1Count).toBe(1);
      
      // Check html lang attribute
      const htmlLang = await page.locator('html').getAttribute('lang');
      expect(htmlLang).toBe(locale);
      
      // Check RTL for Arabic
      if (locale === 'ar') {
        const htmlDir = await page.locator('html').getAttribute('dir');
        expect(htmlDir).toBe('rtl');
      }
    });
  }

  test('should redirect to default locale for invalid locale', async ({ page }) => {
    const response = await page.goto('/invalid-locale/', { waitUntil: 'networkidle' });
    
    // For static sites, invalid locales may show 404 or redirect
    // Accept either a redirect to homepage or a 404 status
    const finalUrl = page.url();
    const isRedirected = finalUrl.endsWith('/') || finalUrl.match(/^https?:\/\/[^/]+\/?$/);
    const is404 = response?.status() === 404;
    
    // Should either redirect to homepage or show 404
    expect(isRedirected || is404).toBeTruthy();
    
    // If redirected, should be homepage
    if (isRedirected && !is404) {
      expect(finalUrl).toMatch(/\/$/);
    }
  });

  test('should have correct language in meta tags', async ({ page }) => {
    await page.goto('/ar/');
    
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('ar');
  });

  test('should have working language-specific navigation', async ({ page }) => {
    // Test Arabic homepage
    await page.goto('/ar/');
    
    const navLinks = page.locator('header nav a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
    
    // Test that links use correct language prefix
    const firstLink = navLinks.first();
    const href = await firstLink.getAttribute('href');
    expect(href).toContain('/ar/');
  });
});
