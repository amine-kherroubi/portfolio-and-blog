/**
 * SEO Utilities
 * 
 * Utilities for generating structured data and SEO metadata.
 * Separated from page files to maintain separation of concerns.
 */

import type { ProcessedWritingPost } from "./content";

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
  }>;
}

/**
 * Generate structured data for a blog/writing index page
 */
export function generateBlogStructuredData(
  posts: ProcessedWritingPost[],
  baseUrl: URL | string,
  path: string = "/writing"
): BlogStructuredData {
  const siteUrl = typeof baseUrl === "string" ? new URL(baseUrl) : baseUrl;
  
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Writing",
    description: "Thoughts on design, technology, and the creative process",
    url: new URL(path, siteUrl).toString(),
    blogPost: posts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      url: new URL(`${path}/${post.slug}`, siteUrl).toString(),
    })),
  };
}
