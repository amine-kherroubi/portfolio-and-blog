/**
 * Content Processing Utilities
 *
 * Type-safe content processing with Zod validation and comprehensive error handling.
 * All functions use strict typing and runtime validation.
 */

import type { CollectionEntry } from "astro:content";
import { z } from "zod";
import type {
  WritingPost,
  WorkProject,
  Tag,
  TagId,
  Slug,
  ISODate,
} from "@/types/index";
import {
  safeValidateWritingPost,
  safeValidateWorkProject,
  formatZodError,
} from "@/schemas/content";
import { getTagsByIds, TAGS } from "@/config/tags";

// ============================================================================
// Export Types for External Use
// ============================================================================

export type ProcessedWritingPost = WritingPost;
export type ProcessedWorkProject = WorkProject;

// ============================================================================
// Error Classes
// ============================================================================

class ContentProcessingError extends Error {
  constructor(
    message: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ContentProcessingError";
  }
}

class ValidationError extends Error {
  constructor(
    message: string,
    public readonly errors: z.ZodError
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

// ============================================================================
// Date Processing
// ============================================================================

/**
 * Safely parse date with validation
 * Accepts both Date objects and date strings (YYYY-MM-DD or full ISO)
 */
function parseDateSafe(dateStr: unknown): Date {
  if (dateStr instanceof Date) {
    return dateStr;
  }

  if (typeof dateStr !== "string") {
    throw new ContentProcessingError("Invalid date type", { date: dateStr });
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new ContentProcessingError("Invalid date value", { date: dateStr });
  }

  return date;
}

/**
 * Format date to ISO string - KEEP THE ORIGINAL FORMAT
 */
function formatDateISO(date: Date): ISODate {
  return date.toISOString() as ISODate;
}

// ============================================================================
// Tag Processing
// ============================================================================

/**
 * Validate and filter tag IDs
 */
function validateTagIds(tags: unknown): readonly TagId[] {
  if (!Array.isArray(tags)) {
    console.warn("[Content] Tags is not an array:", tags);
    return [];
  }

  const validTags = tags.filter((tag): tag is TagId => {
    if (typeof tag !== "string") {
      console.warn("[Content] Invalid tag type:", tag);
      return false;
    }

    if (!(tag in TAGS)) {
      console.warn("[Content] Unknown tag ID:", tag);
      return false;
    }

    return true;
  });

  // Remove duplicates and return as readonly
  return [...new Set(validTags)] as readonly TagId[];
}

/**
 * Extract unique tags from content array
 */
function extractUniqueTags<T extends { readonly tags: readonly TagId[] }>(
  items: readonly T[]
): readonly Tag[] {
  const tagIds = new Set<TagId>();

  for (const item of items) {
    for (const tag of item.tags) {
      tagIds.add(tag);
    }
  }

  const tags = getTagsByIds([...tagIds]);
  return [...tags].sort((a, b) => a.label.localeCompare(b.label));
}

// ============================================================================
// Content Processing
// ============================================================================

/**
 * Process single writing post with validation
 */
function processWritingPost(
  entry: CollectionEntry<"writing">,
  index: number
): WritingPost | null {
  try {
    if (!entry?.id || !entry?.data) {
      throw new ContentProcessingError("Invalid entry structure", { index });
    }

    const { id, data } = entry;

    // Parse date to Date object for sorting
    const dateObj = parseDateSafe(data.date);

    // Keep original ISO string OR convert to ISO if needed
    const isoDate =
      typeof data.date === "string" && data.date.includes("T")
        ? data.date // Already ISO format, keep it
        : formatDateISO(dateObj); // Convert to ISO

    // Prepare data for validation
    const postData = {
      type: "post" as const,
      id: id as Slug,
      title: String(data.title ?? "").trim(),
      description: String(data.description ?? data.excerpt ?? "").trim(),
      excerpt: String(data.excerpt ?? "").trim(),
      date: isoDate as ISODate, // Use full ISO format for validation
      readTime: String(data.readTime ?? "").trim(),
      slug: id as Slug,
      tags: validateTagIds(data.tags),
      dateObj, // Keep Date object for sorting
      author: data.author ? String(data.author).trim() : undefined,
      image: data.image ? String(data.image) : undefined,
      published: Boolean(data.published ?? true),
    };

    // Validate with Zod
    const result = safeValidateWritingPost(postData);

    if (!result.success) {
      throw new ValidationError(
        `Validation failed for post "${id}"`,
        result.error
      );
    }

    return result.data;
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error(
        `[Content] Validation error at index ${index}:`,
        formatZodError(error.errors)
      );
    } else if (error instanceof ContentProcessingError) {
      console.error(
        `[Content] Processing error at index ${index}:`,
        error.message
      );
    } else {
      console.error(`[Content] Unexpected error at index ${index}:`, error);
    }
    return null;
  }
}

/**
 * Process single work project with validation
 */
function processWorkProject(
  entry: CollectionEntry<"work">,
  index: number
): WorkProject | null {
  try {
    if (!entry?.id || !entry?.data) {
      throw new ContentProcessingError("Invalid entry structure", { index });
    }

    const { id, data } = entry;

    // Prepare data for validation
    const projectData = {
      type: "project" as const,
      id: id as Slug,
      title: String(data.title ?? "").trim(),
      description: String(data.description ?? "").trim(),
      year: String(data.year ?? new Date().getFullYear()),
      tags: validateTagIds(data.tags),
      link: `/work/${id}`,
      client: data.client ? String(data.client).trim() : undefined,
      role: data.role ? String(data.role).trim() : undefined,
      technologies: Array.isArray(data.technologies)
        ? (data.technologies.map((t: unknown) =>
            String(t).trim()
          ) as readonly string[])
        : undefined,
      featured: Boolean(data.featured ?? false),
    };

    // Validate with Zod
    const result = safeValidateWorkProject(projectData);

    if (!result.success) {
      throw new ValidationError(
        `Validation failed for project "${id}"`,
        result.error
      );
    }

    return result.data;
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error(
        `[Content] Validation error at index ${index}:`,
        formatZodError(error.errors)
      );
    } else if (error instanceof ContentProcessingError) {
      console.error(
        `[Content] Processing error at index ${index}:`,
        error.message
      );
    } else {
      console.error(`[Content] Unexpected error at index ${index}:`, error);
    }
    return null;
  }
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Process writing posts with comprehensive validation and error handling
 */
export function processWritingPosts(
  posts: readonly CollectionEntry<"writing">[]
): readonly WritingPost[] {
  if (!Array.isArray(posts)) {
    console.error("[Content] Invalid posts array");
    return [];
  }

  const processed = posts
    .map((post, index) => processWritingPost(post, index))
    .filter((post): post is WritingPost => post !== null);

  // Sort by date (newest first)
  const sorted = [...processed].sort(
    (a, b) => b.dateObj.getTime() - a.dateObj.getTime()
  );

  const failedCount = posts.length - processed.length;
  if (failedCount > 0) {
    console.warn(
      `[Content] ${failedCount}/${posts.length} posts failed processing`
    );
  }

  console.log(`[Content] Processed ${sorted.length} writing posts`);
  return sorted;
}

/**
 * Process work projects with comprehensive validation and error handling
 */
export function processWorkProjects(
  projects: readonly CollectionEntry<"work">[]
): readonly WorkProject[] {
  if (!Array.isArray(projects)) {
    console.error("[Content] Invalid projects array");
    return [];
  }

  const processed = projects
    .map((project, index) => processWorkProject(project, index))
    .filter((project): project is WorkProject => project !== null);

  // Sort by year (newest first)
  const sorted = [...processed].sort(
    (a, b) => parseInt(b.year) - parseInt(a.year)
  );

  const failedCount = projects.length - processed.length;
  if (failedCount > 0) {
    console.warn(
      `[Content] ${failedCount}/${projects.length} projects failed processing`
    );
  }

  console.log(`[Content] Processed ${sorted.length} work projects`);
  return sorted;
}

/**
 * Get unique tags from writing posts
 */
export function getUniqueTagsFromPosts(
  posts: readonly WritingPost[]
): readonly Tag[] {
  if (!Array.isArray(posts)) {
    console.error("[Content] Invalid posts array");
    return [];
  }

  try {
    return extractUniqueTags(posts);
  } catch (error) {
    console.error("[Content] Error extracting tags from posts:", error);
    return [];
  }
}

/**
 * Get unique tags from work projects
 */
export function getUniqueTagsFromProjects(
  projects: readonly WorkProject[]
): readonly Tag[] {
  if (!Array.isArray(projects)) {
    console.error("[Content] Invalid projects array");
    return [];
  }

  try {
    return extractUniqueTags(projects);
  } catch (error) {
    console.error("[Content] Error extracting tags from projects:", error);
    return [];
  }
}

// ============================================================================
// Statistics
// ============================================================================

interface ContentStats {
  readonly posts: {
    readonly total: number;
    readonly tags: number;
    readonly dateRange: {
      readonly oldest: string;
      readonly newest: string;
    } | null;
  };
  readonly projects: {
    readonly total: number;
    readonly tags: number;
    readonly yearRange: {
      readonly oldest: string;
      readonly newest: string;
    } | null;
  };
}

/**
 * Get comprehensive content statistics
 */
export function getContentStats(
  posts: readonly WritingPost[],
  projects: readonly WorkProject[]
): ContentStats {
  return {
    posts: {
      total: posts.length,
      tags: getUniqueTagsFromPosts(posts).length,
      dateRange:
        posts.length > 0
          ? {
              oldest: posts[posts.length - 1]!.date,
              newest: posts[0]!.date,
            }
          : null,
    },
    projects: {
      total: projects.length,
      tags: getUniqueTagsFromProjects(projects).length,
      yearRange:
        projects.length > 0
          ? {
              oldest: projects[projects.length - 1]!.year,
              newest: projects[0]!.year,
            }
          : null,
    },
  };
}

// ============================================================================
// Content Filtering
// ============================================================================

/**
 * Filter content by tags
 */
export function filterByTags<T extends { readonly tags: readonly TagId[] }>(
  items: readonly T[],
  tagIds: readonly TagId[]
): readonly T[] {
  if (tagIds.length === 0) {
    return items;
  }

  const tagSet = new Set(tagIds);
  return items.filter((item) => item.tags.some((tag) => tagSet.has(tag)));
}

/**
 * Filter content by search query
 */
export function filterByQuery<
  T extends { readonly title: string; readonly description: string },
>(items: readonly T[], query: string): readonly T[] {
  if (!query.trim()) {
    return items;
  }

  const lowerQuery = query.toLowerCase().trim();
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Filter writing posts by published status
 */
export function filterPublishedPosts(
  posts: readonly WritingPost[]
): readonly WritingPost[] {
  return posts.filter((post) => post.published);
}

/**
 * Filter work projects by featured status
 */
export function filterFeaturedProjects(
  projects: readonly WorkProject[]
): readonly WorkProject[] {
  return projects.filter((project) => project.featured);
}

// ============================================================================
// Export Types
// ============================================================================

export type { WritingPost, WorkProject, Tag, TagId, ContentStats };
