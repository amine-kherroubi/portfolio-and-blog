/**
 * Tailwind CSS Configuration - Desktop Only
 */

import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        black: "var(--color-black)",
        white: "var(--color-white)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      maxWidth: {
        container: "1280px",
      },
      transitionDuration: {
        base: "var(--transition-base)",
        fast: "var(--transition-fast)",
        slow: "var(--transition-slow)",
      },
    },
  },
  plugins: [],
} satisfies Config;
