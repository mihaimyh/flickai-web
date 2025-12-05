# i18n Refactoring Plan - Template-Based System

## Overview

Refactor the current duplicated HTML approach to a template-based system that generates localized pages at build time, maintaining perfect SEO while eliminating code duplication.

## Current State

- 4 languages (en, ro, es, fr)
- ~10 pages per language = 40 HTML files
- High duplication, difficult to maintain
- Manual updates required for each language

## Proposed Architecture

### Directory Structure

```
flickai-web/
├── src/
│   ├── templates/          # HTML templates with {{key}} placeholders
│   │   ├── index.html
│   │   ├── privacy-policy.html
│   │   ├── terms-of-service.html
│   │   ├── cookie-policy.html
│   │   ├── gdpr-compliance.html
│   │   ├── accessibility.html
│   │   └── features/
│   │       ├── receipt-scanning.html
│   │       ├── analytics.html
│   │       └── security.html
│   ├── locales/            # Translation JSON files
│   │   ├── en.json
│   │   ├── ro.json
│   │   ├── es.json
│   │   └── fr.json
│   └── scripts/
│       └── build-i18n.ts   # Build-time page generator
├── dist/                   # Generated static files (build output)
└── vite.config.js
```

### Translation File Format (JSON)

```json
{
  "meta": {
    "lang": "en",
    "siteName": "FlickAI",
    "siteUrl": "https://flickai.net"
  },
  "common": {
    "features": "Features",
    "backToHome": "Back to Home",
    "copyright": "© 2025 FlickAI. All rights reserved."
  },
  "footer": {
    "privacyPolicy": "Privacy Policy",
    "termsOfService": "Terms of Service",
    "cookiePolicy": "Cookie Policy"
  },
  "pages": {
    "home": {
      "title": "FlickAI - AI Expense Tracker",
      "description": "Simplify expense tracking...",
      "hero": {
        "title": "AI-Powered Expense Tracking & Receipt Scanning",
        "subtitle": "Track your finances effortlessly..."
      }
    },
    "privacy": {
      "title": "Privacy Policy - FlickAI",
      "heading": "Privacy Policy",
      "lastUpdated": "Last updated: November 28, 2025",
      "sections": {
        "introduction": {
          "title": "1. Introduction",
          "content": "FlickAI (\"we,\" \"our,\" or \"us\") respects your privacy..."
        }
      }
    }
  }
}
```

### Template Example

```html
<!DOCTYPE html>
<html lang="{{meta.lang}}">
  <head>
    <meta charset="UTF-8" />
    <title>{{pages.privacy.title}}</title>
    <meta name="description" content="{{pages.privacy.description}}" />
  </head>
  <body>
    <header class="header">
      <div class="container header-content">
        <a href="/{{meta.lang}}/" class="logo">
          <span class="logo-text">{{meta.siteName}}</span>
        </a>
        <nav class="nav">
          <a href="/{{meta.lang}}/#features">{{common.features}}</a>
          <a href="/{{meta.lang}}/" class="btn btn-primary"
            >{{common.backToHome}}</a
          >
        </nav>
      </div>
    </header>

    <main class="container section">
      <h1 class="section-title">{{pages.privacy.heading}}</h1>
      <div class="legal-content">
        <p class="mb-4">{{pages.privacy.lastUpdated}}</p>

        <h2 class="mb-4">{{pages.privacy.sections.introduction.title}}</h2>
        <p class="mb-4">{{pages.privacy.sections.introduction.content}}</p>
      </div>
    </main>

    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-links">
          <a href="/{{meta.lang}}/privacy-policy.html"
            >{{footer.privacyPolicy}}</a
          >
          <a href="/{{meta.lang}}/terms-of-service.html"
            >{{footer.termsOfService}}</a
          >
          <a href="/{{meta.lang}}/cookie-policy.html"
            >{{footer.cookiePolicy}}</a
          >
        </div>
        <p class="copyright">{{common.copyright}}</p>
      </div>
    </footer>
  </body>
</html>
```

## Implementation Steps

### Phase 1: Setup (1-2 hours)

1. Install dependencies: `npm install -D handlebars glob fast-glob`
2. Create `src/templates/` directory
3. Create `src/locales/` directory
4. Create build script `src/scripts/build-i18n.ts`

### Phase 2: Extract Translations (2-3 hours)

1. Convert existing English HTML to template format
2. Extract all text content to `en.json`
3. Copy and translate to `ro.json`, `es.json`, `fr.json`

### Phase 3: Build System (1-2 hours)

1. Implement template compilation script
2. Update `vite.config.js` to run build script
3. Test build output

### Phase 4: Migration (1 hour)

1. Delete old duplicated HTML files
2. Verify all pages generate correctly
3. Test in browser

## Build Script Pseudocode

```typescript
// src/scripts/build-i18n.ts
import Handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { glob } from "glob";

const LOCALES = ["en", "ro", "es", "fr"];
const TEMPLATES_DIR = "src/templates";
const LOCALES_DIR = "src/locales";
const OUTPUT_DIR = "."; // Root for en, subfolders for others

async function buildPages() {
  // Load all templates
  const templates = await glob(`${TEMPLATES_DIR}/**/*.html`);

  for (const locale of LOCALES) {
    // Load translations
    const translations = JSON.parse(
      fs.readFileSync(`${LOCALES_DIR}/${locale}.json`, "utf-8")
    );

    // Process each template
    for (const templatePath of templates) {
      const template = Handlebars.compile(
        fs.readFileSync(templatePath, "utf-8")
      );

      // Generate HTML
      const html = template(translations);

      // Determine output path
      const relativePath = path.relative(TEMPLATES_DIR, templatePath);
      const outputPath =
        locale === "en" ? relativePath : path.join(locale, relativePath);

      // Write file
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, html);
    }
  }
}

buildPages();
```

## Benefits Summary

### Maintainability

- **Before**: Update 40 files for a footer change
- **After**: Update 1 template file

### Adding New Language

- **Before**: Duplicate and translate 10 HTML files
- **After**: Create 1 JSON file, run build

### Content Updates

- **Before**: Find/replace across multiple files
- **After**: Update JSON key, rebuild

### Type Safety

- Can generate TypeScript types from JSON schema
- Compile-time validation of translation keys

### SEO & Performance

- ✅ Static HTML (same as current)
- ✅ Perfect for search engines
- ✅ No JavaScript required for content
- ✅ Fast page loads
- ✅ Proper hreflang tags

## Alternative Options

### Option 2: Client-Side i18n (NOT Recommended for SEO)

- Use i18next or similar
- ❌ Worse SEO (content loaded via JS)
- ❌ Flash of untranslated content
- ✅ Easier language switching

### Option 3: SSR Framework (Overkill for this project)

- Next.js, Nuxt, SvelteKit with i18n
- ✅ Best developer experience
- ❌ More complex setup
- ❌ Requires Node.js server or edge functions

## Recommendation

**Implement Option 1** - Template-based build system

- Perfect balance of simplicity and maintainability
- Keeps current static hosting approach
- Maintains perfect SEO
- Reduces codebase by ~70%
- Easy to understand and maintain

## Migration Risk: LOW

- Can be done incrementally
- Old files can coexist during migration
- Easy to rollback if needed
- Build-time errors prevent broken deployments
