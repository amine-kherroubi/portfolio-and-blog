/**
 * Tailwind CSS Configuration
 * 
 * Tailwind CSS v4 uses CSS-first configuration via @theme directive in CSS files.
 * This config file is kept for compatibility and TypeScript support.
 * 
 * @see https://tailwindcss.com/docs/v4-beta
 */

import type { Config } from "tailwindcss";

/**
 * Tailwind CSS 4 Configuration
 * 
 * Uses modern Tailwind 4 patterns with CSS-first configuration.
 * Design tokens are defined in global.css using @theme directive.
 * This config file is kept minimal and mainly for content paths.
 */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  // Theme customization is handled via @theme in global.css (Tailwind 4 pattern)
  theme: {
    extend: {
      // Colors are defined in CSS via @theme directive
      // Keeping here for TypeScript autocomplete support
      colors: {
        black: "var(--color-black)",
        white: "var(--color-white)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      maxWidth: {
        "screen-2xl": "1536px",
      },
      // Transition durations from CSS variables
      transitionDuration: {
        base: "var(--transition-base)",
        fast: "var(--transition-fast)",
        slow: "var(--transition-slow)",
      },
    },
  },
  plugins: [],
} satisfies Config;
