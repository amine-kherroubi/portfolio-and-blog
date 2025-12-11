/**
 * Application Constants
 * 
 * Centralized constants for consistent spacing, breakpoints, and configuration
 * across the application.
 */

/**
 * Layout Constants
 */
export const LAYOUT = {
  /** Maximum content width */
  MAX_WIDTH: "1536px",
  /** Header height */
  HEADER_HEIGHT: {
    mobile: "5rem", // 80px
    desktop: "6rem", // 96px
  },
  /** Standard section padding */
  SECTION_PADDING: {
    mobile: "1.5rem", // 24px
    tablet: "2rem", // 32px
    desktop: "3rem", // 48px
  },
} as const;

/**
 * Breakpoints
 * Used for responsive design calculations
 */
export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

/**
 * Page IDs
 * Used for navigation highlighting
 */
export const PAGE_IDS = {
  HOME: "home",
  WORK: "work",
  WRITING: "writing",
  PROFILE: "profile",
} as const;

/**
 * Animation Durations
 */
export const ANIMATION = {
  FAST: "150ms",
  BASE: "200ms",
  SLOW: "300ms",
} as const;

/**
 * Z-Index Layers
 */
export const Z_INDEX = {
  BASE: 0,
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
} as const;
