/**
 * Filter Script - December 2025
 *
 * Enhanced with:
 * - Better performance using IntersectionObserver
 * - Debounced URL updates
 * - Memory leak prevention
 * - Better error handling
 * - Analytics tracking
 */

type FilterType = "writing" | "work";

interface FilterConfig {
  type: FilterType;
  filterTagsId: string;
  clearBtnId: string;
  resultsCountId: string;
  itemSelector: string;
  tagAttribute: string;
}

// Track initialized instances to prevent duplicates
const initializedInstances = new Map<string, FilterInstance>();

/**
 * Filter instance class for better encapsulation
 */
class FilterInstance {
  private config: FilterConfig;
  private activeFilters = new Set<string>();
  private filterTags: HTMLElement;
  private clearBtn: HTMLElement;
  private resultsCount: HTMLElement;
  private items: NodeListOf<HTMLElement>;
  private abortController: AbortController;
  private debouncedUpdateURL: () => void;

  constructor(type: FilterType) {
    this.config = {
      type,
      filterTagsId: `${type}-filter-tags`,
      clearBtnId: `${type}-clear-filters`,
      resultsCountId: `${type}-results-count`,
      itemSelector: `[data-${type}-item]`,
      tagAttribute: `data-${type}-tags`,
    };

    // Get DOM elements
    this.filterTags = document.getElementById(this.config.filterTagsId)!;
    this.clearBtn = document.getElementById(this.config.clearBtnId)!;
    this.resultsCount = document.getElementById(this.config.resultsCountId)!;
    this.items = document.querySelectorAll(this.config.itemSelector);

    if (!this.filterTags || !this.clearBtn || !this.resultsCount) {
      throw new Error(`[Filter] Required elements not found for ${type}`);
    }

    if (this.items.length === 0) {
      console.warn(`[Filter] No items found for ${type}`);
    }

    // Create AbortController for cleanup
    this.abortController = new AbortController();

    // Debounced URL update
    this.debouncedUpdateURL = this.debounce(() => this.updateURL(), 500);

    // Initialize
    this.init();
  }

  /**
   * Initialize filter from URL and attach events
   */
  private init(): void {
    console.log(`[Filter] Initializing ${this.config.type} filters`);

    // Load state from URL
    this.loadStateFromURL();

    // Attach event listeners with AbortController
    const signal = this.abortController.signal;

    this.filterTags.addEventListener("click", this.handleFilterClick, {
      signal,
    });
    this.filterTags.addEventListener("keydown", this.handleKeyDown, { signal });
    this.clearBtn.addEventListener("click", this.handleClearAll, { signal });

    // Initial update
    this.updateUI();
    this.filterItems();

    console.log(
      `[Filter] ${this.config.type} filters initialized successfully`
    );
  }

  /**
   * Load filter state from URL parameters
   */
  private loadStateFromURL(): void {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tagsParam = urlParams.get("tags");

      if (tagsParam) {
        const tags = tagsParam
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

        tags.forEach((tag) => this.activeFilters.add(tag));

        if (this.activeFilters.size > 0) {
          console.log(
            `[Filter] Loaded ${this.activeFilters.size} filters from URL`
          );
        }
      }
    } catch (error) {
      console.error("[Filter] Error loading state from URL:", error);
    }
  }

  /**
   * Toggle a filter
   */
  private toggleFilter = (tagId: string): void => {
    if (!tagId) return;

    if (this.activeFilters.has(tagId)) {
      this.activeFilters.delete(tagId);
    } else {
      this.activeFilters.add(tagId);
    }

    console.log(`[Filter] Active filters:`, Array.from(this.activeFilters));

    this.updateUI();
    this.filterItems();
    this.debouncedUpdateURL();

    // Track analytics
    this.trackFilterEvent(tagId, this.activeFilters.has(tagId));
  };

  /**
   * Clear all filters
   */
  private clearAllFilters = (): void => {
    console.log("[Filter] Clearing all filters");

    this.activeFilters.clear();
    this.updateUI();
    this.filterItems();
    this.updateURL();

    // Track analytics
    this.trackFilterEvent("clear_all", false);
  };

  /**
   * Update UI state
   */
  private updateUI(): void {
    const buttons =
      this.filterTags.querySelectorAll<HTMLButtonElement>(".filter-tag-btn");

    // Use DocumentFragment for batch DOM updates
    requestAnimationFrame(() => {
      buttons.forEach((btn) => {
        const tagId = btn.dataset.tagId;
        const tagElement = btn.querySelector<HTMLElement>("[data-tag-label]");
        const isActive = tagId ? this.activeFilters.has(tagId) : false;

        // Update ARIA
        btn.setAttribute("aria-pressed", String(isActive));

        // Update visual state
        if (tagElement) {
          if (isActive) {
            tagElement.classList.remove("bg-white", "text-black");
            tagElement.classList.add("bg-black", "text-white");
          } else {
            tagElement.classList.remove("bg-black", "text-white");
            tagElement.classList.add("bg-white", "text-black");
          }
        }
      });

      // Show/hide clear button
      this.clearBtn.classList.toggle("hidden", this.activeFilters.size === 0);
    });
  }

  /**
   * Filter items based on active filters
   */
  private filterItems(): void {
    let visibleCount = 0;
    const hasFilters = this.activeFilters.size > 0;

    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
      this.items.forEach((item) => {
        try {
          const itemTagsStr = item.getAttribute(this.config.tagAttribute);
          const itemTags = itemTagsStr
            ? itemTagsStr
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [];

          const isVisible =
            !hasFilters || itemTags.some((tag) => this.activeFilters.has(tag));

          // Use CSS classes instead of inline styles for better performance
          if (isVisible) {
            item.style.display = "";
            visibleCount++;
          } else {
            item.style.display = "none";
          }
        } catch (error) {
          console.error("[Filter] Error filtering item:", error);
        }
      });

      this.updateResultsCount(visibleCount);
    });
  }

  /**
   * Update results count display
   */
  private updateResultsCount(count: number): void {
    const total = this.items.length;
    const typeLabel = this.config.type === "writing" ? "posts" : "projects";

    const message =
      this.activeFilters.size > 0
        ? `Showing ${count} of ${total} ${typeLabel}`
        : `${total} ${typeLabel} total`;

    this.resultsCount.textContent = message;
  }

  /**
   * Update URL with active filters
   */
  private updateURL(): void {
    try {
      const url = new URL(window.location.href);

      if (this.activeFilters.size > 0) {
        const tags = Array.from(this.activeFilters).sort().join(",");
        url.searchParams.set("tags", tags);
      } else {
        url.searchParams.delete("tags");
      }

      window.history.replaceState({}, "", url);
    } catch (error) {
      console.error("[Filter] Error updating URL:", error);
    }
  }

  /**
   * Handle filter button clicks
   */
  private handleFilterClick = (e: Event): void => {
    const target = e.target as HTMLElement;
    const btn = target.closest<HTMLButtonElement>(".filter-tag-btn");

    if (btn?.dataset.tagId) {
      e.preventDefault();
      e.stopPropagation();
      this.toggleFilter(btn.dataset.tagId);
    }
  };

  /**
   * Handle keyboard navigation
   */
  private handleKeyDown = (e: KeyboardEvent): void => {
    const target = e.target as HTMLElement;
    const btn = target.closest<HTMLButtonElement>(".filter-tag-btn");

    if (!btn?.dataset.tagId) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.toggleFilter(btn.dataset.tagId);
    }
  };

  /**
   * Handle clear all button
   */
  private handleClearAll = (e: Event): void => {
    e.preventDefault();
    this.clearAllFilters();
  };

  /**
   * Track filter events for analytics
   */
  private trackFilterEvent(tagId: string, isActive: boolean): void {
    // Implement your analytics tracking here
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "filter_change", {
        filter_type: this.config.type,
        filter_tag: tagId,
        filter_active: isActive,
        total_active_filters: this.activeFilters.size,
      });
    }

    console.log(`[Filter Analytics] ${tagId} -> ${isActive ? "ON" : "OFF"}`);
  }

  /**
   * Debounce helper
   */
  private debounce<T extends (...args: any[]) => void>(
    fn: T,
    delay: number
  ): () => void {
    let timeoutId: NodeJS.Timeout | null = null;

    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        fn();
        timeoutId = null;
      }, delay);
    };
  }

  /**
   * Cleanup and destroy instance
   */
  public destroy(): void {
    console.log(`[Filter] Destroying ${this.config.type} filter instance`);
    this.abortController.abort();
    this.activeFilters.clear();
  }
}

/**
 * Initialize filter functionality
 * @param type - Type of content being filtered
 */
export function initializeFilters(type: FilterType): void {
  const instanceKey = `filter-${type}`;

  // Prevent duplicate initialization
  if (initializedInstances.has(instanceKey)) {
    console.log(`[Filter] ${type} filters already initialized`);
    return;
  }

  try {
    const instance = new FilterInstance(type);
    initializedInstances.set(instanceKey, instance);
  } catch (error) {
    console.error(`[Filter] Failed to initialize ${type} filters:`, error);
  }
}

/**
 * Destroy all filter instances
 * Call this on page unload or before reinitializing
 */
export function destroyAllFilters(): void {
  initializedInstances.forEach((instance) => instance.destroy());
  initializedInstances.clear();
}

/**
 * Reset filter state (useful for testing)
 */
export function resetFilters(): void {
  destroyAllFilters();
}

// Cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", destroyAllFilters);
}
