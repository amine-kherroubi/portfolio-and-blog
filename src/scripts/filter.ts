/**
 * Filter Script - Client-side Content Filtering (Refactored)
 *
 * Now uses shared analytics and DOM utilities for better
 * code organization and tracking.
 */

import { trackFilterChange, trackFilterClear } from "@/utils/use-analytics";
import {
  getElementById,
  querySelectorAll,
  addClass,
  removeClass,
  setAttribute,
  getAttribute,
  setText,
} from "@/utils/use-dom-utils";

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

// ============================================================================
// State Management
// ============================================================================

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
    this.config = {
      type,
      filterTagsId: `${type}-filter-tags`,
      clearBtnId: `${type}-clear-filters`,
      resultsCountId: `${type}-results-count`,
      itemSelector: `[data-${type}-item]`,
      tagAttribute: `data-${type}-tags`,
    };

    this.elements = this.getElements();
    this.abortController = new AbortController();
    this.debouncedUpdateURL = this.createDebounce(() => this.updateURL(), 500);
    this.initialize();
  }

  /**
   * Get and validate DOM elements using shared utilities
   */
  private getElements() {
    const filterTags = getElementById(this.config.filterTagsId, {
      required: true,
      errorMessage: `Filter tags element not found: ${this.config.filterTagsId}`,
    });
    const clearBtn = getElementById(this.config.clearBtnId, {
      required: true,
      errorMessage: `Clear button not found: ${this.config.clearBtnId}`,
    });
    const resultsCount = getElementById(this.config.resultsCountId, {
      required: true,
      errorMessage: `Results count element not found: ${this.config.resultsCountId}`,
    });
    const items = querySelectorAll<HTMLElement>(this.config.itemSelector);

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

    this.loadStateFromURL();
    this.attachEventListeners();
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

    this.elements.filterTags.addEventListener("click", this.handleFilterClick, {
      signal,
    });
    this.elements.filterTags.addEventListener("keydown", this.handleKeyDown, {
      signal,
    });
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

    // Track with analytics utility
    trackFilterChange(this.config.type, tagId, !wasActive);
  }

  /**
   * Clear all active filters
   */
  private clearAllFilters(): void {
    console.log("[Filter] Clearing all filters");

    const previousCount = this.activeFilters.size;
    this.activeFilters.clear();

    this.updateUI();
    this.filterItems();
    this.updateURL();

    // Track with analytics utility
    trackFilterClear(this.config.type, previousCount);
  }

  /**
   * Update UI state using shared utilities
   */
  private updateUI(): void {
    const buttons =
      this.elements.filterTags.querySelectorAll<HTMLButtonElement>(
        ".filter-tag-btn"
      );

    requestAnimationFrame(() => {
      buttons.forEach((btn) => {
        const tagId = btn.dataset["tagId"];
        const isActive = tagId ? this.activeFilters.has(tagId) : false;
        const tagElement = btn.querySelector<HTMLElement>("[data-tag-label]");

        // Update ARIA state
        setAttribute(btn, "aria-pressed", String(isActive));

        // Update visual state
        if (tagElement) {
          if (isActive) {
            removeClass(tagElement, "bg-white", "text-black");
            addClass(tagElement, "bg-black", "text-white");
          } else {
            removeClass(tagElement, "bg-black", "text-white");
            addClass(tagElement, "bg-white", "text-black");
          }
        }
      });

      // Show/hide clear button
      if (this.activeFilters.size === 0) {
        addClass(this.elements.clearBtn, "hidden");
      } else {
        removeClass(this.elements.clearBtn, "hidden");
      }
    });
  }

  /**
   * Filter items based on active filters
   */
  private filterItems(): void {
    let visibleCount = 0;
    const hasFilters = this.activeFilters.size > 0;

    requestAnimationFrame(() => {
      this.elements.items.forEach((item) => {
        const itemTagsStr = getAttribute(item, this.config.tagAttribute);
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

    setText(this.elements.resultsCount, message);
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

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", destroyAllFilters);
}
