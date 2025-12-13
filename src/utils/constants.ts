/**
 * Application Constants
 *
 * Centralized constants for consistent configuration across the application.
 * All constants are frozen to prevent accidental mutation.
 */

// ============================================================================
// Page Identifiers
// ============================================================================

/**
 * Page IDs for navigation highlighting and routing
 */
export const PAGE_IDS = Object.freeze({
  HOME: "home",
  WORK: "work",
  WRITING: "writing",
  PROFILE: "profile",
  SEARCH: "search",
  CONTACT: "contact",
} as const);

export type PageId = (typeof PAGE_IDS)[keyof typeof PAGE_IDS];

// ============================================================================
// Navigation Configuration
// ============================================================================

/**
 * Navigation link interface
 */
export interface NavigationLink {
  href: string;
  label: string;
  page: PageId;
  external?: boolean;
}

/**
 * Main navigation links
 */
export const NAVIGATION_LINKS: readonly NavigationLink[] = Object.freeze([
  { href: "/profile", label: "Profile", page: PAGE_IDS.PROFILE },
  { href: "/work", label: "Work", page: PAGE_IDS.WORK },
  { href: "/writing", label: "Writing", page: PAGE_IDS.WRITING },
]);

// ============================================================================
// Content Configuration
// ============================================================================

/**
 * Content type identifiers
 */
export const CONTENT_TYPES = Object.freeze({
  POST: "post",
  PROJECT: "project",
  PAGE: "page",
} as const);

export type ContentType = (typeof CONTENT_TYPES)[keyof typeof CONTENT_TYPES];

/**
 * Default reading speed (words per minute)
 */
export const DEFAULT_READING_SPEED = 200;

/**
 * Default excerpt length (characters)
 */
export const DEFAULT_EXCERPT_LENGTH = 160;

// ============================================================================
// Search Configuration
// ============================================================================

/**
 * Search configuration constants
 */
export const SEARCH_CONFIG = Object.freeze({
  MIN_QUERY_LENGTH: 2,
  MAX_RESULTS: 50,
  DEBOUNCE_DELAY: 300,
  HIGHLIGHT_CLASS: "search-highlight",
} as const);

// ============================================================================
// Filter Configuration
// ============================================================================

/**
 * Filter configuration constants
 */
export const FILTER_CONFIG = Object.freeze({
  URL_PARAM: "tags",
  URL_UPDATE_DELAY: 500,
  ANIMATION_DURATION: 200,
} as const);

// ============================================================================
// Media Queries
// ============================================================================

/**
 * Responsive breakpoints (matches Tailwind defaults)
 */
export const BREAKPOINTS = Object.freeze({
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const);

/**
 * Media query strings
 */
export const MEDIA_QUERIES = Object.freeze({
  SM: `(min-width: ${BREAKPOINTS.SM}px)`,
  MD: `(min-width: ${BREAKPOINTS.MD}px)`,
  LG: `(min-width: ${BREAKPOINTS.LG}px)`,
  XL: `(min-width: ${BREAKPOINTS.XL}px)`,
  "2XL": `(min-width: ${BREAKPOINTS["2XL"]}px)`,
  DARK: "(prefers-color-scheme: dark)",
  REDUCED_MOTION: "(prefers-reduced-motion: reduce)",
} as const);

// ============================================================================
// Animation Configuration
// ============================================================================

/**
 * Animation duration constants (in milliseconds)
 */
export const ANIMATION_DURATION = Object.freeze({
  FAST: 150,
  BASE: 200,
  SLOW: 300,
  VERY_SLOW: 500,
} as const);

/**
 * Animation easing functions
 */
export const EASING = Object.freeze({
  LINEAR: "linear",
  EASE: "ease",
  EASE_IN: "ease-in",
  EASE_OUT: "ease-out",
  EASE_IN_OUT: "ease-in-out",
} as const);

// ============================================================================
// SEO Configuration
// ============================================================================

/**
 * Default SEO values
 */
export const SEO_DEFAULTS = Object.freeze({
  TITLE_SEPARATOR: "—",
  OG_IMAGE: "/og-image.jpg",
  TWITTER_CARD: "summary_large_image" as const,
  LOCALE: "en_US",
} as const);

// ============================================================================
// Analytics Events
// ============================================================================

/**
 * Analytics event names
 */
export const ANALYTICS_EVENTS = Object.freeze({
  PAGE_VIEW: "page_view",
  SEARCH: "search",
  FILTER_CHANGE: "filter_change",
  SOCIAL_CLICK: "social_click",
  EXTERNAL_LINK: "external_link",
  FORM_SUBMIT: "form_submit",
} as const);

// ============================================================================
// Error Messages
// ============================================================================

/**
 * User-facing error messages
 */
export const ERROR_MESSAGES = Object.freeze({
  GENERIC: "Something went wrong. Please try again.",
  NETWORK: "Network error. Please check your connection.",
  NOT_FOUND: "The requested content could not be found.",
  SEARCH_FAILED: "Search is temporarily unavailable.",
  VALIDATION_FAILED: "Please check your input and try again.",
} as const);

// ============================================================================
// Local Storage Keys
// ============================================================================

/**
 * Local storage key prefixes
 */
export const STORAGE_KEYS = Object.freeze({
  THEME: "theme",
  FILTER_STATE: "filter-state",
  SEARCH_HISTORY: "search-history",
} as const);

// ============================================================================
// HTTP Status Codes
// ============================================================================

/**
 * Common HTTP status codes
 */
export const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const);

// ============================================================================
// Validation Rules
// ============================================================================

/**
 * Form validation constraints
 */
export const VALIDATION = Object.freeze({
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL_REGEX: /^https?:\/\/.+/,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_MESSAGE_LENGTH: 10,
  MAX_MESSAGE_LENGTH: 1000,
} as const);

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if value is a valid page ID
 */
export function isPageId(value: unknown): value is PageId {
  return Object.values(PAGE_IDS).includes(value as PageId);
}

/**
 * Check if value is a valid content type
 */
export function isContentType(value: unknown): value is ContentType {
  return Object.values(CONTENT_TYPES).includes(value as ContentType);
}
