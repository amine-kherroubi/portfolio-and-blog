/**
 * Formatting Utilities
 *
 * Helper functions for formatting dates, times, numbers, and text.
 */

// ============================================================================
// Date & Time Formatting
// ============================================================================

/**
 * Get the current year as a string
 */
export function getCurrentYear(): string {
  return new Date().getFullYear().toString();
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
export function formatDateISO(date: Date | string): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date");
    }

    const isoString = dateObj.toISOString().split("T")[0];
    return isoString ?? "";
  } catch (error) {
    console.error("[Format] Date formatting failed:", error);
    return "";
  }
}

/**
 * Format date to readable string (e.g., "January 15, 2024")
 */
export function formatDateLong(date: Date | string, locale = "en-US"): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date");
    }

    return dateObj.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("[Format] Date formatting failed:", error);
    return "";
  }
}

/**
 * Format date to short string (e.g., "Jan 15, 2024")
 */
export function formatDateShort(date: Date | string, locale = "en-US"): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date");
    }

    return dateObj.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("[Format] Date formatting failed:", error);
    return "";
  }
}

/**
 * Get relative time string (e.g., "2 days ago")
 */
export function getRelativeTime(date: Date | string): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date");
    }

    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSeconds < 60) return "just now";
    if (diffMinutes < 60)
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffMonths < 12)
      return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
    return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
  } catch (error) {
    console.error("[Format] Relative time calculation failed:", error);
    return "";
  }
}

// ============================================================================
// Number Formatting
// ============================================================================

/**
 * Format number with thousands separator
 */
export function formatNumber(num: number, locale = "en-US"): string {
  try {
    return new Intl.NumberFormat(locale).format(num);
  } catch (error) {
    console.error("[Format] Number formatting failed:", error);
    return String(num);
  }
}

/**
 * Format number as percentage
 */
export function formatPercentage(
  num: number,
  decimals = 0,
  locale = "en-US"
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "percent",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  } catch (error) {
    console.error("[Format] Percentage formatting failed:", error);
    return `${(num * 100).toFixed(decimals)}%`;
  }
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// ============================================================================
// Text Formatting
// ============================================================================

/**
 * Truncate text to specified length
 */
export function truncateText(
  text: string,
  maxLength: number,
  ellipsis = "…"
): string {
  if (!text || text.length <= maxLength) {
    return text;
  }

  // Try to truncate at word boundary
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + ellipsis;
}

/**
 * Convert string to title case
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Convert string to slug (URL-friendly)
 */
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Pluralize word based on count
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string
): string {
  if (count === 1) {
    return singular;
  }
  return plural || `${singular}s`;
}

/**
 * Format reading time
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return "Less than a minute";
  if (minutes === 1) return "1 minute";
  return `${minutes} minutes`;
}

// ============================================================================
// List Formatting
// ============================================================================

/**
 * Join array with commas and "and"
 */
export function formatList(items: string[], locale = "en-US"): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;

  try {
    return new Intl.ListFormat(locale, {
      style: "long",
      type: "conjunction",
    }).format(items);
  } catch (error) {
    console.error("[Format] List formatting failed:", error);
    const last = items[items.length - 1];
    const rest = items.slice(0, -1).join(", ");
    return `${rest}, and ${last}`;
  }
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Check if string is valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if string is valid URL
 */
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
