/**
 * RSS Feed Generation
 *
 * Purpose: RSS feed listing recent blog posts.
 */

import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "../config/site.config";
import type { APIRoute } from "astro";
import type { CollectionEntry } from "astro:content";

export const GET: APIRoute = async (context) => {
  // Get all writing posts
  const posts = await getCollection("writing");

  // Sort posts by date (newest first)
  const sortedPosts = posts.sort(
    (a: CollectionEntry<"writing">, b: CollectionEntry<"writing">) => {
      const dateA = new Date(a.data.date);
      const dateB = new Date(b.data.date);
      return dateB.getTime() - dateA.getTime();
    }
  );

  return rss({
    // Basic feed info
    title: SITE.title,
    description: SITE.description,
    site: context.site?.toString() || "",

    // Feed items from blog posts
    items: sortedPosts.map((post: CollectionEntry<"writing">) => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: new Date(post.data.date),
      link: `/writing/${post.id}/`,
      // Optional: Add categories/tags
      categories: post.data.tags || [],
    })),

    // Customize feed appearance
    customData: `
      <language>en-us</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <generator>Astro ${import.meta.env["ASTRO_VERSION"]}</generator>
    `,

    // Styling for feed readers
    stylesheet: "/rss-styles.xsl",
  });
};
