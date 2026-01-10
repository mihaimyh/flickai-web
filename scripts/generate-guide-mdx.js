import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = path.resolve(__dirname, '../src/locales');
const GUIDES_DIR = path.resolve(__dirname, '../src/content/guides');

const LOCALES = ['en', 'ar', 'de', 'es', 'fr', 'hi', 'id', 'it', 'ro', 'zh'];
const GUIDE_SLUGS = {
  'receipt-to-excel': 'receiptToExcel',
  'offline-expense-tracking': 'offlineExpenseTracking',
  'tax-receipts-checklist': 'taxReceiptsChecklist',
};

function generateMDXContent(slug, guideKey, translations, lang) {
  const guide = translations.guides?.[guideKey] || {};
  if (!guide.title) return null;

  let content = `---
title: "${guide.title || ''}"
description: "${guide.description || ''}"
keywords: "${guide.keywords || ''}"
lang: "${lang}"
publishDate: 2026-01-08T00:00:00.000Z
---

# ${guide.heading || guide.title || ''}

${guide.snippet || ''}

${guide.intro || ''}

`;

  if (guide.steps && guide.steps.title) {
    content += `## ${guide.steps.title}\n\n`;
    if (guide.steps.step1) content += `1. ${guide.steps.step1}\n`;
    if (guide.steps.step2) content += `2. ${guide.steps.step2}\n`;
    if (guide.steps.step3) content += `3. ${guide.steps.step3}\n`;
    if (guide.steps.step4) content += `4. ${guide.steps.step4}\n`;
    content += '\n';
  }

  if (guide.checklist && guide.checklist.title) {
    content += `## ${guide.checklist.title}\n\n`;
    if (guide.checklist.point1) content += `- ${guide.checklist.point1}\n`;
    if (guide.checklist.point2) content += `- ${guide.checklist.point2}\n`;
    if (guide.checklist.point3) content += `- ${guide.checklist.point3}\n`;
    if (guide.checklist.point4) content += `- ${guide.checklist.point4}\n`;
    if (guide.checklist.point5) content += `- ${guide.checklist.point5}\n`;
    content += '\n';
  }

  if (guide.pitfalls && guide.pitfalls.title) {
    content += `## ${guide.pitfalls.title}\n\n`;
    if (guide.pitfalls.point1) content += `- ${guide.pitfalls.point1}\n`;
    if (guide.pitfalls.point2) content += `- ${guide.pitfalls.point2}\n`;
    if (guide.pitfalls.point3) content += `- ${guide.pitfalls.point3}\n`;
    content += '\n';
  }

  if (guide.faq && guide.faq.title) {
    content += `## ${guide.faq.title}\n\n`;
    if (guide.faq.q1 && guide.faq.a1) {
      content += `**${guide.faq.q1}**\n${guide.faq.a1}\n\n`;
    }
    if (guide.faq.q2 && guide.faq.a2) {
      content += `**${guide.faq.q2}**\n${guide.faq.a2}\n\n`;
    }
    if (guide.faq.q3 && guide.faq.a3) {
      content += `**${guide.faq.q3}**\n${guide.faq.a3}\n\n`;
    }
    if (guide.faq.q4 && guide.faq.a4) {
      content += `**${guide.faq.q4}**\n${guide.faq.a4}\n\n`;
    }
  }

  return content;
}

async function generateGuides() {
  console.log('Generating guide MDX files from translations...\n');

  for (const [slug, guideKey] of Object.entries(GUIDE_SLUGS)) {
    for (const lang of LOCALES) {
      const localePath = path.join(LOCALES_DIR, `${lang}.json`);
      if (!fs.existsSync(localePath)) {
        console.warn(`⚠️  Translation file not found: ${localePath}`);
        continue;
      }

      const translations = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
      const content = generateMDXContent(slug, guideKey, translations, lang);

      if (!content) {
        console.warn(`⚠️  No content found for ${slug} in ${lang}`);
        continue;
      }

      const filename = lang === 'en' 
        ? `${slug}.md` 
        : `${slug}.${lang}.md`;
      const filePath = path.join(GUIDES_DIR, filename);

      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✓ Created ${filename}`);
    }
  }

  console.log('\n✅ Guide MDX generation complete!');
}

generateGuides().catch(console.error);
