/**
 * Application Constants
 *
 * Type-safe constants with strict typing and comprehensive type guards.
 * All constants are deeply readonly and use modern TypeScript features.
 */

import type {
  PageId,
  NavigationLink,
  ContentType,
  HttpStatus,
  AnimationDuration,
  Easing,
} from "@/types/index";

// ============================================================================
// Page Configuration
// ============================================================================

/**
 * Page identifiers as const assertion for type narrowing
 */
export const PAGE_IDS = {
  HOME: "home",
  WORK: "work",
  WRITING: "writing",
  PROFILE: "profile",
  SEARCH: "search",
  CONTACT: "contact",
} as const satisfies Record<string, PageId>;

/**
 * Navigation links with strict typing
 */
export const NAVIGATION_LINKS = [
  { href: "/profile", label: "Profile", page: PAGE_IDS.PROFILE },
  { href: "/work", label: "Work", page: PAGE_IDS.WORK },
  { href: "/writing", label: "Writing", page: PAGE_IDS.WRITING },
] as const satisfies readonly NavigationLink[];

// ============================================================================
// Content Configuration
// ============================================================================

/**
 * Content type identifiers
 */
export const CONTENT_TYPES = {
  POST: "post",
  PROJECT: "project",
  PAGE: "page",
} as const satisfies Record<string, ContentType>;

/**
 * Reading speed in words per minute
 */
export const DEFAULT_READING_SPEED = 200 as const;

/**
 * Default excerpt length in characters
 */
export const DEFAULT_EXCERPT_LENGTH = 160 as const;

/**
 * Maximum content lengths
 */
export const CONTENT_LIMITS = {
  TITLE_MIN: 1,
  TITLE_MAX: 100,
  EXCERPT_MIN: 1,
  EXCERPT_MAX: 300,
  DESCRIPTION_MIN: 1,
  DESCRIPTION_MAX: 500,
  MESSAGE_MIN: 10,
  MESSAGE_MAX: 1000,
  TAG_MIN: 1,
  TAG_MAX: 10,
} as const;

// ============================================================================
// Search Configuration
// ============================================================================

/**
 * Search configuration with strict types
 */
export const SEARCH_CONFIG = {
  MIN_QUERY_LENGTH: 2,
  MAX_QUERY_LENGTH: 200,
  MAX_RESULTS: 50,
  DEBOUNCE_DELAY: 300,
  HIGHLIGHT_CLASS: "search-highlight",
  WORDS_PER_MINUTE: DEFAULT_READING_SPEED,
} as const;

// ============================================================================
// Filter Configuration
// ============================================================================

/**
 * Filter configuration with strict types
 */
export const FILTER_CONFIG = {
  URL_PARAM: "tags",
  URL_UPDATE_DELAY: 500,
  ANIMATION_DURATION: 200,
  MAX_ACTIVE_FILTERS: 5,
} as const;

// ============================================================================
// Breakpoints
// ============================================================================

/**
 * Responsive breakpoints (matches Tailwind)
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

/**
 * Media query strings
 */
export const MEDIA_QUERIES = {
  SM: `(min-width: ${BREAKPOINTS.SM}px)`,
  MD: `(min-width: ${BREAKPOINTS.MD}px)`,
  LG: `(min-width: ${BREAKPOINTS.LG}px)`,
  XL: `(min-width: ${BREAKPOINTS.XL}px)`,
  "2XL": `(min-width: ${BREAKPOINTS["2XL"]}px)`,
  DARK: "(prefers-color-scheme: dark)",
  REDUCED_MOTION: "(prefers-reduced-motion: reduce)",
  PRINT: "print",
} as const;

// ============================================================================
// Animation Configuration
// ============================================================================

/**
 * Animation durations in milliseconds
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  BASE: 200,
  SLOW: 300,
  VERY_SLOW: 500,
} as const satisfies Record<string, AnimationDuration>;

/**
 * Animation easing functions
 */
export const EASING = {
  LINEAR: "linear",
  EASE: "ease",
  EASE_IN: "ease-in",
  EASE_OUT: "ease-out",
  EASE_IN_OUT: "ease-in-out",
} as const satisfies Record<string, Easing>;

// ============================================================================
// SEO Configuration
// ============================================================================

/**
 * SEO default values
 */
export const SEO_DEFAULTS = {
  TITLE_SEPARATOR: "—",
  OG_IMAGE: "/og-image.jpg",
  TWITTER_CARD: "summary_large_image",
  LOCALE: "en_US",
  MAX_TITLE_LENGTH: 60,
  MAX_DESCRIPTION_LENGTH: 160,
} as const;

// ============================================================================
// HTTP Configuration
// ============================================================================

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const satisfies Record<string, HttpStatus>;

// ============================================================================
// Validation Rules
// ============================================================================

/**
 * Regular expressions for validation
 */
export const VALIDATION_REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  HEX_COLOR: /^#[0-9A-Fa-f]{6}$/,
  ISO_DATE: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
  USERNAME: /^[a-zA-Z0-9_-]+$/,
} as const;

/**
 * Validation constraints
 */
export const VALIDATION_CONSTRAINTS = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  MESSAGE_MIN_LENGTH: 10,
  MESSAGE_MAX_LENGTH: 1000,
  SEARCH_MIN_LENGTH: 2,
  SEARCH_MAX_LENGTH: 200,
} as const;

// ============================================================================
// Analytics Events
// ============================================================================

/**
 * Analytics event names
 */
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: "page_view",
  SEARCH: "search",
  SEARCH_SUCCESS: "search_success",
  SEARCH_FAILURE: "search_failure",
  FILTER_CHANGE: "filter_change",
  FILTER_CLEAR: "filter_clear",
  SOCIAL_CLICK: "social_click",
  EXTERNAL_LINK: "external_link",
  FORM_SUBMIT: "form_submit",
  FORM_ERROR: "form_error",
  FORM_SUCCESS: "form_success",
  SHARE_CLICK: "share_click",
  DOWNLOAD: "download",
} as const;

// ============================================================================
// Error Messages
// ============================================================================

/**
 * User-facing error messages
 */
export const ERROR_MESSAGES = {
  GENERIC: "Something went wrong. Please try again.",
  NETWORK: "Network error. Please check your connection.",
  NOT_FOUND: "The requested content could not be found.",
  SEARCH_FAILED: "Search is temporarily unavailable.",
  SEARCH_EMPTY: "Please enter a search query.",
  VALIDATION_FAILED: "Please check your input and try again.",
  FORM_SUBMIT_FAILED: "Failed to submit form. Please try again.",
  RATE_LIMIT: "Too many requests. Please try again later.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  SERVER_ERROR: "Server error. Please try again later.",
} as const;

// ============================================================================
// Storage Keys
// ============================================================================

/**
 * Local storage key prefixes
 */
export const STORAGE_KEYS = {
  THEME: "theme",
  FILTER_STATE: "filter-state",
  SEARCH_HISTORY: "search-history",
  FORM_DRAFT: "form-draft",
  CONSENT: "consent",
  PREFERENCES: "preferences",
} as const;

// ============================================================================
// Cache Configuration
// ============================================================================

/**
 * Cache durations in milliseconds
 */
export const CACHE_DURATION = {
  FIVE_MINUTES: 5 * 60 * 1000,
  FIFTEEN_MINUTES: 15 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

// ============================================================================
// Rate Limiting
// ============================================================================

/**
 * Rate limit configuration
 */
export const RATE_LIMIT = {
  MAX_REQUESTS: 5,
  WINDOW_MS: 60 * 1000, // 1 minute
  FORM_SUBMIT_MAX: 3,
  FORM_SUBMIT_WINDOW: 5 * 60 * 1000, // 5 minutes
  SEARCH_MAX: 20,
  SEARCH_WINDOW: 60 * 1000, // 1 minute
} as const;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if value is a valid page ID
 */
export function isPageId(value: unknown): value is PageId {
  return (
    typeof value === "string" &&
    Object.values(PAGE_IDS).includes(value as PageId)
  );
}

/**
 * Check if value is a valid content type
 */
export function isContentType(value: unknown): value is ContentType {
  return (
    typeof value === "string" &&
    Object.values(CONTENT_TYPES).includes(value as ContentType)
  );
}

/**
 * Check if value is a valid HTTP status
 */
export function isHttpStatus(value: unknown): value is HttpStatus {
  return (
    typeof value === "number" &&
    Object.values(HTTP_STATUS).includes(value as HttpStatus)
  );
}

/**
 * Check if value is a valid animation duration
 */
export function isAnimationDuration(
  value: unknown
): value is AnimationDuration {
  return (
    typeof value === "number" &&
    Object.values(ANIMATION_DURATION).includes(value as AnimationDuration)
  );
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get page ID by path
 */
export function getPageIdByPath(path: string): PageId | null {
  const normalized = path.toLowerCase().replace(/^\/|\/$/g, "");

  switch (normalized) {
    case "":
      return PAGE_IDS.HOME;
    case "work":
      return PAGE_IDS.WORK;
    case "writing":
      return PAGE_IDS.WRITING;
    case "profile":
      return PAGE_IDS.PROFILE;
    case "search":
      return PAGE_IDS.SEARCH;
    case "contact":
      return PAGE_IDS.CONTACT;
    default:
      return null;
  }
}

/**
 * Get navigation link by page ID
 */
export function getNavigationLink(pageId: PageId): NavigationLink | undefined {
  return NAVIGATION_LINKS.find((link) => link.page === pageId);
}

/**
 * Check if path matches page
 */
export function isCurrentPage(path: string, pageId: PageId): boolean {
  const currentPageId = getPageIdByPath(path);
  return currentPageId === pageId;
}

// ============================================================================
// Type Exports
// ============================================================================

export type {
  PageId,
  NavigationLink,
  ContentType,
  HttpStatus,
  AnimationDuration,
  Easing,
};
