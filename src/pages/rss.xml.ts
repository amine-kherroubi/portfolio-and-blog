/**
 * RSS Feed Generation
 *
 * Purpose: RSS feed listing recent blog posts.
 *
 * Implementation: Automatic generation of an XML feed (e.g. /rss.xml) at build time,
 * containing post titles, summaries, links, and dates.
 *
 * Justification: RSS engages readers (subscribers receive new posts) and acts like
 * a dynamic sitemap for crawlers. Search engines and aggregators use RSS to discover
 * new content faster. Although it doesn't directly boost ranking, it helps Google
 * crawl and index new pages quickly.
 */

import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "../config/site";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
  // Get all writing posts
  const posts = await getCollection("writing");

  // Sort posts by date (newest first)
  const sortedPosts = posts.sort((a, b) => {
    const dateA = new Date(a.data.date);
    const dateB = new Date(b.data.date);
    return dateB.getTime() - dateA.getTime();
  });

  return rss({
    // Basic feed info
    title: SITE.title,
    description: SITE.description,
    site: context.site?.toString() || "",

    // Feed items from blog posts
    items: sortedPosts.map((post) => ({
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
      <generator>Astro ${import.meta.env.ASTRO_VERSION}</generator>
    `,

    // Styling for feed readers
    stylesheet: "/rss-styles.xsl",
  });
};
