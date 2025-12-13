/**
 * Profile Data
 *
 * Centralized profile information including experience, principles, and capabilities.
 * Separated from page files to maintain separation of concerns.
 */

export interface ExperienceItem {
  period: string;
  title: string;
  company: string;
}

export interface Principle {
  title: string;
  description: string;
}

export interface Capability {
  title: string;
  items: string[];
}

/**
 * Professional experience timeline
 */
export const experience: ExperienceItem[] = [
  {
    period: "2024 — Now",
    title: "Independent Designer & Developer",
    company: "Self-initiated projects and collaborations",
  },
  {
    period: "2023",
    title: "Full Stack Developer",
    company: "Tech Company",
  },
  {
    period: "2022",
    title: "Frontend Developer",
    company: "Design Studio",
  },
];

/**
 * Design and development principles
 */
export const principles: Principle[] = [
  {
    title: "Less, but better",
    description:
      "Clarity, hierarchy, and restraint. Every element has a job, or it leaves.",
  },
  {
    title: "Utility first",
    description:
      "Design and code serve the same purpose: make the path obvious and unobtrusive.",
  },
  {
    title: "Calm interactions",
    description:
      "Static by default. Subtle hover cues only where they help the reader orient.",
  },
  {
    title: "Systems thinking",
    description:
      "Consistent grids, measured typography, accessible color, and durable patterns.",
  },
];

/**
 * Capabilities grouped by category
 */
export const capabilities: Capability[] = [
  {
    title: "Design",
    items: [
      "Interface Design",
      "Design Systems",
      "Typography",
      "Visual Identity",
    ],
  },
  {
    title: "Development",
    items: [
      "Frontend Engineering",
      "Python / TypeScript",
      "Machine Learning",
      "Algorithm Design",
    ],
  },
  {
    title: "Strategy",
    items: [
      "Technical Architecture",
      "Problem Solving",
      "Research & Analysis",
      "Process Optimization",
    ],
  },
];
