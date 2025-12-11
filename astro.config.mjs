import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "http://localhost:4321", // Update with your domain

  vite: {
    plugins: [tailwindcss()],

    // Optimize dependencies
    optimizeDeps: {
      exclude: ["@astrojs/mdx"],
    },

    // Build optimizations
    build: {
      cssMinify: "lightningcss",
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
      // Optimize MDX processing
      optimize: true,
      remarkPlugins: [],
      rehypePlugins: [],
    }),
    sitemap({
      // Customize sitemap generation
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],

  // Image optimization (Astro 5+)
  image: {
    domains: ["yourdomain.com"],
  },

  // Experimental features (Astro 5+)
  experimental: {
    // Enable SVG optimization if needed
    // svg: true,
  },

  // Security headers
  security: {
    checkOrigin: true,
  },

  // Output configuration (Astro 5 simplified)
  output: "static", // Default, allows prerender: false on individual pages

  // Prefetch configuration for faster navigation
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },

  // Markdown configuration
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
    remarkPlugins: [],
    rehypePlugins: [],
  },

  // Build configuration
  build: {
    inlineStylesheets: "auto",
    format: "directory",
  },

  // View Transitions configuration
  viewTransitions: {
    fallback: "none",
  },
});
