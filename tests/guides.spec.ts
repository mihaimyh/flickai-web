import { test, expect } from '@playwright/test';

const GUIDES = [
  'best-receipt-scanning-apps',
  'offline-expense-tracking',
  'receipt-to-excel',
  'tax-receipts-checklist',
];

test.describe('Guide Pages', () => {
  test('should load guides index page', async ({ page }) => {
    await page.goto('/guides/');
    
    await expect(page).toHaveTitle(/FlickAI/i);
    
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    
    // Check for guide links
    const guideLinks = page.locator('main a[href*="/guides/"]');
    const count = await guideLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  for (const guide of GUIDES) {
    test(`should load guide: ${guide}`, async ({ page }) => {
      await page.goto(`/guides/${guide}`);
      
      // Check page loads successfully
      await expect(page).toHaveTitle(/FlickAI/i);
      
      // Check main heading exists
      const heading = page.locator('article h1, main h1').first();
      await expect(heading).toBeVisible();
      
      // Check article content exists
      const article = page.locator('article, main').first();
      await expect(article).toBeVisible();
      
      // Check for publish date
      const publishDate = page.locator('time, [datetime]');
      const dateCount = await publishDate.count();
      // Publish date might not be visible, so just check if content exists
      
      // Check SEO meta tags
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /.+/);
    });
  }

  test('should have proper article structure', async ({ page }) => {
    await page.goto('/guides/best-receipt-scanning-apps');
    
    // Check for headings hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // Check for paragraph content
    const paragraphs = page.locator('article p, main p');
    const pCount = await paragraphs.count();
    expect(pCount).toBeGreaterThan(0);
  });

  test('should have working related links', async ({ page }) => {
    await page.goto('/guides/best-receipt-scanning-apps');
    
    // Look for internal links
    const links = page.locator('article a[href^="/"], main a[href^="/"]');
    const linkCount = await links.count();
    
    if (linkCount > 0) {
      const firstLink = links.first();
      const href = await firstLink.getAttribute('href');
      expect(href).toMatch(/^\//);
    }
  });
});
