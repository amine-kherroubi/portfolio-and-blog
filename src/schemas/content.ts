/**
 * Content Validation Schemas
 *
 * Zod schemas for runtime validation of content with detailed error messages.
 * Provides type-safe validation with automatic TypeScript type inference.
 */

import { z } from "zod";
import type {
  WritingPost,
  WorkProject,
  Tag,
  TagId,
  Slug,
  ISODate,
  URL as URLType,
} from "@types/index";

// ============================================================================
// Branded Type Schemas
// ============================================================================

/**
 * Slug validation - lowercase alphanumeric with hyphens
 */
export const slugSchema = z
  .string()
  .min(1, "Slug cannot be empty")
  .max(100, "Slug must be less than 100 characters")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must be lowercase alphanumeric with hyphens",
  })
  .brand<"Slug">();

/**
 * ISO date validation
 */
export const isoDateSchema = z
  .string()
  .datetime({ message: "Invalid ISO date format" })
  .brand<"ISODate">();

/**
 * URL validation
 */
export const urlSchema = z
  .string()
  .url({ message: "Invalid URL format" })
  .brand<"URL">();

/**
 * Tag ID validation
 */
export const tagIdSchema = z
  .string()
  .min(1, "Tag ID cannot be empty")
  .max(50, "Tag ID must be less than 50 characters")
  .regex(/^[a-z0-9-]+$/, {
    message: "Tag ID must be lowercase alphanumeric with hyphens",
  })
  .brand<"TagId">();

// ============================================================================
// Tag Schemas
// ============================================================================

/**
 * Tag category enum
 */
export const tagCategorySchema = z.enum(
  ["technology", "design", "domain", "skill"],
  {
    errorMap: () => ({ message: "Invalid tag category" }),
  }
);

/**
 * Tag schema with strict validation
 */
export const tagSchema = z.object({
  id: tagIdSchema,
  label: z
    .string()
    .min(1, "Tag label cannot be empty")
    .max(30, "Tag label must be less than 30 characters")
    .trim(),
  category: tagCategorySchema,
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color")
    .optional(),
}) satisfies z.ZodType<Tag>;

/**
 * Array of tag IDs with deduplication
 */
export const tagIdsSchema = z
  .array(tagIdSchema)
  .min(0, "Tags array cannot be negative length")
  .max(10, "Maximum 10 tags allowed")
  .transform((tags) => [...new Set(tags)] as TagId[])
  .readonly();

// ============================================================================
// Writing Post Schema
// ============================================================================

/**
 * Reading time validation (e.g., "5 min read")
 */
export const readTimeSchema = z
  .string()
  .regex(/^\d+\s+min(?:ute)?(?:s)?\s+read$/, {
    message: 'Read time must be in format "X min read" or "X minutes read"',
  })
  .or(
    z
      .number()
      .positive()
      .transform((n) => `${n} min read`)
  );

/**
 * Year validation (1900-current year + 10)
 */
const currentYear = new Date().getFullYear();
export const yearSchema = z
  .string()
  .regex(/^\d{4}$/, "Year must be a 4-digit number")
  .refine(
    (year) => {
      const y = parseInt(year, 10);
      return y >= 1900 && y <= currentYear + 10;
    },
    { message: `Year must be between 1900 and ${currentYear + 10}` }
  )
  .or(
    z
      .number()
      .int()
      .min(1900)
      .max(currentYear + 10)
      .transform((n) => n.toString())
  );

/**
 * Writing post schema with comprehensive validation
 */
export const writingPostSchema = z.object({
  type: z.literal("post"),
  id: slugSchema,
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(100, "Title must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .min(1, "Description cannot be empty")
    .max(500, "Description must be less than 500 characters")
    .trim(),
  excerpt: z
    .string()
    .min(1, "Excerpt cannot be empty")
    .max(300, "Excerpt must be less than 300 characters")
    .trim(),
  date: isoDateSchema,
  readTime: readTimeSchema,
  slug: slugSchema,
  tags: tagIdsSchema,
  dateObj: z.date().or(z.string().transform((s) => new Date(s))),
  author: z.string().min(1).max(100).trim().optional(),
  image: urlSchema.optional(),
  published: z.boolean().default(true),
}) satisfies z.ZodType<WritingPost>;

/**
 * Partial writing post schema for updates
 */
export const writingPostUpdateSchema = writingPostSchema
  .partial()
  .omit({ id: true, type: true });

// ============================================================================
// Work Project Schema
// ============================================================================

/**
 * Work project schema with comprehensive validation
 */
export const workProjectSchema = z.object({
  type: z.literal("project"),
  id: slugSchema,
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(100, "Title must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .min(1, "Description cannot be empty")
    .max(500, "Description must be less than 500 characters")
    .trim(),
  year: yearSchema,
  tags: tagIdsSchema,
  link: urlSchema,
  client: z.string().min(1).max(100).trim().optional(),
  role: z.string().min(1).max(100).trim().optional(),
  technologies: z
    .array(z.string().min(1).max(50).trim())
    .max(15, "Maximum 15 technologies allowed")
    .optional()
    .readonly(),
  featured: z.boolean().default(false),
}) satisfies z.ZodType<WorkProject>;

/**
 * Partial work project schema for updates
 */
export const workProjectUpdateSchema = workProjectSchema
  .partial()
  .omit({ id: true, type: true });

// ============================================================================
// Content Processing Schemas
// ============================================================================

/**
 * Raw content entry schema (from Astro content collections)
 */
export const rawContentEntrySchema = z.object({
  id: z.string(),
  collection: z.enum(["writing", "work"]),
  data: z.record(z.unknown()),
});

/**
 * Processed content stats schema
 */
export const contentStatsSchema = z.object({
  posts: z.object({
    total: z.number().int().nonnegative(),
    tags: z.number().int().nonnegative(),
    dateRange: z
      .object({
        oldest: isoDateSchema,
        newest: isoDateSchema,
      })
      .nullable(),
  }),
  projects: z.object({
    total: z.number().int().nonnegative(),
    tags: z.number().int().nonnegative(),
    yearRange: z
      .object({
        oldest: yearSchema,
        newest: yearSchema,
      })
      .nullable(),
  }),
});

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate and parse writing post
 */
export function validateWritingPost(data: unknown): WritingPost {
  return writingPostSchema.parse(data);
}

/**
 * Safe validation with error handling
 */
export function safeValidateWritingPost(
  data: unknown
):
  | { success: true; data: WritingPost }
  | { success: false; error: z.ZodError } {
  const result = writingPostSchema.safeParse(data);
  return result.success
    ? { success: true, data: result.data }
    : { success: false, error: result.error };
}

/**
 * Validate and parse work project
 */
export function validateWorkProject(data: unknown): WorkProject {
  return workProjectSchema.parse(data);
}

/**
 * Safe validation with error handling
 */
export function safeValidateWorkProject(
  data: unknown
):
  | { success: true; data: WorkProject }
  | { success: false; error: z.ZodError } {
  const result = workProjectSchema.safeParse(data);
  return result.success
    ? { success: true, data: result.data }
    : { success: false, error: result.error };
}

/**
 * Validate tag
 */
export function validateTag(data: unknown): Tag {
  return tagSchema.parse(data);
}

/**
 * Validate array of tag IDs
 */
export function validateTagIds(data: unknown): readonly TagId[] {
  return tagIdsSchema.parse(data);
}

// ============================================================================
// Transformation Helpers
// ============================================================================

/**
 * Transform raw content entry to typed content
 */
export function transformContentEntry(
  entry: unknown
): WritingPost | WorkProject {
  const validated = rawContentEntrySchema.parse(entry);

  if (validated.collection === "writing") {
    return validateWritingPost({
      ...validated.data,
      type: "post",
      id: validated.id,
      slug: validated.id,
    });
  }

  return validateWorkProject({
    ...validated.data,
    type: "project",
    id: validated.id,
  });
}

/**
 * Batch validate content entries
 */
export function validateContentBatch(entries: unknown[]): {
  valid: Array<WritingPost | WorkProject>;
  invalid: Array<{ entry: unknown; error: z.ZodError }>;
} {
  const valid: Array<WritingPost | WorkProject> = [];
  const invalid: Array<{ entry: unknown; error: z.ZodError }> = [];

  for (const entry of entries) {
    try {
      valid.push(transformContentEntry(entry));
    } catch (error) {
      if (error instanceof z.ZodError) {
        invalid.push({ entry, error });
      } else {
        throw error;
      }
    }
  }

  return { valid, invalid };
}

// ============================================================================
// Error Formatting
// ============================================================================

/**
 * Format Zod error for user-friendly display
 */
export function formatZodError(error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.join(".");
      return path ? `${path}: ${issue.message}` : issue.message;
    })
    .join(", ");
}

/**
 * Get first error message from Zod error
 */
export function getFirstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Validation failed";
}

/**
 * Group errors by field
 */
export function groupErrorsByField(
  error: z.ZodError
): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const field = issue.path.join(".") || "_general";
    if (!grouped[field]) {
      grouped[field] = [];
    }
    grouped[field].push(issue.message);
  }

  return grouped;
}

// ============================================================================
// Type Inference Helpers
// ============================================================================

/**
 * Infer TypeScript type from Zod schema
 */
export type InferWritingPost = z.infer<typeof writingPostSchema>;
export type InferWorkProject = z.infer<typeof workProjectSchema>;
export type InferTag = z.infer<typeof tagSchema>;

// Ensure types match
type _AssertWritingPost = InferWritingPost extends WritingPost ? true : false;
type _AssertWorkProject = InferWorkProject extends WorkProject ? true : false;
