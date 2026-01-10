import { test, expect } from '@playwright/test';
import { SUPPORTED_LOCALES } from '../src/i18n-config';

/**
 * Integrations Page Testing
 * Tests the integrations/index page and its variants
 */

test.describe('Integrations Page', () => {
  test('should load integrations index page', async ({ page }) => {
    await page.goto('/integrations');
    
    // Check page loads successfully
    await expect(page).toHaveTitle(/FlickAI/i);
    
    // Check main heading exists
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    
    // Check content exists
    const mainContent = page.locator('main').first();
    await expect(mainContent).toBeVisible();
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/integrations');
    
    // Title tag
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(10);
    
    // Meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
    const desc = await metaDescription.getAttribute('content');
    expect(desc?.length).toBeGreaterThan(50);
  });

  test('should have SEO elements', async ({ page }) => {
    await page.goto('/integrations');
    
    // Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);
    
    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute('content', /.+/);
    
    // Canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /.+/);
    
    // Hreflang tags
    const hreflangTags = page.locator('link[rel="alternate"][hreflang]');
    const count = await hreflangTags.count();
    expect(count).toBeGreaterThanOrEqual(10); // 10 languages + x-default
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/integrations');
    
    // Should have exactly one H1
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    expect(h1Count).toBe(1);
    
    // Should have H2s for sections
    const h2s = page.locator('h2');
    const h2Count = await h2s.count();
    expect(h2Count).toBeGreaterThan(0);
  });

  test('should have working internal links', async ({ page }) => {
    await page.goto('/integrations');
    
    // Check for internal links
    const internalLinks = page.locator('main a[href^="/"]');
    const linkCount = await internalLinks.count();
    
    if (linkCount > 0) {
      // Test first internal link
      const firstLink = internalLinks.first();
      const href = await firstLink.getAttribute('href');
      expect(href).toMatch(/^\//);
      
      // Verify link is valid (doesn't throw error)
      if (href && !href.includes('#')) {
        const response = await page.goto(href);
        expect(response?.status()).toBeLessThan(400);
      }
    }
  });

  test('should have language variants', async ({ page }) => {
    // Test a few language variants
    const testLocales = ['en', 'es', 'fr', 'de'];
    
    for (const locale of testLocales) {
      const path = locale === 'en' ? '/integrations' : `/${locale}/integrations`;
      await page.goto(path);
      
      // Check page loads
      await expect(page).toHaveTitle(/FlickAI/i);
      
      // Check language attribute
      const htmlLang = await page.locator('html').getAttribute('lang');
      expect(htmlLang).toBe(locale);
      
      // Check content exists
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
    }
  });

  test('should have structured data', async ({ page }) => {
    await page.goto('/integrations');
    
    // Check for JSON-LD schema
    const schemaScripts = page.locator('script[type="application/ld+json"]');
    const count = await schemaScripts.count();
    
    // Should have at least one schema (Organization, WebSite, or WebPage)
    expect(count).toBeGreaterThan(0);
    
    // Verify schema is valid JSON
    for (let i = 0; i < count; i++) {
      const content = await schemaScripts.nth(i).textContent();
      if (content) {
        expect(() => JSON.parse(content)).not.toThrow();
        const data = JSON.parse(content);
        expect(data['@context']).toBe('https://schema.org');
      }
    }
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/integrations');
    
    // Check for semantic HTML
    const main = page.locator('main').first();
    await expect(main).toBeVisible();
    
    // Check images have alt text
    const images = page.locator('main img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      // Alt text should exist (can be empty for decorative images)
      expect(alt).not.toBeNull();
    }
    
    // Check for proper language attribute
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBeTruthy();
  });
});
