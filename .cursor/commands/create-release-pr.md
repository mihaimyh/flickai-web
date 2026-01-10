---
description: Create a GitHub PR with release notes based on git history
---

Please create a new GitHub Pull Request with release notes generated from git history and update the release_notes.txt file for all supported languages.

## Step 1: Analyze Git History

First, analyze the git history to understand what changes have been made since the last release:

```bash
# Get the last tag
git fetch --tags
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")

# Get commits since last tag (or last 20 commits if no tag)
if [ -z "$LAST_TAG" ]; then
  COMMITS=$(git log --oneline -20)
  COMMITS_FULL=$(git log --format="%H|%s|%b" -20)
else
  COMMITS=$(git log --oneline ${LAST_TAG}..HEAD)
  COMMITS_FULL=$(git log --format="%H|%s|%b" ${LAST_TAG}..HEAD)
fi

# Show what we found
echo "Found commits since last tag:"
echo "$COMMITS"
```

**If no commits found or empty:** Inform the user that there are no new changes to create a release for.

## Step 2: Categorize Changes

Analyze the commit messages and categorize them into user-friendly groups:

**Categories to use:**
- 🎨 **Enhanced Design** - UI/UX improvements, theming, visual updates
- ♿ **Better Accessibility** - Navigation, readability, usability improvements
- 📝 **Improved Expense Details** - Expense viewing, editing, organization features
- 🚀 **Performance & Polish** - Performance optimizations, bug fixes, refactoring
- 🔐 **Security & Privacy** - Security improvements, privacy features
- 🌐 **Localization** - Translation updates, language support
- 🐛 **Bug Fixes** - Bug fixes and error corrections
- ✨ **New Features** - New functionality added

**Analysis Rules:**
1. **Skip technical commits**: Ignore commits with messages like "chore:", "refactor:", "fix: lint", "ci:", "docs:" (unless they affect user experience)
2. **Focus on user-facing changes**: Prioritize commits that users will notice
3. **Group similar changes**: Combine multiple bug fixes into one line
4. **Be concise**: Each bullet point should be one clear, simple sentence
5. **Use active voice**: "Improved navigation" not "Navigation was improved"
6. **Avoid technical jargon**: "Made the app faster" not "Optimized database queries"

**Example categorization:**
```
Commits:
- feat: add dark mode support
- fix: expense wizard crashes on null values
- style: improve card shadows and spacing
- perf: optimize image loading

Categorized:
🎨 Enhanced Design
• Added dark mode for better viewing in low light
• Improved card appearance with better shadows and spacing

🐛 Bug Fixes
• Fixed crashes when adding expenses with missing information

🚀 Performance & Polish
• Faster image loading throughout the app
```

## Step 3: Generate User-Friendly Release Notes (English)

Create user-friendly, non-technical release notes in English. **Maximum 400 characters per section** (leaving 100 chars buffer for Play Store's 500 char limit).

**Format Template:**
```markdown
✨ What's New in FlickAI

🎨 Enhanced Design
• [First bullet point - max 80 chars]
• [Second bullet point - max 80 chars]

♿ Better Accessibility
• [First bullet point - max 80 chars]
• [Second bullet point - max 80 chars]

📝 Improved Expense Details
• [First bullet point - max 80 chars]
• [Second bullet point - max 80 chars]

🚀 Performance & Polish
• [First bullet point - max 80 chars]
• [Second bullet point - max 80 chars]

Thank you for using FlickAI!
```

**Writing Guidelines:**
1. **Start with benefits**: Focus on what users gain, not technical details
2. **Use simple language**: Write for non-technical users
3. **Be specific but concise**: "Improved navigation" is better than "Various improvements"
4. **Use emojis appropriately**: One emoji per category
5. **Limit sections**: Maximum 4-5 main categories
6. **Limit bullets**: Maximum 2-3 bullets per category
7. **Character limits**: 
   - Header: ~30 chars ("✨ What's New in FlickAI")
   - Category header: ~20 chars ("🎨 Enhanced Design")
   - Bullet point: ~80 chars each
   - Footer: ~30 chars ("Thank you for using FlickAI!")
   - **Total target: 350-400 characters** (to stay under 500)

**If changes are mostly bug fixes:**
```markdown
✨ What's New in FlickAI

🐛 Bug Fixes & Improvements
• Fixed several issues reported by users
• Improved stability and performance

🚀 Performance & Polish
• Various UI refinements and optimizations

Thank you for using FlickAI!
```

**If no significant user-facing changes:**
Inform the user: "No significant user-facing changes found. Consider skipping this release or wait for more substantial updates."

## Step 4: Translate to All Languages

Update `release_notes.txt` with translations for all supported languages. Maintain the same structure and meaning across all languages.

**Supported Languages:**
- en-US (English - US)
- ar (Arabic)
- cs-CZ (Czech)
- da-DK (Danish)
- de-DE (German)
- es-419 (Spanish - Latin America)
- es-ES (Spanish - Spain)
- fi-FI (Finnish)
- fr-FR (French)
- hi-IN (Hindi)
- hu-HU (Hungarian)
- id (Indonesian)
- it-IT (Italian)
- iw-IL (Hebrew)
- ja-JP (Japanese)
- ko-KR (Korean)
- nl-NL (Dutch)
- no-NO (Norwegian)
- pl-PL (Polish)
- pt-BR (Portuguese - Brazil)
- ro (Romanian)
- ru-RU (Russian)
- sk (Slovak)
- sv-SE (Swedish)
- th (Thai)
- tr-TR (Turkish)
- uk (Ukrainian)
- vi (Vietnamese)
- zh-CN (Chinese - Simplified)

**Translation Guidelines:**
1. **Maintain meaning**: Keep the same user-friendly tone and meaning
2. **Respect character limits**: Translations may be longer, but stay under 500 chars per language
3. **Localize appropriately**: Use cultural references where appropriate (e.g., different date formats)
4. **Keep structure**: Same categories and emoji usage
5. **Professional quality**: Use proper grammar and natural phrasing
6. **Consistent terminology**: Use the same translation for "FlickAI" (brand name should remain)

**Format for release_notes.txt:**
```markdown
<en-US>
[English content here]
</en-US>
<ar>
[Arabic content here]
</ar>
...
[Continue for all languages]
```

**Character Count Validation:**
- After generating translations, verify each language is under 500 characters
- If a translation exceeds 500 chars, shorten bullet points while maintaining meaning
- Prioritize keeping the most important information

## Step 5: Create Git Branch

Create a new branch for the release:

```bash
# Get current version or calculate next version
CURRENT_VERSION=$(git describe --tags --abbrev=0 2>/dev/null | sed 's/v//' || echo "1.0.0")
NEXT_VERSION=$(echo $CURRENT_VERSION | awk -F. '{print $1"."$2"."($3+1)}')

# Create branch name
BRANCH_NAME="release/update-notes-v${NEXT_VERSION}"

# Create and checkout branch
git checkout -b $BRANCH_NAME
```

## Step 6: Update release_notes.txt

Update the `release_notes.txt` file with the new release notes for all languages:

1. **Read the current file** to understand the format
2. **Replace the content** with new release notes while maintaining the same structure
3. **Verify all language sections** are present and properly formatted
4. **Check character counts** for each language

## Step 7: Commit Changes

Commit the updated release notes:

```bash
git add release_notes.txt
git commit -m "docs: update release notes for v${NEXT_VERSION}

- Generated from git history since last release
- User-friendly, non-technical descriptions
- Translated to all supported languages
- Validated character limits for Play Store"
```

## Step 8: Push Branch and Create PR

Push the branch and create a GitHub PR:

```bash
# Push branch
git push -u origin $BRANCH_NAME

# Create PR using GitHub CLI
gh pr create \
  --title "Release Notes Update for v${NEXT_VERSION}" \
  --body "[PR description generated in Step 9]" \
  --base main \
  --head $BRANCH_NAME
```

## Step 9: Generate PR Description

Create a comprehensive PR description that includes:

**PR Title Format:**
```
Release Notes Update for v{X.Y.Z}
```

**PR Body Template:**
```markdown
## 📋 Summary

This PR updates the release notes based on changes since the last release tag.

**Version:** v${NEXT_VERSION}
**Last Tag:** ${LAST_TAG:-"N/A (first release)"}

## 🔍 Changes Included

${CATEGORIZED_CHANGES}

## 📝 Release Notes Generated

### English (en-US)
\`\`\`
${ENGLISH_NOTES}
\`\`\`

**Character count:** ${CHAR_COUNT}/500 ✅

### Translations Status

- ✅ All ${LANGUAGE_COUNT} languages translated
- ✅ All languages under 500 character limit
- ✅ User-friendly, non-technical descriptions

## 📊 Commit Analysis

**Total commits analyzed:** ${COMMIT_COUNT}
**Commits included:** ${USER_FACING_COUNT}
**Commits skipped (technical):** ${SKIPPED_COUNT}

**Key commits:**
${COMMIT_LIST}

## ✅ Validation

- [x] Release notes are user-friendly and non-technical
- [x] All languages translated and formatted correctly
- [x] Character limits validated for Play Store (500 chars)
- [x] Git history analyzed from last tag
- [x] Changes categorized appropriately

## 🎯 Next Steps

1. Review the release notes for accuracy
2. Adjust translations if needed
3. Merge PR when approved
4. Release will be published with these notes
```

## Step 10: Verify and Finalize

**Before completing, verify:**

1. ✅ **Git history analyzed correctly**: Check that commits are properly categorized
2. ✅ **Release notes are user-friendly**: No technical jargon, clear benefits
3. ✅ **All languages translated**: All 30 languages have updated content
4. ✅ **Character limits respected**: Each language under 500 characters
5. ✅ **PR created successfully**: GitHub PR is created and visible
6. ✅ **Branch name is appropriate**: Follows naming convention
7. ✅ **Commit message is descriptive**: Clear commit history

## Error Handling

**If no commits found:**
```
No new commits found since last release. 
Consider:
- Checking if you're on the correct branch
- Verifying the last tag exists
- Waiting for more commits before creating a release
```

**If translation fails:**
```
Failed to generate translation for language: ${LANG}
Action: Keep existing translation or skip this language
Manual intervention may be required
```

**If character limit exceeded:**
```
Warning: Translation for ${LANG} exceeds 500 characters (${COUNT} chars)
Action: Shortening bullet points while maintaining meaning
Reduced to: ${NEW_COUNT} characters
```

**If GitHub CLI fails:**
```
GitHub CLI authentication required or failed.
Action: 
1. Run: gh auth login
2. Or create PR manually via GitHub web interface
3. Use the generated PR description from this output
```

## Output Format

After completing all steps, provide:

**✅ Success Summary:**
```
✅ Release Notes Generated Successfully

Version: v${NEXT_VERSION}
Branch: ${BRANCH_NAME}
PR: ${PR_URL}

📊 Statistics:
- Commits analyzed: ${COMMIT_COUNT}
- Languages updated: ${LANGUAGE_COUNT}
- Characters per language: ~${AVG_CHARS} (max: 500)
- PR created: ${PR_URL}

🎯 Next Steps:
1. Review PR at: ${PR_URL}
2. Verify translations look correct
3. Merge when ready for release
```

**📝 Release Notes Preview (English):**
```
${ENGLISH_NOTES_PREVIEW}
```

**🔗 Links:**
- PR: ${PR_URL}
- Branch: ${BRANCH_NAME}
- Files changed: release_notes.txt
