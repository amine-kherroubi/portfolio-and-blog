/**
 * Search Utilities
 *
 * Helper functions and types for working with Pagefind search.
 * Provides utilities for marking content as searchable and managing
 * search-related metadata.
 */

/**
 * Pagefind metadata attributes
 * Use these to control how content is indexed
 */
export const SEARCH_ATTRIBUTES = {
  /** Mark element as main searchable content */
  BODY: "data-pagefind-body",

  /** Exclude element from search index */
  IGNORE: "data-pagefind-ignore",

  /** Add custom metadata to page */
  META: "data-pagefind-meta",

  /** Add custom filter values */
  FILTER: "data-pagefind-filter",
} as const;

/**
 * Search result type definitions
 * Useful for TypeScript projects working with Pagefind results
 */
export interface SearchResultMeta {
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
  image?: string;
  [key: string]: string | string[] | undefined;
}

export interface SearchResult {
  id: string;
  url: string;
  excerpt: string;
  meta: SearchResultMeta;
  content: string;
  word_count: number;
  filters: Record<string, string[]>;
  sub_results: Array<{
    title: string;
    url: string;
    excerpt: string;
  }>;
}

/**
 * Generate search URL with query
 *
 * Creates a properly formatted search URL with the given query.
 * Useful for creating search links programmatically.
 *
 * @param query - Search query string
 * @param baseUrl - Base URL (defaults to current origin)
 * @returns Full search URL with query parameter
 *
 * @example
 * ```ts
 * const url = generateSearchUrl("design patterns");
 * // Returns: "https://example.com/search?q=design+patterns"
 * ```
 */
export function generateSearchUrl(query: string, baseUrl?: string): string {
  const base =
    baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
  const url = new URL("/search", base);
  url.searchParams.set("q", query.trim());
  return url.toString();
}

/**
 * Parse search query from URL
 *
 * Extracts the search query from a URL's query parameters.
 *
 * @param url - URL string or URL object
 * @returns Search query or null if not found
 *
 * @example
 * ```ts
 * const query = parseSearchQuery("https://example.com/search?q=design");
 * // Returns: "design"
 * ```
 */
export function parseSearchQuery(url: string | URL): string | null {
  const urlObj = typeof url === "string" ? new URL(url) : url;
  return urlObj.searchParams.get("q");
}

/**
 * Highlight search terms in text
 *
 * Wraps search terms in HTML mark tags for highlighting.
 * Useful for custom search result rendering.
 *
 * @param text - Text to highlight
 * @param query - Search query
 * @returns HTML string with highlighted terms
 *
 * @example
 * ```ts
 * const highlighted = highlightSearchTerms(
 *   "This is a design pattern",
 *   "design"
 * );
 * // Returns: "This is a <mark>design</mark> pattern"
 * ```
 */
export function highlightSearchTerms(text: string, query: string): string {
  if (!query.trim()) return text;

  // Split query into terms
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  // Escape special regex characters
  const escapedTerms = terms.map((term) =>
    term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );

  // Create regex pattern
  const pattern = new RegExp(`(${escapedTerms.join("|")})`, "gi");

  // Replace matches with marked version
  return text.replace(pattern, "<mark>$1</mark>");
}

/**
 * Format search result count
 *
 * Generates a human-readable string for search result counts.
 *
 * @param count - Number of results
 * @param contentType - Type of content (e.g., "result", "post", "project")
 * @returns Formatted count string
 *
 * @example
 * ```ts
 * formatResultCount(5, "post");
 * // Returns: "5 posts"
 *
 * formatResultCount(1, "result");
 * // Returns: "1 result"
 * ```
 */
export function formatResultCount(
  count: number,
  contentType: string = "result"
): string {
  if (count === 0) {
    return `No ${contentType}s found`;
  }

  const plural = count === 1 ? contentType : `${contentType}s`;
  return `${count} ${plural}`;
}

/**
 * Debounce function for search input
 *
 * Creates a debounced version of a function that delays execution
 * until after a specified time has elapsed since the last call.
 *
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 *
 * @example
 * ```ts
 * const debouncedSearch = debounce((query) => {
 *   performSearch(query);
 * }, 300);
 *
 * // Call multiple times rapidly
 * debouncedSearch("des");
 * debouncedSearch("desi");
 * debouncedSearch("design");
 * // Only executes once after 300ms
 * ```
 */
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * Extract content type from URL
 *
 * Determines the content type (writing, work, etc.) from a URL.
 * Useful for categorizing search results.
 *
 * @param url - URL to analyze
 * @returns Content type string
 *
 * @example
 * ```ts
 * extractContentType("/writing/my-post");
 * // Returns: "writing"
 *
 * extractContentType("/work/my-project");
 * // Returns: "work"
 * ```
 */
export function extractContentType(url: string): string {
  const match = url.match(/^\/(writing|work|profile)\//);
  return match ? match[1] : "page";
}

/**
 * Check if Pagefind is available
 *
 * Utility function to check if Pagefind has been loaded.
 * Useful for conditional rendering or feature detection.
 *
 * @returns true if Pagefind is available, false otherwise
 */
export function isSearchAvailable(): boolean {
  return typeof window !== "undefined" && "pagefind" in window;
}

/**
 * Load Pagefind dynamically
 *
 * Loads the Pagefind library if it hasn't been loaded yet.
 * Returns a promise that resolves when Pagefind is ready.
 *
 * @returns Promise that resolves to the Pagefind instance
 *
 * @example
 * ```ts
 * const pagefind = await loadPagefind();
 * const results = await pagefind.search("design");
 * ```
 */
export async function loadPagefind(): Promise<any> {
  if (typeof window === "undefined") {
    throw new Error("Pagefind can only be loaded in the browser");
  }

  if ("pagefind" in window) {
    return (window as any).pagefind;
  }

  try {
    // @ts-ignore
    const pagefind = await import("/pagefind/pagefind.js");
    (window as any).pagefind = pagefind;
    return pagefind;
  } catch (error) {
    console.error("Failed to load Pagefind:", error);
    throw error;
  }
}
