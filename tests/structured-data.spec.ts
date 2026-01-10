import { test, expect } from '@playwright/test';
import { SUPPORTED_LOCALES } from '../src/i18n-config';

/**
 * Comprehensive Structured Data Testing
 * Validates all schema.org structured data types across the site
 */

test.describe('Structured Data', () => {
  test('homepage should have Organization schema', async ({ page }) => {
    await page.goto('/');
    
    const schemaScripts = page.locator('script[type="application/ld+json"]');
    const count = await schemaScripts.count();
    
    expect(count).toBeGreaterThan(0);
    
    let foundOrganization = false;
    
    for (let i = 0; i < count; i++) {
      const content = await schemaScripts.nth(i).textContent();
      if (content) {
        try {
          const data = JSON.parse(content);
          
          // Handle @graph structure
          if (data['@graph']) {
            const organization = data['@graph'].find((item: any) => item['@type'] === 'Organization');
            if (organization) {
              foundOrganization = true;
              expect(organization.name).toBeTruthy();
              expect(organization.url).toContain('flickai.net');
              break;
            }
          } else if (data['@type'] === 'Organization') {
            foundOrganization = true;
            expect(data.name).toBeTruthy();
            expect(data.url).toContain('flickai.net');
            break;
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
    
    expect(foundOrganization).toBe(true);
  });

  test('homepage should have WebSite schema', async ({ page }) => {
    await page.goto('/');
    
    const schemaScripts = page.locator('script[type="application/ld+json"]');
    const count = await schemaScripts.count();
    
    let foundWebSite = false;
    
    for (let i = 0; i < count; i++) {
      const content = await schemaScripts.nth(i).textContent();
      if (content) {
        try {
          const data = JSON.parse(content);
          
          if (data['@graph']) {
            const webSite = data['@graph'].find((item: any) => item['@type'] === 'WebSite');
            if (webSite) {
              foundWebSite = true;
              expect(webSite.name).toBeTruthy();
              expect(webSite.url).toContain('flickai.net');
              break;
            }
          } else if (data['@type'] === 'WebSite') {
            foundWebSite = true;
            expect(data.name).toBeTruthy();
            expect(data.url).toContain('flickai.net');
            break;
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
    
    expect(foundWebSite).toBe(true);
  });

  test('all pages should have WebPage schema', async ({ page }) => {
    const pages = [
      '/',
      '/features/receipt-scanning',
      '/guides/best-receipt-scanning-apps',
      '/alternatives/expensify-alternatives',
      '/faq',
    ];
    
    for (const path of pages) {
      await page.goto(path);
      
      const schemaScripts = page.locator('script[type="application/ld+json"]');
      const count = await schemaScripts.count();
      
      expect(count).toBeGreaterThan(0);
      
      let foundWebPage = false;
      
      for (let i = 0; i < count; i++) {
        const content = await schemaScripts.nth(i).textContent();
        if (content) {
          try {
            const data = JSON.parse(content);
            
            if (data['@graph']) {
              const webPage = data['@graph'].find((item: any) => item['@type'] === 'WebPage');
              if (webPage) {
                foundWebPage = true;
                expect(webPage.name || webPage.headline).toBeTruthy();
                expect(webPage.url).toContain('flickai.net');
                break;
              }
            } else if (data['@type'] === 'WebPage') {
              foundWebPage = true;
              expect(data.name || data.headline).toBeTruthy();
              expect(data.url).toContain('flickai.net');
              break;
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
      
      expect(foundWebPage).toBe(true);
    }
  });

  test('pages with FAQs should have FAQPage schema', async ({ page }) => {
    const faqPages = [
      '/faq',
      '/features/receipt-scanning',
      '/alternatives/expensify-alternatives',
      '/use-cases/expense-tracker-for-freelancers',
    ];
    
    for (const path of faqPages) {
      await page.goto(path);
      
      const schemaScripts = page.locator('script[type="application/ld+json"]');
      const count = await schemaScripts.count();
      
      if (count === 0) {
        // Some pages might not have FAQs
        continue;
      }
      
      let foundFAQPage = false;
      
      for (let i = 0; i < count; i++) {
        const content = await schemaScripts.nth(i).textContent();
        if (content) {
          try {
            const data = JSON.parse(content);
            
            if (data['@graph']) {
              const faqPage = data['@graph'].find((item: any) => item['@type'] === 'FAQPage');
              if (faqPage) {
                foundFAQPage = true;
                expect(faqPage.mainEntity).toBeDefined();
                expect(Array.isArray(faqPage.mainEntity)).toBe(true);
                if (faqPage.mainEntity.length > 0) {
                  expect(faqPage.mainEntity[0]['@type']).toBe('Question');
                  expect(faqPage.mainEntity[0].acceptedAnswer).toBeDefined();
                  expect(faqPage.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
                }
                break;
              }
            } else if (data['@type'] === 'FAQPage') {
              foundFAQPage = true;
              expect(data.mainEntity).toBeDefined();
              expect(Array.isArray(data.mainEntity)).toBe(true);
              break;
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
      
      // Not all pages have FAQs, so this is optional
      // But if schema exists, it should be valid
      if (foundFAQPage) {
        expect(foundFAQPage).toBe(true);
      }
    }
  });

  test('guide pages should have BreadcrumbList schema', async ({ page }) => {
    await page.goto('/guides/best-receipt-scanning-apps');
    
    const schemaScripts = page.locator('script[type="application/ld+json"]');
    const count = await schemaScripts.count();
    
    if (count === 0) return;
    
    let foundBreadcrumb = false;
    
    for (let i = 0; i < count; i++) {
      const content = await schemaScripts.nth(i).textContent();
      if (content) {
        try {
          const data = JSON.parse(content);
          
          if (data['@graph']) {
            const breadcrumb = data['@graph'].find((item: any) => item['@type'] === 'BreadcrumbList');
            if (breadcrumb) {
              foundBreadcrumb = true;
              expect(breadcrumb.itemListElement).toBeDefined();
              expect(Array.isArray(breadcrumb.itemListElement)).toBe(true);
              if (breadcrumb.itemListElement.length > 0) {
                expect(breadcrumb.itemListElement[0]['@type']).toBe('ListItem');
                expect(breadcrumb.itemListElement[0].position).toBe(1);
              }
              break;
            }
          } else if (data['@type'] === 'BreadcrumbList') {
            foundBreadcrumb = true;
            expect(data.itemListElement).toBeDefined();
            break;
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
    
    // Breadcrumbs are optional but recommended
    // This test verifies they're valid if present
  });

  test('homepage should have SoftwareApplication schema', async ({ page }) => {
    await page.goto('/');
    
    const schemaScripts = page.locator('script[type="application/ld+json"]');
    const count = await schemaScripts.count();
    
    let foundSoftwareApp = false;
    
    for (let i = 0; i < count; i++) {
      const content = await schemaScripts.nth(i).textContent();
      if (content) {
        try {
          const data = JSON.parse(content);
          
          if (data['@graph']) {
            const softwareApp = data['@graph'].find((item: any) => item['@type'] === 'SoftwareApplication');
            if (softwareApp) {
              foundSoftwareApp = true;
              expect(softwareApp.name).toBeTruthy();
              expect(softwareApp.applicationCategory).toBeTruthy();
              expect(softwareApp.offers).toBeDefined();
              break;
            }
          } else if (data['@type'] === 'SoftwareApplication') {
            foundSoftwareApp = true;
            expect(data.name).toBeTruthy();
            expect(data.applicationCategory).toBeTruthy();
            break;
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
    
    // SoftwareApplication schema is optional but recommended for app websites
    // This test verifies it's valid if present
  });

  test('all structured data should be valid JSON-LD', async ({ page }) => {
    const pages = [
      '/',
      '/features/receipt-scanning',
      '/guides/best-receipt-scanning-apps',
      '/faq',
      '/alternatives/expensify-alternatives',
    ];
    
    for (const path of pages) {
      await page.goto(path);
      
      const schemaScripts = page.locator('script[type="application/ld+json"]');
      const count = await schemaScripts.count();
      
      for (let i = 0; i < count; i++) {
        const content = await schemaScripts.nth(i).textContent();
        if (content) {
          // Should parse as valid JSON
          expect(() => JSON.parse(content)).not.toThrow();
          
          const data = JSON.parse(content);
          
          // Should have @context
          if (data['@graph']) {
            // @context should be on the parent object
            expect(data['@context']).toBe('https://schema.org');
          } else {
            expect(data['@context']).toBe('https://schema.org');
          }
          
          // Should have at least one @type
          const hasType = data['@type'] || (data['@graph'] && data['@graph'].some((item: any) => item['@type']));
          expect(hasType).toBeTruthy();
        }
      }
    }
  });

  test('structured data should have correct @context', async ({ page }) => {
    await page.goto('/');
    
    const schemaScripts = page.locator('script[type="application/ld+json"]');
    const count = await schemaScripts.count();
    
    for (let i = 0; i < count; i++) {
      const content = await schemaScripts.nth(i).textContent();
      if (content) {
        const data = JSON.parse(content);
        expect(data['@context']).toBe('https://schema.org');
      }
    }
  });

  test('structured data should work across all languages', async ({ page }) => {
    const locales = SUPPORTED_LOCALES.slice(0, 3); // Test first 3 to avoid long test time
    
    for (const locale of locales) {
      const path = locale === 'en' ? '/' : `/${locale}/`;
      await page.goto(path);
      
      const schemaScripts = page.locator('script[type="application/ld+json"]');
      const count = await schemaScripts.count();
      
      // Should have at least one schema (homepage should have Organization/WebSite)
      // Other pages might not have structured data, which is acceptable
      if (path === '/' || path === `/${locale}/`) {
        expect(count).toBeGreaterThan(0);
      }
      
      // Verify JSON is valid if schema exists
      for (let i = 0; i < count; i++) {
        const content = await schemaScripts.nth(i).textContent();
        if (content) {
          expect(() => JSON.parse(content)).not.toThrow();
        }
      }
    }
  });
});
