/**
 * Social Links Utilities
 * 
 * Utilities for processing and formatting social media links.
 * Separated from page files to maintain separation of concerns.
 */

import { SOCIAL } from "../config/site";

export interface SocialLink {
  href: string;
  label: string;
  icon: string;
}

/**
 * Get all available social links with their metadata
 * 
 * Returns an array of social media links with their display information.
 * Automatically filters out empty or invalid links.
 * 
 * @returns Array of social link objects with href, label, and icon
 */
export function getSocialLinks(): SocialLink[] {
  return [
    { href: SOCIAL.github, label: "GitHub", icon: "github" },
    { href: SOCIAL.linkedin, label: "LinkedIn", icon: "linkedin" },
  ].filter((link) => link.href); // Remove any links without a valid href
}
