/**
 * Profile Data
 *
 * Centralized profile information that can be easily modified
 * without changing component code.
 */

// ============================================================================
// Types
// ============================================================================

export interface ExperienceItem {
  period: string;
  title: string;
  company: string;
  description?: string;
  location?: string;
  enabled?: boolean;
  order?: number;
}

export interface Principle {
  title: string;
  description: string;
  icon?: string;
  enabled?: boolean;
  order?: number;
}

export interface Capability {
  title: string;
  items: string[];
  icon?: string;
  enabled?: boolean;
  order?: number;
}

export interface ProfileInfo {
  role: string;
  location: string;
  timezone: string;
  availability: string;
  yearsOfExperience?: number;
}

// ============================================================================
// Profile Information
// ============================================================================

export const PROFILE_INFO: ProfileInfo = {
  role: "Designer & Developer",
  location: "Remote • CET",
  timezone: "CET",
  availability: "Select collaborations, 2025",
  yearsOfExperience: 5,
};

// ============================================================================
// Experience Timeline
// ============================================================================

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    period: "2024 — Now",
    title: "Independent Designer & Developer",
    company: "Self-initiated projects and collaborations",
    description: "Creating thoughtful digital products and experiences",
    location: "Remote",
    enabled: true,
    order: 1,
  },
  {
    period: "2023",
    title: "Full Stack Developer",
    company: "Tech Company",
    description: "Building scalable web applications",
    location: "Remote",
    enabled: true,
    order: 2,
  },
  {
    period: "2022",
    title: "Frontend Developer",
    company: "Design Studio",
    description: "Crafting user interfaces and experiences",
    location: "Remote",
    enabled: true,
    order: 3,
  },
  // Add more experience items as needed
];

// ============================================================================
// Design Principles
// ============================================================================

export const DESIGN_PRINCIPLES: Principle[] = [
  {
    title: "Less, but better",
    description:
      "Clarity, hierarchy, and restraint. Every element has a job, or it leaves.",
    icon: "minimize",
    enabled: true,
    order: 1,
  },
  {
    title: "Utility first",
    description:
      "Design and code serve the same purpose: make the path obvious and unobtrusive.",
    icon: "tool",
    enabled: true,
    order: 2,
  },
  {
    title: "Calm interactions",
    description:
      "Static by default. Subtle hover cues only where they help the reader orient.",
    icon: "calm",
    enabled: true,
    order: 3,
  },
  {
    title: "Systems thinking",
    description:
      "Consistent grids, measured typography, accessible color, and durable patterns.",
    icon: "system",
    enabled: true,
    order: 4,
  },
  // Add more principles as needed
];

// ============================================================================
// Capabilities
// ============================================================================

export const CAPABILITIES: Capability[] = [
  {
    title: "Design",
    items: [
      "Interface Design",
      "Design Systems",
      "Typography",
      "Visual Identity",
    ],
    icon: "palette",
    enabled: true,
    order: 1,
  },
  {
    title: "Development",
    items: [
      "Frontend Engineering",
      "Python / TypeScript",
      "Machine Learning",
      "Algorithm Design",
    ],
    icon: "code",
    enabled: true,
    order: 2,
  },
  {
    title: "Strategy",
    items: [
      "Technical Architecture",
      "Problem Solving",
      "Research & Analysis",
      "Process Optimization",
    ],
    icon: "strategy",
    enabled: true,
    order: 3,
  },
  // Add more capability groups as needed
];

// ============================================================================
// Skills & Technologies
// ============================================================================

export const SKILLS = {
  design: ["Figma", "Adobe Creative Suite", "Sketch", "InVision", "Principle"],
  frontend: [
    "HTML/CSS",
    "JavaScript/TypeScript",
    "React",
    "Astro",
    "Tailwind CSS",
  ],
  backend: ["Node.js", "Python", "SQL/NoSQL", "REST APIs", "GraphQL"],
  tools: ["Git", "VS Code", "Terminal", "Docker", "CI/CD"],
};

// ============================================================================
// Certifications & Education
// ============================================================================

export const CERTIFICATIONS = [
  {
    title: "Certification Name",
    issuer: "Issuing Organization",
    date: "2024",
    url: "https://example.com/cert",
    enabled: false,
  },
  // Add certifications as needed
];

export const EDUCATION = [
  {
    degree: "Degree Name",
    institution: "Institution Name",
    year: "2020",
    description: "Description of studies",
    enabled: false,
  },
  // Add education items as needed
];

// ============================================================================
// Achievements & Awards
// ============================================================================

export const ACHIEVEMENTS = [
  {
    title: "Achievement Title",
    description: "Description of achievement",
    date: "2024",
    enabled: false,
  },
  // Add achievements as needed
];

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get filtered and sorted experience items
 */
export function getExperienceItems(): readonly ExperienceItem[] {
  return EXPERIENCE_ITEMS.filter((item) => item.enabled !== false).sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );
}

/**
 * Get filtered and sorted principles
 */
export function getDesignPrinciples(): readonly Principle[] {
  return DESIGN_PRINCIPLES.filter((item) => item.enabled !== false).sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );
}

/**
 * Get filtered and sorted capabilities
 */
export function getCapabilities(): readonly Capability[] {
  return CAPABILITIES.filter((item) => item.enabled !== false).sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );
}

/**
 * Get all skills organized by category
 */
export function getAllSkills(): typeof SKILLS {
  return SKILLS;
}

/**
 * Get enabled certifications
 */
export function getCertifications() {
  return CERTIFICATIONS.filter((cert) => cert.enabled !== false);
}

/**
 * Get enabled education items
 */
export function getEducation() {
  return EDUCATION.filter((edu) => edu.enabled !== false);
}

/**
 * Get enabled achievements
 */
export function getAchievements() {
  return ACHIEVEMENTS.filter((achievement) => achievement.enabled !== false);
}

/**
 * Get complete profile data
 */
export function getCompleteProfile() {
  return {
    info: PROFILE_INFO,
    experience: getExperienceItems(),
    principles: getDesignPrinciples(),
    capabilities: getCapabilities(),
    skills: getAllSkills(),
    certifications: getCertifications(),
    education: getEducation(),
    achievements: getAchievements(),
  };
}

// ============================================================================
// Backward Compatibility Exports
// ============================================================================

export const experience = getExperienceItems();
export const principles = getDesignPrinciples();
export const capabilities = getCapabilities();
