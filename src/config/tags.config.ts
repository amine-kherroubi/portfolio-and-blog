/**
 * Tags Configuration - Extensible Tag System
 *
 * Add, remove, or modify tags without changing code structure.
 * Tags are organized by category for better organization.
 */

import type { Tag, TagId, TagCategory } from "@/types/index";

// ============================================================================
// Tag Categories
// ============================================================================

export const TAG_CATEGORIES = {
  TECHNOLOGY: "technology",
  DESIGN: "design",
  DOMAIN: "domain",
  SKILL: "skill",
  // Add more categories as needed
} as const;

// ============================================================================
// Tag Registry - Add/Remove Tags Here
// ============================================================================

/**
 * Central tag registry.
 *
 * To add a new tag:
 * 1. Add entry with unique id
 * 2. Specify label, category, and optional metadata
 *
 * To remove a tag:
 * 1. Delete the entry
 * 2. Remove references in content files
 */
export const TAG_REGISTRY: Record<string, Tag> = {
  // ========== Technology Tags ==========
  ai: {
    id: "ai" as TagId,
    label: "AI",
    category: "technology",
    description: "Artificial Intelligence and Machine Learning",
    color: "#FF6B6B",
  },
  python: {
    id: "python" as TagId,
    label: "Python",
    category: "technology",
    description: "Python programming language",
    color: "#3776AB",
  },
  typescript: {
    id: "typescript" as TagId,
    label: "TypeScript",
    category: "technology",
    description: "TypeScript programming language",
    color: "#3178C6",
  },
  javascript: {
    id: "javascript" as TagId,
    label: "JavaScript",
    category: "technology",
    description: "JavaScript programming language",
    color: "#F7DF1E",
  },
  react: {
    id: "react" as TagId,
    label: "React",
    category: "technology",
    description: "React library for building user interfaces",
    color: "#61DAFB",
  },
  astro: {
    id: "astro" as TagId,
    label: "Astro",
    category: "technology",
    description: "Astro web framework",
    color: "#FF5D01",
  },
  tensorflow: {
    id: "tensorflow" as TagId,
    label: "TensorFlow",
    category: "technology",
    description: "TensorFlow machine learning framework",
    color: "#FF6F00",
  },
  pytorch: {
    id: "pytorch" as TagId,
    label: "PyTorch",
    category: "technology",
    description: "PyTorch machine learning framework",
    color: "#EE4C2C",
  },
  qiskit: {
    id: "qiskit" as TagId,
    label: "Qiskit",
    category: "technology",
    description: "Qiskit quantum computing framework",
    color: "#6929C4",
  },
  canvas: {
    id: "canvas" as TagId,
    label: "Canvas API",
    category: "technology",
    description: "HTML5 Canvas API",
    color: "#E44D26",
  },

  // ========== Design Tags ==========
  design: {
    id: "design" as TagId,
    label: "Design",
    category: "design",
    description: "Visual and interaction design",
    color: "#9C27B0",
  },
  typography: {
    id: "typography" as TagId,
    label: "Typography",
    category: "design",
    description: "Typography and type design",
    color: "#673AB7",
  },
  minimalism: {
    id: "minimalism" as TagId,
    label: "Minimalism",
    category: "design",
    description: "Minimalist design approach",
    color: "#000000",
  },
  "swiss-design": {
    id: "swiss-design" as TagId,
    label: "Swiss Design",
    category: "design",
    description: "Swiss/International Typographic Style",
    color: "#D32F2F",
  },
  "design-systems": {
    id: "design-systems" as TagId,
    label: "Design Systems",
    category: "design",
    description: "Design system development",
    color: "#1976D2",
  },
  "ui-ux": {
    id: "ui-ux" as TagId,
    label: "UI/UX",
    category: "design",
    description: "User interface and user experience design",
    color: "#7B1FA2",
  },

  // ========== Domain Tags ==========
  research: {
    id: "research" as TagId,
    label: "Research",
    category: "domain",
    description: "Research and academic work",
    color: "#0288D1",
  },
  creative: {
    id: "creative" as TagId,
    label: "Creative",
    category: "domain",
    description: "Creative and artistic work",
    color: "#F06292",
  },
  "machine-learning": {
    id: "machine-learning" as TagId,
    label: "Machine Learning",
    category: "domain",
    description: "Machine learning and AI applications",
    color: "#00897B",
  },
  "quantum-computing": {
    id: "quantum-computing" as TagId,
    label: "Quantum Computing",
    category: "domain",
    description: "Quantum computing research and development",
    color: "#5E35B1",
  },
  "web-development": {
    id: "web-development" as TagId,
    label: "Web Development",
    category: "domain",
    description: "Web development and engineering",
    color: "#43A047",
  },
  "data-science": {
    id: "data-science" as TagId,
    label: "Data Science",
    category: "domain",
    description: "Data science and analytics",
    color: "#FB8C00",
  },

  // ========== Skill Tags ==========
  frontend: {
    id: "frontend" as TagId,
    label: "Frontend",
    category: "skill",
    description: "Frontend development skills",
    color: "#42A5F5",
  },
  backend: {
    id: "backend" as TagId,
    label: "Backend",
    category: "skill",
    description: "Backend development skills",
    color: "#66BB6A",
  },
  "full-stack": {
    id: "full-stack" as TagId,
    label: "Full Stack",
    category: "skill",
    description: "Full-stack development",
    color: "#26A69A",
  },
  architecture: {
    id: "architecture" as TagId,
    label: "Architecture",
    category: "skill",
    description: "Software architecture and system design",
    color: "#8D6E63",
  },
  optimization: {
    id: "optimization" as TagId,
    label: "Optimization",
    category: "skill",
    description: "Performance optimization",
    color: "#EF5350",
  },
  accessibility: {
    id: "accessibility" as TagId,
    label: "Accessibility",
    category: "skill",
    description: "Web accessibility (a11y)",
    color: "#AB47BC",
  },
  testing: {
    id: "testing" as TagId,
    label: "Testing",
    category: "skill",
    description: "Software testing and QA",
    color: "#26C6DA",
  },
} as const;

// ============================================================================
// Export Tags (Backward Compatibility)
// ============================================================================

export const TAGS = TAG_REGISTRY;

// ============================================================================
// Tag Utility Functions
// ============================================================================

/**
 * Get all available tags
 */
export function getAllTags(): readonly Tag[] {
  return Object.values(TAG_REGISTRY);
}

/**
 * Get tags by IDs with validation
 */
export function getTagsByIds(tagIds: readonly TagId[]): readonly Tag[] {
  return tagIds
    .map((id) => TAG_REGISTRY[id as keyof typeof TAG_REGISTRY])
    .filter((tag): tag is Tag => tag !== undefined);
}

/**
 * Get tags by category
 */
export function getTagsByCategory(category: TagCategory): readonly Tag[] {
  return getAllTags().filter((tag) => tag.category === category);
}

/**
 * Sort tags by category, then by label
 */
export function sortTagsByCategory(tags: readonly Tag[]): readonly Tag[] {
  return [...tags].sort((a, b) =>
    a.category === b.category
      ? a.label.localeCompare(b.label)
      : a.category.localeCompare(b.category)
  );
}

/**
 * Sort tags alphabetically by label
 */
export function sortTagsByLabel(tags: readonly Tag[]): readonly Tag[] {
  return [...tags].sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Check if tag ID exists
 */
export function isValidTagId(id: string): id is TagId {
  return id in TAG_REGISTRY;
}

/**
 * Get tag by ID with fallback
 */
export function getTagById(id: TagId, fallback?: Tag): Tag | undefined {
  return TAG_REGISTRY[id as keyof typeof TAG_REGISTRY] || fallback;
}

/**
 * Search tags by query
 */
export function searchTags(query: string): readonly Tag[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];

  return getAllTags().filter(
    (tag) =>
      tag.label.toLowerCase().includes(lowerQuery) ||
      tag.description?.toLowerCase().includes(lowerQuery) ||
      tag.id.toLowerCase().includes(lowerQuery)
  );
}

export function getTagsGroupedByCategory(): Record<TagCategory, Tag[]> {
  const groups: Partial<Record<TagCategory, Tag[]>> = {};

  for (const tag of getAllTags()) {
    if (!tag.category) continue; // skip undefined categories

    if (!groups[tag.category]) {
      groups[tag.category] = [];
    }
    groups[tag.category]!.push(tag);
  }

  // Sort tags within each category
  for (const category in groups) {
    groups[category as TagCategory]!.sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }

  return groups as Record<TagCategory, Tag[]>;
}

/**
 * Get tag statistics
 */
export function getTagStatistics(): {
  total: number;
  byCategory: Record<TagCategory, number>;
  mostUsed: Tag[];
} {
  const tags = getAllTags();
  const byCategory: Record<string, number> = {};

  for (const tag of tags) {
    byCategory[tag.category] = (byCategory[tag.category] || 0) + 1;
  }

  return {
    total: tags.length,
    byCategory: byCategory as Record<TagCategory, number>,
    mostUsed: [], // Could be calculated from content if needed
  };
}

/**
 * Validate tag IDs against registry
 */
export function validateTagIds(tagIds: readonly string[]): {
  valid: readonly TagId[];
  invalid: readonly string[];
} {
  const valid: TagId[] = [];
  const invalid: string[] = [];

  for (const id of tagIds) {
    if (isValidTagId(id)) {
      valid.push(id as TagId);
    } else {
      invalid.push(id);
    }
  }

  return { valid, invalid };
}

/**
 * Get suggested tags based on existing tags
 */
export function getSuggestedTags(
  existingTags: readonly TagId[],
  limit: number = 5
): readonly Tag[] {
  // Get tags from same categories
  const existingCategories = new Set(
    getTagsByIds(existingTags).map((tag) => tag.category)
  );

  const suggested = getAllTags()
    .filter(
      (tag) =>
        !existingTags.includes(tag.id) && existingCategories.has(tag.category)
    )
    .slice(0, limit);

  return suggested;
}

// ============================================================================
// Type Exports
// ============================================================================

export type { Tag, TagId, TagCategory };
