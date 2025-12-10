# Tagging & Filtering System Guide

## Overview

This modular tagging system allows you to:
- Define tags in a centralized configuration
- Add tags to blog posts and portfolio projects using Content Collections
- Display tags on cards
- Filter content by tags with URL persistence
- Easily extend with new tags and categories

## Content Collections Structure

Content is organized using Astro's Content Collections in `src/content/`:

```
src/content/
├── config.ts          # Collection schemas
├── blog/             # Blog posts (MDX)
│   ├── beauty-of-constraint.mdx
│   ├── swiss-design-digital.mdx
│   └── ...
└── portfolio/        # Portfolio projects (Markdown)
    ├── neural-networks.md
    ├── grid-system.md
    └── ...
```

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

Create or edit an MDX file in `src/content/blog/`:

```yaml
---
title: "Your Post Title"
date: "2024-03-15"
excerpt: "Your excerpt"
readTime: "5 min read"
tags: ["design", "minimalism", "swiss-design"]
---

Your post content here...
```

### 3. Add Tags to Portfolio Projects

Create or edit a Markdown file in `src/content/portfolio/`:

```yaml
---
title: "Your Project"
description: "Project description"
year: "2024"
tags: ["ai", "python", "machine-learning"]
---

Your project content here...
```

## How It Works

### Content Collections

**`src/content/config.ts`**
- Defines schemas for blog and portfolio collections
- Uses Zod for type validation
- Configures the glob loader for file-based content

**Content Queries**
- Pages use `getCollection()` from `astro:content`
- Automatically loads all content from collections
- Provides type-safe access to frontmatter

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

## Adding New Content

### Add a New Blog Post

1. Create a new `.mdx` file in `src/content/blog/`:

```markdown
---
title: "Building with Svelte"
date: "2024-12-10"
excerpt: "My experience with Svelte framework"
readTime: "8 min read"
tags: ["svelte", "web-development", "frontend"]
---

Your content here...
```

2. The blog index page will automatically include it
3. A dynamic route at `/blog/[slug]` will render it

### Add a New Portfolio Project

1. Create a new `.md` file in `src/content/portfolio/`:

```markdown
---
title: "Your Project"
description: "Project description"
year: "2024"
tags: ["svelte", "typescript", "web-development"]
---

Your project content here...
```

2. The portfolio index will automatically include it
3. A dynamic route at `/portfolio/[slug]` will render it

## Extending the System

### Add New Tag Category

```typescript
export interface Tag {
  id: string;
  label: string;
  category: 'technology' | 'design' | 'domain' | 'skill' | 'industry'; // Add new
}
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
6. **Type Safety**: Always define tags in `src/config/tags.ts` first

## Content Collection Benefits

- **Type Safety**: Zod schemas validate frontmatter
- **Centralized**: All content in one location
- **Easy Queries**: Use `getCollection()` for data access
- **Auto-generated Routes**: Dynamic pages for all content
- **Performance**: Optimized for build-time rendering

## Troubleshooting

**Tags not showing?**
- Verify tag IDs exist in `src/config/tags.ts`
- Check `data-{type}-tags` attributes match exactly
- Ensure frontmatter schema matches `src/content/config.ts`

**Content not appearing?**
- Check file location in correct collection folder
- Verify frontmatter matches schema in `config.ts`
- Run `astro dev` and check console for errors

**Filtering not working?**
- Check browser console for JavaScript errors
- Verify `data-{type}-item` attributes exist
- Ensure FilterBar is imported and rendered

## Performance Notes

- Filtering is client-side (instant, no page reload)
- Content is static at build time
- Collections are queried at build time
- No runtime dependencies
- Minimal JavaScript footprint (~2KB)