/**
 * Search Utilities - December 2025
 *
 * Enhanced Pagefind integration with:
 * - Better error handling
 * - Type-safe search results
 * - Performance optimization
 * - Retry logic for failed searches
 */

/**
 * Pagefind metadata attributes
 */
export const SEARCH_ATTRIBUTES = {
  BODY: "data-pagefind-body",
  IGNORE: "data-pagefind-ignore",
  META: "data-pagefind-meta",
  FILTER: "data-pagefind-filter",
} as const;

/**
 * Search result metadata interface
 */
export interface SearchResultMeta {
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
  image?: string;
  [key: string]: string | string[] | undefined;
}

/**
 * Complete search result interface
 */
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
 * Pagefind search response
 */
export interface PagefindResponse {
  results: Array<{
    id: string;
    data: () => Promise<SearchResult>;
  }>;
}

/**
 * Pagefind instance interface
 */
export interface PagefindInstance {
  search: (query: string) => Promise<PagefindResponse>;
  debouncedSearch?: (
    query: string,
    options?: { debounce?: number }
  ) => Promise<PagefindResponse>;
}

/**
 * Load Pagefind with retry logic
 *
 * @param retries - Number of retry attempts
 * @param delay - Delay between retries in ms
 * @returns Pagefind instance
 */
export async function loadPagefind(
  retries: number = 3,
  delay: number = 1000
): Promise<PagefindInstance> {
  if (typeof window === "undefined") {
    throw new Error("[Search] Pagefind can only be loaded in the browser");
  }

  // Check if already loaded
  if ((window as any).pagefind) {
    return (window as any).pagefind;
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[Search] Loading Pagefind (attempt ${attempt}/${retries})`);

      // Dynamic import constructed at runtime to avoid bundler resolution
      const pagefindPath = "/pagefind/pagefind.js";
      // @ts-ignore
      const module = await import(pagefindPath);
      const pagefind = module.default || module;

      if (!pagefind || typeof pagefind.search !== "function") {
        throw new Error("Invalid Pagefind module");
      }

      // Cache for future use
      (window as any).pagefind = pagefind;

      console.log("[Search] Pagefind loaded successfully");
      return pagefind;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(
        `[Search] Failed to load Pagefind (attempt ${attempt}/${retries}):`,
        error
      );

      if (attempt < retries) {
        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(
    `[Search] Failed to load Pagefind after ${retries} attempts: ${lastError?.message}`
  );
}

/**
 * Check if Pagefind is available
 */
export function isSearchAvailable(): boolean {
  return (
    typeof window !== "undefined" && (window as any).pagefind !== undefined
  );
}

/**
 * Perform search with error handling
 *
 * @param query - Search query
 * @param options - Search options
 * @returns Search results
 */
export async function performSearch(
  query: string,
  options: {
    debounce?: number;
    maxResults?: number;
  } = {}
): Promise<SearchResult[]> {
  if (!query || typeof query !== "string") {
    console.warn("[Search] Invalid query:", query);
    return [];
  }

  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return [];
  }

  try {
    // Load Pagefind if not already loaded
    const pagefind = await loadPagefind();

    // Use debounced search if available and requested
    const searchFn =
      options.debounce && pagefind.debouncedSearch
        ? (q: string) =>
            pagefind.debouncedSearch!(q, { debounce: options.debounce })
        : pagefind.search;

    console.log(`[Search] Searching for: "${trimmedQuery}"`);
    const response = await searchFn(trimmedQuery);

    if (!response || !Array.isArray(response.results)) {
      console.error("[Search] Invalid response format:", response);
      return [];
    }

    // Limit results if specified
    const results = options.maxResults
      ? response.results.slice(0, options.maxResults)
      : response.results;

    // Load result data
    const loadedResults = await Promise.all(
      results.map(async (result) => {
        try {
          return await result.data();
        } catch (error) {
          console.error("[Search] Error loading result data:", error);
          return null;
        }
      })
    );

    // Filter out failed loads
    const validResults = loadedResults.filter(
      (result): result is SearchResult => result !== null
    );

    console.log(`[Search] Found ${validResults.length} results`);
    return validResults;
  } catch (error) {
    console.error("[Search] Search failed:", error);
    throw error;
  }
}

/**
 * Generate search URL with query parameter
 *
 * @param query - Search query
 * @param baseUrl - Base URL (defaults to current origin)
 * @returns Complete search URL
 */
export function generateSearchUrl(query: string, baseUrl?: string): string {
  const base =
    baseUrl || (typeof window !== "undefined" ? window.location.origin : "");

  try {
    const url = new URL("/search", base);
    url.searchParams.set("q", query.trim());
    return url.toString();
  } catch (error) {
    console.error("[Search] Error generating URL:", error);
    return `/search?q=${encodeURIComponent(query)}`;
  }
}

/**
 * Parse search query from URL
 *
 * @param url - URL string or URL object
 * @returns Search query or null
 */
export function parseSearchQuery(url: string | URL): string | null {
  try {
    const urlObj = typeof url === "string" ? new URL(url) : url;
    return urlObj.searchParams.get("q");
  } catch (error) {
    console.error("[Search] Error parsing URL:", error);
    return null;
  }
}

/**
 * Highlight search terms in text
 *
 * @param text - Text to highlight
 * @param query - Search query
 * @returns HTML string with highlighted terms
 */
export function highlightSearchTerms(text: string, query: string): string {
  if (!query || !text) {
    return text;
  }

  try {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

    if (terms.length === 0) {
      return text;
    }

    // Escape special regex characters
    const escapedTerms = terms.map((term) =>
      term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );

    // Create regex pattern
    const pattern = new RegExp(`(${escapedTerms.join("|")})`, "gi");

    // Replace matches
    return text.replace(pattern, "<mark>$1</mark>");
  } catch (error) {
    console.error("[Search] Error highlighting terms:", error);
    return text;
  }
}

/**
 * Format result count message
 *
 * @param count - Number of results
 * @param contentType - Type of content
 * @returns Formatted message
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
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Extract content type from URL
 *
 * @param url - URL to analyze
 * @returns Content type
 */
export function extractContentType(url: string): string {
  try {
    const match = url.match(/^\/(writing|work|profile)\//);
    return match ? match[1] : "page";
  } catch (error) {
    console.error("[Search] Error extracting content type:", error);
    return "page";
  }
}

/**
 * Search statistics tracker
 */
export class SearchStats {
  private searches: number = 0;
  private totalResults: number = 0;
  private failedSearches: number = 0;

  recordSearch(resultCount: number): void {
    this.searches++;
    this.totalResults += resultCount;
  }

  recordFailure(): void {
    this.failedSearches++;
  }

  getStats() {
    return {
      searches: this.searches,
      totalResults: this.totalResults,
      avgResults: this.searches > 0 ? this.totalResults / this.searches : 0,
      failedSearches: this.failedSearches,
      successRate:
        this.searches > 0
          ? ((this.searches - this.failedSearches) / this.searches) * 100
          : 0,
    };
  }

  reset(): void {
    this.searches = 0;
    this.totalResults = 0;
    this.failedSearches = 0;
  }
}

// Global search stats instance
export const searchStats = new SearchStats();
