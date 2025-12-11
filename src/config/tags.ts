/**
 * Tags Configuration
 * 
 * Tag definitions for categorizing content.
 * Tags are organized by category for better organization.
 */

/**
 * Tag interface
 */
export interface Tag {
  /** Unique tag identifier */
  id: string;
  /** Display label */
  label: string;
  /** Category for grouping */
  category: "technology" | "design" | "domain" | "skill";
}

export const TAGS: Record<string, Tag> = {
  // Technology tags
  ai: { id: "ai", label: "AI", category: "technology" },
  python: { id: "python", label: "Python", category: "technology" },
  typescript: { id: "typescript", label: "TypeScript", category: "technology" },
  react: { id: "react", label: "React", category: "technology" },
  astro: { id: "astro", label: "Astro", category: "technology" },
  tensorflow: { id: "tensorflow", label: "TensorFlow", category: "technology" },
  pytorch: { id: "pytorch", label: "PyTorch", category: "technology" },
  qiskit: { id: "qiskit", label: "Qiskit", category: "technology" },
  canvas: { id: "canvas", label: "Canvas API", category: "technology" },

  // Design tags
  design: { id: "design", label: "Design", category: "design" },
  typography: { id: "typography", label: "Typography", category: "design" },
  minimalism: { id: "minimalism", label: "Minimalism", category: "design" },
  "swiss-design": {
    id: "swiss-design",
    label: "Swiss Design",
    category: "design",
  },
  "design-systems": {
    id: "design-systems",
    label: "Design Systems",
    category: "design",
  },

  // Domain tags
  research: { id: "research", label: "Research", category: "domain" },
  creative: { id: "creative", label: "Creative", category: "domain" },
  "machine-learning": {
    id: "machine-learning",
    label: "Machine Learning",
    category: "domain",
  },
  "quantum-computing": {
    id: "quantum-computing",
    label: "Quantum Computing",
    category: "domain",
  },
  "web-development": {
    id: "web-development",
    label: "Web Development",
    category: "domain",
  },

  // Skill tags
  frontend: { id: "frontend", label: "Frontend", category: "skill" },
  backend: { id: "backend", label: "Backend", category: "skill" },
  "full-stack": { id: "full-stack", label: "Full Stack", category: "skill" },
  architecture: {
    id: "architecture",
    label: "Architecture",
    category: "skill",
  },
  optimization: {
    id: "optimization",
    label: "Optimization",
    category: "skill",
  },
} as const;

/**
 * Tag ID type (keys of TAGS object)
 */
export type TagId = keyof typeof TAGS;

/**
 * Get tags by their IDs
 * @param tagIds - Array of tag IDs
 * @returns Array of Tag objects
 */
export function getTagsByIds(tagIds: TagId[]): Tag[] {
  return tagIds.map((id) => TAGS[id]).filter(Boolean);
}

/**
 * Sort tags by category, then by label
 * @param tags - Array of Tag objects
 * @returns Sorted array of Tag objects
 */
export function sortTagsByCategory(tags: Tag[]): Tag[] {
  return [...tags].sort((a, b) =>
    a.category === b.category
      ? a.label.localeCompare(b.label)
      : a.category.localeCompare(b.category)
  );
}
