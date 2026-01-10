# Translation Requirements Document

This document outlines all content that needs to be translated into other languages for the FlickAI website.

## Status Overview

- **English (en)**: ✅ Complete (baseline language)
- **Arabic (ar)**: ⏳ Needs translation
- **German (de)**: 🟡 Partial (testimonials done)
- **Spanish (es)**: 🟡 Partial (testimonials + 1 persona page done)
- **French (fr)**: ⏳ Needs translation
- **Hindi (hi)**: ⏳ Needs translation
- **Indonesian (id)**: ⏳ Needs translation
- **Italian (it)**: ⏳ Needs translation
- **Romanian (ro)**: ⏳ Needs translation
- **Chinese (zh)**: ⏳ Needs translation

---

## 1. Alternatives Pages (MDX Content)

### Priority: HIGH (Core SEO Content)

These are the main alternatives comparison pages that drive organic traffic. Each file needs to be translated into 9 languages.

**Location**: `src/content/alternatives/`

#### 1.1 Expensify Alternatives
- **English**: `expensify-alternatives.md` ✅ (Complete, ~2000 words)
- **Needs Translation To**:
  - `expensify-alternatives.ar.md` (Arabic)
  - `expensify-alternatives.de.md` (German)
  - `expensify-alternatives.es.md` (Spanish)
  - `expensify-alternatives.fr.md` (French)
  - `expensify-alternatives.hi.md` (Hindi)
  - `expensify-alternatives.id.md` (Indonesian)
  - `expensify-alternatives.it.md` (Italian)
  - `expensify-alternatives.ro.md` (Romanian)
  - `expensify-alternatives.zh.md` (Chinese)

**Key Sections to Translate**:
- Introduction with pain points
- Feature comparison table
- Pricing breakdown
- Pros & cons sections
- "Why FlickAI Wins" persona sections
- Migration guide
- FAQ section
- Conclusion with CTA

**SEO Keywords (translate these)**:
- English: "Expensify alternatives, apps like Expensify, expense reporting alternative 2026, offline expense tracker, privacy-first expense tracker, AI receipt scanner"
- Need localized versions for each language

---

#### 1.2 Zoho Expense Alternatives
- **English**: `zoho-expense-alternatives.md` ✅ (Complete, ~2000 words)
- **Needs Translation To**: Same 9 languages as above

**Key Sections**: Same structure as Expensify alternatives

**SEO Keywords (translate these)**:
- English: "Zoho Expense alternatives, apps like Zoho Expense, simple expense tracker, receipt scanner alternative 2026, offline expense tracking"

---

#### 1.3 Best Expense Tracker Apps
- **English**: `best-expense-tracker-apps.md` ✅ (Complete, ~2200 words)
- **Needs Translation To**: Same 9 languages as above

**Key Sections**:
- Feature comparison across multiple apps (FlickAI, YNAB, PocketGuard, Spendee, Money Manager)
- Detailed pricing analysis
- Use case recommendations
- Implementation guide

**SEO Keywords (translate these)**:
- English: "best expense tracker apps, best budgeting app 2026, offline expense tracker, private expense tracker, AI expense tracker, free to start expense app"

---

#### 1.4 Best Receipt Scanner Apps
- **English**: `best-receipt-scanner-apps.md` ✅ (Complete, ~2000 words)
- **Needs Translation To**: Same 9 languages as above

**Key Sections**:
- OCR accuracy comparisons
- Offline functionality analysis
- Export capabilities comparison
- Use case recommendations

**SEO Keywords (translate these)**:
- English: "best receipt scanner app, receipt OCR, scan receipts offline, receipt scanner free to start, receipt scanner 2026, scan receipts to Excel"

---

### Translation Notes for Alternatives Pages

**Important Considerations**:
1. **Maintain SEO Value**: Translate keywords naturally, don't just transliterate English terms
2. **Localize Examples**: Use culturally appropriate examples (e.g., "Hans M." for German, "María G." for Spanish)
3. **Currency**: Keep USD in pricing sections but add local context where relevant
4. **Links**: Keep internal links but update language prefixes (e.g., `/es/features/...` for Spanish)
5. **Table Formatting**: Maintain table structure but translate all content
6. **CTA Buttons**: Ensure "Try FlickAI free" links point to correct language version

**Total Files Needed**: 36 files (4 alternatives × 9 languages)

---

## 2. Testimonials (JSON Locale Files)

### Priority: MEDIUM (Social Proof)

**Location**: `src/locales/[lang].json`

**Status**:
- ✅ English (`en.json`) - Complete
- ✅ German (`de.json`) - Complete
- ✅ Spanish (`es.json`) - Complete
- ⏳ Arabic (`ar.json`) - Needs translation
- ⏳ French (`fr.json`) - Needs translation
- ⏳ Hindi (`hi.json`) - Needs translation
- ⏳ Indonesian (`id.json`) - Needs translation
- ⏳ Italian (`it.json`) - Needs translation
- ⏳ Romanian (`ro.json`) - Needs translation
- ⏳ Chinese (`zh.json`) - Needs translation

### Structure Required in Each Locale File:

```json
{
  "testimonials": {
    "title": "[Translated title: 'What Our Users Say']",
    "subtitle": "[Translated subtitle about joining satisfied users]",
    "items": [
      {
        "name": "[Culturally appropriate name]",
        "role": "[Translated role: 'Freelance Graphic Designer']",
        "text": "[Translated testimonial text, maintain same meaning and tone]",
        "rating": 5
      },
      {
        "name": "[Culturally appropriate name]",
        "role": "[Translated role: 'Consultant']",
        "text": "[Translated testimonial text]",
        "rating": 5
      },
      {
        "name": "[Culturally appropriate name]",
        "role": "[Translated role: 'Small Business Owner']",
        "text": "[Translated testimonial text]",
        "rating": 5
      }
    ]
  }
}
```

### Translation Guidelines:
- Use culturally appropriate names (e.g., Arabic: "Ahmed", "Fatima"; Chinese: "Wei", "Li")
- Maintain the same professional tone
- Keep the same structure (3 testimonials per language)
- Ensure role translations are accurate for the target culture

**Files to Update**: 7 files (ar, fr, hi, id, it, ro, zh)

---

## 3. Persona/Use Case Pages (MDX Content)

### Priority: MEDIUM (Long-tail SEO)

**Location**: `src/content/use-cases/`

### 3.1 Expense Tracker for Freelancers

**Status**:
- ✅ Spanish: `expense-tracker-for-freelancers.es.md` (Complete, ~1500 words)
- ⏳ English: `expense-tracker-for-freelancers.md` (Should be created)
- ⏳ Other languages: 8 additional translations needed

**Needs Translation To**:
- `expense-tracker-for-freelancers.md` (English base version)
- `expense-tracker-for-freelancers.ar.md`
- `expense-tracker-for-freelancers.de.md`
- `expense-tracker-for-freelancers.fr.md`
- `expense-tracker-for-freelancers.hi.md`
- `expense-tracker-for-freelancers.id.md`
- `expense-tracker-for-freelancers.it.md`
- `expense-tracker-for-freelancers.ro.md`
- `expense-tracker-for-freelancers.zh.md`

**SEO Keywords (translate these)**:
- Spanish: "aplicación de gastos para autónomos, app gastos freelance, gestor gastos autónomo, seguimiento gastos freelance 2026"
- Need equivalent keywords for each language

---

### 3.2 Additional Persona Pages (To Be Created)

These pages should be created and translated as outlined in the SEO plan:

#### Receipt Scanner for Real Estate Agents
- **Priority Markets**: German (`receipt-scanner-for-real-estate-agents.de.md`)
- **Keywords**: "Belegscanner für Immobilienmakler" (German)

#### Receipt Scanner for Consultants
- **Priority Markets**: Spanish (`receipt-scanner-for-consultants.es.md`)
- **Keywords**: "escáner de recibos para consultores" (Spanish)

#### Expense Tracker for Small Businesses
- **Priority Markets**: French (`expense-tracker-for-small-businesses.fr.md`)
- **Keywords**: "suivi des dépenses pour petites entreprises" (French)

**Translation Strategy**: Create English base first, then translate to priority markets based on keyword research and GSC data.

---

## 4. Sticky CTA Component Text

### Priority: LOW (UI Copy)

**Location**: Component uses translations from locale files

**Already Handled**: The StickyCTA component pulls from `translations.common.downloadApp` and `translations.home.download.subtitle`, which should already exist in all locale files.

**Verify These Keys Exist in All Locales**:
- `common.downloadApp` - "Download App" equivalent
- `home.download.subtitle` - "Free to start. No credit card required." equivalent

**Action**: Verify all 10 locale files have these keys, add if missing.

---

## 5. Alternative Page "Back to Hub" Link

### Priority: LOW (Already Handled)

**Status**: ✅ Uses `alternatives.backToHub` from locale files

**Verify**: All locale files should have `alternatives.backToHub` key. Current English: "Back to Alternatives"

---

## Translation Priority Matrix

### Phase 1: High Priority (Do First)
1. **Alternatives Pages** (36 files total)
   - Start with high-traffic markets: German, Spanish, French
   - These drive the most SEO value

### Phase 2: Medium Priority
2. **Testimonials** (7 remaining locale files)
   - Quick wins for social proof
   - Can be done in parallel with alternatives

3. **Persona Pages** (9 files for freelancer page + new pages)
   - Long-tail keyword targeting
   - Focus on markets with lower competition

### Phase 3: Lower Priority
4. **Additional Persona Pages** (as keyword opportunities arise)
   - Monitor GSC for long-tail keyword opportunities
   - Create pages based on search data

---

## File Structure Reference

### Alternatives Pages
```
src/content/alternatives/
├── expensify-alternatives.md (✅ EN)
├── expensify-alternatives.es.md (⏳)
├── expensify-alternatives.de.md (⏳)
├── expensify-alternatives.fr.md (⏳)
├── expensify-alternatives.ar.md (⏳)
├── expensify-alternatives.hi.md (⏳)
├── expensify-alternatives.id.md (⏳)
├── expensify-alternatives.it.md (⏳)
├── expensify-alternatives.ro.md (⏳)
└── expensify-alternatives.zh.md (⏳)
[Repeat for: zoho-expense-alternatives, best-expense-tracker-apps, best-receipt-scanner-apps]
```

### Testimonials
```
src/locales/
├── en.json (✅ Complete)
├── de.json (✅ Complete)
├── es.json (✅ Complete)
├── ar.json (⏳ Needs testimonials section)
├── fr.json (⏳ Needs testimonials section)
├── hi.json (⏳ Needs testimonials section)
├── id.json (⏳ Needs testimonials section)
├── it.json (⏳ Needs testimonials section)
├── ro.json (⏳ Needs testimonials section)
└── zh.json (⏳ Needs testimonials section)
```

### Persona Pages
```
src/content/use-cases/
├── expense-tracker-for-freelancers.es.md (✅ ES)
├── expense-tracker-for-freelancers.md (⏳ EN base needed)
├── expense-tracker-for-freelancers.de.md (⏳)
├── expense-tracker-for-freelancers.fr.md (⏳)
└── [8 more languages...]
```

---

## Quality Checklist for Translations

For each translation, verify:

- [ ] All frontmatter fields translated (title, description, keywords)
- [ ] SEO keywords naturally integrated (not keyword stuffing)
- [ ] Internal links updated with correct language prefixes
- [ ] Cultural appropriateness (names, examples, references)
- [ ] Currency and pricing context appropriate for region
- [ ] Technical terms properly localized or explained
- [ ] CTA buttons link to correct language version
- [ ] Table formatting preserved
- [ ] Word count maintains quality (1500+ words for alternatives)
- [ ] Tone and style match original English version

---

## Notes for Translators

1. **SEO Focus**: These pages are critical for organic search. Maintain keyword relevance while writing naturally.

2. **Brand Consistency**: Always refer to "FlickAI" as is (no translation). Product features like "OCR", "offline mode" should be translated when first introduced, with English term in parentheses if needed.

3. **Cultural Adaptation**: 
   - Use local currency examples where relevant
   - Reference local competitors if applicable
   - Adapt use cases to local business practices

4. **Technical Accuracy**: 
   - Maintain accuracy of feature descriptions
   - Preserve table structures and data
   - Keep comparison tables consistent across languages

5. **Link Structure**: All internal links should use language prefix format:
   - English: `/features/analytics/`
   - Spanish: `/es/features/analytics/`
   - German: `/de/features/analytics/`

---

## Estimated Translation Effort

**Alternatives Pages (High Priority)**:
- 4 pages × 9 languages = 36 files
- ~2000 words each = ~72,000 words total
- Estimated time: 180-240 hours (professional translation)

**Testimonials (Medium Priority)**:
- 7 locale files × ~150 words = ~1,050 words
- Estimated time: 3-5 hours

**Persona Pages (Medium Priority)**:
- 1 page × 9 languages = 9 files
- ~1500 words each = ~13,500 words
- Estimated time: 35-45 hours

**Total Estimated Effort**: 220-290 hours of professional translation work

---

## Next Steps

1. **Prioritize Markets**: Based on GSC data, prioritize German, Spanish, French for alternatives pages
2. **Hire Translators**: Engage native speakers for each target language
3. **Create Translation Brief**: Share this document with translation team
4. **Review Process**: Have native speakers review translations for cultural appropriateness
5. **SEO Review**: Verify keyword integration maintains SEO value
6. **Quality Assurance**: Test all links, formatting, and functionality after translation

---

**Last Updated**: 2026-01-09
**Document Owner**: Content/SEO Team
**Review Frequency**: Quarterly (update as new content is added)
