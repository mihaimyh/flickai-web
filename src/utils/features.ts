/**
 * Mapping between URL slugs and feature translation keys
 */
export const FEATURE_SLUG_MAP: Record<string, string> = {
  'receipt-scanning': 'scanning',
  'analytics': 'analytics',
  'security': 'security',
  'offline-expense-tracker': 'offlineTracker',
  'ai-financial-assistant': 'aiAssistant',
  'on-device-ai-expense-tracker': 'onDeviceAI',
  'privacy-first-expense-tracker': 'privacyFirst',
  'receipt-to-excel': 'receiptToExcel',
  'scan-receipts-for-taxes': 'taxReceipts',
};

/**
 * Get feature translation key from slug
 */
export function getFeatureKey(slug: string): string | null {
  return FEATURE_SLUG_MAP[slug] || null;
}

/**
 * Get all valid feature slugs
 */
export function getFeatureSlugs(): string[] {
  return Object.keys(FEATURE_SLUG_MAP);
}

/**
 * Check if a slug is a valid feature slug
 */
export function isValidFeatureSlug(slug: string): boolean {
  return slug in FEATURE_SLUG_MAP;
}
