/**
 * Astro Configuration - Desktop Only
 *
 * Enhanced with search support via Pagefind.
 * Note: Pagefind runs as a post-build step (see package.json build script)
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
    // Note: Pagefind integration happens via post-build script
    // See package.json: "build": "astro check && astro build && pagefind --site dist"
  ],

  image: {
    domains: ["yourdomain.com"],
  },

  security: {
    checkOrigin: true,
  },

  output: "static",

  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },

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
