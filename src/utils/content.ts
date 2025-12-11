/**
 * Content Transformation Utilities
 * 
 * Utilities for transforming and processing content collections.
 * Separated from page files to maintain separation of concerns.
 */

import type { CollectionEntry } from "astro:content";
import { getTagsByIds, type TagId } from "../config/tags";

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
 * Transform and sort writing posts by date (newest first)
 * 
 * Processes raw content collection entries into a structured format
 * suitable for display, including slug generation and date-based sorting.
 * 
 * @param posts - Array of writing post entries from Astro content collections
 * @returns Array of processed posts sorted by date (newest first)
 */
export function processWritingPosts(
  posts: CollectionEntry<"writing">[]
): ProcessedWritingPost[] {
  return posts
    .map((post) => {
      // In Astro 5, post.id is the filename without extension
      const slug = post.id;
      return {
        title: post.data.title,
        excerpt: post.data.excerpt,
        date: post.data.date,
        readTime: post.data.readTime,
        slug: slug,
        tags: post.data.tags as TagId[],
        // Create Date object for sorting purposes
        dateObj: new Date(post.data.date),
      };
    })
    .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
}

/**
 * Transform and sort work projects by year (newest first)
 * 
 * Processes raw content collection entries into a structured format
 * suitable for display, including slug generation and year-based sorting.
 * 
 * @param projects - Array of work project entries from Astro content collections
 * @returns Array of processed projects sorted by year (newest first)
 */
export function processWorkProjects(
  projects: CollectionEntry<"work">[]
): ProcessedWorkProject[] {
  return projects
    .map((project) => {
      // In Astro 5, project.id is the filename without extension
      const slug = project.id;
      return {
        title: project.data.title,
        description: project.data.description,
        year: project.data.year,
        tags: project.data.tags as TagId[],
        // Generate link to project detail page
        link: `/work/${slug}`,
      };
    })
    .sort((a, b) => parseInt(b.year) - parseInt(a.year));
}

/**
 * Get all unique tags from processed writing posts
 * 
 * Extracts all unique tag IDs from posts and converts them to tag objects
 * for use in filtering and display.
 * 
 * @param posts - Array of processed writing posts
 * @returns Array of unique tag objects
 */
export function getUniqueTagsFromPosts(
  posts: ProcessedWritingPost[]
): ReturnType<typeof getTagsByIds> {
  // Extract all tag IDs, flatten the array, and remove duplicates
  const tagIds = [...new Set(posts.flatMap((p) => p.tags))];
  return getTagsByIds(tagIds);
}

/**
 * Get all unique tags from processed work projects
 * 
 * Extracts all unique tag IDs from projects and converts them to tag objects
 * for use in filtering and display.
 * 
 * @param projects - Array of processed work projects
 * @returns Array of unique tag objects
 */
export function getUniqueTagsFromProjects(
  projects: ProcessedWorkProject[]
): ReturnType<typeof getTagsByIds> {
  // Extract all tag IDs, flatten the array, and remove duplicates
  const tagIds = [...new Set(projects.flatMap((p) => p.tags))];
  return getTagsByIds(tagIds);
}
