import { test, expect } from '@playwright/test';

test.describe('SEO Elements', () => {
  test('should have proper meta tags on all pages', async ({ page }) => {
    const pages = ['/', '/features/receipt-scanning', '/guides/', '/alternatives/'];
    
    for (const path of pages) {
      await page.goto(path);
      
      // Title tag
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(10);
      
      // Meta description
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /.+/);
      const desc = await metaDescription.getAttribute('content');
      expect(desc?.length).toBeGreaterThan(50);
      
      // Meta keywords (optional but should exist if present)
      const metaKeywords = page.locator('meta[name="keywords"]');
      if (await metaKeywords.count() > 0) {
        const keywords = await metaKeywords.getAttribute('content');
        expect(keywords).toBeTruthy();
      }
    }
  });

  test('should have Open Graph tags', async ({ page }) => {
    await page.goto('/');
    
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);
    
    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute('content', /.+/);
    
    const ogUrl = page.locator('meta[property="og:url"]');
    await expect(ogUrl).toHaveAttribute('content', /.+/);
    
    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute('content', /.+/);
  });

  test('should have Twitter Card tags', async ({ page }) => {
    await page.goto('/');
    
    const twitterCard = page.locator('meta[property="twitter:card"]');
    await expect(twitterCard).toHaveAttribute('content', /.+/);
    
    const twitterTitle = page.locator('meta[property="twitter:title"]');
    await expect(twitterTitle).toHaveAttribute('content', /.+/);
  });

  test('should have canonical URLs', async ({ page }) => {
    const pages = ['/', '/features/receipt-scanning', '/guides/best-receipt-scanning-apps'];
    
    for (const path of pages) {
      await page.goto(path);
      
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute('href', /.+/);
      
      const href = await canonical.getAttribute('href');
      expect(href).toMatch(/^https:\/\//);
    }
  });

  test('should have hreflang tags on all pages', async ({ page }) => {
    await page.goto('/');
    
    const hreflangTags = page.locator('link[rel="alternate"][hreflang]');
    const count = await hreflangTags.count();
    expect(count).toBeGreaterThanOrEqual(10); // 10 languages + x-default
    
    // Check for x-default
    const xDefault = page.locator('link[hreflang="x-default"]');
    await expect(xDefault).toHaveAttribute('href', /.+/);
  });

  test('should have structured data where applicable', async ({ page }) => {
    // Test FAQ page
    await page.goto('/faq');
    
    const schema = page.locator('script[type="application/ld+json"]');
    const schemaContent = await schema.textContent();
    
    if (schemaContent) {
      const schemaData = JSON.parse(schemaContent);
      expect(schemaData['@context']).toBe('https://schema.org');
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/features/receipt-scanning');
    
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    const h1Count = await h1.count();
    expect(h1Count).toBe(1); // Should have exactly one H1
    
    // Check for H2s
    const h2s = page.locator('h2');
    const h2Count = await h2s.count();
    expect(h2Count).toBeGreaterThan(0);
  });

  test('should have alt text on images', async ({ page }) => {
    await page.goto('/features/receipt-scanning');
    
    const images = page.locator('main img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy();
        expect(alt?.length).toBeGreaterThan(0);
      }
    }
  });

  test('should have robots meta tag', async ({ page }) => {
    await page.goto('/');
    
    const robots = page.locator('meta[name="robots"]');
    if (await robots.count() > 0) {
      const content = await robots.getAttribute('content');
      expect(content).toContain('index');
    }
  });
});
