/**
 * Filter Script
 * 
 * Handles content filtering functionality with URL state management,
 * keyboard navigation, and smooth animations.
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

/**
 * Initialize filter functionality
 * @param type - Type of content being filtered ("writing" or "work")
 */
export function initializeFilters(type: FilterType): void {
  const config: FilterConfig = {
    type,
    filterTagsId: `${type}-filter-tags`,
    clearBtnId: `${type}-clear-filters`,
    resultsCountId: `${type}-results-count`,
    itemSelector: `[data-${type}-item]`,
    tagAttribute: `${type}Tags`,
  };

  const filterTags = document.getElementById(config.filterTagsId);
  const clearBtn = document.getElementById(config.clearBtnId);
  const resultsCount = document.getElementById(config.resultsCountId);
  const items = document.querySelectorAll<HTMLElement>(config.itemSelector);

  if (!filterTags || !clearBtn || !resultsCount || items.length === 0) {
    return;
  }

  const activeFilters = new Set<string>();

  /**
   * Initialize from URL parameters
   */
  function initFromURL(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const tagsParam = urlParams.get("tags");
    
    if (tagsParam) {
      tagsParam.split(",").forEach((tag) => {
        const trimmedTag = tag.trim();
        if (trimmedTag) {
          activeFilters.add(trimmedTag);
        }
      });
      updateUI();
      filterItems();
    } else {
      updateResultsCount(items.length);
    }
  }

  /**
   * Toggle a filter
   */
  function toggleFilter(tagId: string): void {
    if (activeFilters.has(tagId)) {
      activeFilters.delete(tagId);
    } else {
      activeFilters.add(tagId);
    }
    updateUI();
    filterItems();
    updateURL();
  }

  /**
   * Clear all filters
   */
  function clearAllFilters(): void {
    activeFilters.clear();
    updateUI();
    filterItems();
    updateURL();
  }

  /**
   * Update UI state
   */
  function updateUI(): void {
    filterTags.querySelectorAll<HTMLButtonElement>(".filter-tag-btn").forEach((btn) => {
      const tagId = btn.dataset.tagId;
      const tagElement = btn.querySelector<HTMLElement>("[data-tag]");
      const isActive = tagId ? activeFilters.has(tagId) : false;

      // Update ARIA state
      btn.setAttribute("aria-pressed", String(isActive));

      // Update visual state
      if (tagElement) {
        tagElement.classList.toggle("bg-black", isActive);
        tagElement.classList.toggle("text-white", isActive);
        tagElement.classList.toggle("bg-white", !isActive);
        tagElement.classList.toggle("text-black", !isActive);
      }
    });

    // Show/hide clear button
    clearBtn.classList.toggle("hidden", activeFilters.size === 0);
  }

  /**
   * Filter items based on active filters
   */
  function filterItems(): void {
    let visibleCount = 0;
    const hasFilters = activeFilters.size > 0;

    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
      items.forEach((item) => {
        const itemTags =
          item.dataset[config.tagAttribute]
            ?.split(",")
            .map((t) => t.trim())
            .filter(Boolean) || [];
        
        const isVisible =
          !hasFilters || itemTags.some((tag) => activeFilters.has(tag));

        item.style.display = isVisible ? "" : "none";
        if (isVisible) visibleCount++;
      });

      updateResultsCount(visibleCount);
    });
  }

  /**
   * Update results count display
   */
  function updateResultsCount(count: number): void {
    const total = items.length;
    const typeLabel = type === "writing" ? "posts" : "projects";
    
    if (resultsCount) {
      resultsCount.textContent =
        activeFilters.size > 0
          ? `Showing ${count} of ${total} ${typeLabel}`
          : `${total} ${typeLabel} total`;
    }
  }

  /**
   * Update URL without adding history entry
   */
  function updateURL(): void {
    const url = new URL(window.location.href);
    
    if (activeFilters.size > 0) {
      url.searchParams.set("tags", Array.from(activeFilters).sort().join(","));
    } else {
      url.searchParams.delete("tags");
    }

    window.history.replaceState({}, "", url);
  }

  /**
   * Handle filter button clicks
   */
  function handleFilterClick(e: Event): void {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
      ".filter-tag-btn"
    );
    if (btn?.dataset.tagId) {
      toggleFilter(btn.dataset.tagId);
    }
  }

  /**
   * Handle keyboard navigation
   */
  function handleKeyDown(e: KeyboardEvent): void {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
      ".filter-tag-btn"
    );
    
    if (!btn?.dataset.tagId) return;

    // Handle Enter and Space keys
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFilter(btn.dataset.tagId);
    }
  }

  // Initialize from URL
  initFromURL();

  // Event listeners
  filterTags.addEventListener("click", handleFilterClick);
  filterTags.addEventListener("keydown", handleKeyDown);
  clearBtn.addEventListener("click", clearAllFilters);
}

/**
 * Auto-initialize filters based on current path
 */
function init(): void {
  const path = window.location.pathname;
  if (path.includes("/writing")) {
    initializeFilters("writing");
  } else if (path.includes("/work")) {
    initializeFilters("work");
  }
}

// Initialize on DOM ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Reinitialize on Astro page navigation (View Transitions)
  document.addEventListener("astro:page-load", init);
}
