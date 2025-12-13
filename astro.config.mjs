/**
 * Astro Configuration - December 2025
 *
 * Enhanced with Astro 5.16 features:
 * - SVG optimization with SVGO
 * - Content Layer API (stable)
 * - Better conflict handling
 * - Improved prefetch
 *
 * Tailwind 4.1 integrated via @tailwindcss/vite plugin
 */

import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "http://localhost:4321",

  vite: {
    plugins: [tailwindcss()],

    optimizeDeps: {
      exclude: ["@astrojs/mdx"],
    },

    build: {
      rollupOptions: {
        external: ["/pagefind/pagefind.js"],
        output: {
          manualChunks: {
            vendor: ["astro"],
          },
        },
        onwarn(warning, warn) {
          // Suppress warnings about unused imports in Astro's internal code
          if (
            warning.code === "UNUSED_EXTERNAL_IMPORT" &&
            warning.id?.includes("@astrojs/internal-helpers")
          ) {
            return;
          }
          warn(warning);
        },
      },
    },
  },

  integrations: [
    mdx({
      optimize: true,
      remarkPlugins: [],
      rehypePlugins: [],
    }),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
    }),
  ],

  image: {
    domains: ["yourdomain.com"],
  },

  security: {
    checkOrigin: true,
  },

  output: "static",

  // Astro 5: Enhanced prefetch with throttling
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
    throttle: 3, // Limit concurrent prefetch requests
  },

  // Astro 5: Prerender conflict handling
  prerenderConflictBehavior: "warn", // or "error" for stricter builds

  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
    remarkPlugins: [],
    rehypePlugins: [],
  },

  build: {
    inlineStylesheets: "auto",
    format: "directory",
  },
});
