/**
 * Formatting Utilities
 * 
 * Helper functions for formatting dates, times, and other data.
 */

/**
 * Format a date string to a readable format
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string (e.g., "January 1, 2024")
 */
export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Format a date to a short format
 * @param dateString - ISO date string or Date object
 * @returns Short date string (e.g., "Jan 1, 2024")
 */
export function formatDateShort(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Get relative time string (e.g., "2 days ago")
 * @param dateString - ISO date string or Date object
 * @returns Relative time string
 */
export function getRelativeTime(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };
  
  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
    }
  }
  
  return "just now";
}

/**
 * Get the current year as a string
 * @returns Current year (e.g., "2024")
 */
export function getCurrentYear(): string {
  return new Date().getFullYear().toString();
}
