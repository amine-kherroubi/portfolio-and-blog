/**
 * Content Transformation Utilities - December 2025
 *
 * Enhanced with:
 * - Robust error handling for malformed data
 * - Better type safety with strict validation
 * - Defensive programming against edge cases
 * - Performance optimization for large collections
 */

import type { CollectionEntry } from "astro:content";
import { getTagsByIds, TAGS, type TagId, type Tag } from "../config/tags";

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

/**
 * Safely parse date string with fallback
 * @param dateStr - Date string to parse
 * @param fallback - Fallback date (defaults to current date)
 * @returns Valid Date object
 */
function parseDate(dateStr: string, fallback: Date = new Date()): Date {
  try {
    const date = new Date(dateStr);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn(
        `[Content] Invalid date format: "${dateStr}", using fallback`
      );
      return fallback;
    }
    return date;
  } catch (error) {
    console.error(`[Content] Error parsing date: "${dateStr}"`, error);
    return fallback;
  }
}

/**
 * Validate and filter tag IDs
 * Ensures only valid tags are included
 * @param tags - Array of tag strings
 * @returns Validated TagId array
 */
function validateTags(tags: string[]): TagId[] {
  if (!Array.isArray(tags)) {
    console.warn(`[Content] Invalid tags format, expected array`);
    return [];
  }

  return tags.filter((tag): tag is TagId => {
    const isValid = tag in TAGS;
    if (!isValid && tag) {
      console.warn(`[Content] Unknown tag ID: "${tag}" - skipping`);
    }
    return isValid;
  });
}

/**
 * Validate year string
 * @param year - Year string to validate
 * @returns Valid year string or current year as fallback
 */
function validateYear(year: string): string {
  const parsed = parseInt(year, 10);
  const currentYear = new Date().getFullYear();

  if (isNaN(parsed) || parsed < 1900 || parsed > currentYear + 10) {
    console.warn(`[Content] Invalid year: "${year}", using current year`);
    return currentYear.toString();
  }

  return year;
}

/**
 * Transform and sort writing posts by date (newest first)
 *
 * Enhanced with:
 * - Robust date parsing with fallbacks
 * - Tag validation
 * - Error boundaries for malformed content
 * - Performance optimization
 *
 * @param posts - Array of writing post entries
 * @returns Sorted and validated processed posts
 */
export function processWritingPosts(
  posts: CollectionEntry<"writing">[]
): ProcessedWritingPost[] {
  if (!Array.isArray(posts)) {
    console.error(`[Content] processWritingPosts received non-array input`);
    return [];
  }

  const processed = posts
    .map((post, index) => {
      try {
        // Validate required fields
        if (!post?.id || !post?.data) {
          console.error(
            `[Content] Post at index ${index} missing required fields`
          );
          return null;
        }

        const { id, data } = post;
        const { title, excerpt, date, readTime, tags } = data;

        // Validate required data
        if (!title || !excerpt || !date || !readTime) {
          console.error(`[Content] Post "${id}" missing required data fields`);
          return null;
        }

        // Parse and validate date
        const dateObj = parseDate(date);

        // Validate tags
        const validatedTags = validateTags(tags || []);

        return {
          title: String(title).trim(),
          excerpt: String(excerpt).trim(),
          date: String(date).trim(),
          readTime: String(readTime).trim(),
          slug: id,
          tags: validatedTags,
          dateObj,
        };
      } catch (error) {
        console.error(
          `[Content] Error processing post at index ${index}:`,
          error
        );
        return null;
      }
    })
    .filter((post): post is ProcessedWritingPost => post !== null)
    .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

  if (processed.length < posts.length) {
    console.warn(
      `[Content] Processed ${processed.length}/${posts.length} posts (${posts.length - processed.length} failed validation)`
    );
  }

  return processed;
}

/**
 * Transform and sort work projects by year (newest first)
 *
 * Enhanced with:
 * - Year validation
 * - Tag validation
 * - Error boundaries
 * - Performance optimization
 *
 * @param projects - Array of work project entries
 * @returns Sorted and validated processed projects
 */
export function processWorkProjects(
  projects: CollectionEntry<"work">[]
): ProcessedWorkProject[] {
  if (!Array.isArray(projects)) {
    console.error(`[Content] processWorkProjects received non-array input`);
    return [];
  }

  const processed = projects
    .map((project, index) => {
      try {
        // Validate required fields
        if (!project?.id || !project?.data) {
          console.error(
            `[Content] Project at index ${index} missing required fields`
          );
          return null;
        }

        const { id, data } = project;
        const { title, description, year, tags } = data;

        // Validate required data
        if (!title || !description || !year) {
          console.error(
            `[Content] Project "${id}" missing required data fields`
          );
          return null;
        }

        // Validate year
        const validatedYear = validateYear(year);

        // Validate tags
        const validatedTags = validateTags(tags || []);

        return {
          title: String(title).trim(),
          description: String(description).trim(),
          year: validatedYear,
          tags: validatedTags,
          link: `/work/${id}`,
        };
      } catch (error) {
        console.error(
          `[Content] Error processing project at index ${index}:`,
          error
        );
        return null;
      }
    })
    .filter((project): project is ProcessedWorkProject => project !== null)
    .sort((a, b) => {
      const yearA = parseInt(a.year, 10);
      const yearB = parseInt(b.year, 10);
      return yearB - yearA;
    });

  if (processed.length < projects.length) {
    console.warn(
      `[Content] Processed ${processed.length}/${projects.length} projects (${projects.length - processed.length} failed validation)`
    );
  }

  return processed;
}

/**
 * Get all unique tags from processed writing posts
 *
 * Enhanced with deduplication and sorting
 *
 * @param posts - Array of processed writing posts
 * @returns Sorted array of unique tag objects
 */
export function getUniqueTagsFromPosts(posts: ProcessedWritingPost[]): Tag[] {
  if (!Array.isArray(posts)) {
    console.error(`[Content] getUniqueTagsFromPosts received non-array input`);
    return [];
  }

  try {
    // Extract unique tag IDs
    const tagIds = [...new Set(posts.flatMap((p) => p.tags || []))] as TagId[];

    // Get tag objects and sort by label
    return getTagsByIds(tagIds).sort((a, b) => a.label.localeCompare(b.label));
  } catch (error) {
    console.error(`[Content] Error extracting unique tags from posts:`, error);
    return [];
  }
}

/**
 * Get all unique tags from processed work projects
 *
 * Enhanced with deduplication and sorting
 *
 * @param projects - Array of processed work projects
 * @returns Sorted array of unique tag objects
 */
export function getUniqueTagsFromProjects(
  projects: ProcessedWorkProject[]
): Tag[] {
  if (!Array.isArray(projects)) {
    console.error(
      `[Content] getUniqueTagsFromProjects received non-array input`
    );
    return [];
  }

  try {
    // Extract unique tag IDs
    const tagIds = [
      ...new Set(projects.flatMap((p) => p.tags || [])),
    ] as TagId[];

    // Get tag objects and sort by label
    return getTagsByIds(tagIds).sort((a, b) => a.label.localeCompare(b.label));
  } catch (error) {
    console.error(
      `[Content] Error extracting unique tags from projects:`,
      error
    );
    return [];
  }
}

/**
 * Get content statistics
 * Useful for debugging and monitoring
 *
 * @param posts - Processed posts
 * @param projects - Processed projects
 * @returns Statistics object
 */
export function getContentStats(
  posts: ProcessedWritingPost[],
  projects: ProcessedWorkProject[]
) {
  return {
    posts: {
      total: posts.length,
      tags: getUniqueTagsFromPosts(posts).length,
      dateRange:
        posts.length > 0
          ? {
              oldest: posts[posts.length - 1]?.date,
              newest: posts[0]?.date,
            }
          : null,
    },
    projects: {
      total: projects.length,
      tags: getUniqueTagsFromProjects(projects).length,
      yearRange:
        projects.length > 0
          ? {
              oldest: projects[projects.length - 1]?.year,
              newest: projects[0]?.year,
            }
          : null,
    },
  };
}
