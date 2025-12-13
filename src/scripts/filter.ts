/**
 * Filter Script - Client-side Content Filtering (WORKING & GENERIC)
 *
 * Truly generic - accepts ANY string as type, no hardcoded sections.
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

interface FilterConfig {
  type: string;
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

  constructor(type: string) {
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

    return { filterTags, clearBtn, resultsCount, items };
  }

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

  private handleFilterClick = (event: Event): void => {
    const target = event.target as HTMLElement;
    const btn = target.closest<HTMLButtonElement>(".filter-tag-btn");

    if (btn?.dataset["tagId"]) {
      event.preventDefault();
      event.stopPropagation();
      this.toggleFilter(btn.dataset["tagId"]);
    }
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    const target = event.target as HTMLElement;
    const btn = target.closest<HTMLButtonElement>(".filter-tag-btn");

    if (!btn?.dataset["tagId"]) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.toggleFilter(btn.dataset["tagId"]);
    }
  };

  private handleClearAll = (event: Event): void => {
    event.preventDefault();
    this.clearAllFilters();
  };

  private toggleFilter(tagId: string): void {
    if (!tagId) return;

    const wasActive = this.activeFilters.has(tagId);

    if (wasActive) {
      this.activeFilters.delete(tagId);
    } else {
      this.activeFilters.add(tagId);
    }

    console.log(`[Filter] ${tagId}: ${wasActive ? "OFF" : "ON"}`);

    this.updateUI();
    this.filterItems();
    this.debouncedUpdateURL();

    trackFilterChange(this.config.type, tagId, !wasActive);
  }

  private clearAllFilters(): void {
    console.log("[Filter] Clearing all filters");

    const previousCount = this.activeFilters.size;
    this.activeFilters.clear();

    this.updateUI();
    this.filterItems();
    this.updateURL();

    trackFilterClear(this.config.type, previousCount);
  }

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

        setAttribute(btn, "aria-pressed", String(isActive));

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

      if (this.activeFilters.size === 0) {
        addClass(this.elements.clearBtn, "hidden");
      } else {
        removeClass(this.elements.clearBtn, "hidden");
      }
    });
  }

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

  private updateResultsCount(count: number): void {
    const total = this.elements.items.length;
    const typeLabel = this.config.type;

    const message =
      this.activeFilters.size > 0
        ? `Showing ${count} of ${total} ${typeLabel}`
        : `${total} ${typeLabel} total`;

    setText(this.elements.resultsCount, message);
  }

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

  public isValid(): boolean {
    return document.getElementById(this.config.filterTagsId) !== null;
  }

  public destroy(): void {
    console.log(`[Filter] Destroying ${this.config.type} instance`);
    this.abortController.abort();
    this.activeFilters.clear();
  }
}

// ============================================================================
// Navigation Helpers
// ============================================================================

function getBaseSection(path: string): string {
  const segments = path.replace(/^\/|\/$/g, "").split("/");
  return segments[0] || "home";
}

// ============================================================================
// Public API
// ============================================================================

export function initializeFilters(type: string): void {
  const instanceKey = `filter-${type}`;
  const existingInstance = initializedInstances.get(instanceKey);

  if (existingInstance) {
    if (!existingInstance.isValid()) {
      console.log(`[Filter] ${type} DOM missing, recreating instance`);
      existingInstance.destroy();
      initializedInstances.delete(instanceKey);
    } else {
      console.log(`[Filter] ${type} already initialized and valid`);
      return;
    }
  }

  try {
    const instance = new FilterInstance(type);
    initializedInstances.set(instanceKey, instance);
    console.log(`[Filter] ${type} instance created successfully`);
  } catch (error) {
    console.error(`[Filter] Failed to initialize ${type}:`, error);
  }
}

export function destroyAllFilters(): void {
  console.log("[Filter] Destroying all filter instances");
  initializedInstances.forEach((instance) => instance.destroy());
  initializedInstances.clear();
}

export function destroyFilter(type: string): void {
  const instanceKey = `filter-${type}`;
  const instance = initializedInstances.get(instanceKey);

  if (instance) {
    instance.destroy();
    initializedInstances.delete(instanceKey);
    console.log(`[Filter] Destroyed ${type} instance`);
  }
}

function cleanupStaleFilters(): void {
  const staleFilters: string[] = [];

  initializedInstances.forEach((instance, key) => {
    if (!instance.isValid()) {
      staleFilters.push(key);
    }
  });

  if (staleFilters.length > 0) {
    console.log(`[Filter] Cleaning up ${staleFilters.length} stale filters`);
    staleFilters.forEach((key) => {
      const instance = initializedInstances.get(key);
      instance?.destroy();
      initializedInstances.delete(key);
    });
  }
}

function smartCleanup(fromPath: string, toPath: string): void {
  const fromSection = getBaseSection(fromPath);
  const toSection = getBaseSection(toPath);

  if (fromSection === toSection) {
    console.log(`[Filter] Staying in ${fromSection} section`);
    cleanupStaleFilters();
  } else {
    console.log(`[Filter] Section change: ${fromSection} → ${toSection}`);
    destroyAllFilters();
  }
}

// ============================================================================
// Auto-Initialization
// ============================================================================

if (typeof window !== "undefined") {
  let currentPath = window.location.pathname;

  document.addEventListener("astro:before-preparation", () => {
    const nextPath = window.location.pathname;
    console.log(`[Filter] Navigation: ${currentPath} → ${nextPath}`);

    smartCleanup(currentPath, nextPath);
    currentPath = nextPath;
  });

  setInterval(() => {
    cleanupStaleFilters();
  }, 5000);

  window.addEventListener("beforeunload", destroyAllFilters);
}
