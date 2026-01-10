/**
 * Mapping between URL slugs and alternative translation keys
 */
export const ALTERNATIVE_SLUG_MAP: Record<string, string> = {
  'best-expense-tracker-apps': 'bestExpenseTrackers',
  'best-receipt-scanner-apps': 'bestReceiptScanners',
  'expensify-alternatives': 'expensify',
  'zoho-expense-alternatives': 'zoho',
};

/**
 * Get alternative translation key from slug
 */
export function getAlternativeKey(slug: string): string | null {
  return ALTERNATIVE_SLUG_MAP[slug] || null;
}

/**
 * Get all valid alternative slugs
 */
export function getAlternativeSlugs(): string[] {
  return Object.keys(ALTERNATIVE_SLUG_MAP);
}

/**
 * Check if a slug is a valid alternative slug
 */
export function isValidAlternativeSlug(slug: string): boolean {
  return slug in ALTERNATIVE_SLUG_MAP;
}
