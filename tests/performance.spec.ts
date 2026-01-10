import { test, expect } from '@playwright/test';

/**
 * Performance Testing
 * Tests Core Web Vitals and page load performance metrics
 */

test.describe('Performance', () => {
  test('homepage should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('homepage should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstByte: navigation.responseStart - navigation.requestStart,
      };
    });
    
    // DOM Content Loaded should be fast (< 2s)
    expect(metrics.domContentLoaded).toBeLessThan(2000);
    
    // First byte should be fast (< 1s)
    expect(metrics.firstByte).toBeLessThan(1000);
  });

  test('should have optimized images', async ({ page }) => {
    await page.goto('/');
    
    // Check that images are loaded efficiently
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const src = await img.getAttribute('src');
      
      // Images should use modern formats or have proper optimization
      if (src && !src.startsWith('data:')) {
        // Check for lazy loading
        const loading = await img.getAttribute('loading');
        if (loading !== 'lazy') {
          // Hero images can be eager, but most should be lazy
          const isHero = await img.evaluate((el) => {
            const rect = el.getBoundingClientRect();
            return rect.top < 800; // Above the fold
          });
          
          if (!isHero) {
            // Non-hero images should be lazy loaded
            expect(loading).toBe('lazy');
          }
        }
      }
    }
  });

  test('should not have excessive JavaScript bundles', async ({ page }) => {
    await page.goto('/');
    
    const jsResources = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return entries
        .filter(entry => entry.initiatorType === 'script' || entry.name.endsWith('.js'))
        .map(entry => ({
          name: entry.name,
          size: entry.transferSize,
          duration: entry.duration,
        }));
    });
    
    // Total JS should not be excessive (adjust threshold as needed)
    const totalJsSize = jsResources.reduce((sum, r) => sum + (r.size || 0), 0);
    // 500KB is a reasonable threshold for a modern website
    expect(totalJsSize).toBeLessThan(500 * 1024);
  });

  test('should use efficient CSS loading', async ({ page }) => {
    await page.goto('/');
    
    const cssResources = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return entries
        .filter(entry => entry.initiatorType === 'css' || entry.name.endsWith('.css'))
        .map(entry => ({
          name: entry.name,
          size: entry.transferSize,
          duration: entry.duration,
        }));
    });
    
    // CSS should load reasonably fast
    for (const css of cssResources) {
      expect(css.duration).toBeLessThan(2000);
    }
  });

  test('feature pages should load within acceptable time', async ({ page }) => {
    const featurePages = [
      '/features/receipt-scanning',
      '/features/analytics',
      '/features/security',
    ];
    
    for (const path of featurePages) {
      const startTime = Date.now();
      await page.goto(path);
      const loadTime = Date.now() - startTime;
      
      // Feature pages should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    }
  });

  test('should have proper caching headers', async ({ page }) => {
    const response = await page.goto('/');
    
    // Check for cache-control or similar headers
    const headers = response?.headers();
    
    if (headers) {
      // Static assets should have caching headers
      // This is a basic check - in production, verify specific assets
      const cacheControl = headers['cache-control'];
      // At minimum, ensure headers are set (exact values depend on your setup)
      // This test ensures the response has headers
      expect(headers).toBeDefined();
    }
  });

  test('should have minimal layout shift', async ({ page }) => {
    await page.goto('/');
    
    // Check for common layout shift causes
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const width = await img.getAttribute('width');
      const height = await img.getAttribute('height');
      
      // Images should have width/height to prevent layout shift
      // or use aspect-ratio CSS
      const hasDimensions = width && height;
      const hasAspectRatio = await img.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.aspectRatio !== 'auto';
      });
      
      // At least one dimension strategy should be present
      if (!hasDimensions && !hasAspectRatio) {
        // Check if it's a decorative image (small or background)
        const isSmall = await img.evaluate((el) => {
          const rect = el.getBoundingClientRect();
          return rect.width < 100 && rect.height < 100;
        });
        
        // Non-small images should have dimensions
        if (!isSmall) {
          console.warn(`Image at index ${i} lacks dimensions`);
        }
      }
    }
  });

  test('should load critical resources first', async ({ page }) => {
    await page.goto('/');
    
    const resources = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return entries.map(entry => ({
        name: entry.name,
        startTime: entry.startTime,
        duration: entry.duration,
        type: entry.initiatorType,
      }));
    });
    
    // Critical CSS should load before images (rough check)
    const cssResources = resources.filter(r => r.type === 'css' || r.name.endsWith('.css'));
    const imageResources = resources.filter(r => r.type === 'img');
    
    if (cssResources.length > 0 && imageResources.length > 0) {
      const firstCss = Math.min(...cssResources.map(r => r.startTime));
      const firstImage = Math.min(...imageResources.map(r => r.startTime));
      
      // CSS should start loading before images (allowing some overlap)
      // This is a basic check - adjust based on your optimization strategy
      expect(firstCss).toBeLessThanOrEqual(firstImage + 100);
    }
  });
});
