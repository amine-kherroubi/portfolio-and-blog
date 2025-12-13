/**
 * Analytics Hook
 *
 * Reusable analytics tracking utilities for consistent
 * event tracking across the application.
 */

// ============================================================================
// Types
// ============================================================================

export interface AnalyticsEvent {
  name: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

export interface PageViewData {
  title: string;
  path: string;
  referrer?: string;
}

export type AnalyticsProvider = "gtag" | "plausible" | "custom";

// ============================================================================
// Event Names
// ============================================================================

export const ANALYTICS_EVENTS = {
  // Page events
  PAGE_VIEW: "page_view",
  PAGE_EXIT: "page_exit",

  // Navigation events
  INTERNAL_LINK: "internal_link",
  EXTERNAL_LINK: "external_link",
  SOCIAL_CLICK: "social_click",

  // Search events
  SEARCH: "search",
  SEARCH_SUCCESS: "search_success",
  SEARCH_FAILURE: "search_failure",

  // Filter events
  FILTER_CHANGE: "filter_change",
  FILTER_CLEAR: "filter_clear",

  // Form events
  FORM_START: "form_start",
  FORM_SUBMIT: "form_submit",
  FORM_ERROR: "form_error",
  FORM_SUCCESS: "form_success",

  // Content events
  ARTICLE_READ: "article_read",
  PROJECT_VIEW: "project_view",
  SHARE_CLICK: "share_click",

  // Media events
  VIDEO_PLAY: "video_play",
  VIDEO_PAUSE: "video_pause",
  IMAGE_VIEW: "image_view",

  // Download events
  DOWNLOAD: "download",
  COPY_CODE: "copy_code",
} as const;

// ============================================================================
// Provider Detection
// ============================================================================

/**
 * Check if Google Analytics is available
 */
function isGtagAvailable(): boolean {
  return (
    typeof window !== "undefined" && typeof (window as any).gtag === "function"
  );
}

/**
 * Check if Plausible is available
 */
function isPlausibleAvailable(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof (window as any).plausible === "function"
  );
}

/**
 * Get available analytics provider
 */
export function getAnalyticsProvider(): AnalyticsProvider | null {
  if (isGtagAvailable()) return "gtag";
  if (isPlausibleAvailable()) return "plausible";
  return null;
}

// ============================================================================
// Core Tracking Functions
// ============================================================================

/**
 * Track event with Google Analytics
 */
function trackGtagEvent(event: AnalyticsEvent): void {
  if (!isGtagAvailable()) return;

  const { name, category, label, value, ...rest } = event;

  (window as any).gtag("event", name, {
    event_category: category,
    event_label: label,
    value,
    ...rest,
  });
}

/**
 * Track event with Plausible
 */
function trackPlausibleEvent(event: AnalyticsEvent): void {
  if (!isPlausibleAvailable()) return;

  const { name, ...props } = event;
  (window as any).plausible(name, { props });
}

/**
 * Track event with any available provider
 */
export function trackEvent(event: AnalyticsEvent): void {
  const provider = getAnalyticsProvider();

  if (!provider) {
    console.log("[Analytics] No provider available:", event);
    return;
  }

  try {
    switch (provider) {
      case "gtag":
        trackGtagEvent(event);
        break;
      case "plausible":
        trackPlausibleEvent(event);
        break;
    }

    console.log(`[Analytics] Tracked with ${provider}:`, event);
  } catch (error) {
    console.error("[Analytics] Tracking failed:", error);
  }
}

// ============================================================================
// Page Tracking
// ============================================================================

/**
 * Track page view
 */
export function trackPageView(data: PageViewData): void {
  trackEvent({
    name: ANALYTICS_EVENTS.PAGE_VIEW,
    page_title: data.title,
    page_path: data.path,
    page_referrer: data.referrer || document.referrer,
  });
}

/**
 * Track page exit
 */
export function trackPageExit(path: string): void {
  trackEvent({
    name: ANALYTICS_EVENTS.PAGE_EXIT,
    page_path: path,
  });
}

// ============================================================================
// Click Tracking
// ============================================================================

/**
 * Track internal link click
 */
export function trackInternalLink(href: string, text?: string): void {
  trackEvent({
    name: ANALYTICS_EVENTS.INTERNAL_LINK,
    link_url: href,
    link_text: text,
  });
}

/**
 * Track external link click
 */
export function trackExternalLink(href: string, text?: string): void {
  trackEvent({
    name: ANALYTICS_EVENTS.EXTERNAL_LINK,
    link_url: href,
    link_text: text,
    transport_type: "beacon",
  });
}

/**
 * Track social media click
 */
export function trackSocialClick(platform: string, action?: string): void {
  trackEvent({
    name: ANALYTICS_EVENTS.SOCIAL_CLICK,
    social_platform: platform,
    social_action: action,
  });
}

// ============================================================================
// Search Tracking
// ============================================================================

/**
 * Track search query
 */
export function trackSearch(query: string, resultCount?: number): void {
  trackEvent({
    name: ANALYTICS_EVENTS.SEARCH,
    search_term: query,
    search_results: resultCount,
  });
}

/**
 * Track successful search
 */
export function trackSearchSuccess(query: string, resultCount: number): void {
  trackEvent({
    name: ANALYTICS_EVENTS.SEARCH_SUCCESS,
    search_term: query,
    search_results: resultCount,
  });
}

/**
 * Track failed search
 */
export function trackSearchFailure(query: string, error?: string): void {
  trackEvent({
    name: ANALYTICS_EVENTS.SEARCH_FAILURE,
    search_term: query,
    error_message: error,
  });
}

// ============================================================================
// Filter Tracking
// ============================================================================

/**
 * Track filter change
 */
export function trackFilterChange(
  type: string,
  tag: string,
  isActive: boolean
): void {
  trackEvent({
    name: ANALYTICS_EVENTS.FILTER_CHANGE,
    filter_type: type,
    filter_tag: tag,
    filter_active: isActive,
  });
}

/**
 * Track filter clear
 */
export function trackFilterClear(type: string, count: number): void {
  trackEvent({
    name: ANALYTICS_EVENTS.FILTER_CLEAR,
    filter_type: type,
    filter_count: count,
  });
}

// ============================================================================
// Form Tracking
// ============================================================================

/**
 * Track form start
 */
export function trackFormStart(formName: string): void {
  trackEvent({
    name: ANALYTICS_EVENTS.FORM_START,
    form_name: formName,
  });
}

/**
 * Track form submission
 */
export function trackFormSubmit(formName: string): void {
  trackEvent({
    name: ANALYTICS_EVENTS.FORM_SUBMIT,
    form_name: formName,
  });
}

/**
 * Track form error
 */
export function trackFormError(formName: string, error: string): void {
  trackEvent({
    name: ANALYTICS_EVENTS.FORM_ERROR,
    form_name: formName,
    error_message: error,
  });
}

/**
 * Track form success
 */
export function trackFormSuccess(formName: string): void {
  trackEvent({
    name: ANALYTICS_EVENTS.FORM_SUCCESS,
    form_name: formName,
  });
}

// ============================================================================
// Content Tracking
// ============================================================================

/**
 * Track article read
 */
export function trackArticleRead(title: string, progress: number): void {
  trackEvent({
    name: ANALYTICS_EVENTS.ARTICLE_READ,
    article_title: title,
    read_progress: progress,
  });
}

/**
 * Track project view
 */
export function trackProjectView(title: string): void {
  trackEvent({
    name: ANALYTICS_EVENTS.PROJECT_VIEW,
    project_title: title,
  });
}

/**
 * Track share click
 */
export function trackShareClick(platform: string, title?: string): void {
  trackEvent({
    name: ANALYTICS_EVENTS.SHARE_CLICK,
    share_platform: platform,
    content_title: title,
  });
}

// ============================================================================
// Download Tracking
// ============================================================================

/**
 * Track file download
 */
export function trackDownload(filename: string, filetype?: string): void {
  trackEvent({
    name: ANALYTICS_EVENTS.DOWNLOAD,
    file_name: filename,
    file_type: filetype,
  });
}

/**
 * Track code copy
 */
export function trackCodeCopy(language?: string): void {
  trackEvent({
    name: ANALYTICS_EVENTS.COPY_CODE,
    code_language: language,
  });
}

// ============================================================================
// Timing Tracking
// ============================================================================

/**
 * Track timing measurement
 */
export function trackTiming(
  category: string,
  variable: string,
  value: number
): void {
  if (!isGtagAvailable()) return;

  (window as any).gtag("event", "timing_complete", {
    name: variable,
    value: value,
    event_category: category,
  });
}

/**
 * Measure and track performance metric
 */
export function measurePerformance(
  name: string,
  startMark: string,
  endMark?: string
): void {
  try {
    if (!performance || !performance.measure) return;

    const measureName = `measure-${name}`;
    performance.measure(measureName, startMark, endMark);

    const measure = performance.getEntriesByName(measureName)[0];
    if (measure) {
      trackTiming("Performance", name, Math.round(measure.duration));
    }
  } catch (error) {
    console.error("[Analytics] Performance measurement failed:", error);
  }
}

// ============================================================================
// Batch Tracking
// ============================================================================

let eventQueue: AnalyticsEvent[] = [];
let flushTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Queue event for batch sending
 */
export function queueEvent(event: AnalyticsEvent): void {
  eventQueue.push(event);

  if (flushTimeout) {
    clearTimeout(flushTimeout);
  }

  flushTimeout = setTimeout(() => {
    flushEvents();
  }, 1000);
}

/**
 * Flush queued events
 */
export function flushEvents(): void {
  if (eventQueue.length === 0) return;

  eventQueue.forEach((event) => trackEvent(event));
  eventQueue = [];

  if (flushTimeout) {
    clearTimeout(flushTimeout);
    flushTimeout = null;
  }
}

// Flush on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", flushEvents);
}
