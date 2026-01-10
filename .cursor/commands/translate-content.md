---
description: Systematically translate content to all supported languages with SEO optimization
---

Please systematically translate the specified content to all supported languages, ensuring translations are complete, correct, and optimized for first-page Google rankings.

## Supported Languages

The following languages are supported and must be included:

- **ar** (Arabic)
- **de** (German)
- **es** (Spanish)
- **fr** (French)
- **hi** (Hindi)
- **id** (Indonesian)
- **it** (Italian)
- **ro** (Romanian)
- **zh** (Chinese)

**English (en)** is the baseline language and should already exist.

## Step 1: Identify Content to Translate

First, determine what content needs translation:

### 1.1 Check MDX Content Collections

**Alternatives Pages** (`src/content/alternatives/`):
- List all English MDX files that need translation
- Check which language variants already exist
- Identify missing translations

**Use Case/Persona Pages** (`src/content/use-cases/`):
- List all English MDX files
- Check existing language variants
- Identify missing translations

**Example check:**
```bash
# Check alternatives directory
ls -la src/content/alternatives/*.md

# Check for existing language variants
ls -la src/content/alternatives/*.es.md
ls -la src/content/alternatives/*.de.md
# ... repeat for all languages
```

### 1.2 Check JSON Locale Files

**Testimonials** (`src/locales/[lang].json`):
- Verify which locale files have testimonials section
- Identify missing testimonials translations

**Other UI Text**:
- Verify all locale files have required keys
- Check for missing translations in common sections

### 1.3 Content Selection

**Priority Order:**
1. **HIGH**: Alternatives pages (core SEO content) - 4 files × 9 languages = 36 files
2. **MEDIUM**: Testimonials (social proof) - 7 remaining locale files
3. **MEDIUM**: Persona pages - Based on keyword opportunities
4. **LOW**: Additional UI copy - As needed

**User Prompt:** Ask the user which content to translate, or use default priority order.

## Step 2: Analyze Source Content

For each English source file that needs translation:

### 2.1 Extract Key SEO Elements

**From MDX Frontmatter:**
- `title` - Page title (translate, keep brand name "FlickAI" as-is)
- `description` - Meta description (translate, optimize for search)
- `keywords` - SEO keywords (localize and expand)
- `publishDate` - Keep ISO format, adjust if needed

**From Content:**
- H1 heading - Primary keyword target
- H2/H3 headings - Secondary keywords and structure
- Key phrases and terminology
- Internal links (update language prefixes)
- CTAs and call-to-action text

### 2.2 Identify SEO Keywords

**Extract keywords from English source:**
1. **Primary keywords**: Main search terms (e.g., "Expensify alternatives")
2. **Long-tail keywords**: Specific phrases (e.g., "best expense tracker for freelancers 2026")
3. **Semantic keywords**: Related terms (e.g., "expense management", "receipt scanning")

**Keyword Research for Target Language:**
- Use Google Keyword Planner insights for target language
- Check search volume and competition
- Identify local variations (e.g., "alternativas a Expensify" for Spanish)
- Consider cultural context (e.g., popular local competitors)

### 2.3 Content Structure Analysis

**Identify and preserve:**
- Table structures (translate content, preserve formatting)
- Lists and bullet points
- Code blocks or technical examples
- Internal links (must update language prefix)
- External links (keep as-is unless local alternative exists)

## Step 3: Create Translation with SEO Optimization

For each target language, create a complete, SEO-optimized translation.

### 3.1 Frontmatter Translation (Critical for SEO)

**Title Translation:**
- Translate naturally while maintaining keyword focus
- Keep "FlickAI" brand name unchanged
- Include year (2026) if in original
- Length: 50-60 characters ideal, max 70

**Example:**
```
English: "Best Expensify Alternatives (2025-2026): Privacy-First, Offline-First Expense Tracking"
Spanish: "Mejores Alternativas a Expensify (2025-2026): Seguimiento de Gastos con Privacidad y Modo Offline"
German: "Beste Expensify-Alternativen (2025-2026): Datenschutzfreundliche, Offline-fähige Ausgabenverfolgung"
```

**Description Translation:**
- Translate naturally, include primary keywords
- Keep compelling and descriptive
- Length: 150-160 characters ideal, max 160
- Should encourage clicks when shown in search results

**Keywords Translation:**
- Localize all keywords naturally
- Add local search variations
- Include semantic keywords in target language
- Separate with commas, no keyword stuffing

**Example Keyword Translation:**
```
English: "Expensify alternatives, apps like Expensify, expense reporting alternative 2026, offline expense tracker, privacy-first expense tracker, AI receipt scanner"

Spanish: "alternativas a Expensify, aplicaciones como Expensify, alternativa de gestión de gastos 2026, rastreador de gastos offline, rastreador de gastos con privacidad, escáner de recibos IA"

German: "Expensify Alternativen, Apps wie Expensify, Ausgabenverwaltung Alternative 2026, Offline-Ausgaben-Tracker, datenschutzorientierter Ausgaben-Tracker, KI-Belegscanner"
```

### 3.2 Content Translation Guidelines

**SEO-Optimized Writing:**

1. **Natural Keyword Integration:**
   - Use primary keyword in first paragraph (naturally)
   - Include keywords in H1, H2, H3 headings (where appropriate)
   - Use semantic variations throughout
   - Avoid keyword stuffing (read naturally)

2. **Content Depth Requirements:**
   - **Minimum 1500 words** for alternatives pages
   - **Minimum 1200 words** for persona/use-case pages
   - Maintain comprehensive coverage like English version
   - Add local context where relevant

3. **Cultural Localization:**
   - Use culturally appropriate names in examples
   - Reference local competitors if relevant (research first)
   - Adapt use cases to local business practices
   - Use appropriate currency examples (when relevant)

4. **Link Structure:**
   - **Internal links**: Update to language prefix format
     - English: `/features/analytics/`
     - Spanish: `/es/features/analytics/`
     - German: `/de/features/analytics/`
   - **External links**: Keep as-is (unless local alternative exists)
   - **Anchor text**: Translate naturally while maintaining keyword relevance

5. **Table Translation:**
   - Translate all content in tables
   - Preserve table structure and formatting
   - Keep data accurate (pricing, percentages, etc.)
   - Maintain comparison accuracy

6. **Technical Terms:**
   - First mention: Translate, then include English in parentheses if needed
   - Example: "Reconocimiento Óptico de Caracteres (OCR)" or "OCR (Reconocimiento Óptico de Caracteres)"
   - Common terms: Use standard local terminology
   - Brand names: Keep as-is (FlickAI, Expensify, QuickBooks, etc.)

### 3.3 Content Structure Requirements

**Maintain this structure for alternatives pages:**

1. **Introduction** (200-250 words)
   - Hook with pain point in target language
   - Include primary keyword naturally
   - Set up value proposition

2. **What Makes a Great Alternative** (300-400 words)
   - Define criteria
   - Include semantic keywords
   - Build authority and expertise

3. **Detailed Comparison** (400-500 words)
   - Feature comparison table (translate all content)
   - Pricing breakdown (localize currency context if relevant)
   - Pros and cons (honest evaluation)

4. **Why FlickAI Wins** (300-400 words)
   - Persona-specific value propositions
   - Include use case examples
   - Cultural adaptation where relevant

5. **Migration Guide** (200-250 words)
   - Step-by-step instructions
   - Practical advice
   - Cultural considerations

6. **FAQ Section** (300-400 words)
   - 5-7 common questions
   - Natural keyword inclusion
   - Address local concerns if relevant

7. **Conclusion with CTA** (100-150 words)
   - Summarize key points
   - Clear call-to-action
   - Link to correct language version

**Word Count Verification:**
- Check total word count after translation
- Ensure minimum requirements met
- Quality over quantity (don't pad unnecessarily)

### 3.4 Quality Assurance Checks

**Before finalizing each translation, verify:**

- [ ] **Word count**: Meets minimum requirements
- [ ] **Keywords**: Primary keyword in first paragraph
- [ ] **Headings**: Include keywords where natural
- [ ] **Links**: All internal links updated with language prefix
- [ ] **Brand names**: "FlickAI" kept as-is throughout
- [ ] **Technical accuracy**: Features and capabilities accurately described
- [ ] **Cultural appropriateness**: Names, examples, references are appropriate
- [ ] **Grammar and spelling**: Professional quality, native-level
- [ ] **Natural flow**: Reads naturally in target language
- [ ] **SEO optimization**: Keywords integrated naturally, not stuffed
- [ ] **Table formatting**: Preserved and all content translated
- [ ] **CTA links**: Point to correct language version

## Step 4: Testimonials Translation

For locale JSON files that need testimonials:

### 4.1 Structure to Add

```json
{
  "testimonials": {
    "title": "[Translated: 'What Our Users Say']",
    "subtitle": "[Translated subtitle about joining satisfied users]",
    "items": [
      {
        "name": "[Culturally appropriate name]",
        "role": "[Translated role title]",
        "text": "[Translated testimonial maintaining tone and meaning]",
        "rating": 5
      },
      {
        "name": "[Culturally appropriate name]",
        "role": "[Translated role title]",
        "text": "[Translated testimonial]",
        "rating": 5
      },
      {
        "name": "[Culturally appropriate name]",
        "role": "[Translated role title]",
        "text": "[Translated testimonial]",
        "rating": 5
      }
    ]
  }
}
```

### 4.2 Cultural Adaptation Guidelines

**Names by Language:**
- **Arabic (ar)**: Ahmed, Fatima, Mohammed, Layla, etc.
- **German (de)**: Hans, Julia, Michael, Anna, etc.
- **Spanish (es)**: Carlos, María, José, Ana, etc.
- **French (fr)**: Pierre, Marie, Jean, Sophie, etc.
- **Hindi (hi)**: Raj, Priya, Amit, Anjali, etc.
- **Indonesian (id)**: Budi, Siti, Andi, Ratna, etc.
- **Italian (it)**: Marco, Giulia, Alessandro, Francesca, etc.
- **Romanian (ro)**: Ion, Maria, Alexandru, Elena, etc.
- **Chinese (zh)**: Wei, Li, Zhang, Wang, etc.

**Roles Translation:**
- "Freelance Graphic Designer" → Appropriate translation
- "Consultant" → Appropriate translation
- "Small Business Owner" → Appropriate translation

**Testimonial Tone:**
- Maintain authentic, natural voice
- Keep same level of enthusiasm
- Preserve specific details (time saved, cost savings, etc.)
- Adapt cultural expressions naturally

## Step 5: File Creation and Organization

### 5.1 MDX File Naming Convention

**Format:** `[slug].[lang].md`

**Examples:**
- English: `expensify-alternatives.md`
- Spanish: `expensify-alternatives.es.md`
- German: `expensify-alternatives.de.md`
- Arabic: `expensify-alternatives.ar.md`

**Location:**
- Alternatives: `src/content/alternatives/[filename].[lang].md`
- Use Cases: `src/content/use-cases/[filename].[lang].md`

### 5.2 JSON Locale File Updates

**Location:** `src/locales/[lang].json`

**Process:**
1. Read existing locale file
2. Add or update `testimonials` section
3. Ensure proper JSON formatting
4. Verify no syntax errors

### 5.3 Validation Before Committing

**MDX Validation:**
```bash
# Check file exists
ls -la src/content/alternatives/expensify-alternatives.es.md

# Verify frontmatter is valid
# Check for YAML syntax errors
# Verify all required fields present
```

**JSON Validation:**
```bash
# Validate JSON syntax
node -e "JSON.parse(require('fs').readFileSync('src/locales/es.json', 'utf8'))"

# Or use jq if available
cat src/locales/es.json | jq .
```

## Step 6: SEO Optimization Verification

For each translated file, verify SEO requirements:

### 6.1 Keyword Optimization Checklist

- [ ] **Primary keyword** appears in:
  - Title (frontmatter)
  - First paragraph (naturally)
  - At least one H2 heading
  - Meta description
  - URL slug (already set via filename)

- [ ] **Secondary keywords** integrated throughout:
  - H2/H3 headings
  - Body paragraphs
  - Alt text (if images added)
  - Internal link anchor text

- [ ] **Semantic keywords** used naturally:
  - Related terms and phrases
  - Variations of main keywords
  - Industry-specific terminology

### 6.2 Content Quality for SEO

- [ ] **Word count**: Minimum 1500 words (alternatives), 1200 words (persona)
- [ ] **Content depth**: Comprehensive coverage, not thin content
- [ ] **Internal linking**: 3-5 relevant internal links with proper language prefixes
- [ ] **External linking**: Authoritative sources (if applicable)
- [ ] **Readability**: Natural flow, appropriate paragraph length
- [ ] **Structure**: Clear hierarchy (H1 → H2 → H3)
- [ ] **Uniqueness**: Not just translated, but culturally adapted

### 6.3 Technical SEO

- [ ] **Canonical URL**: Will be set automatically by BaseLayout
- [ ] **Hreflang tags**: Handled by Astro i18n config
- [ ] **Meta tags**: Title and description properly set in frontmatter
- [ ] **Structured data**: Will inherit from layout (if applicable)
- [ ] **Mobile-friendly**: Markdown renders responsively
- [ ] **Page speed**: No large assets, optimized content

### 6.4 Local SEO Considerations

- [ ] **Local search terms**: Include if relevant (e.g., "aplicación de gastos España")
- [ ] **Currency**: Mention local context if relevant (e.g., "pricing in USD, approximately X EUR")
- [ ] **Local competitors**: Reference if appropriate (research first)
- [ ] **Regional examples**: Adapt use cases to local business culture

## Step 7: Quality Review Process

### 7.1 Automated Checks

**Run these validations:**

1. **Frontmatter Validation:**
   ```typescript
   // Verify all required fields exist
   - title: string (required)
   - description: string (required)
   - keywords: string (optional but recommended)
   - lang: enum (must match file suffix)
   - publishDate: date (required)
   ```

2. **Content Validation:**
   - Word count check (minimum requirements)
   - Link validation (all internal links have correct language prefix)
   - Table structure preservation
   - Image alt text (if images present)

3. **JSON Validation:**
   - Valid JSON syntax
   - Required keys present
   - Proper structure maintained

### 7.2 Manual Review Checklist

For each translation, human review should verify:

**Accuracy:**
- [ ] Technical terms correctly translated
- [ ] Feature descriptions accurate
- [ ] Pricing information correct
- [ ] Links work correctly

**Naturalness:**
- [ ] Reads naturally in target language
- [ ] No awkward literal translations
- [ ] Cultural expressions appropriate
- [ ] Tone matches original

**SEO Effectiveness:**
- [ ] Keywords integrated naturally
- [ ] Content comprehensive and valuable
- [ ] Internal linking strategy sound
- [ ] Meta description compelling

**Completeness:**
- [ ] All sections translated
- [ ] All tables translated
- [ ] All FAQs translated
- [ ] No missing content

## Step 8: Create Translation Files

### 8.1 For MDX Files

**Process:**
1. Read English source file
2. Create new file with language suffix
3. Translate frontmatter (title, description, keywords)
4. Translate content section by section
5. Update all internal links
6. Verify word count
7. Run quality checks
8. Save file

**Example Workflow:**
```
Source: src/content/alternatives/expensify-alternatives.md
Target: src/content/alternatives/expensify-alternatives.es.md

1. Read English file
2. Extract frontmatter
3. Translate frontmatter with SEO keywords
4. Translate introduction (200-250 words)
5. Translate comparison section (400-500 words)
6. Translate pros/cons (300-400 words)
7. Translate FAQ (300-400 words)
8. Translate conclusion (100-150 words)
9. Update all internal links (/features/... → /es/features/...)
10. Verify word count >= 1500
11. Save file
```

### 8.2 For JSON Locale Files

**Process:**
1. Read existing locale JSON file
2. Check if testimonials section exists
3. If missing, add complete testimonials section
4. If exists but incomplete, update it
5. Verify JSON syntax
6. Save file

**Example:**
```json
// Before (missing testimonials):
{
  "common": { ... },
  "alternatives": { ... }
}

// After (with testimonials):
{
  "common": { ... },
  "alternatives": { ... },
  "testimonials": {
    "title": "Lo que dicen nuestros usuarios",
    "subtitle": "Únete a miles de usuarios satisfechos...",
    "items": [ ... ]
  }
}
```

## Step 9: Batch Processing

When translating multiple files, follow this systematic approach:

### 9.1 Priority Order

**Phase 1: High-Priority Markets**
1. German (de) - High traffic potential
2. Spanish (es) - Large market
3. French (fr) - High traffic potential

**Phase 2: Medium-Priority Markets**
4. Italian (it)
5. Chinese (zh)
6. Arabic (ar)

**Phase 3: Remaining Markets**
7. Hindi (hi)
8. Indonesian (id)
9. Romanian (ro)

### 9.2 Content Priority

**Within each language, prioritize:**
1. Expensify alternatives (highest search volume)
2. Best expense tracker apps
3. Best receipt scanner apps
4. Zoho Expense alternatives
5. Persona pages (based on keyword research)

### 9.3 Batch Processing Template

For each language:
```
Language: [lang]
Files to translate: [list]
Estimated word count: [total]
Estimated time: [hours]

Status: [ ] Not started | [ ] In progress | [x] Complete

Files:
  [ ] expensify-alternatives.[lang].md
  [ ] zoho-expense-alternatives.[lang].md
  [ ] best-expense-tracker-apps.[lang].md
  [ ] best-receipt-scanner-apps.[lang].md
  [ ] [locale].json (testimonials)
```

## Step 10: Verification and Testing

### 10.1 Build Verification

After creating translations, verify the site builds correctly:

```bash
# Build the site
npm run build

# Check for errors
# Verify all MDX files are processed
# Check for missing translations
# Verify routing works for all languages
```

### 10.2 Link Verification

**Check internal links:**
- All internal links use correct language prefix
- Links point to existing pages
- No broken references

**Example verification:**
```bash
# Check for English links in translated files
grep -r "href=\"/features" src/content/alternatives/*.es.md
# Should find Spanish links like href="/es/features"
```

### 10.3 Content Verification

**Spot checks:**
- Randomly verify 2-3 sections from each translation
- Check keyword integration looks natural
- Verify cultural appropriateness
- Confirm technical accuracy

## Step 11: Commit and Documentation

### 11.1 Commit Strategy

**Option A: Single commit per language (Recommended)**
```bash
git add src/content/alternatives/*.es.md src/locales/es.json
git commit -m "feat(i18n): add Spanish translations for alternatives pages

- Translated 4 alternatives pages (expensify, zoho, best-trackers, best-scanners)
- Added testimonials to Spanish locale
- SEO-optimized with localized keywords
- 1500+ words per page, comprehensive coverage
- All internal links updated with /es/ prefix"
```

**Option B: Single commit per page**
```bash
git add src/content/alternatives/expensify-alternatives.es.md
git commit -m "feat(i18n): add Spanish translation for Expensify alternatives page

- Complete translation with SEO optimization
- ~2000 words, comprehensive coverage
- Localized keywords and cultural adaptation
- All links updated for Spanish version"
```

### 11.2 Update Translation Requirements Document

After completing translations, update `TRANSLATION_REQUIREMENTS.md`:

```markdown
#### 1.1 Expensify Alternatives
- **English**: `expensify-alternatives.md` ✅ (Complete, ~2000 words)
- **Needs Translation To**:
  - `expensify-alternatives.es.md` ✅ (Complete, ~2000 words) [Date: YYYY-MM-DD]
  - `expensify-alternatives.de.md` ✅ (Complete, ~2000 words) [Date: YYYY-MM-DD]
  - ... (mark as complete when done)
```

## Step 12: SEO Validation Report

After completing translations, generate a validation report:

### 12.1 Report Template

```markdown
# Translation SEO Validation Report

**Date:** YYYY-MM-DD
**Language:** [lang]
**Translator:** [if applicable]
**Reviewer:** [if applicable]

## Files Translated

1. `expensify-alternatives.[lang].md`
   - Word count: [count] / 1500 minimum ✅
   - Primary keyword: [keyword] - Appears in title ✅, first paragraph ✅, H2 ✅
   - Internal links: [count] - All have language prefix ✅
   - Quality: Professional, natural translation ✅

2. [Repeat for each file]

## SEO Metrics

- **Total words translated:** [count]
- **Keywords integrated:** [count] primary, [count] secondary
- **Internal links:** [count] (all verified working)
- **Content depth:** Comprehensive ✅

## Quality Scores

- **Translation quality:** 9/10 (native-level, natural)
- **SEO optimization:** 9/10 (keywords well-integrated)
- **Cultural adaptation:** 8/10 (appropriate examples used)
- **Technical accuracy:** 10/10 (features correctly described)

## Issues Found

- [List any issues or recommendations]

## Recommendations

- [Any suggestions for improvement]
```

## Error Handling

### Missing Source File

**Error:** Source English file not found
```
Error: Source file src/content/alternatives/expensify-alternatives.md not found
Action: Verify file exists, check filename spelling
```

### Invalid Frontmatter

**Error:** Frontmatter validation fails
```
Error: Missing required field 'description' in frontmatter
Action: Add missing required fields to frontmatter
File: src/content/alternatives/expensify-alternatives.es.md
```

### Word Count Below Minimum

**Error:** Translation too short
```
Warning: Word count for expensify-alternatives.es.md is 1200 words (minimum: 1500)
Action: Expand content while maintaining quality, add more detail to sections
```

### Link Errors

**Error:** Broken or incorrect links
```
Error: Link '/features/analytics' should be '/es/features/analytics' in Spanish file
Action: Update all internal links with correct language prefix
File: src/content/alternatives/expensify-alternatives.es.md, line 45
```

### JSON Syntax Error

**Error:** Invalid JSON in locale file
```
Error: JSON syntax error in src/locales/es.json
Line 150: Expected ',' or '}'
Action: Fix JSON syntax, validate with JSON linter
```

## Output Format

After completing translation work, provide:

### ✅ Success Summary

```
✅ Translation Complete

Language: [lang]
Files Created/Updated: [count]
Total Words: [count]

📊 Statistics:
- Alternatives pages: [count] files
- Testimonials: [locale file] updated
- Word count average: [count] words per page
- SEO keywords: [count] primary, [count] secondary
- Internal links: [count] (all verified)

🎯 Quality Metrics:
- Translation quality: [score]/10
- SEO optimization: [score]/10
- Cultural adaptation: [score]/10

📝 Files Created:
- src/content/alternatives/expensify-alternatives.[lang].md
- src/content/alternatives/zoho-expense-alternatives.[lang].md
- [list all files]

🔗 Next Steps:
1. Review translations for accuracy
2. Run build to verify no errors
3. Test links and functionality
4. Deploy and monitor SEO performance
```

### 📋 Translation Preview

```
Language: Spanish (es)
File: expensify-alternatives.es.md

Title: "Mejores Alternativas a Expensify (2025-2026): Seguimiento de Gastos con Privacidad y Modo Offline"
Description: "Buscas alternativas a Expensify? Compara aplicaciones que enfatizan modo offline, privacidad, simplicidad y automatización IA moderna..."
Keywords: "alternativas a Expensify, aplicaciones como Expensify, gestión de gastos alternativa 2026..."

Word Count: 2,047 words ✅
Primary Keyword: "alternativas a Expensify" - Appears 12 times naturally ✅
Internal Links: 8 links, all with /es/ prefix ✅
```

## Best Practices Reminder

1. **Quality over Speed**: Take time for accurate, natural translations
2. **SEO is Long-term**: Well-optimized content ranks better over time
3. **Cultural Sensitivity**: Research cultural norms and preferences
4. **Consistency**: Use consistent terminology across all translations
5. **Testing**: Always verify builds and links after translation
6. **Documentation**: Keep TRANSLATION_REQUIREMENTS.md updated
7. **Review Process**: Have native speakers review when possible
8. **Iteration**: Improve translations based on SEO performance data

## Advanced: SEO Keyword Research Integration

For optimal results, consider:

1. **Google Search Console Data**: Use GSC to identify keyword opportunities in each language
2. **Competitor Analysis**: Check what keywords competitors rank for in target language
3. **Local Search Trends**: Adapt content based on local search behavior
4. **Long-tail Opportunities**: Target specific long-tail keywords with lower competition
5. **Semantic SEO**: Use related terms and concepts naturally throughout content

---

**Usage Example:**

To translate all alternatives pages to Spanish:
```
@translate-content
Language: es
Content: alternatives pages (all 4)
Priority: high
```

To translate testimonials for remaining languages:
```
@translate-content
Content: testimonials
Languages: ar, fr, hi, id, it, ro, zh
Priority: medium
```
