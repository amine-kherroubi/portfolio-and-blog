/**
 * SEO Utilities
 *
 * Provides structured data generation and metadata utilities for SEO optimization.
 * Implements schema.org types with validation and error handling.
 */

import type { WritingPost } from "@/utils/content";
import { SITE } from "@/config/site.config";

// ============================================================================
// Types
// ============================================================================

interface BaseStructuredData {
  "@context": string;
  "@type": string;
}

export interface BlogPostSchema extends BaseStructuredData {
  "@type": "BlogPosting";
  headline: string;
  description: string;
  datePublished: string;
  url: string;
  author: {
    "@type": "Person";
    name: string;
  };
  image?: string;
}

export interface BlogStructuredData extends BaseStructuredData {
  "@type": "Blog";
  name: string;
  description: string;
  url: string;
  blogPost: BlogPostSchema[];
}

export interface BreadcrumbItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
}

export interface BreadcrumbStructuredData extends BaseStructuredData {
  "@type": "BreadcrumbList";
  itemListElement: BreadcrumbItem[];
}

export interface PersonStructuredData extends BaseStructuredData {
  "@type": "Person";
  name: string;
  url: string;
  email?: string;
  sameAs?: string[];
  jobTitle?: string;
  worksFor?: {
    "@type": "Organization";
    name: string;
  };
}

export interface OpenGraphMeta {
  "og:type": string;
  "og:title": string;
  "og:description": string;
  "og:url": string;
  "og:image": string;
  "og:site_name": string;
}

export interface TwitterCardMeta {
  "twitter:card": string;
  "twitter:title": string;
  "twitter:description": string;
  "twitter:url": string;
  "twitter:image": string;
}

// ============================================================================
// URL Utilities
// ============================================================================

/**
 * Safely create and validate URL
 */
function createURL(path: string, base?: string | URL): URL | null {
  try {
    return new URL(path, base);
  } catch (error) {
    console.error("[SEO] Invalid URL:", { path, base, error });
    return null;
  }
}

/**
 * Validate and format URL string
 */
function validateURL(url: string | URL, baseUrl?: string | URL): string {
  try {
    if (typeof url === "string") {
      const urlObj = createURL(url, baseUrl);
      return urlObj?.toString() || url;
    }
    return url.toString();
  } catch (error) {
    console.error("[SEO] URL validation failed:", error);
    return String(url);
  }
}

/**
 * Generate canonical URL with proper formatting
 */
export function generateCanonicalURL(
  path: string,
  baseUrl: string | URL
): string {
  try {
    const url = createURL(path, baseUrl);
    if (!url) return path;

    // Remove trailing slash except for root
    url.pathname = url.pathname.replace(/\/+$/, "") || "/";
    return url.toString();
  } catch (error) {
    console.error("[SEO] Canonical URL generation failed:", error);
    return path;
  }
}

// ============================================================================
// Structured Data Generation
// ============================================================================

/**
 * Generate blog structured data
 */
export function generateBlogStructuredData(
  posts: readonly WritingPost[],
  baseUrl: string | URL | undefined,
  path = "/writing"
): BlogStructuredData {
  try {
    const siteUrl = createURL(String(baseUrl), undefined);
    if (!siteUrl) {
      throw new Error("Invalid base URL");
    }

    const blogPosts: BlogPostSchema[] = posts.slice(0, 10).map((post) => {
      const postUrl = validateURL(`${path}/${post.slug}`, siteUrl);

      return {
        "@context": "https://schema.org",
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
    });

    return {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Writing",
      description: "Thoughts on design, technology, and the creative process",
      url: validateURL(path, siteUrl),
      blogPost: blogPosts,
    };
  } catch (error) {
    console.error("[SEO] Blog structured data generation failed:", error);

    // Return minimal valid structure
    return {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Writing",
      description: "Thoughts on design, technology, and the creative process",
      url: path,
      blogPost: [],
    };
  }
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(
  breadcrumbs: Array<{ name: string; path: string }>,
  baseUrl: string | URL
): BreadcrumbStructuredData {
  try {
    const siteUrl = createURL(String(baseUrl), undefined);
    if (!siteUrl) {
      throw new Error("Invalid base URL");
    }

    const items: BreadcrumbItem[] = breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: validateURL(crumb.path, siteUrl),
    }));

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items,
    };
  } catch (error) {
    console.error("[SEO] Breadcrumb structured data generation failed:", error);
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [],
    };
  }
}

/**
 * Generate person structured data
 */
export function generatePersonStructuredData(
  baseUrl: string | URL
): PersonStructuredData {
  try {
    const siteUrl = createURL(String(baseUrl), undefined);
    const url = siteUrl?.toString() || String(baseUrl);

    return {
      "@context": "https://schema.org",
      "@type": "Person",
      name: SITE.name,
      url,
      email: SITE.email,
      jobTitle: "Designer & Developer",
    };
  } catch (error) {
    console.error("[SEO] Person structured data generation failed:", error);
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      name: SITE.name,
      url: String(baseUrl),
    };
  }
}

// ============================================================================
// Meta Tag Generation
// ============================================================================

/**
 * Generate Open Graph metadata
 */
export function generateOpenGraphMeta(options: {
  title: string;
  description: string;
  url: string | URL;
  image?: string;
  type?: "website" | "article";
  siteName?: string;
}): OpenGraphMeta {
  const {
    title,
    description,
    url,
    image = "/og-image.jpg",
    type = "website",
    siteName = SITE.name,
  } = options;

  return {
    "og:type": type,
    "og:title": title,
    "og:description": description,
    "og:url": validateURL(url, undefined),
    "og:image": image,
    "og:site_name": siteName,
  };
}

/**
 * Generate Twitter Card metadata
 */
export function generateTwitterCardMeta(options: {
  title: string;
  description: string;
  url: string | URL;
  image?: string;
  card?: "summary" | "summary_large_image";
}): TwitterCardMeta {
  const {
    title,
    description,
    url,
    image = "/og-image.jpg",
    card = "summary_large_image",
  } = options;

  return {
    "twitter:card": card,
    "twitter:title": title,
    "twitter:description": description,
    "twitter:url": validateURL(url, undefined),
    "twitter:image": image,
  };
}

// ============================================================================
// Data Validation
// ============================================================================

/**
 * Validate structured data
 */
export function validateStructuredData<T extends BaseStructuredData>(
  data: T
): T {
  if (!data["@context"] || !data["@type"]) {
    console.error("[SEO] Invalid structured data: missing @context or @type");
  }

  // Remove undefined/null values
  return Object.entries(data).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as T);
}

/**
 * Generate JSON-LD script content
 */
export function generateJSONLD<T extends BaseStructuredData>(data: T): string {
  try {
    const validated = validateStructuredData(data);
    return JSON.stringify(validated, null, 0); // Minified
  } catch (error) {
    console.error("[SEO] JSON-LD generation failed:", error);
    return "{}";
  }
}

// ============================================================================
// Content Utilities
// ============================================================================

/**
 * Calculate reading time
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute = 200
): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * Generate meta description from content
 */
export function generateMetaDescription(
  content: string,
  maxLength = 160
): string {
  const cleaned = content
    .replace(/[#*`_~\[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  const truncated = cleaned.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "…";
}
