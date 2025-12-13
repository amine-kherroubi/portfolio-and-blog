/**
 * Card Style Utilities
 *
 * Shared utilities for card components to reduce duplication
 * and maintain consistent styling across BlogCard and ProjectCard.
 */

// ============================================================================
// Types
// ============================================================================

export type CardVariant = "featured" | "grid" | "list";

export interface CardClassNames {
  readonly container: string;
  readonly link: string;
  readonly image: string;
  readonly content: string;
  readonly metadata: string;
  readonly title: string;
  readonly description: string;
  readonly action: string;
}

// ============================================================================
// Grid Span Utilities
// ============================================================================

/**
 * Get grid span classes based on variant and custom span
 */
export function getGridSpanClass(
  variant: CardVariant,
  customSpan?: string
): string {
  if (customSpan) return customSpan;

  switch (variant) {
    case "featured":
      return "col-span-1";
    case "grid":
      return "col-span-1";
    case "list":
      return "";
    default:
      return "";
  }
}

// ============================================================================
// Card Layout Classes
// ============================================================================

/**
 * Get container classes for card variant
 */
export function getCardContainerClasses(variant: CardVariant): string {
  const baseClasses = "group relative";

  switch (variant) {
    case "featured":
    case "grid":
      return `${baseClasses} overflow-hidden bg-white border-4 border-black hover:bg-gray-50 transition-colors`;

    case "list":
      return `${baseClasses} border-b-2 border-black last:border-b-0`;

    default:
      return baseClasses;
  }
}

/**
 * Get link classes for card variant
 */
export function getCardLinkClasses(variant: CardVariant): string {
  const baseClasses =
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-4";

  switch (variant) {
    case "featured":
    case "grid":
      return `block h-full ${baseClasses}`;

    case "list":
      return `group block py-16 transition-colors duration-200 hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white ${baseClasses}`;

    default:
      return baseClasses;
  }
}

/**
 * Get content padding classes for card variant
 */
export function getCardContentClasses(variant: CardVariant): string {
  switch (variant) {
    case "featured":
    case "grid":
      return "p-12";

    case "list":
      return "grid grid-cols-12 gap-12 items-start px-16";

    default:
      return "";
  }
}

// ============================================================================
// Typography Classes
// ============================================================================

/**
 * Get metadata classes (date, reading time, etc)
 */
export function getMetadataClasses(variant: CardVariant): string {
  const baseClasses =
    "flex items-center gap-4 text-sm font-bold uppercase tracking-[0.15em]";

  switch (variant) {
    case "featured":
    case "grid":
      return `${baseClasses} mb-6`;

    case "list":
      return `col-span-2 text-[0.8125rem] font-bold uppercase tracking-[0.15em] opacity-60 group-hover:opacity-100 transition-opacity`;

    default:
      return baseClasses;
  }
}

/**
 * Get title classes for card variant
 */
export function getTitleClasses(variant: CardVariant): string {
  const hoverEffect = "group-hover:underline decoration-2 underline-offset-8";

  switch (variant) {
    case "featured":
    case "grid":
      return `text-4xl font-bold leading-tight mb-4 ${hoverEffect}`;

    case "list":
      return `text-[2.75rem] font-bold leading-[1.1] tracking-[-0.02em] mb-5`;

    default:
      return "text-2xl font-bold mb-4";
  }
}

/**
 * Get description classes for card variant
 */
export function getDescriptionClasses(variant: CardVariant): string {
  switch (variant) {
    case "featured":
    case "grid":
      return "text-xl text-black/70 leading-relaxed mb-6";

    case "list":
      return "text-[1.25rem] leading-[1.6] opacity-70 group-hover:opacity-100 transition-opacity mb-6";

    default:
      return "text-base text-black/70 leading-relaxed";
  }
}

// ============================================================================
// Image Classes
// ============================================================================

/**
 * Get image container classes
 */
export function getImageContainerClasses(hasBorder = true): string {
  const baseClasses = "aspect-video bg-gray-100 overflow-hidden";
  return hasBorder ? `${baseClasses} border-b-4 border-black` : baseClasses;
}

/**
 * Get image classes with hover effect
 */
export function getImageClasses(): string {
  return "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105";
}

// ============================================================================
// Action Button Classes
// ============================================================================

/**
 * Get action/CTA classes for card variant
 */
export function getActionClasses(variant: CardVariant): string {
  switch (variant) {
    case "featured":
    case "grid":
      return "inline-flex items-center gap-3 font-bold uppercase text-sm tracking-[0.15em]";

    case "list":
      return "col-span-3 flex items-center justify-end text-[0.8125rem] uppercase tracking-[0.15em] opacity-60 group-hover:opacity-100 transition-opacity";

    default:
      return "inline-flex items-center gap-2 font-bold";
  }
}

/**
 * Get arrow icon classes
 */
export function getArrowIconClasses(): string {
  return "w-6 h-6 transition-transform duration-200 group-hover:translate-x-1";
}

// ============================================================================
// Complete Card Classes
// ============================================================================

/**
 * Get all card classes for a variant
 */
export function getCardClasses(variant: CardVariant): CardClassNames {
  return {
    container: getCardContainerClasses(variant),
    link: getCardLinkClasses(variant),
    image: getImageClasses(),
    content: getCardContentClasses(variant),
    metadata: getMetadataClasses(variant),
    title: getTitleClasses(variant),
    description: getDescriptionClasses(variant),
    action: getActionClasses(variant),
  };
}

// ============================================================================
// Layout Helpers
// ============================================================================

/**
 * Check if variant needs list layout
 */
export function isListLayout(variant: CardVariant): boolean {
  return variant === "list";
}

/**
 * Check if variant needs grid/featured layout
 */
export function isGridLayout(variant: CardVariant): boolean {
  return variant === "featured" || variant === "grid";
}

// ============================================================================
// Content Helpers
// ============================================================================

/**
 * Format metadata separator
 */
export function renderMetadataSeparator(): string {
  return '<span class="w-2 h-2 bg-black rounded-full" aria-hidden="true"></span>';
}

/**
 * Generate aria label for card link
 */
export function getCardAriaLabel(
  title: string,
  type: "article" | "project"
): string {
  return type === "article"
    ? `Read article: ${title}`
    : `View project: ${title}`;
}
