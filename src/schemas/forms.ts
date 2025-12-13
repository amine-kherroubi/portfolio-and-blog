/**
 * Form Validation Schemas
 *
 * Zod schemas for client-side and server-side form validation.
 * Provides comprehensive validation with custom error messages.
 */

import { z } from "zod";
import type { ContactFormData, Email, ISODate } from "@/types/index";

// ============================================================================
// Common Field Schemas
// ============================================================================

/**
 * Email validation with detailed error messages
 */
export const emailSchema = z
  .string({
    message: "Email must be a string",
  })
  .min(1, "Email cannot be empty")
  .max(255, "Email must be less than 255 characters")
  .refine(
    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    "Please enter a valid email address"
  )
  .toLowerCase()
  .trim() as unknown as z.ZodType<Email>;

/**
 * Name validation
 */
export const nameSchema = z
  .string({
    message: "Name must be a string",
  })
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be less than 100 characters")
  .trim()
  .refine((name) => /^[a-zA-Z\s'-]+$/.test(name), {
    message: "Name can only contain letters, spaces, hyphens, and apostrophes",
  });

/**
 * Message validation with profanity filter placeholder
 */
export const messageSchema = z
  .string({
    message: "Message must be a string",
  })
  .min(10, "Message must be at least 10 characters")
  .max(1000, "Message must be less than 1000 characters")
  .trim()
  .refine((msg) => msg.split(/\s+/).length >= 3, {
    message: "Message must contain at least 3 words",
  });

/**
 * Honeypot field for bot detection (should be empty)
 */
export const honeypotSchema = z
  .string()
  .max(0, "Invalid submission")
  .optional()
  .or(z.literal(""));

// ============================================================================
// Contact Form Schema
// ============================================================================

/**
 * Contact form schema with comprehensive validation
 */
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  message: messageSchema,
  timestamp: z
    .string()
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Invalid timestamp" }
    )
    .or(
      z.date().transform((d) => d.toISOString())
    ) as unknown as z.ZodType<ISODate>,
  honeypot: honeypotSchema,
}) as unknown as z.ZodType<ContactFormData>;

/**
 * Contact form without timestamp (for client-side validation)
 */
export const contactFormClientSchema = contactFormSchema.omit({
  timestamp: true,
});

/**
 * Partial contact form for progressive validation
 */
export const contactFormPartialSchema = contactFormSchema.partial();

// ============================================================================
// Search Form Schema
// ============================================================================

/**
 * Search query validation
 */
export const searchQuerySchema = z
  .string()
  .min(1, "Search query cannot be empty")
  .max(200, "Search query must be less than 200 characters")
  .trim()
  .refine((query) => query.length >= 2, {
    message: "Search query must be at least 2 characters",
  });

/**
 * Search form schema
 */
export const searchFormSchema = z.object({
  q: searchQuerySchema,
  tags: z
    .string()
    .optional()
    .transform((tags) => tags?.split(",").filter(Boolean) ?? []),
  page: z
    .string()
    .regex(/^\d+$/)
    .transform((s) => parseInt(s, 10))
    .pipe(z.number().int().positive())
    .optional()
    .default(1),
});

// ============================================================================
// Filter Form Schema
// ============================================================================

/**
 * Filter form schema
 */
export const filterFormSchema = z.object({
  tags: z
    .string()
    .optional()
    .transform((tags) => (tags ? tags.split(",").filter(Boolean) : [])),
  type: z.enum(["writing", "work"]).optional(),
});

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate contact form data
 */
export function validateContactForm(data: unknown): ContactFormData {
  return contactFormSchema.parse(data);
}

/**
 * Safe contact form validation
 */
export function safeValidateContactForm(
  data: unknown
):
  | { success: true; data: ContactFormData }
  | { success: false; error: z.ZodError } {
  const result = contactFormSchema.safeParse(data);
  return result.success
    ? { success: true, data: result.data }
    : { success: false, error: result.error };
}

/**
 * Validate individual field
 */
export function validateField<T extends keyof ContactFormData>(
  field: T,
  value: unknown
): ContactFormData[T] {
  const fieldSchemas: Record<keyof ContactFormData, z.ZodType> = {
    name: nameSchema,
    email: emailSchema,
    message: messageSchema,
    timestamp: z.string().refine((val) => !isNaN(new Date(val).getTime())),
    honeypot: honeypotSchema,
  };

  const schema = fieldSchemas[field];
  if (!schema) {
    throw new Error(`Unknown field: ${field}`);
  }

  return schema.parse(value) as ContactFormData[T];
}

/**
 * Safe individual field validation
 */
export function safeValidateField<T extends keyof ContactFormData>(
  field: T,
  value: unknown
):
  | { success: true; data: ContactFormData[T] }
  | { success: false; error: z.ZodError } {
  try {
    const data = validateField(field, value);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
}

/**
 * Validate search query
 */
export function validateSearchQuery(query: unknown): string {
  return searchQuerySchema.parse(query);
}

/**
 * Safe search query validation
 */
export function safeValidateSearchQuery(
  query: unknown
): { success: true; data: string } | { success: false; error: z.ZodError } {
  const result = searchQuerySchema.safeParse(query);
  return result.success
    ? { success: true, data: result.data }
    : { success: false, error: result.error };
}

// ============================================================================
// Field-Specific Validators
// ============================================================================

/**
 * Email validator with custom error handling
 */
export function isValidEmail(email: unknown): email is Email {
  return emailSchema.safeParse(email).success;
}

/**
 * Name validator
 */
export function isValidName(name: unknown): name is string {
  return nameSchema.safeParse(name).success;
}

/**
 * Message validator
 */
export function isValidMessage(message: unknown): message is string {
  return messageSchema.safeParse(message).success;
}

// ============================================================================
// Form State Helpers
// ============================================================================

/**
 * Extract field errors from Zod error
 */
export function extractFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (field && typeof field === "string") {
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
  }

  return fieldErrors;
}

/**
 * Check if form has errors
 */
export function hasFormErrors(error: z.ZodError | null): boolean {
  return error !== null && error.issues.length > 0;
}

/**
 * Get error message for specific field
 */
export function getFieldError(
  error: z.ZodError | null,
  field: string
): string | null {
  if (!error) return null;

  const issue = error.issues.find((issue) => issue.path[0] === field);
  return issue?.message ?? null;
}

/**
 * Check if specific field has error
 */
export function hasFieldError(
  error: z.ZodError | null,
  field: string
): boolean {
  return getFieldError(error, field) !== null;
}

// ============================================================================
// Sanitization Helpers
// ============================================================================

/**
 * Sanitize HTML from user input
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Sanitize contact form data
 */
export function sanitizeContactForm(data: ContactFormData): ContactFormData {
  return {
    ...data,
    name: sanitizeHtml(data.name),
    message: sanitizeHtml(data.message),
  };
}

/**
 * Normalize whitespace in string
 */
export function normalizeWhitespace(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

// ============================================================================
// Rate Limiting Schema
// ============================================================================

/**
 * Rate limit check schema
 */
export const rateLimitSchema = z.object({
  ip: z.string().refine((val) => {
    // Simple IP validation
    return (
      /^(?:\d{1,3}\.){3}\d{1,3}$/.test(val) ||
      /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/.test(val)
    );
  }, "Invalid IP address"),
  timestamp: z.number().int().positive(),
  count: z.number().int().nonnegative(),
});

/**
 * Rate limit config schema
 */
export const rateLimitConfigSchema = z.object({
  maxRequests: z.number().int().positive().default(5),
  windowMs: z.number().int().positive().default(60000), // 1 minute
  skipSuccessfulRequests: z.boolean().default(false),
});

// ============================================================================
// Type Exports
// ============================================================================

export type ValidatedContactForm = z.infer<typeof contactFormSchema>;
export type ValidatedSearchForm = z.infer<typeof searchFormSchema>;
export type ValidatedFilterForm = z.infer<typeof filterFormSchema>;
