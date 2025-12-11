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
 */
export function processWritingPosts(
  posts: CollectionEntry<"writing">[]
): ProcessedWritingPost[] {
  return posts
    .map((post) => {
      const slug = post.id; // In Astro 5, post.id is the filename without extension
      return {
        title: post.data.title,
        excerpt: post.data.excerpt,
        date: post.data.date,
        readTime: post.data.readTime,
        slug: slug,
        tags: post.data.tags as TagId[],
        dateObj: new Date(post.data.date), // For sorting
      };
    })
    .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
}

/**
 * Transform and sort work projects by year (newest first)
 */
export function processWorkProjects(
  projects: CollectionEntry<"work">[]
): ProcessedWorkProject[] {
  return projects
    .map((project) => {
      const slug = project.id; // In Astro 5, project.id is the filename without extension
      return {
        title: project.data.title,
        description: project.data.description,
        year: project.data.year,
        tags: project.data.tags as TagId[],
        link: `/work/${slug}`,
      };
    })
    .sort((a, b) => parseInt(b.year) - parseInt(a.year));
}

/**
 * Get all unique tags from processed content items
 */
export function getUniqueTagsFromPosts(
  posts: ProcessedWritingPost[]
): ReturnType<typeof getTagsByIds> {
  const tagIds = [...new Set(posts.flatMap((p) => p.tags))];
  return getTagsByIds(tagIds);
}

/**
 * Get all unique tags from processed work projects
 */
export function getUniqueTagsFromProjects(
  projects: ProcessedWorkProject[]
): ReturnType<typeof getTagsByIds> {
  const tagIds = [...new Set(projects.flatMap((p) => p.tags))];
  return getTagsByIds(tagIds);
}
