/**
 * Application Constants
 * 
 * Centralized constants for consistent configuration across the application.
 */

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
 * Navigation links configuration
 */
export interface NavigationLink {
  href: string;
  label: string;
  page: typeof PAGE_IDS[keyof typeof PAGE_IDS];
}

export const NAVIGATION_LINKS: NavigationLink[] = [
  { href: "/profile", label: "Profile", page: PAGE_IDS.PROFILE },
  { href: "/work", label: "Work", page: PAGE_IDS.WORK },
  { href: "/writing", label: "Writing", page: PAGE_IDS.WRITING },
] as const;
