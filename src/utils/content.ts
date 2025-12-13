/**
 * Content Processing Utilities
 *
 * Transforms and validates content collection entries with robust error handling.
 * Provides type-safe content processing for writing posts and work projects.
 */

import type { CollectionEntry } from "astro:content";
import { getTagsByIds, TAGS, type TagId, type Tag } from "../config/tags";

// ============================================================================
// Types
// ============================================================================

export interface ProcessedWritingPost {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  slug: string;
  tags: TagId[];
  dateObj: Date;
}

export interface ProcessedWorkProject {
  title: string;
  description: string;
  year: string;
  tags: TagId[];
  link: string;
}

export interface ContentStats {
  posts: {
    total: number;
    tags: number;
    dateRange: { oldest: string; newest: string } | null;
  };
  projects: {
    total: number;
    tags: number;
    yearRange: { oldest: string; newest: string } | null;
  };
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Safely parse date string with fallback
 */
function parseDate(dateStr: string, fallback: Date = new Date()): Date {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.warn(`[Content] Invalid date: "${dateStr}"`);
      return fallback;
    }
    return date;
  } catch (error) {
    console.error(`[Content] Date parsing error:`, error);
    return fallback;
  }
}

/**
 * Validate and filter tag IDs
 */
function validateTags(tags: unknown): TagId[] {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags.filter((tag): tag is TagId => {
    if (typeof tag !== "string") return false;
    const isValid = tag in TAGS;
    if (!isValid && tag) {
      console.warn(`[Content] Unknown tag: "${tag}"`);
    }
    return isValid;
  });
}

/**
 * Validate year string
 */
function validateYear(year: unknown): string {
  const yearStr = String(year);
  const parsed = parseInt(yearStr, 10);
  const currentYear = new Date().getFullYear();

  if (isNaN(parsed) || parsed < 1900 || parsed > currentYear + 10) {
    console.warn(`[Content] Invalid year: "${yearStr}"`);
    return currentYear.toString();
  }

  return yearStr;
}

/**
 * Safe string trim
 */
function safeTrim(value: unknown): string {
  return String(value ?? "").trim();
}

// ============================================================================
// Content Processing
// ============================================================================

/**
 * Process writing posts with validation
 */
export function processWritingPosts(
  posts: CollectionEntry<"writing">[]
): ProcessedWritingPost[] {
  if (!Array.isArray(posts)) {
    console.error("[Content] Invalid posts array");
    return [];
  }

  const processed = posts
    .map((post, index) => {
      try {
        if (!post?.id || !post?.data) {
          console.error(`[Content] Invalid post at index ${index}`);
          return null;
        }

        const { id, data } = post;
        const { title, excerpt, date, readTime, tags } = data;

        // Validate required fields
        if (!title || !excerpt || !date || !readTime) {
          console.error(`[Content] Missing fields in post "${id}"`);
          return null;
        }

        return {
          title: safeTrim(title),
          excerpt: safeTrim(excerpt),
          date: safeTrim(date),
          readTime: safeTrim(readTime),
          slug: id,
          tags: validateTags(tags),
          dateObj: parseDate(safeTrim(date)),
        };
      } catch (error) {
        console.error(`[Content] Processing error at index ${index}:`, error);
        return null;
      }
    })
    .filter((post): post is ProcessedWritingPost => post !== null)
    .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

  if (processed.length < posts.length) {
    const failed = posts.length - processed.length;
    console.warn(`[Content] ${failed}/${posts.length} posts failed validation`);
  }

  return processed;
}

/**
 * Process work projects with validation
 */
export function processWorkProjects(
  projects: CollectionEntry<"work">[]
): ProcessedWorkProject[] {
  if (!Array.isArray(projects)) {
    console.error("[Content] Invalid projects array");
    return [];
  }

  const processed = projects
    .map((project, index) => {
      try {
        if (!project?.id || !project?.data) {
          console.error(`[Content] Invalid project at index ${index}`);
          return null;
        }

        const { id, data } = project;
        const { title, description, year, tags } = data;

        // Validate required fields
        if (!title || !description || !year) {
          console.error(`[Content] Missing fields in project "${id}"`);
          return null;
        }

        return {
          title: safeTrim(title),
          description: safeTrim(description),
          year: validateYear(year),
          tags: validateTags(tags),
          link: `/work/${id}`,
        };
      } catch (error) {
        console.error(`[Content] Processing error at index ${index}:`, error);
        return null;
      }
    })
    .filter((project): project is ProcessedWorkProject => project !== null)
    .sort((a, b) => parseInt(b.year) - parseInt(a.year));

  if (processed.length < projects.length) {
    const failed = projects.length - processed.length;
    console.warn(
      `[Content] ${failed}/${projects.length} projects failed validation`
    );
  }

  return processed;
}

// ============================================================================
// Tag Extraction
// ============================================================================

/**
 * Extract unique tags from writing posts
 */
export function getUniqueTagsFromPosts(posts: ProcessedWritingPost[]): Tag[] {
  if (!Array.isArray(posts)) {
    console.error("[Content] Invalid posts array");
    return [];
  }

  try {
    const tagIds = [...new Set(posts.flatMap((p) => p.tags || []))];
    return getTagsByIds(tagIds).sort((a, b) => a.label.localeCompare(b.label));
  } catch (error) {
    console.error("[Content] Error extracting tags:", error);
    return [];
  }
}

/**
 * Extract unique tags from work projects
 */
export function getUniqueTagsFromProjects(
  projects: ProcessedWorkProject[]
): Tag[] {
  if (!Array.isArray(projects)) {
    console.error("[Content] Invalid projects array");
    return [];
  }

  try {
    const tagIds = [...new Set(projects.flatMap((p) => p.tags || []))];
    return getTagsByIds(tagIds).sort((a, b) => a.label.localeCompare(b.label));
  } catch (error) {
    console.error("[Content] Error extracting tags:", error);
    return [];
  }
}

// ============================================================================
// Statistics
// ============================================================================

/**
 * Get content statistics
 */
export function getContentStats(
  posts: ProcessedWritingPost[],
  projects: ProcessedWorkProject[]
): ContentStats {
  return {
    posts: {
      total: posts.length,
      tags: getUniqueTagsFromPosts(posts).length,
      dateRange:
        posts.length > 0
          ? {
              oldest: posts[posts.length - 1].date,
              newest: posts[0].date,
            }
          : null,
    },
    projects: {
      total: projects.length,
      tags: getUniqueTagsFromProjects(projects).length,
      yearRange:
        projects.length > 0
          ? {
              oldest: projects[projects.length - 1].year,
              newest: projects[0].year,
            }
          : null,
    },
  };
}
