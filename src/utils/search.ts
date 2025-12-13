/**
 * Search Utilities
 *
 * Pagefind integration utilities with type safety and error handling.
 * Provides search functionality with retry logic and performance optimization.
 */

// ============================================================================
// Constants
// ============================================================================

export const SEARCH_ATTRIBUTES = {
  BODY: "data-pagefind-body",
  IGNORE: "data-pagefind-ignore",
  META: "data-pagefind-meta",
  FILTER: "data-pagefind-filter",
} as const;

const DEFAULT_RETRY_ATTEMPTS = 3;
const DEFAULT_RETRY_DELAY = 1000;
const DEFAULT_WORDS_PER_MINUTE = 200;

// ============================================================================
// Types
// ============================================================================

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

export interface PagefindResponse {
  results: Array<{
    id: string;
    data: () => Promise<SearchResult>;
  }>;
}

export interface PagefindInstance {
  search: (query: string) => Promise<PagefindResponse>;
  debouncedSearch?: (
    query: string,
    options?: { debounce?: number }
  ) => Promise<PagefindResponse>;
}

export interface SearchOptions {
  debounce?: number;
  maxResults?: number;
  retries?: number;
  retryDelay?: number;
}

// ============================================================================
// Pagefind Loading
// ============================================================================

let pagefindInstance: PagefindInstance | null = null;

/**
 * Check if running in browser
 */
function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * Load Pagefind with retry logic
 */
export async function loadPagefind(
  retries = DEFAULT_RETRY_ATTEMPTS,
  delay = DEFAULT_RETRY_DELAY
): Promise<PagefindInstance> {
  if (!isBrowser()) {
    throw new Error("[Search] Pagefind requires browser environment");
  }

  // Return cached instance
  if (pagefindInstance) {
    return pagefindInstance;
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[Search] Loading Pagefind (attempt ${attempt}/${retries})`);

      // Dynamic import to avoid bundler resolution
      const pagefindPath = "/pagefind/pagefind.js";
      const module = await import(/* @vite-ignore */ pagefindPath);
      const pagefind = module.default || module;

      // Validate module
      if (!pagefind || typeof pagefind.search !== "function") {
        throw new Error("Invalid Pagefind module");
      }

      // Cache instance
      pagefindInstance = pagefind;
      console.log("[Search] Pagefind loaded successfully");

      return pagefind;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(
        `[Search] Load attempt ${attempt}/${retries} failed:`,
        error
      );

      if (attempt < retries) {
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
  return pagefindInstance !== null;
}

/**
 * Reset Pagefind instance (useful for testing)
 */
export function resetPagefind(): void {
  pagefindInstance = null;
}

// ============================================================================
// Search Operations
// ============================================================================

/**
 * Validate search query
 */
function validateQuery(query: unknown): string | null {
  if (typeof query !== "string") return null;
  const trimmed = query.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Perform search with error handling
 */
export async function performSearch(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResult[]> {
  const validQuery = validateQuery(query);
  if (!validQuery) {
    return [];
  }

  try {
    // Load Pagefind
    const pagefind = await loadPagefind(options.retries, options.retryDelay);

    // Choose search method
    const searchFn =
      options.debounce && pagefind.debouncedSearch
        ? (q: string) =>
            pagefind.debouncedSearch!(q, { debounce: options.debounce })
        : pagefind.search;

    console.log(`[Search] Searching: "${validQuery}"`);
    const response = await searchFn(validQuery);

    // Validate response
    if (!response?.results || !Array.isArray(response.results)) {
      console.error("[Search] Invalid response format");
      return [];
    }

    // Limit results
    const results = options.maxResults
      ? response.results.slice(0, options.maxResults)
      : response.results;

    // Load result data
    const loadedResults = await Promise.allSettled(
      results.map((result) => result.data())
    );

    // Extract successful results
    const validResults = loadedResults
      .filter(
        (result): result is PromiseFulfilledResult<SearchResult> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value);

    // Log failed results
    const failedCount = loadedResults.length - validResults.length;
    if (failedCount > 0) {
      console.warn(`[Search] ${failedCount} results failed to load`);
    }

    console.log(`[Search] Found ${validResults.length} results`);
    return validResults;
  } catch (error) {
    console.error("[Search] Search failed:", error);
    throw error;
  }
}

// ============================================================================
// URL Utilities
// ============================================================================

/**
 * Generate search URL
 */
export function generateSearchUrl(query: string, baseUrl?: string): string {
  const validQuery = validateQuery(query);
  if (!validQuery) return "/search";

  const base = baseUrl || (isBrowser() ? window.location.origin : "");

  try {
    const url = new URL("/search", base);
    url.searchParams.set("q", validQuery);
    return url.toString();
  } catch (error) {
    console.error("[Search] URL generation failed:", error);
    return `/search?q=${encodeURIComponent(validQuery)}`;
  }
}

/**
 * Parse search query from URL
 */
export function parseSearchQuery(url: string | URL): string | null {
  try {
    const urlObj = typeof url === "string" ? new URL(url) : url;
    return validateQuery(urlObj.searchParams.get("q"));
  } catch (error) {
    console.error("[Search] URL parsing failed:", error);
    return null;
  }
}

// ============================================================================
// Text Processing
// ============================================================================

/**
 * Highlight search terms in text
 */
export function highlightSearchTerms(text: string, query: string): string {
  const validQuery = validateQuery(query);
  if (!validQuery || !text) return text;

  try {
    const terms = validQuery.toLowerCase().split(/\s+/).filter(Boolean);

    if (terms.length === 0) return text;

    // Escape special regex characters
    const escapedTerms = terms.map((term) =>
      term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );

    const pattern = new RegExp(`(${escapedTerms.join("|")})`, "gi");
    return text.replace(pattern, "<mark>$1</mark>");
  } catch (error) {
    console.error("[Search] Highlighting failed:", error);
    return text;
  }
}

/**
 * Format result count message
 */
export function formatResultCount(
  count: number,
  contentType = "result"
): string {
  if (count === 0) return `No ${contentType}s found`;
  const plural = count === 1 ? contentType : `${contentType}s`;
  return `${count} ${plural}`;
}

/**
 * Extract content type from URL
 */
export function extractContentType(url: string): string {
  try {
    const match = url.match(/^\/(writing|work|profile)\//);
    return match ? match[1] : "page";
  } catch (error) {
    console.error("[Search] Content type extraction failed:", error);
    return "page";
  }
}

/**
 * Calculate reading time
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute = DEFAULT_WORDS_PER_MINUTE
): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

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

// ============================================================================
// Statistics Tracker
// ============================================================================

export class SearchStats {
  private searches = 0;
  private totalResults = 0;
  private failedSearches = 0;

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

// Global instance
export const searchStats = new SearchStats();
