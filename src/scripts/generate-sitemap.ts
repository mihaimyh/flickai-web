import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES = ['en', 'ro', 'es', 'fr'];
const TEMPLATES_DIR = path.resolve(__dirname, '../templates');
const OUTPUT_FILE = path.resolve(__dirname, '../../public/sitemap.xml');
const BASE_URL = 'https://flickai.net';

interface SitemapEntry {
  path: string;
  locale: string;
  priority: number;
  changefreq: string;
}

async function generateSitemap() {
  console.log('🗺️  Generating sitemap...\n');

  // Find all templates
  const templates = await glob('**/*.html', {
    cwd: TEMPLATES_DIR,
    absolute: false
  });

  const entries: SitemapEntry[] = [];

  // Generate entries for each template and locale
  for (const template of templates) {
    for (const locale of LOCALES) {
      const isEnglish = locale === 'en';
      const localePath = isEnglish ? '' : `${locale}/`;
      const fullPath = `${localePath}${template}`;
      
      // Determine priority based on page type
      let priority = 0.5;
      let changefreq = 'monthly';
      
      if (template === 'index.html') {
        priority = 1.0;
        changefreq = 'weekly';
      } else if (template.startsWith('features/')) {
        priority = 0.8;
      }
      
      entries.push({
        path: fullPath,
        locale,
        priority,
        changefreq
      });
    }
  }

  // Group entries by base path for hreflang
  const groupedEntries = new Map<string, SitemapEntry[]>();
  
  for (const entry of entries) {
    const basePath = entry.path.replace(/^(ro|es|fr)\//, '');
    if (!groupedEntries.has(basePath)) {
      groupedEntries.set(basePath, []);
    }
    groupedEntries.get(basePath)!.push(entry);
  }

  // Generate XML
  const today = new Date().toISOString().split('T')[0];
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  // Sort entries by locale for better organization
  const sortedLocales = ['en', 'es', 'fr', 'ro'];
  
  for (const locale of sortedLocales) {
    const localeEntries = entries.filter(e => e.locale === locale);
    
    if (localeEntries.length > 0) {
      const localeName = locale === 'en' ? 'English' : 
                        locale === 'es' ? 'Spanish' :
                        locale === 'fr' ? 'French' : 'Romanian';
      xml += `  <!-- ${localeName} Pages -->\n`;
      
      for (const entry of localeEntries) {
        const basePath = entry.path.replace(/^(ro|es|fr)\//, '');
        const alternates = groupedEntries.get(basePath) || [];
        
        xml += `  <url>\n`;
        xml += `    <loc>${BASE_URL}/${entry.path}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
        xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
        
        // Add hreflang links for pages that have translations
        if (alternates.length > 1) {
          for (const alt of alternates) {
            const hreflang = alt.locale;
            const href = `${BASE_URL}/${alt.path}`;
            xml += `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}" />\n`;
          }
          // Add x-default for English version
          const enVersion = alternates.find(a => a.locale === 'en');
          if (enVersion) {
            xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/${enVersion.path}" />\n`;
          }
        }
        
        xml += `  </url>\n`;
      }
      xml += '\n';
    }
  }

  xml += '</urlset>\n';

  // Write sitemap
  fs.writeFileSync(OUTPUT_FILE, xml, 'utf-8');
  
  console.log(`✅ Sitemap generated with ${entries.length} URLs`);
  console.log(`📍 Location: ${OUTPUT_FILE}`);
  console.log(`\nPages per locale:`);
  for (const locale of LOCALES) {
    const count = entries.filter(e => e.locale === locale).length;
    console.log(`  ${locale.toUpperCase()}: ${count} pages`);
  }
}

generateSitemap().catch(error => {
  console.error('❌ Sitemap generation failed:', error);
  process.exit(1);
});
