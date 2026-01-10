import { test, expect } from '@playwright/test';

const USE_CASES = [
  'expense-tracker-for-freelancers',
  'self-employed-tax-deductions',
];

test.describe('Use Case Pages', () => {
  for (const useCase of USE_CASES) {
    test(`should load use case page: ${useCase}`, async ({ page }) => {
      await page.goto(`/use-cases/${useCase}`);
      
      // Check page loads successfully
      await expect(page).toHaveTitle(/FlickAI/i);
      
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
      
      // Check SEO meta tags
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /.+/);
    });
  }

  test('should have FAQ schema on use case pages', async ({ page }) => {
    await page.goto('/use-cases/expense-tracker-for-freelancers');
    
    // Check for JSON-LD schema
    const schema = page.locator('script[type="application/ld+json"]');
    const schemaContent = await schema.textContent();
    
    if (schemaContent) {
      const schemaData = JSON.parse(schemaContent);
      expect(schemaData['@type']).toBe('FAQPage');
    }
  });

  test('should have working related links', async ({ page }) => {
    await page.goto('/use-cases/expense-tracker-for-freelancers');
    
    // Look for internal links in related section (should be only one main)
    const main = page.locator('main');
    const mainCount = await main.count();
    expect(mainCount).toBe(1);
    
    const links = main.locator('a[href^="/"]');
    const linkCount = await links.count();
    
    if (linkCount > 0) {
      const firstLink = links.first();
      const href = await firstLink.getAttribute('href');
      expect(href).toMatch(/^\//);
    }
  });
});
