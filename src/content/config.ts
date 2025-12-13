/**
 * Content Collections Configuration
 *
 * Defines content collections for type-safe content management.
 * Uses Zod schemas for validation and TypeScript type inference.
 *
 * @see https://docs.astro.build/en/guides/content-collections/
 */

import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Writing collection schema
 * Defines the structure for blog posts
 */
const writing = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./src/content/writing",
  }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.string(),
    readTime: z.string(),
    tags: z.array(z.string()),
  }),
});

/**
 * Work collection schema
 * Defines the structure for project pages
 */
const work = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./src/content/work",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    year: z.string(),
    tags: z.array(z.string()),
  }),
});

/**
 * Export all collections
 */
export const collections = { writing, work };
