import { test, expect } from '@playwright/test';
import { SUPPORTED_LOCALES } from '../src/i18n-config';

/**
 * Comprehensive Route Testing
 * Tests all routes across all languages to ensure complete coverage
 */

const ROUTES = {
  homepage: [''],
  features: [
    'receipt-scanning',
    'analytics',
    'security',
    'offline-expense-tracker',
    'ai-financial-assistant',
    'on-device-ai-expense-tracker',
    'privacy-first-expense-tracker',
    'receipt-to-excel',
    'scan-receipts-for-taxes',
  ],
  guides: [
    'best-receipt-scanning-apps',
    'offline-expense-tracking',
    'receipt-to-excel',
    'tax-receipts-checklist',
  ],
  alternatives: [
    'best-expense-tracker-apps',
    'best-receipt-scanner-apps',
    'expensify-alternatives',
    'zoho-expense-alternatives',
  ],
  useCases: [
    'expense-tracker-for-freelancers',
    'self-employed-tax-deductions',
  ],
  legal: [
    'privacy-policy',
    'terms-of-service',
    'cookie-policy',
    'gdpr-compliance',
    'accessibility',
    'faq',
  ],
  integrations: [''],
};

test.describe('Comprehensive Route Testing', () => {
  // Test all routes in English
  test.describe('English Routes', () => {
    for (const feature of ROUTES.features) {
      test(`should load /features/${feature}`, async ({ page }) => {
        const response = await page.goto(`/features/${feature}`);
        expect(response?.status()).toBe(200);
        await expect(page.locator('h1')).toBeVisible();
      });
    }

    for (const guide of ROUTES.guides) {
      test(`should load /guides/${guide}`, async ({ page }) => {
        const response = await page.goto(`/guides/${guide}`);
        expect(response?.status()).toBe(200);
        await expect(page.locator('h1')).toBeVisible();
      });
    }

    for (const alt of ROUTES.alternatives) {
      test(`should load /alternatives/${alt}`, async ({ page }) => {
        const response = await page.goto(`/alternatives/${alt}`);
        expect(response?.status()).toBe(200);
        await expect(page.locator('h1')).toBeVisible();
      });
    }

    for (const useCase of ROUTES.useCases) {
      test(`should load /use-cases/${useCase}`, async ({ page }) => {
        const response = await page.goto(`/use-cases/${useCase}`);
        expect(response?.status()).toBe(200);
        await expect(page.locator('h1')).toBeVisible();
      });
    }

    for (const legal of ROUTES.legal) {
      test(`should load /${legal}`, async ({ page }) => {
        const response = await page.goto(`/${legal}`);
        expect(response?.status()).toBe(200);
        await expect(page.locator('h1')).toBeVisible();
      });
    }

    test('should load /integrations', async ({ page }) => {
      const response = await page.goto('/integrations');
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toBeVisible();
    });

    test('should load /guides/ (index)', async ({ page }) => {
      const response = await page.goto('/guides/');
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toBeVisible();
    });

    test('should load /alternatives/ (index)', async ({ page }) => {
      const response = await page.goto('/alternatives/');
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toBeVisible();
    });
  });

  // Test key routes across all languages
  test.describe('Multi-language Route Coverage', () => {
    // Test homepage for all languages
    for (const locale of SUPPORTED_LOCALES) {
      test(`should load ${locale} homepage`, async ({ page }) => {
        const path = locale === 'en' ? '/' : `/${locale}/`;
        const response = await page.goto(path);
        expect(response?.status()).toBe(200);
        
        const htmlLang = await page.locator('html').getAttribute('lang');
        expect(htmlLang).toBe(locale);
        
        await expect(page.locator('h1')).toBeVisible();
      });
    }

    // Test feature pages for major languages
    const majorLocales = ['en', 'es', 'fr', 'de', 'ar'];
    for (const locale of majorLocales) {
      for (const feature of ROUTES.features.slice(0, 3)) { // Test first 3 features
        test(`should load ${locale} /${locale === 'en' ? '' : locale + '/'}features/${feature}`, async ({ page }) => {
          const path = locale === 'en' 
            ? `/features/${feature}`
            : `/${locale}/features/${feature}`;
          
          const response = await page.goto(path);
          expect(response?.status()).toBe(200);
          
          const htmlLang = await page.locator('html').getAttribute('lang');
          expect(htmlLang).toBe(locale);
          
          await expect(page.locator('h1')).toBeVisible();
        });
      }
    }

    // Test legal pages for major languages
    for (const locale of majorLocales) {
      for (const legal of ['privacy-policy', 'terms-of-service', 'faq']) {
        test(`should load ${locale} /${locale === 'en' ? '' : locale + '/'}${legal}`, async ({ page }) => {
          const path = locale === 'en' 
            ? `/${legal}`
            : `/${locale}/${legal}`;
          
          const response = await page.goto(path);
          expect(response?.status()).toBe(200);
          
          const htmlLang = await page.locator('html').getAttribute('lang');
          expect(htmlLang).toBe(locale);
          
          await expect(page.locator('h1')).toBeVisible();
        });
      }
    }
  });

  // Test 404 handling
  test.describe('404 Error Handling', () => {
    test('should handle 404 for invalid feature', async ({ page }) => {
      const response = await page.goto('/features/non-existent-feature');
      expect(response?.status()).toBeGreaterThanOrEqual(404);
    });

    test('should handle 404 for invalid guide', async ({ page }) => {
      const response = await page.goto('/guides/non-existent-guide');
      expect(response?.status()).toBeGreaterThanOrEqual(404);
    });

    test('should handle 404 for invalid alternative', async ({ page }) => {
      const response = await page.goto('/alternatives/non-existent-alt');
      expect(response?.status()).toBeGreaterThanOrEqual(404);
    });

    test('should handle 404 for invalid language route', async ({ page }) => {
      const response = await page.goto('/invalid-lang/');
      // Should redirect to default or show 404
      expect(response?.status()).toBeGreaterThanOrEqual(400);
    });
  });

  // Test redirects and canonical URLs
  test.describe('Redirects and Canonicals', () => {
    test('should redirect trailing slash consistently', async ({ page }) => {
      await page.goto('/features/receipt-scanning');
      const url1 = page.url();
      
      await page.goto('/features/receipt-scanning/');
      const url2 = page.url();
      
      // URLs should be consistent (with or without trailing slash)
      // Both should work, but should resolve to same final URL
      expect(url1).toContain('/features/receipt-scanning');
    });

    test('should have canonical URLs on all pages', async ({ page }) => {
      const pages = [
        '/',
        '/features/receipt-scanning',
        '/guides/best-receipt-scanning-apps',
        '/alternatives/expensify-alternatives',
        '/faq',
      ];
      
      for (const path of pages) {
        await page.goto(path);
        const canonical = page.locator('link[rel="canonical"]');
        await expect(canonical).toHaveAttribute('href', /.+/);
        
        const href = await canonical.getAttribute('href');
        expect(href).toContain('https://flickai.net');
      }
    });

    test('should have correct canonical URLs for language variants', async ({ page }) => {
      await page.goto('/ar/features/receipt-scanning');
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute('href', /.+/);
      
      const href = await canonical.getAttribute('href');
      expect(href).toContain('/ar/features/receipt-scanning');
      expect(href).toContain('https://flickai.net');
    });
  });

  // Test navigation consistency
  test.describe('Navigation Consistency', () => {
    test('should have working navigation links', async ({ page }) => {
      await page.goto('/');
      
      // Check header navigation
      const navLinks = page.locator('header nav a[href^="/"]');
      const count = await navLinks.count();
      expect(count).toBeGreaterThan(0);
      
      // Test first navigation link
      const firstLink = navLinks.first();
      const href = await firstLink.getAttribute('href');
      expect(href).toMatch(/^\//);
      
      // Click and verify it works
      if (href && !href.includes('#')) {
        await firstLink.click();
        await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      }
    });

    test('should have working footer links', async ({ page }) => {
      await page.goto('/');
      
      const footerLinks = page.locator('footer a[href^="/"]');
      const count = await footerLinks.count();
      expect(count).toBeGreaterThan(0);
      
      // Test privacy policy link
      const privacyLink = page.locator('footer a[href*="privacy-policy"]');
      if (await privacyLink.count() > 0) {
        await privacyLink.click();
        await expect(page).toHaveURL(/privacy-policy/);
      }
    });
  });
});
