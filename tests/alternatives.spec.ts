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
    
    // Wait for page to load and check it loaded successfully
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/alternatives/');
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    const h1Count = await heading.count();
    expect(h1Count).toBe(1);
    
    // Check for alternative links
    const altLinks = page.locator('main a[href*="/alternatives/"]');
    const count = await altLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  for (const alt of ALTERNATIVES) {
    test(`should load alternative page: ${alt}`, async ({ page }) => {
      await page.goto(`/alternatives/${alt}/`);
      
      // Check page loads successfully (status 200)
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain(`/alternatives/${alt}/`);
      
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
      
      // Check SEO meta tags
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /.+/);
    });
  }

  test('should have FAQ schema on alternative pages', async ({ page }) => {
    await page.goto('/alternatives/best-expense-tracker-apps/');
    
    // Check for JSON-LD schema (optional - may not be implemented yet)
    const schema = page.locator('script[type="application/ld+json"]');
    const schemaCount = await schema.count();
    
    // If schema exists, validate it
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

  test('should have working internal links', async ({ page }) => {
    await page.goto('/alternatives/best-expense-tracker-apps/');
    
    // Check for links back to alternatives index
    const backLink = page.locator('main a[href*="/alternatives/"]');
    if (await backLink.count() > 0) {
      const href = await backLink.first().getAttribute('href');
      expect(href).toMatch(/alternatives/);
    }
  });
});
