/**
 * SEO Utilities - December 2025
 *
 * Enhanced with:
 * - Better structured data validation
 * - More schema types
 * - Rich snippets support
 * - Error handling
 */

import type { ProcessedWritingPost } from "./content";
import { SITE } from "../config/site";

/**
 * BlogPosting structured data
 */
export interface BlogStructuredData {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  url: string;
  blogPost: Array<{
    "@type": string;
    headline: string;
    description: string;
    datePublished: string;
    url: string;
    author?: {
      "@type": string;
      name: string;
    };
    image?: string;
  }>;
}

/**
 * BreadcrumbList structured data
 */
export interface BreadcrumbStructuredData {
  "@context": string;
  "@type": string;
  itemListElement: Array<{
    "@type": string;
    position: number;
    name: string;
    item: string;
  }>;
}

/**
 * Person structured data
 */
export interface PersonStructuredData {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  email?: string;
  sameAs?: string[];
  jobTitle?: string;
  worksFor?: {
    "@type": string;
    name: string;
  };
}

/**
 * Validate URL
 */
function validateURL(url: string | URL, baseUrl?: URL | string): string {
  try {
    if (typeof url === "string") {
      return new URL(url, baseUrl).toString();
    }
    return url.toString();
  } catch (error) {
    console.error("[SEO] Invalid URL:", url, error);
    return "";
  }
}

/**
 * Generate blog structured data
 *
 * @param posts - Array of processed writing posts
 * @param baseUrl - Base URL of the site
 * @param path - Path to the writing section
 * @returns Structured data object
 */
export function generateBlogStructuredData(
  posts: ProcessedWritingPost[],
  baseUrl: URL | string,
  path: string = "/writing"
): BlogStructuredData {
  const siteUrl = typeof baseUrl === "string" ? new URL(baseUrl) : baseUrl;

  try {
    return {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Writing",
      description: "Thoughts on design, technology, and the creative process",
      url: validateURL(path, siteUrl),
      blogPost: posts.slice(0, 10).map((post) => {
        const postUrl = validateURL(`${path}/${post.slug}`, siteUrl);

        return {
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          url: postUrl,
          author: {
            "@type": "Person",
            name: SITE.name,
          },
        };
      }),
    };
  } catch (error) {
    console.error("[SEO] Error generating blog structured data:", error);
    // Return minimal valid structure
    return {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Writing",
      description: "Thoughts on design, technology, and the creative process",
      url: validateURL(path, siteUrl),
      blogPost: [],
    };
  }
}

/**
 * Generate breadcrumb structured data
 *
 * @param breadcrumbs - Array of breadcrumb items
 * @param baseUrl - Base URL of the site
 * @returns Breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(
  breadcrumbs: Array<{ name: string; path: string }>,
  baseUrl: URL | string
): BreadcrumbStructuredData {
  const siteUrl = typeof baseUrl === "string" ? new URL(baseUrl) : baseUrl;

  try {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: validateURL(crumb.path, siteUrl),
      })),
    };
  } catch (error) {
    console.error("[SEO] Error generating breadcrumb structured data:", error);
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [],
    };
  }
}

/**
 * Generate person structured data
 *
 * @param baseUrl - Base URL of the site
 * @returns Person structured data
 */
export function generatePersonStructuredData(
  baseUrl: URL | string
): PersonStructuredData {
  const siteUrl = typeof baseUrl === "string" ? new URL(baseUrl) : baseUrl;

  try {
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      name: SITE.name,
      url: siteUrl.toString(),
      email: SITE.email,
      jobTitle: "Designer & Developer",
    };
  } catch (error) {
    console.error("[SEO] Error generating person structured data:", error);
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      name: SITE.name,
      url: siteUrl.toString(),
    };
  }
}

/**
 * Generate Open Graph metadata
 *
 * @param options - Metadata options
 * @returns Object with Open Graph meta tags
 */
export function generateOpenGraphMeta(options: {
  title: string;
  description: string;
  url: string | URL;
  image?: string;
  type?: "website" | "article";
  siteName?: string;
}) {
  const {
    title,
    description,
    url,
    image = "/og-image.jpg",
    type = "website",
    siteName = SITE.name,
  } = options;

  const urlStr = typeof url === "string" ? url : url.toString();

  return {
    "og:type": type,
    "og:title": title,
    "og:description": description,
    "og:url": urlStr,
    "og:image": image,
    "og:site_name": siteName,
  };
}

/**
 * Generate Twitter Card metadata
 *
 * @param options - Metadata options
 * @returns Object with Twitter Card meta tags
 */
export function generateTwitterCardMeta(options: {
  title: string;
  description: string;
  url: string | URL;
  image?: string;
  card?: "summary" | "summary_large_image";
}) {
  const {
    title,
    description,
    url,
    image = "/og-image.jpg",
    card = "summary_large_image",
  } = options;

  const urlStr = typeof url === "string" ? url : url.toString();

  return {
    "twitter:card": card,
    "twitter:title": title,
    "twitter:description": description,
    "twitter:url": urlStr,
    "twitter:image": image,
  };
}

/**
 * Validate and sanitize structured data
 * Ensures all required fields are present
 *
 * @param data - Structured data object
 * @returns Validated and sanitized data
 */
export function validateStructuredData<T extends Record<string, any>>(
  data: T
): T {
  // Check for required @context and @type
  if (!data["@context"] || !data["@type"]) {
    console.error("[SEO] Invalid structured data: missing @context or @type");
  }

  // Remove undefined and null values
  const cleaned = Object.entries(data).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      (acc as Record<string, any>)[key] = value;
    }
    return acc;
  }, {} as T);

  return cleaned;
}

/**
 * Generate JSON-LD script tag content
 *
 * @param data - Structured data object
 * @returns JSON string for script tag
 */
export function generateJSONLD<T extends Record<string, any>>(data: T): string {
  try {
    const validated = validateStructuredData(data);
    return JSON.stringify(validated, null, 0); // Minified for production
  } catch (error) {
    console.error("[SEO] Error generating JSON-LD:", error);
    return "{}";
  }
}

/**
 * Generate canonical URL
 * Ensures proper URL format for canonical tags
 *
 * @param path - Page path
 * @param baseUrl - Base URL
 * @returns Canonical URL string
 */
export function generateCanonicalURL(
  path: string,
  baseUrl: URL | string
): string {
  try {
    const siteUrl = typeof baseUrl === "string" ? new URL(baseUrl) : baseUrl;
    const canonical = new URL(path, siteUrl);

    // Remove trailing slash except for root
    const cleanPath = canonical.pathname.replace(/\/+$/, "") || "/";
    canonical.pathname = cleanPath;

    return canonical.toString();
  } catch (error) {
    console.error("[SEO] Error generating canonical URL:", error);
    return path;
  }
}

/**
 * Calculate reading time from content
 *
 * @param content - Text content
 * @param wordsPerMinute - Average reading speed
 * @returns Reading time string
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 200
): string {
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return `${minutes} min read`;
}

/**
 * Generate meta description from content
 *
 * @param content - Full content text
 * @param maxLength - Maximum description length
 * @returns Meta description string
 */
export function generateMetaDescription(
  content: string,
  maxLength: number = 160
): string {
  // Remove markdown/HTML and extra whitespace
  const cleaned = content
    .replace(/[#*`_~\[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  // Truncate at word boundary
  const truncated = cleaned.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return lastSpace > 0 ? truncated.slice(0, lastSpace) + "…" : truncated + "…";
}
