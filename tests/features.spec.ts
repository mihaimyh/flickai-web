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
      await page.goto(`/features/${feature}`);
      
      // Check page loads successfully
      await expect(page).toHaveTitle(/FlickAI/i);
      
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
    await page.goto('/features/receipt-scanning');
    
    // Check for JSON-LD schema
    const schema = page.locator('script[type="application/ld+json"]');
    const schemaContent = await schema.textContent();
    
    if (schemaContent) {
      const schemaData = JSON.parse(schemaContent);
      expect(schemaData['@type']).toBe('FAQPage');
    }
  });

  test('should have feature images', async ({ page }) => {
    await page.goto('/features/receipt-scanning');
    
    const images = page.locator('main img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
    
    // Check images have alt text
    const firstImage = images.first();
    const alt = await firstImage.getAttribute('alt');
    expect(alt).toBeTruthy();
  });

  test('should have working internal links', async ({ page }) => {
    await page.goto('/features/receipt-scanning');
    
    // Find internal links
    const internalLinks = page.locator('main a[href^="/"]');
    const firstLink = internalLinks.first();
    
    if (await firstLink.count() > 0) {
      const href = await firstLink.getAttribute('href');
      expect(href).toMatch(/^\//);
      
      // Click link and verify it works
      if (href && !href.includes('#')) {
        await firstLink.click();
        await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      }
    }
  });

  test('should 404 for invalid feature slug', async ({ page }) => {
    const response = await page.goto('/features/invalid-feature-slug');
    
    // Should redirect to 404 or return 404
    expect(response?.status()).toBeGreaterThanOrEqual(404);
  });
});
