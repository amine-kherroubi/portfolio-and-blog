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

// Load environment variables
const SITE_URL = process.env.PUBLIC_SITE_URL || "http://localhost:4321";

export default defineConfig({
  // Site URL - used for sitemap, RSS, and canonical URLs
  // Set PUBLIC_SITE_URL in production environment
  site: SITE_URL,

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

    // Define environment variables for client-side access
    define: {
      "import.meta.env.PUBLIC_SITE_URL": JSON.stringify(SITE_URL),
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
      // Filter out development URLs from sitemap
      filter: (page) => !page.includes("localhost"),
    }),
  ],

  image: {
    domains: ["yourdomain.com"],
    // Add your image CDN domains here if using external images
    // remotePatterns: [{ protocol: "https", hostname: "**.cdn.com" }],
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
    // Assets configuration
    assets: "_astro",
  },

  // Server configuration for development
  server: {
    port: 4321,
    host: true, // Listen on all addresses
  },

  // Experimental features (optional)
  experimental: {
    // Enable as needed
    // contentLayer: true,
  },
});
