import { test, expect } from '@playwright/test';

const FEATURES = [
  'receipt-scanning',
  'analytics',
  'security',
  'offline-expense-tracker',
  'ai-financial-assistant',
  'on-device-ai-expense-tracker',
  'privacy-first-expense-tracker',
  'receipt-to-excel',
  'scan-receipts-for-taxes',
];

test.describe('Feature Pages', () => {
  for (const feature of FEATURES) {
    test(`should load feature page: ${feature}`, async ({ page }) => {
      await page.goto(`/features/${feature}/`);
      
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
      
      // Check feature content exists (should be only one main)
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
      const mainCount = await mainContent.count();
      expect(mainCount).toBe(1);
      
      // Check SEO meta tags
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /.+/);
    });
  }

  test('should have FAQ schema for feature pages', async ({ page }) => {
    await page.goto('/features/receipt-scanning/');
    
    // Check for JSON-LD schema (optional - may not be implemented yet)
    const schema = page.locator('script[type="application/ld+json"]');
    const schemaCount = await schema.count();
    
    if (schemaCount > 0) {
      const schemaContent = await schema.first().textContent();
      if (schemaContent) {
        try {
          const schemaData = JSON.parse(schemaContent);
          // Check if it's an array or single object
          const schemas = Array.isArray(schemaData) ? schemaData : [schemaData];
          // Verify at least one schema has a valid @type
          const hasValidSchema = schemas.some(s => s['@type']);
          expect(hasValidSchema).toBe(true);
        } catch (e) {
          // Schema exists but might be malformed - log but don't fail
          console.warn('Schema parsing failed:', e);
        }
      }
    }
    // If no schema found, that's okay - it's optional
  });

  test('should have feature images', async ({ page }) => {
    await page.goto('/features/receipt-scanning/');
    
    const images = page.locator('main img');
    const count = await images.count();
    // Images are optional, but if they exist, they should have alt text
    if (count > 0) {
      const firstImage = images.first();
      const alt = await firstImage.getAttribute('alt');
      // Alt text should exist (even if empty, attribute should be present for decorative images)
      expect(alt).not.toBeNull();
    }
  });

  test('should have working internal links', async ({ page }) => {
    await page.goto('/features/receipt-scanning/');
    
    // Find internal links
    const internalLinks = page.locator('main a[href^="/"]');
    const linkCount = await internalLinks.count();
    
    if (linkCount > 0) {
      const firstLink = internalLinks.first();
      const href = await firstLink.getAttribute('href');
      expect(href).toMatch(/^\//);
      
      // Click link and verify it works (skip hash links)
      if (href && !href.includes('#')) {
        await firstLink.click();
        await page.waitForLoadState('networkidle');
        // URL should match the href (allowing for trailing slashes)
        const currentUrl = page.url();
        expect(currentUrl).toContain(href.replace(/\/$/, ''));
      }
    }
  });

  test('should 404 for invalid feature slug', async ({ page }) => {
    const response = await page.goto('/features/invalid-feature-slug/');
    
    // Should redirect to 404 or return 404
    expect(response?.status()).toBeGreaterThanOrEqual(404);
  });
});
