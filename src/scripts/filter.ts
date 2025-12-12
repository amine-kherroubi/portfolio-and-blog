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

// Track initialized instances to prevent duplicate initialization
const initializedInstances = new Set<string>();

/**
 * Initialize filter functionality
 * @param type - Type of content being filtered ("writing" or "work")
 */
export function initializeFilters(type: FilterType): void {
  // Prevent duplicate initialization
  const instanceKey = `filter-${type}`;
  if (initializedInstances.has(instanceKey)) {
    console.log(`Filters already initialized for ${type}`);
    return;
  }

  console.log(`Initializing filters for ${type}`);

  // ========================================================================
  // Configuration Setup
  // ========================================================================
  const config: FilterConfig = {
    type,
    filterTagsId: `${type}-filter-tags`,
    clearBtnId: `${type}-clear-filters`,
    resultsCountId: `${type}-results-count`,
    itemSelector: `[data-${type}-item]`,
    tagAttribute: `data-${type}-tags`,
  };

  // Get DOM elements
  const filterTags = document.getElementById(config.filterTagsId);
  const clearBtn = document.getElementById(config.clearBtnId);
  const resultsCount = document.getElementById(config.resultsCountId);
  const items = document.querySelectorAll<HTMLElement>(config.itemSelector);

  // Early return if required elements are missing
  if (!filterTags || !clearBtn || !resultsCount) {
    console.warn(`Filter elements not found for ${type}`);
    return;
  }

  if (items.length === 0) {
    console.warn(`No items found with selector ${config.itemSelector}`);
    return;
  }

  console.log(`Found ${items.length} items to filter`);

  // Mark as initialized
  initializedInstances.add(instanceKey);

  // ========================================================================
  // State Management
  // ========================================================================
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
    console.log(`Toggling filter: ${tagId}`);

    if (activeFilters.has(tagId)) {
      activeFilters.delete(tagId);
    } else {
      activeFilters.add(tagId);
    }

    console.log(`Active filters:`, Array.from(activeFilters));
    updateUI();
    filterItems();
    updateURL();
  }

  /**
   * Clear all filters
   */
  function clearAllFilters(): void {
    console.log("Clearing all filters");
    activeFilters.clear();
    updateUI();
    filterItems();
    updateURL();
  }

  // ========================================================================
  // UI Update Functions
  // ========================================================================

  /**
   * Update UI state
   * Updates button states, ARIA attributes, and visibility of clear button
   */
  function updateUI(): void {
    const buttons =
      filterTags.querySelectorAll<HTMLButtonElement>(".filter-tag-btn");
    console.log(`Updating UI for ${buttons.length} buttons`);

    buttons.forEach((btn) => {
      const tagId = btn.dataset.tagId;
      const tagElement = btn.querySelector<HTMLElement>("[data-tag-label]");
      const isActive = tagId ? activeFilters.has(tagId) : false;

      // Update ARIA state for accessibility
      btn.setAttribute("aria-pressed", String(isActive));

      // Update visual state by directly manipulating classes
      if (tagElement) {
        if (isActive) {
          // Active state: black background, white text
          tagElement.classList.remove("bg-white", "text-black");
          tagElement.classList.add("bg-black", "text-white");
        } else {
          // Inactive state: white background, black text
          tagElement.classList.remove("bg-black", "text-white");
          tagElement.classList.add("bg-white", "text-black");
        }
      }
    });

    // Show/hide clear button based on active filter count
    if (clearBtn) {
      clearBtn.classList.toggle("hidden", activeFilters.size === 0);
    }
  }

  /**
   * Filter items based on active filters
   */
  function filterItems(): void {
    let visibleCount = 0;
    const hasFilters = activeFilters.size > 0;

    console.log(
      `Filtering items. Has filters: ${hasFilters}, Active filters:`,
      Array.from(activeFilters)
    );

    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
      items.forEach((item) => {
        // Get tags from data attribute
        const itemTagsStr = item.getAttribute(config.tagAttribute);
        const itemTags = itemTagsStr
          ? itemTagsStr
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [];

        // Check if item matches filters
        const isVisible =
          !hasFilters || itemTags.some((tag) => activeFilters.has(tag));

        // Show/hide item
        item.style.display = isVisible ? "" : "none";

        if (isVisible) {
          visibleCount++;
        }
      });

      console.log(`Visible items: ${visibleCount} of ${items.length}`);
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

  // ========================================================================
  // Event Handlers
  // ========================================================================

  /**
   * Handle filter button clicks
   */
  function handleFilterClick(e: Event): void {
    // Find the button that was clicked
    const target = e.target as HTMLElement;
    const btn = target.closest<HTMLButtonElement>(".filter-tag-btn");

    if (btn?.dataset.tagId) {
      console.log(`Button clicked:`, btn.dataset.tagId);
      e.preventDefault();
      e.stopPropagation();
      toggleFilter(btn.dataset.tagId);
    }
  }

  /**
   * Handle keyboard navigation
   * Supports Enter and Space keys for accessibility
   */
  function handleKeyDown(e: KeyboardEvent): void {
    const target = e.target as HTMLElement;
    const btn = target.closest<HTMLButtonElement>(".filter-tag-btn");

    if (!btn?.dataset.tagId) return;

    // Handle Enter and Space keys for keyboard accessibility
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFilter(btn.dataset.tagId);
    }
  }

  // ========================================================================
  // Initialization
  // ========================================================================

  // Initialize filter state from URL parameters
  initFromURL();

  // Attach event listeners
  filterTags.addEventListener("click", handleFilterClick);
  filterTags.addEventListener("keydown", handleKeyDown);

  if (clearBtn) {
    clearBtn.addEventListener("click", clearAllFilters);
  }

  console.log(`Filters successfully initialized for ${type}`);
}

/**
 * Reset initialization state (useful for page transitions)
 */
export function resetFilters(): void {
  initializedInstances.clear();
}
