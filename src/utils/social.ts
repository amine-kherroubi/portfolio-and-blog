/**
 * Social Links Utilities
 *
 * Utilities for processing and formatting social media links.
 */

import { SOCIAL } from "../config/site";

// ============================================================================
// Types
// ============================================================================

export interface SocialLink {
  href: string;
  label: string;
  icon: string;
  platform: string;
}

export type SocialPlatform = "github" | "linkedin" | "twitter" | "mastodon";

// ============================================================================
// Social Links Processing
// ============================================================================

/**
 * Get all available social links with metadata
 */
export function getSocialLinks(): SocialLink[] {
  const links: SocialLink[] = [
    {
      href: SOCIAL.github,
      label: "GitHub",
      icon: "github",
      platform: "github",
    },
    {
      href: SOCIAL.linkedin,
      label: "LinkedIn",
      icon: "linkedin",
      platform: "linkedin",
    },
  ];

  // Filter out empty links and validate URLs
  return links.filter((link) => link.href && isValidURL(link.href));
}

/**
 * Get social link by platform
 */
export function getSocialLink(platform: SocialPlatform): SocialLink | null {
  const links = getSocialLinks();
  return links.find((link) => link.platform === platform) || null;
}

/**
 * Check if a social platform is configured
 */
export function hasSocialLink(platform: SocialPlatform): boolean {
  return getSocialLink(platform) !== null;
}

// ============================================================================
// URL Utilities
// ============================================================================

/**
 * Validate URL
 */
function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract username from social URL
 */
export function extractUsername(
  url: string,
  platform: SocialPlatform
): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    switch (platform) {
      case "github":
        // GitHub: https://github.com/username
        const githubMatch = pathname.match(/^\/([^\/]+)/);
        return githubMatch ? githubMatch[1] : null;

      case "linkedin":
        // LinkedIn: https://linkedin.com/in/username
        const linkedinMatch = pathname.match(/^\/in\/([^\/]+)/);
        return linkedinMatch ? linkedinMatch[1] : null;

      case "twitter":
        // Twitter: https://twitter.com/username
        const twitterMatch = pathname.match(/^\/([^\/]+)/);
        return twitterMatch ? twitterMatch[1] : null;

      case "mastodon":
        // Mastodon: https://mastodon.social/@username
        const mastodonMatch = pathname.match(/^\/@?([^\/]+)/);
        return mastodonMatch ? mastodonMatch[1] : null;

      default:
        return null;
    }
  } catch (error) {
    console.error("[Social] Username extraction failed:", error);
    return null;
  }
}

/**
 * Generate share URL for social platform
 */
export function generateShareURL(
  platform: SocialPlatform,
  options: {
    url: string;
    title?: string;
    text?: string;
    hashtags?: string[];
  }
): string {
  const { url, text, hashtags } = options;

  try {
    switch (platform) {
      case "twitter": {
        const shareUrl = new URL("https://twitter.com/intent/tweet");
        shareUrl.searchParams.set("url", url);
        if (text) shareUrl.searchParams.set("text", text);
        if (hashtags?.length)
          shareUrl.searchParams.set("hashtags", hashtags.join(","));
        return shareUrl.toString();
      }

      case "linkedin": {
        const shareUrl = new URL(
          "https://www.linkedin.com/sharing/share-offsite/"
        );
        shareUrl.searchParams.set("url", url);
        return shareUrl.toString();
      }

      default:
        return url;
    }
  } catch (error) {
    console.error("[Social] Share URL generation failed:", error);
    return url;
  }
}

// ============================================================================
// Icon Utilities
// ============================================================================

/**
 * Get SVG icon for social platform
 */
export function getSocialIcon(platform: SocialPlatform): string {
  const icons: Record<SocialPlatform, string> = {
    github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
    twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>`,
    mastodon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z"/></svg>`,
  };

  return icons[platform] || "";
}

// ============================================================================
// Analytics
// ============================================================================

/**
 * Track social link click
 */
export function trackSocialClick(
  platform: SocialPlatform,
  label: string
): void {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "social_click", {
      platform,
      label,
      transport_type: "beacon",
    });
  }

  console.log(`[Social] Clicked: ${platform} (${label})`);
}
