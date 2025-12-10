# Tagging & Filtering System Guide

## Overview

This modular tagging system allows you to:
- Define tags in a centralized configuration
- Add tags to blog posts and portfolio projects
- Display tags on cards
- Filter content by tags with URL persistence
- Easily extend with new tags and categories

## Adding New Tags

### 1. Define Tags in Configuration

Edit `src/config/tags.ts`:

```typescript
export const TAGS: Record<string, Tag> = {
  // Add your new tag
  'nextjs': { 
    id: 'nextjs', 
    label: 'Next.js', 
    category: 'technology' 
  },
  // ... existing tags
}
```

**Tag Categories:**
- `technology` - Programming languages, frameworks, tools
- `design` - Design principles, methodologies
- `domain` - Subject areas, fields of work
- `skill` - Capabilities, competencies

### 2. Add Tags to Blog Posts

**For MDX Posts** (in frontmatter):

```yaml
---
layout: ../../layouts/BlogLayout.astro
title: "Your Post Title"
date: "2024-03-15"
excerpt: "Your excerpt"
readTime: "5 min read"
tags: ['design', 'minimalism', 'swiss-design']
---
```

**For Posts in index.astro** (in the posts array):

```typescript
const posts = [
  {
    title: "Your Post",
    excerpt: "...",
    date: "2024-03-15",
    readTime: "5 min",
    slug: "your-post",
    tags: ['design', 'minimalism'] as TagId[],
  },
]
```

### 3. Add Tags to Portfolio Projects

Edit `src/pages/portfolio/index.astro`:

```typescript
const projects = [
  {
    title: "Your Project",
    description: "...",
    year: "2024",
    tags: ['ai', 'python', 'machine-learning'] as TagId[],
    link: "/portfolio/your-project",
  },
]
```

## How It Works

### Components

**`Tag.astro`**
- Displays individual tags
- Variants: `default`, `filter`, `large`
- Supports active/inactive states

**`FilterBar.astro`**
- Shows all available tags as clickable filters
- Displays results count
- Handles URL parameter persistence
- Client-side filtering logic

### Filtering Logic

1. User clicks tag → adds/removes from active filters
2. Items are filtered using `data-{type}-tags` attributes
3. URL updates with `?tags=design,python` format
4. Filters persist on page reload
5. "Clear All" button resets filters

### Data Attributes

Items must have these attributes for filtering:

```html
<article 
  data-blog-item
  data-blog-tags="design,minimalism,swiss-design"
>
```

Or for portfolio:

```html
<article 
  data-portfolio-item
  data-portfolio-tags="ai,python,machine-learning"
>
```

## Extending the System

### Add New Tag Category

```typescript
export interface Tag {
  id: string;
  label: string;
  category: 'technology' | 'design' | 'domain' | 'skill' | 'industry'; // Add new
}
```

### Use Tags Dynamically from MDX

To fetch and display tags from MDX posts:

```astro
---
const posts = await Astro.glob('./blog/*.mdx');
const postsWithTags = posts.map(post => ({
  ...post.frontmatter,
  slug: post.file.split('/').pop()?.replace('.mdx', ''),
  tags: post.frontmatter.tags || []
}));
---
```

### Custom Tag Styling

Modify `Tag.astro` component classes:

```astro
class:list={[
  'your-custom-classes',
  { 'active-state': active }
]}
```

### Filter by Multiple Criteria

Extend `FilterBar.astro` script to support category filtering:

```typescript
// Add category filter
const categorySelect = document.getElementById('category-filter');
categorySelect?.addEventListener('change', (e) => {
  const category = (e.target as HTMLSelectElement).value;
  // Filter by category
});
```

## Best Practices

1. **Tag Naming**: Use kebab-case for IDs, proper case for labels
2. **Tag Count**: 3-5 tags per item is ideal
3. **Categories**: Group related tags for easier navigation
4. **Consistency**: Use same tag IDs across blog and portfolio
5. **URL Friendly**: Avoid special characters in tag IDs

## Examples

### Adding a New Technology Tag

```typescript
// 1. Add to config
'svelte': { id: 'svelte', label: 'Svelte', category: 'technology' },

// 2. Use in project
tags: ['svelte', 'typescript', 'web-development'] as TagId[],

// 3. Use in blog post
tags: ['svelte', 'design', 'web-development']
```

### Creating a Blog Post with Tags

```markdown
---
layout: ../../layouts/BlogLayout.astro
title: "Building with Svelte"
date: "2024-12-10"
excerpt: "My experience with Svelte framework"
readTime: "8 min read"
tags: ['svelte', 'web-development', 'frontend']
---

Your content here...
```

### Sharing Filtered Views

Filtered URLs are shareable:
- `yoursite.com/blog?tags=design,minimalism`
- `yoursite.com/portfolio?tags=ai,python`

## Troubleshooting

**Tags not showing?**
- Verify tag IDs exist in `src/config/tags.ts`
- Check `data-{type}-tags` attributes match exactly
- Ensure TypeScript types are correct (`as TagId[]`)

**Filtering not working?**
- Check browser console for JavaScript errors
- Verify `data-{type}-item` attributes exist
- Ensure FilterBar is imported and rendered

**Tags not filtering correctly?**
- Confirm tag IDs in data attributes match config
- Check for whitespace in tag lists
- Verify script initialization in FilterBar

## Performance Notes

- Filtering is client-side (instant, no page reload)
- Tags are static at build time
- No runtime dependencies
- Minimal JavaScript footprint (~2KB)