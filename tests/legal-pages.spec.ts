import { test, expect } from '@playwright/test';

const LEGAL_PAGES = [
  'privacy-policy',
  'terms-of-service',
  'cookie-policy',
  'gdpr-compliance',
  'accessibility',
  'faq',
];

test.describe('Legal Pages', () => {
  for (const pageName of LEGAL_PAGES) {
    test(`should load ${pageName} page`, async ({ page }) => {
      await page.goto(`/${pageName}`);
      
      // Check page loads successfully
      await expect(page).toHaveTitle(/FlickAI/i);
      
      // Check main heading exists
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
      
      // Check content exists
      const mainContent = page.locator('main').first();
      await expect(mainContent).toBeVisible();
      
      // Check SEO meta tags
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /.+/);
    });

    test(`should have proper structure for ${pageName}`, async ({ page }) => {
      await page.goto(`/${pageName}`);
      
      // Check for sections with headings
      const sections = page.locator('main h2');
      const sectionCount = await sections.count();
      expect(sectionCount).toBeGreaterThan(0);
      
      // Check for content paragraphs
      const paragraphs = page.locator('main p');
      const pCount = await paragraphs.count();
      expect(pCount).toBeGreaterThan(0);
    });
  }

  test('should have FAQ schema on FAQ page', async ({ page }) => {
    await page.goto('/faq');
    
    // Check for JSON-LD schema
    const schema = page.locator('script[type="application/ld+json"]');
    const schemaContent = await schema.textContent();
    
    if (schemaContent) {
      const schemaData = JSON.parse(schemaContent);
      expect(schemaData['@type']).toBe('FAQPage');
      expect(schemaData.mainEntity).toBeDefined();
    }
  });

  test('should have working footer links to legal pages', async ({ page }) => {
    await page.goto('/');
    
    // Check footer links
    const privacyLink = page.locator('footer a[href*="privacy-policy"]');
    await expect(privacyLink).toBeVisible();
    
    const termsLink = page.locator('footer a[href*="terms-of-service"]');
    await expect(termsLink).toBeVisible();
    
    const cookieLink = page.locator('footer a[href*="cookie-policy"]');
    await expect(cookieLink).toBeVisible();
    
    // Test clicking privacy link
    await privacyLink.click();
    await expect(page).toHaveURL(/privacy-policy/);
  });
});
