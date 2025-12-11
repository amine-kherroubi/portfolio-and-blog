/**
 * Accessibility Utilities
 * 
 * Helper functions for improving accessibility and ARIA attributes.
 */

/**
 * Generates a unique ID for ARIA attributes
 * 
 * @param prefix - Prefix for the ID
 * @returns Unique ID string
 */
export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Determines if an element should have aria-current="page"
 * 
 * @param isActive - Whether the element is currently active
 * @returns "page" if active, undefined otherwise
 */
export function getAriaCurrent(isActive: boolean): "page" | undefined {
  return isActive ? "page" : undefined;
}

/**
 * Gets appropriate aria-label for navigation links
 * 
 * @param label - Link label
 * @param isCurrentPage - Whether this is the current page
 * @returns Appropriate aria-label
 */
export function getNavAriaLabel(label: string, isCurrentPage: boolean): string {
  return isCurrentPage ? `Current page: ${label}` : `Go to ${label} page`;
}
