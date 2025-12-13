/**
 * Tags Configuration
 *
 * Tag definitions for categorizing content.
 * Tags are organized by category for better organization.
 */

import type { Tag, TagId } from "@/types/index";

export const TAGS = {
  // Technology tags
  ai: { id: "ai" as TagId, label: "AI", category: "technology" as const },
  python: {
    id: "python" as TagId,
    label: "Python",
    category: "technology" as const,
  },
  typescript: {
    id: "typescript" as TagId,
    label: "TypeScript",
    category: "technology" as const,
  },
  react: {
    id: "react" as TagId,
    label: "React",
    category: "technology" as const,
  },
  astro: {
    id: "astro" as TagId,
    label: "Astro",
    category: "technology" as const,
  },
  tensorflow: {
    id: "tensorflow" as TagId,
    label: "TensorFlow",
    category: "technology" as const,
  },
  pytorch: {
    id: "pytorch" as TagId,
    label: "PyTorch",
    category: "technology" as const,
  },
  qiskit: {
    id: "qiskit" as TagId,
    label: "Qiskit",
    category: "technology" as const,
  },
  canvas: {
    id: "canvas" as TagId,
    label: "Canvas API",
    category: "technology" as const,
  },

  // Design tags
  design: {
    id: "design" as TagId,
    label: "Design",
    category: "design" as const,
  },
  typography: {
    id: "typography" as TagId,
    label: "Typography",
    category: "design" as const,
  },
  minimalism: {
    id: "minimalism" as TagId,
    label: "Minimalism",
    category: "design" as const,
  },
  "swiss-design": {
    id: "swiss-design" as TagId,
    label: "Swiss Design",
    category: "design" as const,
  },
  "design-systems": {
    id: "design-systems" as TagId,
    label: "Design Systems",
    category: "design" as const,
  },

  // Domain tags
  research: {
    id: "research" as TagId,
    label: "Research",
    category: "domain" as const,
  },
  creative: {
    id: "creative" as TagId,
    label: "Creative",
    category: "domain" as const,
  },
  "machine-learning": {
    id: "machine-learning" as TagId,
    label: "Machine Learning",
    category: "domain" as const,
  },
  "quantum-computing": {
    id: "quantum-computing" as TagId,
    label: "Quantum Computing",
    category: "domain" as const,
  },
  "web-development": {
    id: "web-development" as TagId,
    label: "Web Development",
    category: "domain" as const,
  },

  // Skill tags
  frontend: {
    id: "frontend" as TagId,
    label: "Frontend",
    category: "skill" as const,
  },
  backend: {
    id: "backend" as TagId,
    label: "Backend",
    category: "skill" as const,
  },
  "full-stack": {
    id: "full-stack" as TagId,
    label: "Full Stack",
    category: "skill" as const,
  },
  architecture: {
    id: "architecture" as TagId,
    label: "Architecture",
    category: "skill" as const,
  },
  optimization: {
    id: "optimization" as TagId,
    label: "Optimization",
    category: "skill" as const,
  },
} as const satisfies Record<string, Tag>;

/**
 * Tag ID type (keys of TAGS object)
 */
export type { TagId, Tag };

/**
 * Get tags by their IDs
 *
 * Converts an array of tag IDs to their corresponding Tag objects.
 * Filters out any invalid or missing tag IDs.
 *
 * @param tagIds - Array of tag IDs to look up
 * @returns Array of Tag objects corresponding to the provided IDs
 */
export function getTagsByIds(tagIds: readonly TagId[]): readonly Tag[] {
  return tagIds
    .map((id) => TAGS[id as keyof typeof TAGS])
    .filter(
      (tag): tag is (typeof TAGS)[keyof typeof TAGS] => tag !== undefined
    );
}

/**
 * Sort tags by category, then by label
 *
 * Sorts tags first by their category (alphabetically), then by their
 * label within each category. Returns a new array without mutating the original.
 *
 * @param tags - Array of Tag objects to sort
 * @returns New sorted array of Tag objects
 */
export function sortTagsByCategory(tags: readonly Tag[]): readonly Tag[] {
  return [...tags].sort((a, b) =>
    // First sort by category, then by label within the same category
    a.category === b.category
      ? a.label.localeCompare(b.label)
      : a.category.localeCompare(b.category)
  );
}
