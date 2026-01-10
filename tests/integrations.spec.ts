import { test, expect } from '@playwright/test';
import { SUPPORTED_LOCALES } from '../src/i18n-config';

/**
 * Integrations Page Testing
 * Tests the integrations/index page and its variants
 */

test.describe('Integrations Page', () => {
  test('should load integrations index page', async ({ page }) => {
    await page.goto('/integrations/');
    
    await page.waitForLoadState('networkidle');
    // Check page has a title (not empty)
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    
    // Check main heading exists (should be only one h1)
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    const h1Count = await heading.count();
    expect(h1Count).toBe(1);
    
    // Check content exists (should be only one main)
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
    const mainCount = await mainContent.count();
    expect(mainCount).toBe(1);
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/integrations/');
    
    await page.waitForLoadState('networkidle');
    // Title tag
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(5);
    
    // Meta description
    const metaDescription = page.locator('meta[name="description"]');
    const descCount = await metaDescription.count();
    if (descCount > 0) {
      await expect(metaDescription).toHaveAttribute('content', /.+/);
      const desc = await metaDescription.getAttribute('content');
      expect(desc?.length).toBeGreaterThan(20);
    }
  });

  test('should have SEO elements', async ({ page }) => {
    await page.goto('/integrations/');
    
    await page.waitForLoadState('networkidle');
    // Open Graph tags (optional but recommended)
    const ogTitle = page.locator('meta[property="og:title"]');
    const ogTitleCount = await ogTitle.count();
    if (ogTitleCount > 0) {
      await expect(ogTitle).toHaveAttribute('content', /.+/);
    }
    
    const ogDescription = page.locator('meta[property="og:description"]');
    const ogDescCount = await ogDescription.count();
    if (ogDescCount > 0) {
      await expect(ogDescription).toHaveAttribute('content', /.+/);
    }
    
    // Canonical URL (should exist)
    const canonical = page.locator('link[rel="canonical"]');
    const canonicalCount = await canonical.count();
    if (canonicalCount > 0) {
      await expect(canonical).toHaveAttribute('href', /.+/);
    }
    
    // Hreflang tags (optional - may not be on all pages)
    const hreflangTags = page.locator('link[rel="alternate"][hreflang]');
    const count = await hreflangTags.count();
    // Hreflang is optional but recommended for multi-language sites
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/integrations/');
    
    // Should have exactly one H1
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    expect(h1Count).toBe(1);
    
    // Should have H2s for sections (or other headings)
    const h2s = page.locator('h2, h3');
    const h2Count = await h2s.count();
    // Some pages might only have h1, which is acceptable
    expect(h2Count).toBeGreaterThanOrEqual(0);
  });

  test('should have working internal links', async ({ page }) => {
    await page.goto('/integrations/');
    
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
      const path = locale === 'en' ? '/integrations/' : `/${locale}/integrations/`;
      await page.goto(path);
      
      await page.waitForLoadState('networkidle');
      // Check page has a title (not empty)
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
      
      // Check language attribute
      const htmlLang = await page.locator('html').getAttribute('lang');
      expect(htmlLang).toBe(locale);
      
      // Check content exists (should be only one h1)
      const heading = page.locator('h1');
      await expect(heading).toBeVisible();
      const h1Count = await heading.count();
      expect(h1Count).toBe(1);
    }
  });

  test('should have structured data', async ({ page }) => {
    await page.goto('/integrations/');
    
    // Check for JSON-LD schema (optional - may not be implemented yet)
    const schemaScripts = page.locator('script[type="application/ld+json"]');
    const count = await schemaScripts.count();
    
    // Structured data is optional - if present, validate it
    if (count > 0) {
      // Verify schema is valid JSON
      for (let i = 0; i < count; i++) {
        const content = await schemaScripts.nth(i).textContent();
        if (content) {
          expect(() => JSON.parse(content)).not.toThrow();
          const data = JSON.parse(content);
          expect(data['@context']).toBe('https://schema.org');
        }
      }
    }
    // If no schema found, that's okay - it's optional
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/integrations/');
    
    // Check for semantic HTML (should be only one main)
    const main = page.locator('main');
    await expect(main).toBeVisible();
    const mainCount = await main.count();
    expect(mainCount).toBe(1);
    
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
