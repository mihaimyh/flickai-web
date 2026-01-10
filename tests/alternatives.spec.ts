import { test, expect } from '@playwright/test';

const ALTERNATIVES = [
  'best-expense-tracker-apps',
  'best-receipt-scanner-apps',
  'expensify-alternatives',
  'zoho-expense-alternatives',
];

test.describe('Alternatives Pages', () => {
  test('should load alternatives index page', async ({ page }) => {
    await page.goto('/alternatives/');
    
    await expect(page).toHaveTitle(/FlickAI/i);
    
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    
    // Check for alternative links
    const altLinks = page.locator('main a[href*="/alternatives/"]');
    const count = await altLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  for (const alt of ALTERNATIVES) {
    test(`should load alternative page: ${alt}`, async ({ page }) => {
      await page.goto(`/alternatives/${alt}`);
      
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

  test('should have FAQ schema on alternative pages', async ({ page }) => {
    await page.goto('/alternatives/best-expense-tracker-apps');
    
    // Check for JSON-LD schema
    const schema = page.locator('script[type="application/ld+json"]');
    const schemaContent = await schema.textContent();
    
    if (schemaContent) {
      const schemaData = JSON.parse(schemaContent);
      expect(schemaData['@type']).toBe('FAQPage');
    }
  });

  test('should have working internal links', async ({ page }) => {
    await page.goto('/alternatives/best-expense-tracker-apps');
    
    // Check for links back to alternatives index
    const backLink = page.locator('main a[href*="/alternatives/"]');
    if (await backLink.count() > 0) {
      const href = await backLink.first().getAttribute('href');
      expect(href).toMatch(/alternatives/);
    }
  });
});
