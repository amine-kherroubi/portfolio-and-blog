/**
 * Mobile Menu Script
 * 
 * Handles mobile menu toggle functionality with proper ARIA management
 * and keyboard navigation support.
 */

interface MobileMenuElements {
  button: HTMLElement | null;
  menu: HTMLElement | null;
}

/**
 * Initialize mobile menu functionality
 * @param buttonId - ID of the menu toggle button
 * @param menuId - ID of the mobile menu element
 */
export function initMobileMenu(
  buttonId: string = "mobile-menu-button",
  menuId: string = "mobile-menu"
): void {
  const button = document.getElementById(buttonId);
  const menu = document.getElementById(menuId);

  if (!button || !menu) {
    console.warn(`Mobile menu elements not found: button=${buttonId}, menu=${menuId}`);
    return;
  }

  /**
   * Toggle menu visibility
   */
  function toggleMenu(): void {
    const isExpanded = button?.getAttribute("aria-expanded") === "true";
    button?.setAttribute("aria-expanded", String(!isExpanded));
    menu?.classList.toggle("hidden");
    
    // Focus management
    if (!isExpanded) {
      // Menu opened - focus first link
      const firstLink = menu?.querySelector<HTMLAnchorElement>("a");
      firstLink?.focus();
    }
  }

  /**
   * Close menu
   */
  function closeMenu(): void {
    button?.setAttribute("aria-expanded", "false");
    menu?.classList.add("hidden");
    button?.focus();
  }

  /**
   * Handle click events
   */
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  /**
   * Close menu when clicking outside
   */
  document.addEventListener("click", (e) => {
    const target = e.target as Node;
    if (
      button &&
      menu &&
      !button.contains(target) &&
      !menu.contains(target) &&
      !menu.classList.contains("hidden")
    ) {
      closeMenu();
    }
  });

  /**
   * Handle Escape key
   */
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      menu &&
      !menu.classList.contains("hidden")
    ) {
      e.preventDefault();
      closeMenu();
    }
  });

  /**
   * Trap focus within menu when open (accessibility)
   */
  menu.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || menu.classList.contains("hidden")) return;

    const focusableElements = menu.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement?.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement?.focus();
    }
  });
}

// Auto-initialize on DOM ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initMobileMenu());
  } else {
    initMobileMenu();
  }

  // Reinitialize on Astro page navigation (View Transitions)
  document.addEventListener("astro:page-load", () => initMobileMenu());
}
