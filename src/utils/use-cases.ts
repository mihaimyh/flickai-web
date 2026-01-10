/**
 * Mapping between URL slugs and use case translation keys
 */
export const USE_CASE_SLUG_MAP: Record<string, string> = {
  'expense-tracker-for-freelancers': 'freelancers',
  'self-employed-tax-deductions': 'selfEmployedDeductions',
};

/**
 * Get use case translation key from slug
 */
export function getUseCaseKey(slug: string): string | null {
  return USE_CASE_SLUG_MAP[slug] || null;
}

/**
 * Get all valid use case slugs
 */
export function getUseCaseSlugs(): string[] {
  return Object.keys(USE_CASE_SLUG_MAP);
}

/**
 * Check if a slug is a valid use case slug
 */
export function isValidUseCaseSlug(slug: string): boolean {
  return slug in USE_CASE_SLUG_MAP;
}
