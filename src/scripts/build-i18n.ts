import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES = ['en', 'ro', 'es', 'fr'];
const TEMPLATES_DIR = path.resolve(__dirname, '../templates');
const LOCALES_DIR = path.resolve(__dirname, '../locales');
const OUTPUT_DIR = path.resolve(__dirname, '../..');

// Register Handlebars helpers
Handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

Handlebars.registerHelper('ne', function(a, b) {
  return a !== b;
});

// Helper to generate language prefix for URLs
Handlebars.registerHelper('langPrefix', function(lang: string) {
  return lang === 'en' ? '' : `${lang}/`;
});

// Helper to generate canonical URL
Handlebars.registerHelper('canonicalUrl', function(lang: string, path: string) {
  const langPath = lang === 'en' ? '' : `${lang}/`;
  return `https://flickai.net/${langPath}${path}`;
});

interface Translation {
  meta: {
    lang: string;
    langName: string;
    siteName: string;
    siteUrl: string;
  };
  [key: string]: any;
}

async function buildPages() {
  console.log('🌍 Building i18n pages...\n');

  // Find all template files
  const templates = await glob('**/*.html', {
    cwd: TEMPLATES_DIR,
    absolute: false
  });

  console.log(`📄 Found ${templates.length} templates`);
  console.log(`🗣️  Building for ${LOCALES.length} locales: ${LOCALES.join(', ')}\n`);

  let totalGenerated = 0;

  for (const locale of LOCALES) {
    const translationPath = path.join(LOCALES_DIR, `${locale}.json`);
    
    if (!fs.existsSync(translationPath)) {
      console.warn(`⚠️  Warning: Translation file not found: ${translationPath}`);
      continue;
    }

    // Load translations
    const translations: Translation = JSON.parse(
      fs.readFileSync(translationPath, 'utf-8')
    );

    console.log(`\n🔨 Building ${locale.toUpperCase()} pages...`);

    for (const templateRelPath of templates) {
      const templatePath = path.join(TEMPLATES_DIR, templateRelPath);
      const templateContent = fs.readFileSync(templatePath, 'utf-8');
      
      // Compile template
      const template = Handlebars.compile(templateContent, {
        strict: false,
        noEscape: false
      });

      // Generate HTML
      const html = template(translations);

      // Determine output path
      // English goes to root, other languages go to their subdirectory
      const outputPath = locale === 'en'
        ? path.join(OUTPUT_DIR, templateRelPath)
        : path.join(OUTPUT_DIR, locale, templateRelPath);

      // Create directory if it doesn't exist
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Write file
      fs.writeFileSync(outputPath, html, 'utf-8');
      console.log(`  ✓ ${outputPath.replace(OUTPUT_DIR, '').substring(1)}`);
      totalGenerated++;
    }
  }

  console.log(`\n✅ Successfully generated ${totalGenerated} pages!`);
}

// Run the build
buildPages().catch(error => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
