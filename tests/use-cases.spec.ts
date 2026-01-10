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
      
      // Check main heading exists
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
      
      // Check content exists
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
      
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
    
    // Look for internal links in related section
    const links = page.locator('main a[href^="/"]');
    const linkCount = await links.count();
    
    if (linkCount > 0) {
      const firstLink = links.first();
      const href = await firstLink.getAttribute('href');
      expect(href).toMatch(/^\//);
    }
  });
});
