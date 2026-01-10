# Playwright Tests for FlickAI Website

This directory contains end-to-end tests for the FlickAI website built with Playwright.

## Test Structure

- `homepage.spec.ts` - Tests for the homepage including hero, features, and download sections
- `i18n.spec.ts` - Tests for internationalization (all 10 languages)
- `features.spec.ts` - Tests for feature pages (9 features)
- `guides.spec.ts` - Tests for guide pages (4 guides)
- `alternatives.spec.ts` - Tests for alternatives pages (4 alternatives)
- `use-cases.spec.ts` - Tests for use case pages (2 use cases)
- `legal-pages.spec.ts` - Tests for legal pages (privacy, terms, cookies, etc.)
- `integrations.spec.ts` - Tests for integrations/index page
- `seo.spec.ts` - **Comprehensive SEO testing** (meta tags, structured data, hreflang across all pages/languages)
- `structured-data.spec.ts` - **Comprehensive structured data testing** (Organization, WebSite, WebPage, FAQPage, BreadcrumbList, SoftwareApplication)
- `comprehensive-routes.spec.ts` - **Comprehensive route testing** (all routes across all languages, 404s, redirects)
- `performance.spec.ts` - **Performance testing** (Core Web Vitals, load times, optimization)
- `accessibility.spec.ts` - Tests for accessibility (semantic HTML, ARIA, keyboard navigation)

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run specific test file
```bash
npx playwright test tests/homepage.spec.ts
```

### Run tests for a specific browser
```bash
npx playwright test --project=chromium
```

### View test report
```bash
npm run test:report
```

## Test Configuration

Tests are configured in `playwright.config.ts`. Key settings:

- **Base URL**: `http://localhost:4321` (Astro preview server)
- **Browser**: Chromium (can be extended to Firefox/WebKit)
- **Retries**: 2 retries on CI, 0 locally
- **Workers**: 1 on CI, parallel locally
- **Web Server**: Automatically starts `npm run preview` before tests

## Writing New Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/FlickAI/i);
  });
});
```

### Common Patterns

#### Check page loads
```typescript
await page.goto('/features/receipt-scanning');
await expect(page).toHaveTitle(/FlickAI/i);
```

#### Check elements are visible
```typescript
const heading = page.locator('h1');
await expect(heading).toBeVisible();
```

#### Check meta tags
```typescript
const metaDescription = page.locator('meta[name="description"]');
await expect(metaDescription).toHaveAttribute('content', /.+/);
```

#### Check structured data
```typescript
const schema = page.locator('script[type="application/ld+json"]');
const schemaContent = await schema.textContent();
const schemaData = JSON.parse(schemaContent);
expect(schemaData['@type']).toBe('FAQPage');
```

#### Test multiple languages
```typescript
const locales = ['en', 'ar', 'de', 'es', 'fr'];
for (const locale of locales) {
  test(`should work for ${locale}`, async ({ page }) => {
    const path = locale === 'en' ? '/' : `/${locale}/`;
    await page.goto(path);
    // ... test logic
  });
}
```

## CI/CD Integration

Tests automatically run:
- On every push to `main` or `develop` branches
- On pull requests to `main` or `develop`
- Before deployment (deploy workflow runs tests first)

Test reports are uploaded as artifacts and available for 30 days.

## Debugging Tests

### Debug mode
```bash
npm run test:debug
```

### Show trace
Tests are configured to collect traces on first retry. View with:
```bash
npx playwright show-trace trace.zip
```

### Screenshots
Screenshots are automatically taken on test failure and saved to `test-results/`.

### Console logs
```typescript
// In test
console.log('Debug info:', await page.title());

// Or use page context
page.on('console', msg => console.log('Browser console:', msg.text()));
```

## Test Coverage

### Comprehensive Test Coverage

Current test coverage includes:

#### Route Testing
- ✅ Homepage (all sections)
- ✅ All 10 language variants (homepage + key routes)
- ✅ All 9 feature pages
- ✅ All 4 guide pages (including index)
- ✅ All 4 alternative pages (including index)
- ✅ All 2 use case pages
- ✅ All 6 legal pages
- ✅ Integrations page
- ✅ All routes across all languages
- ✅ 404 error handling
- ✅ Redirects and canonical URLs

#### SEO Testing
- ✅ Meta tags (title, description) across all page types
- ✅ Open Graph tags on all pages
- ✅ Twitter Card tags
- ✅ Canonical URLs on all pages
- ✅ Hreflang tags for all 10 languages
- ✅ Proper heading hierarchy (H1, H2 structure)
- ✅ Alt text on images
- ✅ Robots meta tags
- ✅ SEO elements across all languages
- ✅ Social sharing meta tags
- ✅ Sitemap references

#### Structured Data Testing
- ✅ Organization schema
- ✅ WebSite schema
- ✅ WebPage schema (all pages)
- ✅ FAQPage schema (FAQ pages)
- ✅ BreadcrumbList schema (guide pages)
- ✅ SoftwareApplication schema (homepage)
- ✅ Valid JSON-LD format
- ✅ Correct @context
- ✅ Structured data across all languages

#### Performance Testing
- ✅ Page load time (< 3 seconds)
- ✅ Core Web Vitals (DOM Content Loaded, Load Complete, First Byte)
- ✅ Image optimization (lazy loading, formats)
- ✅ JavaScript bundle size monitoring
- ✅ CSS loading efficiency
- ✅ Caching headers
- ✅ Layout shift prevention
- ✅ Critical resource loading order

#### Accessibility Testing
- ✅ Semantic HTML structure
- ✅ Accessible navigation
- ✅ Proper heading hierarchy
- ✅ Accessible form elements
- ✅ Proper link accessibility
- ✅ Skip links and focus management
- ✅ Keyboard navigation
- ✅ ARIA labels where needed
- ✅ Language attributes
- ✅ RTL support for Arabic

## Best Practices

1. **Use descriptive test names** - Test names should clearly describe what they're testing
2. **Keep tests focused** - One test should verify one thing
3. **Use page objects for complex pages** - For pages with many interactions, consider page objects
4. **Avoid hard-coded waits** - Use Playwright's auto-waiting instead of `setTimeout`
5. **Test what matters** - Focus on user-facing functionality and critical paths
6. **Keep tests maintainable** - Use constants for repeated values (URLs, selectors, etc.)

## Troubleshooting

### Tests fail with "Navigation timeout"
- Make sure the preview server is running: `npm run preview`
- Check if the base URL is correct in `playwright.config.ts`

### Tests fail with "Element not found"
- Check if the selector is correct
- Use `await page.pause()` to inspect the page
- Check if the element is inside an iframe or shadow DOM

### Tests are flaky
- Increase timeout if needed: `test.setTimeout(60000)`
- Use `waitFor` for dynamic content: `await page.waitForSelector('.dynamic-element')`
- Check for race conditions in async operations

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-test)
