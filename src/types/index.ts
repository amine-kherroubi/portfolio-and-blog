/**
 * Shared Type Definitions
 *
 * Centralized type definitions with strict typing and modern TypeScript features.
 * All types are immutable by default using 'as const' and 'readonly' where appropriate.
 */

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Make all properties of T deeply readonly
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Make all properties of T required and non-nullable
 */
export type RequiredNonNull<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

/**
 * Extract keys of T where value is of type V
 */
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/**
 * Create a branded type for type-safe primitives
 */
export type Brand<T, B extends string> = T & { readonly __brand: B };

/**
 * Make properties K of T optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make properties K of T required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

/**
 * Ensure at least one property is present
 */
export type AtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// ============================================================================
// Branded Types
// ============================================================================

export type Slug = Brand<string, "Slug">;
export type Email = Brand<string, "Email">;
export type URL = Brand<string, "URL">;
export type ISODate = Brand<string, "ISODate">;
export type TagId = Brand<string, "TagId">;

// ============================================================================
// Page & Navigation Types
// ============================================================================

export const PAGE_IDS = {
  HOME: "home",
  WORK: "work",
  WRITING: "writing",
  PROFILE: "profile",
  SEARCH: "search",
  CONTACT: "contact",
} as const;

export type PageId = (typeof PAGE_IDS)[keyof typeof PAGE_IDS];

export interface NavigationLink {
  readonly href: string;
  readonly label: string;
  readonly page: PageId;
  readonly external?: boolean;
  readonly icon?: string;
}

// ============================================================================
// Content Types
// ============================================================================

export const CONTENT_TYPES = {
  POST: "post",
  PROJECT: "project",
  PAGE: "page",
} as const;

export type ContentType = (typeof CONTENT_TYPES)[keyof typeof CONTENT_TYPES];

/**
 * Base content interface
 */
export interface BaseContent {
  readonly id: Slug;
  readonly title: string;
  readonly description: string;
  readonly tags: readonly TagId[];
}

/**
 * Writing post with strict typing
 */
export interface WritingPost extends BaseContent {
  readonly type: typeof CONTENT_TYPES.POST;
  readonly excerpt: string;
  readonly date: ISODate;
  readonly readTime: string;
  readonly slug: Slug;
  readonly dateObj: Date;
  readonly author?: string;
  readonly image?: URL;
  readonly published: boolean;
}

/**
 * Work project with strict typing
 */
export interface WorkProject extends BaseContent {
  readonly type: typeof CONTENT_TYPES.PROJECT;
  readonly year: string;
  readonly link: string;
  readonly client?: string;
  readonly role?: string;
  readonly technologies?: readonly string[];
  readonly featured: boolean;
}

/**
 * Content collection entry
 */
export interface ContentEntry<T extends ContentType> {
  readonly id: Slug;
  readonly collection: T;
  readonly data: T extends typeof CONTENT_TYPES.POST
    ? WritingPost
    : T extends typeof CONTENT_TYPES.PROJECT
      ? WorkProject
      : BaseContent;
}

// ============================================================================
// Tag System Types
// ============================================================================

export const TAG_CATEGORIES = {
  TECHNOLOGY: "technology",
  DESIGN: "design",
  DOMAIN: "domain",
  SKILL: "skill",
} as const;

export type TagCategory = (typeof TAG_CATEGORIES)[keyof typeof TAG_CATEGORIES];

export interface Tag {
  readonly id: TagId;
  readonly label: string;
  readonly category: TagCategory;
  readonly description?: string;
  readonly color?: string;
}

export interface TagGroup {
  readonly category: TagCategory;
  readonly tags: readonly Tag[];
}

// ============================================================================
// Search Types
// ============================================================================

export interface SearchResultMeta {
  readonly title: string;
  readonly description?: string;
  readonly date?: ISODate;
  readonly tags?: readonly string[];
  readonly image?: URL;
  readonly [key: string]: string | readonly string[] | undefined;
}

export interface SearchResult {
  readonly id: string;
  readonly url: string;
  readonly excerpt: string;
  readonly meta: SearchResultMeta;
  readonly content: string;
  readonly wordCount: number;
  readonly filters: Readonly<Record<string, readonly string[]>>;
  readonly subResults: readonly SearchSubResult[];
  readonly score?: number;
}

export interface SearchSubResult {
  readonly title: string;
  readonly url: string;
  readonly excerpt: string;
}

export interface SearchOptions {
  readonly query: string;
  readonly debounce?: number;
  readonly maxResults?: number;
  readonly filters?: Readonly<Record<string, readonly string[]>>;
  readonly sortBy?: "relevance" | "date" | "title";
}

export interface SearchStats {
  readonly totalSearches: number;
  readonly totalResults: number;
  readonly averageResults: number;
  readonly failedSearches: number;
  readonly successRate: number;
}

// ============================================================================
// Filter Types
// ============================================================================

export type FilterType = "writing" | "work";

export interface FilterState {
  readonly type: FilterType;
  readonly activeTags: ReadonlySet<TagId>;
  readonly visibleCount: number;
  readonly totalCount: number;
}

export interface FilterEvent {
  readonly type: FilterType;
  readonly tag: TagId;
  readonly isActive: boolean;
  readonly activeCount: number;
  readonly timestamp: number;
}

// ============================================================================
// Form Types
// ============================================================================

export interface ContactFormData {
  readonly name: string;
  readonly email: Email;
  readonly message: string;
  readonly timestamp: ISODate;
  readonly honeypot?: string;
}

export interface FormValidationError {
  readonly field: keyof ContactFormData;
  readonly message: string;
  readonly code: string;
}

export interface FormState<T> {
  readonly data: Partial<T>;
  readonly errors: readonly FormValidationError[];
  readonly isSubmitting: boolean;
  readonly isValid: boolean;
  readonly isDirty: boolean;
}

// ============================================================================
// SEO Types
// ============================================================================

export interface OpenGraphMeta {
  readonly "og:type": "website" | "article";
  readonly "og:title": string;
  readonly "og:description": string;
  readonly "og:url": string;
  readonly "og:image": string;
  readonly "og:site_name": string;
  readonly "og:locale"?: string;
}

export interface TwitterCardMeta {
  readonly "twitter:card": "summary" | "summary_large_image";
  readonly "twitter:title": string;
  readonly "twitter:description": string;
  readonly "twitter:url": string;
  readonly "twitter:image": string;
  readonly "twitter:creator"?: string;
}

export interface StructuredData {
  readonly "@context": "https://schema.org";
  readonly "@type": string;
  readonly [key: string]: unknown;
}

export interface ArticleSchema extends StructuredData {
  readonly "@type": "BlogPosting";
  readonly headline: string;
  readonly description: string;
  readonly datePublished: ISODate;
  readonly dateModified?: ISODate;
  readonly author: {
    readonly "@type": "Person";
    readonly name: string;
  };
  readonly image?: string;
  readonly url: string;
}

export interface BreadcrumbItem {
  readonly "@type": "ListItem";
  readonly position: number;
  readonly name: string;
  readonly item: string;
}

export interface BreadcrumbSchema extends StructuredData {
  readonly "@type": "BreadcrumbList";
  readonly itemListElement: readonly BreadcrumbItem[];
}

// ============================================================================
// Social Types
// ============================================================================

export const SOCIAL_PLATFORMS = {
  GITHUB: "github",
  LINKEDIN: "linkedin",
  TWITTER: "twitter",
  MASTODON: "mastodon",
} as const;

export type SocialPlatform =
  (typeof SOCIAL_PLATFORMS)[keyof typeof SOCIAL_PLATFORMS];

export interface SocialLink {
  readonly href: string;
  readonly label: string;
  readonly platform: SocialPlatform;
  readonly icon: string;
  readonly username?: string;
}

export interface ShareOptions {
  readonly url: string;
  readonly title?: string;
  readonly text?: string;
  readonly hashtags?: readonly string[];
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface SiteConfig {
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly email: Email;
  readonly url: string;
  readonly locale: string;
  readonly timezone: string;
}

export interface AnalyticsConfig {
  readonly enabled: boolean;
  readonly trackingId?: string;
  readonly anonymizeIp: boolean;
  readonly respectDnt: boolean;
}

export interface SearchConfig {
  readonly minQueryLength: number;
  readonly maxResults: number;
  readonly debounceDelay: number;
  readonly highlightClass: string;
}

export interface FilterConfig {
  readonly urlParam: string;
  readonly urlUpdateDelay: number;
  readonly animationDuration: number;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: ApiError;
  readonly timestamp: ISODate;
}

export interface ApiError {
  readonly code: string;
  readonly message: string;
  readonly field?: string;
  readonly details?: unknown;
}

export type ApiResult<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: ApiError };

// ============================================================================
// Utility Functions Types
// ============================================================================

export type DateFormatter = (date: Date | string, locale?: string) => string;
export type NumberFormatter = (num: number, locale?: string) => string;
export type Validator<T> = (value: unknown) => value is T;
export type Parser<T> = (value: unknown) => T | null;

// ============================================================================
// Error Types
// ============================================================================

export interface AppError {
  readonly name: string;
  readonly message: string;
  readonly code: string;
  readonly timestamp: ISODate;
  readonly context?: Readonly<Record<string, unknown>>;
  readonly cause?: Error | undefined;
}

export class ValidationError extends Error implements AppError {
  readonly code = "VALIDATION_ERROR";
  readonly timestamp: ISODate;
  readonly context?: Readonly<Record<string, unknown>>;
  override readonly cause?: Error | undefined;

  constructor(message: string, context?: Record<string, unknown>) {
    super(message);
    this.name = "ValidationError";
    this.timestamp = new Date().toISOString() as ISODate;
    this.context = context;
  }
}

export class NotFoundError extends Error implements AppError {
  readonly code = "NOT_FOUND";
  readonly timestamp: ISODate;
  readonly context?: Readonly<Record<string, unknown>>;
  override readonly cause?: Error | undefined;

  constructor(message: string, context?: Record<string, unknown>) {
    super(message);
    this.name = "NotFoundError";
    this.timestamp = new Date().toISOString() as ISODate;
    this.context = context;
  }
}

// ============================================================================
// Type Guards
// ============================================================================

export function isPageId(value: unknown): value is PageId {
  return (
    typeof value === "string" &&
    Object.values(PAGE_IDS).includes(value as PageId)
  );
}

export function isContentType(value: unknown): value is ContentType {
  return (
    typeof value === "string" &&
    Object.values(CONTENT_TYPES).includes(value as ContentType)
  );
}

export function isTagCategory(value: unknown): value is TagCategory {
  return (
    typeof value === "string" &&
    Object.values(TAG_CATEGORIES).includes(value as TagCategory)
  );
}

export function isSocialPlatform(value: unknown): value is SocialPlatform {
  return (
    typeof value === "string" &&
    Object.values(SOCIAL_PLATFORMS).includes(value as SocialPlatform)
  );
}

export function isEmail(value: unknown): value is Email {
  if (typeof value !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

export function isURL(value: unknown): value is URL {
  if (typeof value !== "string") return false;
  try {
    new globalThis.URL(value);
    return true;
  } catch {
    return false;
  }
}

export function isISODate(value: unknown): value is ISODate {
  if (typeof value !== "string") return false;
  const date = new Date(value);
  return !isNaN(date.getTime()) && value === date.toISOString();
}

// ============================================================================
// Type Assertions
// ============================================================================

export function assertPageId(value: unknown): asserts value is PageId {
  if (!isPageId(value)) {
    throw new ValidationError(`Invalid page ID: ${value}`);
  }
}

export function assertEmail(value: unknown): asserts value is Email {
  if (!isEmail(value)) {
    throw new ValidationError(`Invalid email: ${value}`);
  }
}

export function assertURL(value: unknown): asserts value is URL {
  if (!isURL(value)) {
    throw new ValidationError(`Invalid URL: ${value}`);
  }
}

// ============================================================================
// Constants
// ============================================================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

export const ANIMATION_DURATION = {
  FAST: 150,
  BASE: 200,
  SLOW: 300,
  VERY_SLOW: 500,
} as const;

export type AnimationDuration =
  (typeof ANIMATION_DURATION)[keyof typeof ANIMATION_DURATION];

export const EASING = {
  LINEAR: "linear",
  EASE: "ease",
  EASE_IN: "ease-in",
  EASE_OUT: "ease-out",
  EASE_IN_OUT: "ease-in-out",
} as const;

export type Easing = (typeof EASING)[keyof typeof EASING];
