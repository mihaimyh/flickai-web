import { test, expect } from '@playwright/test';
import { SUPPORTED_LOCALES } from '../src/i18n-config';

/**
 * Comprehensive SEO Testing
 * Tests all SEO elements across all page types and languages
 */

const ALL_PAGE_TYPES = [
  '/',
  '/features/receipt-scanning',
  '/guides/best-receipt-scanning-apps',
  '/guides/',
  '/alternatives/expensify-alternatives',
  '/alternatives/',
  '/use-cases/expense-tracker-for-freelancers',
  '/integrations',
  '/faq',
  '/privacy-policy',
  '/terms-of-service',
];

test.describe('SEO Elements', () => {
  test('should have proper meta tags on all page types', async ({ page }) => {
    for (const path of ALL_PAGE_TYPES) {
      await page.goto(path);
      
      // Title tag
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThan(60); // Recommended max length
      
      // Meta description
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /.+/);
      const desc = await metaDescription.getAttribute('content');
      expect(desc?.length).toBeGreaterThan(50);
      expect(desc?.length).toBeLessThan(160); // Recommended max length
      
      // Meta keywords (optional but should exist if present)
      const metaKeywords = page.locator('meta[name="keywords"]');
      if (await metaKeywords.count() > 0) {
        const keywords = await metaKeywords.getAttribute('content');
        expect(keywords).toBeTruthy();
      }
    }
  });

  test('should have Open Graph tags on all page types', async ({ page }) => {
    const keyPages = ['/', '/features/receipt-scanning', '/guides/best-receipt-scanning-apps', '/faq'];
    
    for (const path of keyPages) {
      await page.goto(path);
      
      const ogTitle = page.locator('meta[property="og:title"]');
      await expect(ogTitle).toHaveAttribute('content', /.+/);
      
      const ogDescription = page.locator('meta[property="og:description"]');
      await expect(ogDescription).toHaveAttribute('content', /.+/);
      
      const ogUrl = page.locator('meta[property="og:url"]');
      await expect(ogUrl).toHaveAttribute('content', /.+/);
      const ogUrlContent = await ogUrl.getAttribute('content');
      expect(ogUrlContent).toContain('https://flickai.net');
      
      const ogImage = page.locator('meta[property="og:image"]');
      await expect(ogImage).toHaveAttribute('content', /.+/);
      const ogImageContent = await ogImage.getAttribute('content');
      expect(ogImageContent).toMatch(/^https?:\/\//); // Should be absolute URL
      
      const ogType = page.locator('meta[property="og:type"]');
      await expect(ogType).toHaveAttribute('content', /.+/);
    }
  });

  test('should have Twitter Card tags on all page types', async ({ page }) => {
    const keyPages = ['/', '/features/receipt-scanning', '/guides/best-receipt-scanning-apps'];
    
    for (const path of keyPages) {
      await page.goto(path);
      
      const twitterCard = page.locator('meta[property="twitter:card"]');
      await expect(twitterCard).toHaveAttribute('content', /.+/);
      const cardType = await twitterCard.getAttribute('content');
      expect(['summary', 'summary_large_image', 'app', 'player']).toContain(cardType);
      
      const twitterTitle = page.locator('meta[property="twitter:title"]');
      await expect(twitterTitle).toHaveAttribute('content', /.+/);
      
      const twitterDescription = page.locator('meta[property="twitter:description"]');
      if (await twitterDescription.count() > 0) {
        await expect(twitterDescription).toHaveAttribute('content', /.+/);
      }
    }
  });

  test('should have canonical URLs on all pages', async ({ page }) => {
    for (const path of ALL_PAGE_TYPES) {
      await page.goto(path);
      
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute('href', /.+/);
      
      const href = await canonical.getAttribute('href');
      expect(href).toMatch(/^https:\/\//);
      expect(href).toContain('flickai.net');
      
      // Canonical should match current URL structure
      if (path !== '/') {
        expect(href).toContain(path);
      }
    }
  });

  test('should have hreflang tags on all pages', async ({ page }) => {
    for (const path of ALL_PAGE_TYPES.slice(0, 5)) { // Test key pages
      await page.goto(path);
      
      const hreflangTags = page.locator('link[rel="alternate"][hreflang]');
      const count = await hreflangTags.count();
      expect(count).toBeGreaterThanOrEqual(10); // 10 languages + x-default
      
      // Check for x-default
      const xDefault = page.locator('link[hreflang="x-default"]');
      await expect(xDefault).toHaveAttribute('href', /.+/);
      
      // Check that all supported locales have hreflang tags
      for (const locale of SUPPORTED_LOCALES) {
        const localeTag = page.locator(`link[hreflang="${locale}"]`);
        await expect(localeTag).toHaveAttribute('href', /.+/);
      }
    }
  });

  test('should have correct hreflang URLs for language variants', async ({ page }) => {
    await page.goto('/features/receipt-scanning');
    
    // Check English hreflang
    const enHreflang = page.locator('link[hreflang="en"]');
    const enHref = await enHreflang.getAttribute('href');
    expect(enHref).toContain('/features/receipt-scanning');
    expect(enHref).not.toContain('/en/');
    
    // Check Spanish hreflang
    const esHreflang = page.locator('link[hreflang="es"]');
    const esHref = await esHreflang.getAttribute('href');
    expect(esHref).toContain('/es/features/receipt-scanning');
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

  test('should have proper heading hierarchy on all content pages', async ({ page }) => {
    const contentPages = [
      '/features/receipt-scanning',
      '/guides/best-receipt-scanning-apps',
      '/alternatives/expensify-alternatives',
      '/use-cases/expense-tracker-for-freelancers',
    ];
    
    for (const path of contentPages) {
      await page.goto(path);
      
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
      
      const h1Count = await h1.count();
      expect(h1Count).toBe(1); // Should have exactly one H1
      
      // Check for H2s
      const h2s = page.locator('h2');
      const h2Count = await h2s.count();
      expect(h2Count).toBeGreaterThan(0);
      
      // Verify heading hierarchy (h2 should come after h1, not before)
      const h1Position = await h1.first().evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top;
      });
      
      if (h2Count > 0) {
        const firstH2Position = await h2s.first().evaluate((el) => {
          const rect = el.getBoundingClientRect();
          return rect.top;
        });
        
        expect(firstH2Position).toBeGreaterThan(h1Position);
      }
    }
  });

  test('should have alt text on images across all pages', async ({ page }) => {
    const pagesWithImages = [
      '/',
      '/features/receipt-scanning',
      '/guides/best-receipt-scanning-apps',
      '/alternatives/expensify-alternatives',
    ];
    
    for (const path of pagesWithImages) {
      await page.goto(path);
      
      const images = page.locator('main img');
      const imageCount = await images.count();
      
      if (imageCount > 0) {
        for (let i = 0; i < imageCount; i++) {
          const img = images.nth(i);
          const alt = await img.getAttribute('alt');
          
          // Alt text should exist (can be empty string for decorative images)
          expect(alt).not.toBeNull();
          
          // If image is not decorative, alt should have content
          const role = await img.getAttribute('role');
          const ariaHidden = await img.getAttribute('aria-hidden');
          
          if (role !== 'presentation' && ariaHidden !== 'true') {
            // For meaningful images, alt should have content
            // But allow empty string for truly decorative images
            const isDecorative = await img.evaluate((el) => {
              const rect = el.getBoundingClientRect();
              return rect.width < 50 && rect.height < 50; // Very small images might be decorative
            });
            
            if (!isDecorative) {
              expect(alt?.length || 0).toBeGreaterThan(0);
            }
          }
        }
      }
    }
  });

  test('should have robots meta tag on all pages', async ({ page }) => {
    for (const path of ALL_PAGE_TYPES) {
      await page.goto(path);
      
      const robots = page.locator('meta[name="robots"]');
      if (await robots.count() > 0) {
        const content = await robots.getAttribute('content');
        expect(content).toBeTruthy();
        // Should allow indexing unless it's a specific no-index page
        expect(content).toContain('index');
      }
    }
  });

  test('should have SEO elements across all languages', async ({ page }) => {
    const testLocales = ['en', 'es', 'fr', 'de', 'ar'];
    
    for (const locale of testLocales) {
      const path = locale === 'en' ? '/' : `/${locale}/`;
      await page.goto(path);
      
      // Title should be localized
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(10);
      
      // Meta description should exist
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /.+/);
      
      // Language should match
      const htmlLang = await page.locator('html').getAttribute('lang');
      expect(htmlLang).toBe(locale);
      
      // Hreflang should include this locale
      const localeHreflang = page.locator(`link[hreflang="${locale}"]`);
      await expect(localeHreflang).toHaveAttribute('href', /.+/);
    }
  });

  test('should have sitemap reference', async ({ page }) => {
    await page.goto('/');
    
    // Check for sitemap link in head
    const sitemapLink = page.locator('link[rel="sitemap"]');
    if (await sitemapLink.count() > 0) {
      const href = await sitemapLink.getAttribute('href');
      expect(href).toContain('sitemap.xml');
    }
    
    // Or check robots.txt references sitemap
    const robotsTxt = await page.goto('/robots.txt');
    if (robotsTxt?.status() === 200) {
      const robotsContent = await robotsTxt.text();
      expect(robotsContent).toContain('sitemap');
    }
  });

  test('should have proper URL structure', async ({ page }) => {
    // Test that URLs are clean and SEO-friendly
    const testPaths = [
      '/features/receipt-scanning',
      '/guides/best-receipt-scanning-apps',
      '/alternatives/expensify-alternatives',
    ];
    
    for (const path of testPaths) {
      await page.goto(path);
      
      // URL should be clean (no hash, no query params for content pages)
      const url = new URL(page.url());
      expect(url.hash).toBe('');
      
      // URL should match the path structure
      expect(url.pathname).toMatch(/^\/[a-z0-9\-/]*$/);
    }
  });

  test('should have proper meta tags for social sharing', async ({ page }) => {
    await page.goto('/');
    
    // Open Graph image should be absolute URL
    const ogImage = page.locator('meta[property="og:image"]');
    const ogImageContent = await ogImage.getAttribute('content');
    expect(ogImageContent).toMatch(/^https?:\/\//);
    expect(ogImageContent).not.toMatch(/^\/\//); // Should not be protocol-relative
    
    // Open Graph URL should match canonical
    const ogUrl = page.locator('meta[property="og:url"]');
    const ogUrlContent = await ogUrl.getAttribute('content');
    
    const canonical = page.locator('link[rel="canonical"]');
    const canonicalContent = await canonical.getAttribute('href');
    
    // They should match (allowing for trailing slash differences)
    expect(ogUrlContent?.replace(/\/$/, '')).toBe(canonicalContent?.replace(/\/$/, ''));
  });
});
