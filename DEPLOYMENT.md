# Deployment Checklist

Complete this checklist before deploying to production to ensure optimal SEO,
security, and performance.

## Pre-Deployment Configuration

### 1. Environment Variables

- [ ] Create `.env` from `.env.example`
- [ ] Set `PUBLIC_SITE_URL` to production domain (e.g.,
      `https://yourdomain.com`)
- [ ] Update `PUBLIC_SITE_NAME` if different from config
- [ ] Update `PUBLIC_SITE_EMAIL` if needed
- [ ] Add analytics tracking IDs (if using)
- [ ] Add API keys for form services (if using)
- [ ] Verify no sensitive data in environment variables

### 2. Site Configuration (`src/config/site.ts`)

- [ ] Update `SITE.name` with your name
- [ ] Update `SITE.title` with your title
- [ ] Update `SITE.description` with your description
- [ ] Update `SITE.email` with your contact email
- [ ] Update `SOCIAL.github` with your GitHub URL
- [ ] Update `SOCIAL.linkedin` with your LinkedIn URL
- [ ] Add additional social links if needed

### 3. SEO Files

#### robots.txt (`public/robots.txt`)

- [ ] Update sitemap URL to production domain
- [ ] Review allowed/disallowed paths
- [ ] Decide on AI crawler policies (uncomment if blocking)
- [ ] Verify file is under 500KB

#### security.txt (`public/.well-known/security.txt`)

- [ ] Update contact email
- [ ] Update canonical URL to production domain
- [ ] Set expiration date (should be within 1 year)
- [ ] Update policy URL if you have one
- [ ] Review scope and disclosure policy

### 4. Content Review

#### Writing Posts (`src/content/writing/`)

- [ ] All posts have required frontmatter (title, excerpt, date, readTime, tags)
- [ ] Dates are in ISO format (YYYY-MM-DD)
- [ ] Tags exist in `src/config/tags.ts`
- [ ] Remove any draft/placeholder posts
- [ ] Verify links are working
- [ ] Check images are optimized

#### Work Projects (`src/content/work/`)

- [ ] All projects have required frontmatter (title, description, year, tags)
- [ ] Years are valid (YYYY format)
- [ ] Tags exist in `src/config/tags.ts`
- [ ] Remove any placeholder projects
- [ ] Verify external links work
- [ ] Check images are optimized

### 5. Images & Assets

- [ ] Add favicon.svg to `public/`
- [ ] Add og-image.jpg (1200x630px) to `public/`
- [ ] Optimize all images (use WebP/AVIF if possible)
- [ ] Verify all image alt text is descriptive
- [ ] Check image file sizes (< 500KB recommended)
- [ ] Test responsive images load correctly

### 6. Meta & Structured Data

- [ ] Update default OG image path if needed
- [ ] Verify canonical URLs are correct
- [ ] Test structured data with Google's Rich Results Test
- [ ] Confirm author information is correct
- [ ] Review meta descriptions (under 160 characters)

### 7. Astro Configuration (`astro.config.mjs`)

- [ ] Verify `site` uses `process.env.PUBLIC_SITE_URL`
- [ ] Update `image.domains` if using external images
- [ ] Review prefetch settings
- [ ] Confirm sitemap is enabled
- [ ] Check security settings

### 8. Build & Test

```bash
# Type check
npm run check

# Build
npm run build

# Preview build locally
npm run preview

# Test all pages load
# Test search functionality
# Test forms (if applicable)
# Test on mobile viewport
```

#### What to Test:

- [ ] All pages load without errors
- [ ] Navigation works correctly
- [ ] Search returns results (visit `/search`)
- [ ] Filters work on `/writing` and `/work`
- [ ] Forms validate and submit (if applicable)
- [ ] Images load and are optimized
- [ ] View transitions are smooth
- [ ] No console errors
- [ ] No broken links
- [ ] Responsive on mobile devices
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility (basic test)

### 9. Performance

Run Lighthouse audit and aim for:

- [ ] Performance: 90+
- [ ] Accessibility: 95+
- [ ] Best Practices: 95+
- [ ] SEO: 100

Check Core Web Vitals:

- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1

### 10. Security

- [ ] Enable HTTPS on hosting platform
- [ ] Configure CSP headers (if needed)
- [ ] Set security headers (X-Frame-Options, etc.)
- [ ] Review CORS settings
- [ ] Disable debug mode in production
- [ ] Remove any console.log statements with sensitive data

## Hosting Platform Setup

### Vercel

1. **Environment Variables**

   ```
   PUBLIC_SITE_URL=https://yourdomain.com
   ```

2. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Redirects** (if needed) Create `vercel.json`:
   ```json
   {
     "rewrites": [
       {
         "source": "/.well-known/security.txt",
         "destination": "/security.txt"
       }
     ]
   }
   ```

### Netlify

1. **Environment Variables**

   ```
   PUBLIC_SITE_URL=https://yourdomain.com
   ```

2. **Build Settings**
   - Build Command: `npm run build`
   - Publish Directory: `dist`

3. **Redirects** Create `netlify.toml`:
   ```toml
   [[redirects]]
     from = "/.well-known/security.txt"
     to = "/security.txt"
     status = 200
   ```

### Cloudflare Pages

1. **Environment Variables**

   ```
   PUBLIC_SITE_URL=https://yourdomain.com
   ```

2. **Build Settings**
   - Build Command: `npm run build`
   - Build Output Directory: `dist`

3. **Headers** Create `_headers` in `public/`:
   ```
   /*
     X-Frame-Options: DENY
     X-Content-Type-Options: nosniff
     Referrer-Policy: strict-origin-when-cross-origin
   ```

## Post-Deployment

### Immediate Checks

- [ ] Visit production URL and verify site loads
- [ ] Check robots.txt: `https://yourdomain.com/robots.txt`
- [ ] Check security.txt: `https://yourdomain.com/.well-known/security.txt`
- [ ] Verify sitemap: `https://yourdomain.com/sitemap-index.xml`
- [ ] Check RSS feed: `https://yourdomain.com/rss.xml`
- [ ] Test search functionality
- [ ] Verify forms work (if applicable)
- [ ] Test on multiple devices and browsers

### SEO Setup

- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Set up Google Analytics (if using)
- [ ] Configure other analytics tools
- [ ] Test structured data with Google Rich Results Test
- [ ] Verify social sharing cards (Twitter, LinkedIn, etc.)

### Monitoring

- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Configure error tracking (e.g., Sentry)
- [ ] Set up performance monitoring
- [ ] Enable analytics tracking
- [ ] Create alerts for downtime

### Social Media

- [ ] Share launch announcement
- [ ] Update bio links on GitHub
- [ ] Update bio links on LinkedIn
- [ ] Update portfolio links on other platforms

## Maintenance Schedule

### Weekly

- [ ] Review analytics data
- [ ] Check for broken links
- [ ] Monitor error logs

### Monthly

- [ ] Update dependencies
- [ ] Review and update content
- [ ] Check performance metrics
- [ ] Review search console issues

### Quarterly

- [ ] Full content audit
- [ ] SEO review
- [ ] Accessibility audit
- [ ] Security review

### Annually

- [ ] Update security.txt expiration date
- [ ] Review and update all content
- [ ] Major dependency updates
- [ ] Complete redesign consideration

## Rollback Plan

If something goes wrong:

1. **Immediate**: Revert to previous deployment via hosting platform
2. **Diagnose**: Check build logs and error messages
3. **Fix**: Correct issues locally
4. **Test**: Verify fixes with `npm run build && npm run preview`
5. **Redeploy**: Push corrected version

## Support Resources

- [Astro Docs](https://docs.astro.build)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Pagefind Docs](https://pagefind.app)
- [Google Search Console](https://search.google.com/search-console)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Security.txt Spec](https://securitytxt.org)

---

**Remember**: Always test thoroughly before deploying to production!
