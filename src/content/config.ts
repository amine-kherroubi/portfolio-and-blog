import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

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

export const collections = { writing, work };
