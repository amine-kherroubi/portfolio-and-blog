/**
 * Filter Script - Client-side Content Filtering
 *
 * Provides interactive filtering for writing posts and work projects.
 * Includes URL state management, debouncing, and analytics tracking.
 *
 * Note: This is a client-side script that runs in the browser.
 */

// ============================================================================
// Types
// ============================================================================

type FilterType = "writing" | "work";

interface FilterConfig {
  type: FilterType;
  filterTagsId: string;
  clearBtnId: string;
  resultsCountId: string;
  itemSelector: string;
  tagAttribute: string;
}

interface FilterEventDetail {
  type: FilterType;
  tag: string;
  isActive: boolean;
  activeCount: number;
}

// ============================================================================
// State Management
// ============================================================================

// Track initialized instances to prevent duplicates
const initializedInstances = new Map<string, FilterInstance>();

// ============================================================================
// Filter Instance Class
// ============================================================================

class FilterInstance {
  private config: FilterConfig;
  private activeFilters = new Set<string>();
  private elements: {
    filterTags: HTMLElement;
    clearBtn: HTMLElement;
    resultsCount: HTMLElement;
    items: NodeListOf<HTMLElement>;
  };
  private abortController: AbortController;
  private debouncedUpdateURL: () => void;

  constructor(type: FilterType) {
    // Initialize config
    this.config = {
      type,
      filterTagsId: `${type}-filter-tags`,
      clearBtnId: `${type}-clear-filters`,
      resultsCountId: `${type}-results-count`,
      itemSelector: `[data-${type}-item]`,
      tagAttribute: `data-${type}-tags`,
    };

    // Get DOM elements
    this.elements = this.getElements();

    // Create abort controller for cleanup
    this.abortController = new AbortController();

    // Create debounced URL update
    this.debouncedUpdateURL = this.createDebounce(() => this.updateURL(), 500);

    // Initialize
    this.initialize();
  }

  /**
   * Get and validate DOM elements
   */
  private getElements() {
    const filterTags = document.getElementById(this.config.filterTagsId);
    const clearBtn = document.getElementById(this.config.clearBtnId);
    const resultsCount = document.getElementById(this.config.resultsCountId);
    const items = document.querySelectorAll<HTMLElement>(
      this.config.itemSelector
    );

    if (!filterTags || !clearBtn || !resultsCount) {
      throw new Error(
        `[Filter] Required elements not found for ${this.config.type}`
      );
    }

    if (items.length === 0) {
      console.warn(`[Filter] No items found for ${this.config.type}`);
    }

    return { filterTags, clearBtn, resultsCount, items };
  }

  /**
   * Initialize filter instance
   */
  private initialize(): void {
    console.log(`[Filter] Initializing ${this.config.type} filters`);

    // Load state from URL
    this.loadStateFromURL();

    // Attach event listeners
    this.attachEventListeners();

    // Initial update
    this.updateUI();
    this.filterItems();

    console.log(
      `[Filter] ${this.config.type} filters initialized (${this.activeFilters.size} active)`
    );
  }

  /**
   * Load filter state from URL parameters
   */
  private loadStateFromURL(): void {
    try {
      const params = new URLSearchParams(window.location.search);
      const tagsParam = params.get("tags");

      if (tagsParam) {
        const tags = tagsParam
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

        tags.forEach((tag) => this.activeFilters.add(tag));
      }
    } catch (error) {
      console.error("[Filter] Failed to load state from URL:", error);
    }
  }

  /**
   * Attach event listeners
   */
  private attachEventListeners(): void {
    const { signal } = this.abortController;

    // Filter button clicks
    this.elements.filterTags.addEventListener("click", this.handleFilterClick, {
      signal,
    });

    // Keyboard navigation
    this.elements.filterTags.addEventListener("keydown", this.handleKeyDown, {
      signal,
    });

    // Clear button
    this.elements.clearBtn.addEventListener("click", this.handleClearAll, {
      signal,
    });
  }

  /**
   * Handle filter button clicks
   */
  private handleFilterClick = (event: Event): void => {
    const target = event.target as HTMLElement;
    const btn = target.closest<HTMLButtonElement>(".filter-tag-btn");

    if (btn?.dataset["tagId"]) {
      event.preventDefault();
      event.stopPropagation();
      this.toggleFilter(btn.dataset["tagId"]);
    }
  };

  /**
   * Handle keyboard navigation
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    const target = event.target as HTMLElement;
    const btn = target.closest<HTMLButtonElement>(".filter-tag-btn");

    if (!btn?.dataset["tagId"]) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.toggleFilter(btn.dataset["tagId"]);
    }
  };

  /**
   * Handle clear all button
   */
  private handleClearAll = (event: Event): void => {
    event.preventDefault();
    this.clearAllFilters();
  };

  /**
   * Toggle a filter on/off
   */
  private toggleFilter(tagId: string): void {
    if (!tagId) return;

    const wasActive = this.activeFilters.has(tagId);

    if (wasActive) {
      this.activeFilters.delete(tagId);
    } else {
      this.activeFilters.add(tagId);
    }

    console.log(`[Filter] ${tagId}: ${wasActive ? "OFF" : "ON"}`);

    // Update UI and filter items
    this.updateUI();
    this.filterItems();
    this.debouncedUpdateURL();

    // Dispatch custom event for analytics
    this.dispatchFilterEvent(tagId, !wasActive);
  }

  /**
   * Clear all active filters
   */
  private clearAllFilters(): void {
    console.log("[Filter] Clearing all filters");

    this.activeFilters.clear();

    this.updateUI();
    this.filterItems();
    this.updateURL();

    // Dispatch custom event
    this.dispatchFilterEvent("clear_all", false);
  }

  /**
   * Update UI state
   */
  private updateUI(): void {
    const buttons =
      this.elements.filterTags.querySelectorAll<HTMLButtonElement>(
        ".filter-tag-btn"
      );

    // Batch DOM updates with requestAnimationFrame
    requestAnimationFrame(() => {
      buttons.forEach((btn) => {
        const tagId = btn.dataset["tagId"];
        const isActive = tagId ? this.activeFilters.has(tagId) : false;
        const tagElement = btn.querySelector<HTMLElement>("[data-tag-label]");

        // Update ARIA state
        btn.setAttribute("aria-pressed", String(isActive));

        // Update visual state
        if (tagElement) {
          tagElement.classList.toggle("bg-white", !isActive);
          tagElement.classList.toggle("text-black", !isActive);
          tagElement.classList.toggle("bg-black", isActive);
          tagElement.classList.toggle("text-white", isActive);
        }
      });

      // Show/hide clear button
      this.elements.clearBtn.classList.toggle(
        "hidden",
        this.activeFilters.size === 0
      );
    });
  }

  /**
   * Filter items based on active filters
   */
  private filterItems(): void {
    let visibleCount = 0;
    const hasFilters = this.activeFilters.size > 0;

    // Batch DOM updates
    requestAnimationFrame(() => {
      this.elements.items.forEach((item) => {
        const itemTagsStr = item.getAttribute(this.config.tagAttribute);
        const itemTags = itemTagsStr
          ? itemTagsStr
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [];

        const isVisible =
          !hasFilters || itemTags.some((tag) => this.activeFilters.has(tag));

        item.style.display = isVisible ? "" : "none";

        if (isVisible) {
          visibleCount++;
        }
      });

      this.updateResultsCount(visibleCount);
    });
  }

  /**
   * Update results count display
   */
  private updateResultsCount(count: number): void {
    const total = this.elements.items.length;
    const typeLabel = this.config.type === "writing" ? "posts" : "projects";

    const message =
      this.activeFilters.size > 0
        ? `Showing ${count} of ${total} ${typeLabel}`
        : `${total} ${typeLabel} total`;

    this.elements.resultsCount.textContent = message;
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
      console.error("[Filter] Failed to update URL:", error);
    }
  }

  /**
   * Dispatch custom filter event
   */
  private dispatchFilterEvent(tagId: string, isActive: boolean): void {
    const detail: FilterEventDetail = {
      type: this.config.type,
      tag: tagId,
      isActive,
      activeCount: this.activeFilters.size,
    };

    const event = new CustomEvent("filterChange", { detail });
    window.dispatchEvent(event);

    // Google Analytics tracking (if available)
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "filter_change", {
        filter_type: this.config.type,
        filter_tag: tagId,
        filter_active: isActive,
        total_active_filters: this.activeFilters.size,
      });
    }
  }

  /**
   * Create debounced function
   */
  private createDebounce<T extends (...args: any[]) => void>(
    fn: T,
    delay: number
  ): () => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

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
   * Destroy instance and cleanup
   */
  public destroy(): void {
    console.log(`[Filter] Destroying ${this.config.type} instance`);
    this.abortController.abort();
    this.activeFilters.clear();
  }
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Initialize filters for a content type
 */
export function initializeFilters(type: FilterType): void {
  const instanceKey = `filter-${type}`;

  // Prevent duplicate initialization
  if (initializedInstances.has(instanceKey)) {
    console.log(`[Filter] ${type} already initialized`);
    return;
  }

  try {
    const instance = new FilterInstance(type);
    initializedInstances.set(instanceKey, instance);
  } catch (error) {
    console.error(`[Filter] Failed to initialize ${type}:`, error);
  }
}

/**
 * Destroy all filter instances
 */
export function destroyAllFilters(): void {
  initializedInstances.forEach((instance) => instance.destroy());
  initializedInstances.clear();
}

/**
 * Destroy specific filter instance
 */
export function destroyFilter(type: FilterType): void {
  const instanceKey = `filter-${type}`;
  const instance = initializedInstances.get(instanceKey);

  if (instance) {
    instance.destroy();
    initializedInstances.delete(instanceKey);
  }
}

// ============================================================================
// Cleanup
// ============================================================================

// Cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", destroyAllFilters);
}
