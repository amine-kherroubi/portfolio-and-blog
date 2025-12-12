/**
 * Astro Configuration - Desktop Only
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
        output: {
          manualChunks: {
            vendor: ["astro"],
          },
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
