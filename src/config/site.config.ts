/**
 * Site Configuration - Centralized & Extensible
 *
 * All configurable values in one place.
 * Override via environment variables or this file.
 */

// ============================================================================
// Environment Variables Helper
// ============================================================================

function getEnv(key: string, fallback: string = ""): string {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env[key] || fallback;
  }
  if (typeof process !== "undefined" && process.env) {
    return process.env[key] || fallback;
  }
  return fallback;
}

function getEnvNumber(key: string, fallback: number): number {
  const value = getEnv(key);
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}

function getEnvBoolean(key: string, fallback: boolean): boolean {
  const value = getEnv(key);
  if (!value) return fallback;
  return value.toLowerCase() === "true" || value === "1";
}

// ============================================================================
// Site Information
// ============================================================================

export const SITE_CONFIG = {
  // Basic Information
  name: getEnv("PUBLIC_SITE_NAME", "Your Name"),
  title: getEnv("PUBLIC_SITE_TITLE", "Your Name — Designer & Developer"),
  description: getEnv(
    "PUBLIC_SITE_DESCRIPTION",
    "Portfolio and blog showcasing work and thoughts"
  ),
  email: getEnv("PUBLIC_SITE_EMAIL", "your@email.com"),
  url: getEnv("PUBLIC_SITE_URL", "http://localhost:4321"),

  // Localization
  locale: getEnv("PUBLIC_SITE_LOCALE", "en-US"),
  language: getEnv("PUBLIC_SITE_LANGUAGE", "en"),
  timezone: getEnv("PUBLIC_SITE_TIMEZONE", "UTC"),

  // Author Information
  author: {
    name: getEnv("PUBLIC_AUTHOR_NAME", "Your Name"),
    email: getEnv("PUBLIC_AUTHOR_EMAIL", "your@email.com"),
    jobTitle: getEnv("PUBLIC_AUTHOR_JOB_TITLE", "Designer & Developer"),
    bio: getEnv("PUBLIC_AUTHOR_BIO", "Creating thoughtful digital experiences"),
    avatar: getEnv("PUBLIC_AUTHOR_AVATAR", "/avatar.jpg"),
  },

  // SEO Defaults
  seo: {
    titleSeparator: getEnv("PUBLIC_SEO_TITLE_SEPARATOR", "—"),
    maxTitleLength: getEnvNumber("PUBLIC_SEO_MAX_TITLE_LENGTH", 60),
    maxDescriptionLength: getEnvNumber(
      "PUBLIC_SEO_MAX_DESCRIPTION_LENGTH",
      160
    ),
    ogImage: getEnv("PUBLIC_SEO_OG_IMAGE", "/og-image.jpg"),
    twitterCard: getEnv("PUBLIC_SEO_TWITTER_CARD", "summary_large_image") as
      | "summary"
      | "summary_large_image",
  },

  // Features
  features: {
    search: getEnvBoolean("PUBLIC_FEATURE_SEARCH", true),
    darkMode: getEnvBoolean("PUBLIC_FEATURE_DARK_MODE", false),
    comments: getEnvBoolean("PUBLIC_FEATURE_COMMENTS", false),
    newsletter: getEnvBoolean("PUBLIC_FEATURE_NEWSLETTER", false),
    analytics: getEnvBoolean("PUBLIC_FEATURE_ANALYTICS", false),
  },
} as const;

// ============================================================================
// Social Media Links
// ============================================================================

export const SOCIAL_CONFIG = {
  github: {
    enabled: getEnvBoolean("PUBLIC_SOCIAL_GITHUB_ENABLED", true),
    url: getEnv("PUBLIC_SOCIAL_GITHUB_URL", "https://github.com/yourusername"),
    label: getEnv("PUBLIC_SOCIAL_GITHUB_LABEL", "GitHub"),
    icon: "github",
    platform: "github" as const,
  },
  linkedin: {
    enabled: getEnvBoolean("PUBLIC_SOCIAL_LINKEDIN_ENABLED", true),
    url: getEnv(
      "PUBLIC_SOCIAL_LINKEDIN_URL",
      "https://linkedin.com/in/yourusername"
    ),
    label: getEnv("PUBLIC_SOCIAL_LINKEDIN_LABEL", "LinkedIn"),
    icon: "linkedin",
    platform: "linkedin" as const,
  },
  twitter: {
    enabled: getEnvBoolean("PUBLIC_SOCIAL_TWITTER_ENABLED", false),
    url: getEnv("PUBLIC_SOCIAL_TWITTER_URL", ""),
    label: getEnv("PUBLIC_SOCIAL_TWITTER_LABEL", "Twitter"),
    icon: "twitter",
    platform: "twitter" as const,
  },
  mastodon: {
    enabled: getEnvBoolean("PUBLIC_SOCIAL_MASTODON_ENABLED", false),
    url: getEnv("PUBLIC_SOCIAL_MASTODON_URL", ""),
    label: getEnv("PUBLIC_SOCIAL_MASTODON_LABEL", "Mastodon"),
    icon: "mastodon",
    platform: "mastodon" as const,
  },
  // Add more social platforms as needed
} as const;

// ============================================================================
// Navigation Configuration
// ============================================================================

export const NAVIGATION_CONFIG = {
  links: [
    {
      href: "/profile",
      label: "Profile",
      page: "profile" as const,
      enabled: getEnvBoolean("PUBLIC_NAV_PROFILE_ENABLED", true),
      order: getEnvNumber("PUBLIC_NAV_PROFILE_ORDER", 1),
    },
    {
      href: "/work",
      label: "Work",
      page: "work" as const,
      enabled: getEnvBoolean("PUBLIC_NAV_WORK_ENABLED", true),
      order: getEnvNumber("PUBLIC_NAV_WORK_ORDER", 2),
    },
    {
      href: "/writing",
      label: "Writing",
      page: "writing" as const,
      enabled: getEnvBoolean("PUBLIC_NAV_WRITING_ENABLED", true),
      order: getEnvNumber("PUBLIC_NAV_WRITING_ORDER", 3),
    },
    {
      href: "/contact",
      label: "Contact",
      page: "contact" as const,
      enabled: getEnvBoolean("PUBLIC_NAV_CONTACT_ENABLED", false),
      order: getEnvNumber("PUBLIC_NAV_CONTACT_ORDER", 4),
    },
  ]
    .filter((link) => link.enabled)
    .sort((a, b) => a.order - b.order),

  showSearch: getEnvBoolean("PUBLIC_NAV_SHOW_SEARCH", true),
} as const;

// ============================================================================
// Content Configuration
// ============================================================================

export const CONTENT_CONFIG = {
  // Reading Time
  wordsPerMinute: getEnvNumber("PUBLIC_CONTENT_WORDS_PER_MINUTE", 200),

  // Excerpt
  excerptLength: getEnvNumber("PUBLIC_CONTENT_EXCERPT_LENGTH", 160),
  excerptSuffix: getEnv("PUBLIC_CONTENT_EXCERPT_SUFFIX", "…"),

  // Limits
  limits: {
    titleMin: getEnvNumber("PUBLIC_CONTENT_TITLE_MIN", 1),
    titleMax: getEnvNumber("PUBLIC_CONTENT_TITLE_MAX", 100),
    excerptMin: getEnvNumber("PUBLIC_CONTENT_EXCERPT_MIN", 1),
    excerptMax: getEnvNumber("PUBLIC_CONTENT_EXCERPT_MAX", 300),
    descriptionMin: getEnvNumber("PUBLIC_CONTENT_DESCRIPTION_MIN", 1),
    descriptionMax: getEnvNumber("PUBLIC_CONTENT_DESCRIPTION_MAX", 500),
    messageMin: getEnvNumber("PUBLIC_CONTENT_MESSAGE_MIN", 10),
    messageMax: getEnvNumber("PUBLIC_CONTENT_MESSAGE_MAX", 1000),
    tagsMin: getEnvNumber("PUBLIC_CONTENT_TAGS_MIN", 0),
    tagsMax: getEnvNumber("PUBLIC_CONTENT_TAGS_MAX", 10),
  },

  // Defaults
  defaults: {
    author: getEnv("PUBLIC_CONTENT_DEFAULT_AUTHOR", SITE_CONFIG.author.name),
    image: getEnv("PUBLIC_CONTENT_DEFAULT_IMAGE", "/placeholder.jpg"),
  },
} as const;

// ============================================================================
// Search Configuration
// ============================================================================

export const SEARCH_CONFIG = {
  enabled: getEnvBoolean("PUBLIC_SEARCH_ENABLED", true),
  minQueryLength: getEnvNumber("PUBLIC_SEARCH_MIN_QUERY_LENGTH", 2),
  maxQueryLength: getEnvNumber("PUBLIC_SEARCH_MAX_QUERY_LENGTH", 200),
  maxResults: getEnvNumber("PUBLIC_SEARCH_MAX_RESULTS", 50),
  debounceDelay: getEnvNumber("PUBLIC_SEARCH_DEBOUNCE_DELAY", 300),
  highlightClass: getEnv("PUBLIC_SEARCH_HIGHLIGHT_CLASS", "search-highlight"),
  retryAttempts: getEnvNumber("PUBLIC_SEARCH_RETRY_ATTEMPTS", 3),
  retryDelay: getEnvNumber("PUBLIC_SEARCH_RETRY_DELAY", 1000),
} as const;

// ============================================================================
// Filter Configuration
// ============================================================================

export const FILTER_CONFIG = {
  urlParam: getEnv("PUBLIC_FILTER_URL_PARAM", "tags"),
  urlUpdateDelay: getEnvNumber("PUBLIC_FILTER_URL_UPDATE_DELAY", 500),
  animationDuration: getEnvNumber("PUBLIC_FILTER_ANIMATION_DURATION", 200),
  maxActiveFilters: getEnvNumber("PUBLIC_FILTER_MAX_ACTIVE", 5),
} as const;

// ============================================================================
// Form Configuration
// ============================================================================

export const FORM_CONFIG = {
  // Contact Form
  contact: {
    enabled: getEnvBoolean("PUBLIC_FORM_CONTACT_ENABLED", true),
    endpoint: getEnv("PUBLIC_FORM_CONTACT_ENDPOINT", "/api/contact"),
    method: getEnv("PUBLIC_FORM_CONTACT_METHOD", "POST"),
    honeypotField: getEnv("PUBLIC_FORM_CONTACT_HONEYPOT", "website"),
  },

  // Validation
  validation: {
    nameMin: getEnvNumber("PUBLIC_FORM_NAME_MIN", 2),
    nameMax: getEnvNumber("PUBLIC_FORM_NAME_MAX", 100),
    emailMax: getEnvNumber("PUBLIC_FORM_EMAIL_MAX", 255),
    messageMin: getEnvNumber("PUBLIC_FORM_MESSAGE_MIN", 10),
    messageMax: getEnvNumber("PUBLIC_FORM_MESSAGE_MAX", 1000),
    messageMinWords: getEnvNumber("PUBLIC_FORM_MESSAGE_MIN_WORDS", 3),
  },

  // Rate Limiting
  rateLimit: {
    maxRequests: getEnvNumber("PUBLIC_FORM_RATE_LIMIT_MAX", 5),
    windowMs: getEnvNumber("PUBLIC_FORM_RATE_LIMIT_WINDOW", 300000), // 5 minutes
  },
} as const;

// ============================================================================
// Analytics Configuration
// ============================================================================

export const ANALYTICS_CONFIG = {
  enabled: getEnvBoolean("PUBLIC_ANALYTICS_ENABLED", false),

  // Google Analytics
  googleAnalytics: {
    enabled: getEnvBoolean("PUBLIC_ANALYTICS_GA_ENABLED", false),
    trackingId: getEnv("PUBLIC_ANALYTICS_GA_TRACKING_ID", ""),
    anonymizeIp: getEnvBoolean("PUBLIC_ANALYTICS_GA_ANONYMIZE_IP", true),
  },

  // Plausible
  plausible: {
    enabled: getEnvBoolean("PUBLIC_ANALYTICS_PLAUSIBLE_ENABLED", false),
    domain: getEnv("PUBLIC_ANALYTICS_PLAUSIBLE_DOMAIN", ""),
  },

  // Privacy
  respectDnt: getEnvBoolean("PUBLIC_ANALYTICS_RESPECT_DNT", true),
  cookieConsent: getEnvBoolean("PUBLIC_ANALYTICS_COOKIE_CONSENT", true),
} as const;

// ============================================================================
// Design System Configuration
// ============================================================================

export const DESIGN_CONFIG = {
  // Colors (OKLCH format)
  colors: {
    primary: getEnv("PUBLIC_DESIGN_COLOR_PRIMARY", "oklch(0% 0 0)"), // Black
    secondary: getEnv("PUBLIC_DESIGN_COLOR_SECONDARY", "oklch(100% 0 0)"), // White
    accent: getEnv("PUBLIC_DESIGN_COLOR_ACCENT", "oklch(0.5 0.2 250)"), // Blue
  },

  // Typography
  typography: {
    fontSans: getEnv(
      "PUBLIC_DESIGN_FONT_SANS",
      "Helvetica Neue, Helvetica, Arial, system-ui, sans-serif"
    ),
    fontMono: getEnv(
      "PUBLIC_DESIGN_FONT_MONO",
      "Courier New, Courier, ui-monospace, monospace"
    ),
    baseFontSize: getEnvNumber("PUBLIC_DESIGN_BASE_FONT_SIZE", 16),
    scaleRatio: parseFloat(getEnv("PUBLIC_DESIGN_SCALE_RATIO", "1.25")),
  },

  // Spacing
  spacing: {
    unit: getEnvNumber("PUBLIC_DESIGN_SPACING_UNIT", 8), // 8px base unit
    containerMaxWidth: getEnvNumber("PUBLIC_DESIGN_CONTAINER_MAX_WIDTH", 1280),
  },

  // Borders
  borders: {
    thin: getEnvNumber("PUBLIC_DESIGN_BORDER_THIN", 1),
    medium: getEnvNumber("PUBLIC_DESIGN_BORDER_MEDIUM", 2),
    thick: getEnvNumber("PUBLIC_DESIGN_BORDER_THICK", 4),
  },

  // Animation
  animation: {
    durationFast: getEnvNumber("PUBLIC_DESIGN_ANIMATION_FAST", 150),
    durationBase: getEnvNumber("PUBLIC_DESIGN_ANIMATION_BASE", 200),
    durationSlow: getEnvNumber("PUBLIC_DESIGN_ANIMATION_SLOW", 300),
    easingDefault: getEnv("PUBLIC_DESIGN_ANIMATION_EASING", "ease"),
  },

  // Breakpoints (px)
  breakpoints: {
    sm: getEnvNumber("PUBLIC_DESIGN_BREAKPOINT_SM", 640),
    md: getEnvNumber("PUBLIC_DESIGN_BREAKPOINT_MD", 768),
    lg: getEnvNumber("PUBLIC_DESIGN_BREAKPOINT_LG", 1024),
    xl: getEnvNumber("PUBLIC_DESIGN_BREAKPOINT_XL", 1280),
    "2xl": getEnvNumber("PUBLIC_DESIGN_BREAKPOINT_2XL", 1536),
  },
} as const;

// ============================================================================
// Performance Configuration
// ============================================================================

export const PERFORMANCE_CONFIG = {
  // Image Optimization
  images: {
    formats: getEnv("PUBLIC_IMAGES_FORMATS", "avif,webp,jpg").split(","),
    widths: getEnv("PUBLIC_IMAGES_WIDTHS", "640,1024,1920")
      .split(",")
      .map(Number),
    quality: getEnvNumber("PUBLIC_IMAGES_QUALITY", 80),
    lazyLoading: getEnvBoolean("PUBLIC_IMAGES_LAZY_LOADING", true),
  },

  // Caching
  cache: {
    staticAssets: getEnvNumber("PUBLIC_CACHE_STATIC_ASSETS", 31536000), // 1 year
    dynamicContent: getEnvNumber("PUBLIC_CACHE_DYNAMIC_CONTENT", 3600), // 1 hour
    searchIndex: getEnvNumber("PUBLIC_CACHE_SEARCH_INDEX", 86400), // 1 day
  },

  // Prefetching
  prefetch: {
    enabled: getEnvBoolean("PUBLIC_PREFETCH_ENABLED", true),
    strategy: getEnv("PUBLIC_PREFETCH_STRATEGY", "viewport") as
      | "viewport"
      | "hover"
      | "tap",
    throttle: getEnvNumber("PUBLIC_PREFETCH_THROTTLE", 3),
  },
} as const;

// ============================================================================
// Error Messages Configuration
// ============================================================================

export const ERROR_MESSAGES = {
  generic: getEnv(
    "PUBLIC_ERROR_GENERIC",
    "Something went wrong. Please try again."
  ),
  network: getEnv(
    "PUBLIC_ERROR_NETWORK",
    "Network error. Please check your connection."
  ),
  notFound: getEnv(
    "PUBLIC_ERROR_NOT_FOUND",
    "The requested content could not be found."
  ),
  searchFailed: getEnv(
    "PUBLIC_ERROR_SEARCH_FAILED",
    "Search is temporarily unavailable."
  ),
  searchEmpty: getEnv(
    "PUBLIC_ERROR_SEARCH_EMPTY",
    "Please enter a search query."
  ),
  validationFailed: getEnv(
    "PUBLIC_ERROR_VALIDATION_FAILED",
    "Please check your input and try again."
  ),
  formSubmitFailed: getEnv(
    "PUBLIC_ERROR_FORM_SUBMIT_FAILED",
    "Failed to submit form. Please try again."
  ),
  rateLimit: getEnv(
    "PUBLIC_ERROR_RATE_LIMIT",
    "Too many requests. Please try again later."
  ),
  unauthorized: getEnv(
    "PUBLIC_ERROR_UNAUTHORIZED",
    "You are not authorized to perform this action."
  ),
  serverError: getEnv(
    "PUBLIC_ERROR_SERVER_ERROR",
    "Server error. Please try again later."
  ),
} as const;

// ============================================================================
// Exports for Backward Compatibility
// ============================================================================

export const SITE = {
  name: SITE_CONFIG.name,
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  email: SITE_CONFIG.email,
} as const;

export const SOCIAL = {
  github: SOCIAL_CONFIG.github.url,
  linkedin: SOCIAL_CONFIG.linkedin.url,
  twitter: SOCIAL_CONFIG.twitter.url,
  mastodon: SOCIAL_CONFIG.mastodon.url,
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

export function getSocialLinks() {
  return Object.values(SOCIAL_CONFIG).filter((social) => social.enabled);
}

export function getNavigationLinks() {
  return NAVIGATION_CONFIG.links;
}

export function isFeatureEnabled(
  feature: keyof typeof SITE_CONFIG.features
): boolean {
  return SITE_CONFIG.features[feature];
}

export function getDesignToken(path: string): any {
  const parts = path.split(".");
  let value: any = DESIGN_CONFIG;

  for (const part of parts) {
    value = value?.[part];
    if (value === undefined) return null;
  }

  return value;
}
