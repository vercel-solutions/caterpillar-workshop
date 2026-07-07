# Optimization & Performance Workshop - Caterpillar Edition

> **Slides:** [https://caterpillar-workshop-slides.vercel.app/optimization](https://caterpillar-workshop-slides.vercel.app/optimization)


Welcome to Caterpillar's performance optimization workshop! Learn to identify and fix common performance issues in Next.js applications using the Caterpillar Fleet Showcase.

## Prerequisites

- Node.js 18+ installed
- Basic knowledge of Next.js App Router
- Understanding of React Server Components

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Visit http://localhost:3000
```

## Current Implementation (Unoptimized)

The Portfolio application is intentionally unoptimized with these issues:

- Uses `<img>` tags instead of `next/image`
- Loads Google Fonts via `<link>` tag instead of `next/font`
- Sequential data fetches on homepage (waterfall)
- Entire projects page is `'use client'` with `useEffect`
- Barrel imports (`components/index.ts`) prevent tree-shaking
- Heavy Chart component statically imported (not code-split)
- No metadata or SEO optimization
- No `remotePatterns` configured for images

## Tasks

### Task 1: Image Optimization

Replace all `<img>` tags with `next/image`:
- Add `priority` to the hero image (LCP candidate)
- Set proper `sizes` attribute for responsive images
- Configure `remotePatterns` in `next.config.ts` for picsum.photos and avatars.githubusercontent.com

### Task 2: Font Optimization

Remove the `<link>` Google Fonts tag from the layout:
- Use `next/font/google` to load Inter
- Configure `subsets`, `display: 'swap'`, and `variable`
- Apply the font via CSS variable

### Task 3: Fix Data Waterfalls

The homepage fetches data sequentially (250ms + 500ms + 300ms = 1050ms):
- Use `Promise.all()` to fetch in parallel
- Or wrap sections in `<Suspense>` for streaming

### Task 4: Server Component Extraction

The projects page is entirely `'use client'`:
- Convert the page itself to a Server Component
- Only keep `ProjectFilter` as a Client Component
- Fetch data on the server instead of via API route

### Task 5: Metadata & SEO

Add proper metadata:
- Static `metadata` export in `layout.tsx` (title, description)
- `generateMetadata` in project detail page
- Create `sitemap.ts` at app root

### Task 6: Bundle Optimization

Fix barrel imports and code splitting:
- Replace `import { X } from "@/components"` with direct imports
- Use `next/dynamic` to lazy-load the Chart component on the contact page

### Task 7: Bonus — Loading States

Add `loading.tsx` and Suspense boundaries for a polished loading experience.

### Task 8: Bonus — Link Prefetching

Add `prefetch={true}` to critical navigation links (Home, Projects).

## Checking Your Progress

Run the progress checker at any time to see how complete each task looks:

```bash
pnpm validate
```

It checks each README task and shows a completion meter — it is guidance while you work, not a grade. Some live checks start the app briefly (or reuse your running dev server).

## Resources

- [Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Lazy Loading](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- [Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Bundle Analyzer](https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer)

---

**Happy coding!**
