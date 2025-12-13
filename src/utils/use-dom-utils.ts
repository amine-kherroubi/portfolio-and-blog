/**
 * DOM Utilities
 *
 * Reusable DOM manipulation and query utilities for
 * consistent element handling across components.
 */

// ============================================================================
// Types
// ============================================================================

export interface ElementOptions {
  required?: boolean;
  errorMessage?: string;
}

export interface ScrollOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
}

// ============================================================================
// Element Selection
// ============================================================================

/**
 * Get element by ID with type safety
 */
export function getElementById<T extends HTMLElement = HTMLElement>(
  id: string,
  options: ElementOptions = {}
): T | null {
  const element = document.getElementById(id) as T | null;

  if (!element && options.required) {
    const message =
      options.errorMessage || `Required element not found: #${id}`;
    console.error("[DOM]", message);
    throw new Error(message);
  }

  return element;
}

/**
 * Get element by selector with type safety
 */
export function querySelector<T extends HTMLElement = HTMLElement>(
  selector: string,
  options: ElementOptions = {}
): T | null {
  const element = document.querySelector<T>(selector);

  if (!element && options.required) {
    const message =
      options.errorMessage || `Required element not found: ${selector}`;
    console.error("[DOM]", message);
    throw new Error(message);
  }

  return element;
}

/**
 * Get all elements by selector with type safety
 */
export function querySelectorAll<T extends HTMLElement = HTMLElement>(
  selector: string
): NodeListOf<T> {
  return document.querySelectorAll<T>(selector);
}

/**
 * Find closest parent element matching selector
 */
export function closest<T extends HTMLElement = HTMLElement>(
  element: HTMLElement,
  selector: string
): T | null {
  return element.closest<T>(selector);
}

// ============================================================================
// Class Manipulation
// ============================================================================

/**
 * Toggle class on element
 */
export function toggleClass(
  element: HTMLElement,
  className: string,
  force?: boolean
): void {
  element.classList.toggle(className, force);
}

/**
 * Add class to element
 */
export function addClass(element: HTMLElement, ...classNames: string[]): void {
  element.classList.add(...classNames);
}

/**
 * Remove class from element
 */
export function removeClass(
  element: HTMLElement,
  ...classNames: string[]
): void {
  element.classList.remove(...classNames);
}

/**
 * Check if element has class
 */
export function hasClass(element: HTMLElement, className: string): boolean {
  return element.classList.contains(className);
}

// ============================================================================
// Attribute Manipulation
// ============================================================================

/**
 * Set attribute on element
 */
export function setAttribute(
  element: HTMLElement,
  name: string,
  value: string
): void {
  element.setAttribute(name, value);
}

/**
 * Get attribute from element
 */
export function getAttribute(
  element: HTMLElement,
  name: string
): string | null {
  return element.getAttribute(name);
}

/**
 * Remove attribute from element
 */
export function removeAttribute(element: HTMLElement, name: string): void {
  element.removeAttribute(name);
}

/**
 * Check if element has attribute
 */
export function hasAttribute(element: HTMLElement, name: string): boolean {
  return element.hasAttribute(name);
}

/**
 * Set data attribute
 */
export function setData(
  element: HTMLElement,
  key: string,
  value: string
): void {
  element.dataset[key] = value;
}

/**
 * Get data attribute
 */
export function getData(element: HTMLElement, key: string): string | undefined {
  return element.dataset[key];
}

// ============================================================================
// Style Manipulation
// ============================================================================

/**
 * Set inline style on element
 */
export function setStyle(
  element: HTMLElement,
  property: string,
  value: string
): void {
  element.style.setProperty(property, value);
}

/**
 * Get computed style value
 */
export function getComputedStyle(
  element: HTMLElement,
  property: string
): string {
  return window.getComputedStyle(element).getPropertyValue(property);
}

/**
 * Show element
 */
export function show(element: HTMLElement): void {
  element.style.display = "";
}

/**
 * Hide element
 */
export function hide(element: HTMLElement): void {
  element.style.display = "none";
}

/**
 * Toggle element visibility
 */
export function toggle(element: HTMLElement, force?: boolean): void {
  const isHidden = element.style.display === "none";
  const shouldShow = force !== undefined ? force : isHidden;

  element.style.display = shouldShow ? "" : "none";
}

// ============================================================================
// Scroll Utilities
// ============================================================================

/**
 * Scroll element into view
 */
export function scrollIntoView(
  element: HTMLElement,
  options: ScrollOptions = {}
): void {
  element.scrollIntoView({
    behavior: options.behavior || "smooth",
    block: options.block || "center",
    inline: options.inline || "nearest",
  });
}

/**
 * Scroll to top of page
 */
export function scrollToTop(behavior: ScrollBehavior = "smooth"): void {
  window.scrollTo({ top: 0, behavior });
}

/**
 * Get scroll position
 */
export function getScrollPosition(): { x: number; y: number } {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop,
  };
}

// ============================================================================
// Focus Management
// ============================================================================

/**
 * Focus element
 */
export function focus(element: HTMLElement, options?: FocusOptions): void {
  element.focus(options);
}

/**
 * Blur element
 */
export function blur(element: HTMLElement): void {
  element.blur();
}

/**
 * Get focused element
 */
export function getFocusedElement(): Element | null {
  return document.activeElement;
}

/**
 * Focus first focusable element within container
 */
export function focusFirst(container: HTMLElement): boolean {
  const focusable = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusable.length > 0 && focusable[0]) {
    focusable[0].focus();
    return true;
  }

  return false;
}

// ============================================================================
// Event Utilities
// ============================================================================

/**
 * Add event listener with cleanup
 */
export function addEventListener<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  type: K,
  listener: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void {
  element.addEventListener(type, listener as EventListener, options);

  // Return cleanup function
  return () => {
    element.removeEventListener(type, listener as EventListener, options);
  };
}

/**
 * Dispatch custom event
 */
export function dispatchEvent(
  element: HTMLElement,
  eventName: string,
  detail?: any
): void {
  const event = new CustomEvent(eventName, {
    detail,
    bubbles: true,
    cancelable: true,
  });

  element.dispatchEvent(event);
}

// ============================================================================
// Content Manipulation
// ============================================================================

/**
 * Set text content
 */
export function setText(element: HTMLElement, text: string): void {
  element.textContent = text;
}

/**
 * Get text content
 */
export function getText(element: HTMLElement): string {
  return element.textContent || "";
}

/**
 * Set HTML content
 */
export function setHTML(element: HTMLElement, html: string): void {
  element.innerHTML = html;
}

/**
 * Get HTML content
 */
export function getHTML(element: HTMLElement): string {
  return element.innerHTML;
}

/**
 * Clear element content
 */
export function clear(element: HTMLElement): void {
  element.innerHTML = "";
}

/**
 * Append HTML to element
 */
export function append(element: HTMLElement, html: string): void {
  element.insertAdjacentHTML("beforeend", html);
}

/**
 * Prepend HTML to element
 */
export function prepend(element: HTMLElement, html: string): void {
  element.insertAdjacentHTML("afterbegin", html);
}

// ============================================================================
// Dimension Utilities
// ============================================================================

/**
 * Get element dimensions
 */
export function getDimensions(element: HTMLElement): {
  width: number;
  height: number;
} {
  return {
    width: element.offsetWidth,
    height: element.offsetHeight,
  };
}

/**
 * Get element position
 */
export function getPosition(element: HTMLElement): {
  top: number;
  left: number;
} {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.pageYOffset,
    left: rect.left + window.pageXOffset,
  };
}

/**
 * Get element bounding box
 */
export function getBoundingBox(element: HTMLElement): DOMRect {
  return element.getBoundingClientRect();
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Check if element is visible
 */
export function isVisible(element: HTMLElement): boolean {
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  );
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Check if element is focused
 */
export function isFocused(element: HTMLElement): boolean {
  return document.activeElement === element;
}

// ============================================================================
// Batch Operations
// ============================================================================

/**
 * Apply function to multiple elements
 */
export function batch<T extends HTMLElement>(
  elements: NodeListOf<T> | T[],
  fn: (element: T, index: number) => void
): void {
  const array = Array.isArray(elements) ? elements : Array.from(elements);
  array.forEach(fn);
}

/**
 * Batch update using requestAnimationFrame
 */
export function batchUpdate(callback: () => void): void {
  requestAnimationFrame(callback);
}

// ============================================================================
// Template Utilities
// ============================================================================

/**
 * Create element from template string
 */
export function createElement<T extends HTMLElement = HTMLElement>(
  html: string
): T {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstChild as T;
}

/**
 * Clone element
 */
export function clone<T extends HTMLElement>(
  element: T,
  deep: boolean = true
): T {
  return element.cloneNode(deep) as T;
}
