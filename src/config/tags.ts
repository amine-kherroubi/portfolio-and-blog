export interface Tag {
  id: string;
  label: string;
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

export type TagId = keyof typeof TAGS;

// Helper function to get tags by IDs
export function getTagsByIds(tagIds: TagId[]): Tag[] {
  return tagIds.map((id) => TAGS[id]).filter(Boolean);
}

// Helper function to get all tags by category
export function getTagsByCategory(category: Tag["category"]): Tag[] {
  return Object.values(TAGS).filter((tag) => tag.category === category);
}

// Helper function to get all unique categories
export function getAllCategories(): Tag["category"][] {
  return Array.from(new Set(Object.values(TAGS).map((tag) => tag.category)));
}
