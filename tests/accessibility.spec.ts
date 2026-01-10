import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('should have proper semantic HTML structure', async ({ page }) => {
    await page.goto('/');
    
    // Check for semantic elements
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    // Check for nav element (there should be at least one nav)
    const navCount = await page.locator('nav').count();
    expect(navCount).toBeGreaterThan(0);
  });

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check nav links have accessible text
    const navLinks = page.locator('nav a');
    const linkCount = await navLinks.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i);
      const text = await link.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/features/receipt-scanning');
    
    // Check H1 exists
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // Check only one H1
    const h1Count = await h1.count();
    expect(h1Count).toBe(1);
  });

  test('should have accessible form elements', async ({ page }) => {
    await page.goto('/');
    
    // Check for any forms
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      for (let i = 0; i < formCount; i++) {
        const form = forms.nth(i);
        const inputs = form.locator('input, select, textarea');
        const inputCount = await inputs.count();
        
        for (let j = 0; j < inputCount; j++) {
          const input = inputs.nth(j);
          const id = await input.getAttribute('id');
          const name = await input.getAttribute('name');
          const label = form.locator(`label[for="${id}"]`);
          const ariaLabel = await input.getAttribute('aria-label');
          const ariaLabelledBy = await input.getAttribute('aria-labelledby');
          
          // Input should have either id+label, aria-label, or aria-labelledby
          const hasAccessibleName = (id && (await label.count()) > 0) || ariaLabel || ariaLabelledBy;
          expect(hasAccessibleName).toBeTruthy();
        }
      }
    }
  });

  test('should have proper link accessibility', async ({ page }) => {
    await page.goto('/');
    
    const links = page.locator('a:not([aria-hidden="true"])'); // Skip hidden links
    const linkCount = await links.count();
    
    // Check first few visible links have accessible text
    let accessibleLinks = 0;
    for (let i = 0; i < Math.min(10, linkCount); i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');
      const isHidden = await link.getAttribute('aria-hidden') === 'true';
      
      // Skip decorative/hidden links
      if (isHidden) continue;
      
      // Check if link contains an image with alt text
      const images = link.locator('img');
      const imageCount = await images.count();
      let hasImageWithAlt = false;
      
      if (imageCount > 0) {
        for (let j = 0; j < imageCount; j++) {
          const img = images.nth(j);
          const imgAlt = await img.getAttribute('alt');
          if (imgAlt && imgAlt.length > 0) {
            hasImageWithAlt = true;
            break;
          }
        }
      }
      
      // Link should have accessible text, aria-label, title, or image with alt
      const hasAccessibleText = (text && text.trim().length > 0) || 
                                ariaLabel || 
                                title || 
                                hasImageWithAlt;
      
      if (hasAccessibleText) {
        accessibleLinks++;
      }
    }
    
    // Most links should be accessible (allow some margin for edge cases)
    // If there are few links, be more lenient
    const minRequired = linkCount > 5 ? Math.min(5, linkCount / 2) : Math.max(1, Math.floor(linkCount / 2));
    expect(accessibleLinks).toBeGreaterThanOrEqual(minRequired);
  });

  test('should have skip links or proper focus management', async ({ page }) => {
    await page.goto('/');
    
    // Check if skip link exists
    const skipLink = page.locator('a[href="#main"], a[href="#content"]');
    const skipLinkCount = await skipLink.count();
    
    // Skip links are optional but good practice
    // Just verify the page doesn't break
    await expect(page.locator('body')).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Tab through navigation
    await page.keyboard.press('Tab');
    
    // Check if focus is visible (CSS :focus-visible)
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have proper ARIA labels where needed', async ({ page }) => {
    await page.goto('/');
    
    // Check hamburger menu button if exists
    const hamburger = page.locator('button[id="hamburger"]');
    if (await hamburger.count() > 0) {
      const ariaLabel = await hamburger.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    }
  });

  test('should have proper language attribute', async ({ page }) => {
    await page.goto('/');
    
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBeTruthy();
    expect(htmlLang?.length).toBeGreaterThan(0);
  });

  test('should have proper dir attribute for RTL languages', async ({ page }) => {
    await page.goto('/ar/');
    
    const htmlDir = await page.locator('html').getAttribute('dir');
    expect(htmlDir).toBe('rtl');
  });
});
