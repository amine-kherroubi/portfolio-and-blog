/**
 * Astro Configuration
 * 
 * Modern Astro 5 configuration with optimizations for performance,
 * SEO, and developer experience.
 * 
 * @see https://docs.astro.build/en/reference/configuration-reference/
 */

import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  /**
   * Site URL
   * Update this with your production domain
   */
  site: "http://localhost:4321",

  /**
   * Vite Configuration
   * Custom Vite settings for build optimizations
   */
  vite: {
    plugins: [tailwindcss()],

    // Optimize dependencies
    optimizeDeps: {
      exclude: ["@astrojs/mdx"],
    },

    // Build optimizations
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["astro"],
          },
        },
      },
    },
  },

  /**
   * Integrations
   * Astro integrations for extended functionality
   */
  integrations: [
    // MDX support for markdown with JSX
    mdx({
      optimize: true,
      remarkPlugins: [],
      rehypePlugins: [],
    }),
    // Sitemap generation for SEO
    // lastmod is automatically calculated from file modification dates
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
    }),
  ],

  /**
   * Image Optimization
   * Configure allowed image domains for optimization
   */
  image: {
    domains: ["yourdomain.com"], // Add your production domain
  },

  /**
   * Security Configuration
   * Enable origin checking for security
   */
  security: {
    checkOrigin: true,
  },

  /**
   * Output Configuration
   * Static site generation (SSG) by default
   */
  output: "static",

  /**
   * Prefetch Configuration
   * Prefetch links for faster navigation
   * ClientRouter automatically enables prefetching by default
   */
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },

  /**
   * Markdown Configuration
   * Syntax highlighting and markdown processing
   */
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
    remarkPlugins: [],
    rehypePlugins: [],
  },

  /**
   * Build Configuration
   * Optimize build output
   */
  build: {
    inlineStylesheets: "auto", // Inline small stylesheets
    format: "directory", // Use directory format for clean URLs
  },

});
