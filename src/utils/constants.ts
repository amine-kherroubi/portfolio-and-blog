/**
 * Application Constants
 *
 * Type-safe constants that reference the centralized configuration system.
 * All configurable values come from config files, not hard-coded here.
 */

import type {
  PageId,
  NavigationLink,
  ContentType,
  HttpStatus,
  AnimationDuration,
  Easing,
} from "@/types/index";
import {
  NAVIGATION_CONFIG,
  CONTENT_CONFIG,
  SEARCH_CONFIG,
  DESIGN_CONFIG,
} from "@/config/site.config";

// ============================================================================
// Page Configuration
// ============================================================================

/**
 * Page identifiers - These are framework constants, not configurable
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
 * Navigation links from configuration
 */
export const NAVIGATION_LINKS =
  NAVIGATION_CONFIG.links as unknown as readonly NavigationLink[];

// ============================================================================
// Content Configuration
// ============================================================================

/**
 * Content type identifiers - Framework constants
 */
export const CONTENT_TYPES = {
  POST: "post",
  PROJECT: "project",
  PAGE: "page",
} as const satisfies Record<string, ContentType>;

/**
 * Reading speed from configuration
 */
export const DEFAULT_READING_SPEED = CONTENT_CONFIG.wordsPerMinute;

/**
 * Default excerpt length from configuration
 */
export const DEFAULT_EXCERPT_LENGTH = CONTENT_CONFIG.excerptLength;

/**
 * Maximum content lengths from configuration
 */
export const CONTENT_LIMITS = {
  TITLE_MIN: CONTENT_CONFIG.limits.titleMin,
  TITLE_MAX: CONTENT_CONFIG.limits.titleMax,
  EXCERPT_MIN: CONTENT_CONFIG.limits.excerptMin,
  EXCERPT_MAX: CONTENT_CONFIG.limits.excerptMax,
  DESCRIPTION_MIN: CONTENT_CONFIG.limits.descriptionMin,
  DESCRIPTION_MAX: CONTENT_CONFIG.limits.descriptionMax,
  MESSAGE_MIN: CONTENT_CONFIG.limits.messageMin,
  MESSAGE_MAX: CONTENT_CONFIG.limits.messageMax,
  TAG_MIN: CONTENT_CONFIG.limits.tagsMin,
  TAG_MAX: CONTENT_CONFIG.limits.tagsMax,
} as const;

// ============================================================================
// Search Configuration (from config system)
// ============================================================================

export { SEARCH_CONFIG } from "@/config/site.config";

// ============================================================================
// Filter Configuration (from config system)
// ============================================================================

export { FILTER_CONFIG } from "@/config/site.config";

// ============================================================================
// Breakpoints (from design config)
// ============================================================================

/**
 * Responsive breakpoints from design configuration
 */
export const BREAKPOINTS = {
  SM: DESIGN_CONFIG.breakpoints.sm,
  MD: DESIGN_CONFIG.breakpoints.md,
  LG: DESIGN_CONFIG.breakpoints.lg,
  XL: DESIGN_CONFIG.breakpoints.xl,
  "2XL": DESIGN_CONFIG.breakpoints["2xl"],
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
// Animation Configuration (from design config)
// ============================================================================

/**
 * Animation durations from design configuration
 */
export const ANIMATION_DURATION = {
  FAST: DESIGN_CONFIG.animation.durationFast as AnimationDuration,
  BASE: DESIGN_CONFIG.animation.durationBase as AnimationDuration,
  SLOW: DESIGN_CONFIG.animation.durationSlow as AnimationDuration,
} as const satisfies Record<string, AnimationDuration>;

/**
 * Animation easing functions - Framework constants
 */
export const EASING = {
  LINEAR: "linear",
  EASE: "ease",
  EASE_IN: "ease-in",
  EASE_OUT: "ease-out",
  EASE_IN_OUT: "ease-in-out",
} as const satisfies Record<string, Easing>;

// ============================================================================
// SEO Configuration (from site config)
// ============================================================================

import { SITE_CONFIG } from "@/config/site.config";

export const SEO_DEFAULTS = {
  TITLE_SEPARATOR: SITE_CONFIG.seo.titleSeparator,
  OG_IMAGE: SITE_CONFIG.seo.ogImage,
  TWITTER_CARD: SITE_CONFIG.seo.twitterCard,
  LOCALE: SITE_CONFIG.locale,
  MAX_TITLE_LENGTH: SITE_CONFIG.seo.maxTitleLength,
  MAX_DESCRIPTION_LENGTH: SITE_CONFIG.seo.maxDescriptionLength,
} as const;

// ============================================================================
// HTTP Configuration - Framework constants
// ============================================================================

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
// Validation Rules - Framework constants (patterns don't change)
// ============================================================================

export const VALIDATION_REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  HEX_COLOR: /^#[0-9A-Fa-f]{6}$/,
  ISO_DATE: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
  USERNAME: /^[a-zA-Z0-9_-]+$/,
} as const;

/**
 * Validation constraints from form configuration
 */
import { FORM_CONFIG } from "@/config/site.config";

export const VALIDATION_CONSTRAINTS = {
  NAME_MIN_LENGTH: FORM_CONFIG.validation.nameMin,
  NAME_MAX_LENGTH: FORM_CONFIG.validation.nameMax,
  EMAIL_MAX_LENGTH: FORM_CONFIG.validation.emailMax,
  PASSWORD_MIN_LENGTH: 8, // Security requirement, not configurable
  PASSWORD_MAX_LENGTH: 128, // Security requirement, not configurable
  MESSAGE_MIN_LENGTH: FORM_CONFIG.validation.messageMin,
  MESSAGE_MAX_LENGTH: FORM_CONFIG.validation.messageMax,
  SEARCH_MIN_LENGTH: SEARCH_CONFIG.minQueryLength,
  SEARCH_MAX_LENGTH: SEARCH_CONFIG.maxQueryLength,
} as const;

// ============================================================================
// Analytics Events - Framework constants
// ============================================================================

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
// Error Messages (from config system)
// ============================================================================

export { ERROR_MESSAGES } from "@/config/site.config";

// ============================================================================
// Storage Keys - Framework constants
// ============================================================================

export const STORAGE_KEYS = {
  THEME: "theme",
  FILTER_STATE: "filter-state",
  SEARCH_HISTORY: "search-history",
  FORM_DRAFT: "form-draft",
  CONSENT: "consent",
  PREFERENCES: "preferences",
} as const;

// ============================================================================
// Cache Configuration (from performance config)
// ============================================================================

import { PERFORMANCE_CONFIG } from "@/config/site.config";

export const CACHE_DURATION = {
  FIVE_MINUTES: 5 * 60 * 1000,
  FIFTEEN_MINUTES: 15 * 60 * 1000,
  ONE_HOUR: PERFORMANCE_CONFIG.cache.dynamicContent * 1000,
  ONE_DAY: PERFORMANCE_CONFIG.cache.searchIndex * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

// ============================================================================
// Rate Limiting (from form config)
// ============================================================================

export const RATE_LIMIT = {
  MAX_REQUESTS: FORM_CONFIG.rateLimit.maxRequests,
  WINDOW_MS: FORM_CONFIG.rateLimit.windowMs,
  FORM_SUBMIT_MAX: 3,
  FORM_SUBMIT_WINDOW: 5 * 60 * 1000,
  SEARCH_MAX: 20,
  SEARCH_WINDOW: 60 * 1000,
} as const;

// ============================================================================
// Type Guards
// ============================================================================

export function isPageId(value: unknown): value is PageId {
  return (
    typeof value === "string" &&
    Object.values(PAGE_IDS).includes(value as PageId)
  );
}

export function isContentType(value: unknown): value is ContentType {
  return (
    typeof value === "string" &&
    Object.values(CONTENT_TYPES).includes(value as ContentType)
  );
}

export function isHttpStatus(value: unknown): value is HttpStatus {
  return (
    typeof value === "number" &&
    Object.values(HTTP_STATUS).includes(value as HttpStatus)
  );
}

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

export function getNavigationLink(pageId: PageId): NavigationLink | undefined {
  return NAVIGATION_LINKS.find((link) => link.page === pageId);
}

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
