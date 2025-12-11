/**
 * Formatting Utilities
 * 
 * Helper functions for formatting dates, times, and other data.
 */

/**
 * Get the current year as a string
 * @returns Current year (e.g., "2024")
 */
export function getCurrentYear(): string {
  return new Date().getFullYear().toString();
}
