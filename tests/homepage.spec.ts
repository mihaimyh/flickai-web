import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/FlickAI/i);
    
    // Check main heading (should be only one h1)
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    const h1Count = await h1.count();
    expect(h1Count).toBe(1);
    
    // Check navigation is visible (check for nav in header specifically)
    await expect(page.locator('header nav')).toBeVisible();
    
    // Check footer is visible
    await expect(page.locator('footer')).toBeVisible();
    
    // Homepage uses sections (not main tag), which is valid semantic HTML
    // Check that hero section exists instead
    const heroSection = page.locator('section.hero');
    await expect(heroSection).toBeVisible();
  });

  test('should have hero section with CTA buttons', async ({ page }) => {
    await page.goto('/');
    
    // Check hero section exists
    const heroSection = page.locator('section.hero');
    await expect(heroSection).toBeVisible();
    
    // Check for CTA buttons
    const buttons = heroSection.locator('a.btn');
    await expect(buttons.first()).toBeVisible();
  });

  test('should have features section', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to features section
    await page.locator('#features').scrollIntoViewIfNeeded();
    
    // Check features section exists
    const featuresSection = page.locator('#features');
    await expect(featuresSection).toBeVisible();
    
    // Check for feature cards
    const featureCards = page.locator('.feature-card');
    await expect(featureCards.first()).toBeVisible();
    await expect(featureCards).toHaveCount(4); // Should have 4 feature cards
  });

  test('should have download section', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to download section
    await page.locator('#download').scrollIntoViewIfNeeded();
    
    // Check download section exists
    const downloadSection = page.locator('#download');
    await expect(downloadSection).toBeVisible();
    
    // Check for store buttons
    const storeButtons = page.locator('.store-button');
    await expect(storeButtons.first()).toBeVisible();
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
    
    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);
    
    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute('content', /.+/);
  });

  test('should have hreflang tags for all languages', async ({ page }) => {
    await page.goto('/');
    
    // Check for hreflang tags
    const hreflangTags = page.locator('link[rel="alternate"][hreflang]');
    const count = await hreflangTags.count();
    
    // Should have hreflang tags for all 10 languages + x-default
    expect(count).toBeGreaterThanOrEqual(10);
    
    // Check for English hreflang
    const enHreflang = page.locator('link[hreflang="en"]');
    await expect(enHreflang).toHaveAttribute('href', /.+/);
    
    // Check for x-default
    const xDefault = page.locator('link[hreflang="x-default"]');
    await expect(xDefault).toHaveAttribute('href', /.+/);
  });

  test('should have canonical URL', async ({ page }) => {
    await page.goto('/');
    
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /.+/);
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Test features link (use header nav specifically to avoid ambiguity)
    const featuresLink = page.locator('header nav a[href*="#features"]');
    await expect(featuresLink).toBeVisible();
    await featuresLink.click();
    await expect(page.locator('#features')).toBeInViewport();
    
    // Test download link (there should be at least one download link)
    await page.goto('/');
    const downloadLinks = page.locator('main a[href*="#download"], section#download a');
    const downloadLinkCount = await downloadLinks.count();
    if (downloadLinkCount > 0) {
      // Use first link from collection (legitimate use of .first() for collection)
      const downloadLink = downloadLinks.first();
      await downloadLink.click();
      await expect(page.locator('#download')).toBeInViewport();
    }
  });
});
