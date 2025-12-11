/**
 * Formatting Utilities
 * 
 * Helper functions for formatting dates, times, and other data.
 */

/**
 * Get the current year as a string
 * 
 * Utility function for generating dynamic copyright years and other
 * year-based content that should always reflect the current year.
 * 
 * @returns Current year as a string (e.g., "2024")
 */
export function getCurrentYear(): string {
  return new Date().getFullYear().toString();
}
