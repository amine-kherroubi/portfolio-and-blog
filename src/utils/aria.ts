/**
 * ARIA Utilities
 * 
 * Helper functions for managing ARIA attributes and accessibility.
 */

/**
 * Generate a unique ID for ARIA relationships
 * @param prefix - Prefix for the ID
 * @returns Unique ID string
 */
export function generateAriaId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Check if reduced motion is preferred
 * @returns True if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
