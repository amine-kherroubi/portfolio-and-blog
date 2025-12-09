import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    excerpt: z.string(),
    readTime: z.string(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
  }),
});

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    year: z.string(),
    client: z.string(),
    role: z.string(),
    technologies: z.array(z.string()),
    duration: z.string(),
    description: z.string(),
    challenge: z.string(),
    solution: z.string(),
    results: z.array(z.string()),
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
    featured: z.boolean().default(false),
    order: z.number().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  projects: projectsCollection,
};