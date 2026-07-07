# Workshop Exercises

## Getting Started

```bash
pnpm install
```

## Exercises

- [`react`](exercises/react) — [Slides](https://caterpillar-workshop-slides.vercel.app/react)
- [`fundamentals`](exercises/fundamentals) — [Slides](https://caterpillar-workshop-slides.vercel.app/fundamentals)
- [`rendering`](exercises/rendering) — [Slides](https://caterpillar-workshop-slides.vercel.app/rendering)
- [`optimization`](exercises/optimization) — [Slides](https://caterpillar-workshop-slides.vercel.app/optimization)
- [`caching`](exercises/caching) — [Slides](https://caterpillar-workshop-slides.vercel.app/caching)
- [`ai-dev`](exercises/ai-dev) — [Slides](https://caterpillar-workshop-slides.vercel.app/ai-dev)

> **Note:** All exercises run on port 3000. Only run one exercise at a time.

Run a single exercise:

```bash
pnpm --filter @workshop/<exercise-name>-exercise dev
```

## Checking Your Progress

Every exercise ships with a progress checker. From inside an exercise folder:

```bash
pnpm validate
```

It walks through the README tasks and reports how complete each one looks — it's guidance while you work, not a grade.

## Resources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
