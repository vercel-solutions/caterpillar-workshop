/**
 * Progress checks for the README tasks. Run with `pnpm validate`.
 * These are heuristics — they tell you whether a task looks complete,
 * not how to complete it.
 *
 * Note: caching behavior itself is best observed in `next build` +
 * `next start` or a deployment — these checks validate structure.
 */

const HOME = 'src/app/page.tsx'
const BLOG = 'src/app/blog/page.tsx'

function findPostPage(ctx) {
  return ctx.files('src/app/blog').find(f => /\[[^\]]+\][/\\]page\.tsx$/.test(f)) ?? null
}

function findRevalidateRoute(ctx) {
  return ctx.files('src/app').find(f => f.endsWith('route.ts') && /revalidateTag\(/.test(ctx.code(f) ?? '')) ?? null
}

export default {
  exercise: 'Cat Insights Blog (Next.js 16 Caching Migration)',
  probe: /Cat Insights/,
  tasks: [
    {
      id: 1,
      title: 'Enable Next.js 16 features',
      checks: [
        {
          label: 'Next.js 16 is installed',
          run: ctx => ctx.match('package.json', /"next":\s*"[\^~]?16/),
        },
        {
          label: 'Cache components are enabled in next.config.ts',
          run: ctx => ctx.match('next.config.ts', /cacheComponents:\s*true/),
        },
      ],
    },
    {
      id: 2,
      title: 'Home page migration',
      checks: [
        {
          label: 'The homepage uses the "use cache" directive',
          run: ctx => ctx.match(HOME, /['"]use cache['"]/),
        },
        {
          label: 'The old force-static / revalidate exports are removed',
          run: ctx => ctx.noMatch(HOME, /export const (dynamic|revalidate)/),
        },
        {
          label: 'A ~60s revalidation lifetime is configured',
          run: ctx => ctx.match(HOME, /cacheLife\(/),
        },
      ],
    },
    {
      id: 3,
      title: 'Blog page — static shell, dynamic posts',
      checks: [
        {
          label: 'The blog page no longer forces dynamic rendering',
          run: ctx => ctx.noMatch(BLOG, /force-dynamic/),
        },
        {
          label: 'Part of the blog page is served from cache',
          run: ctx => ctx.match(BLOG, /['"]use cache['"]/)
            || ctx.matchInDir('src/components', /['"]use cache['"]/),
        },
        {
          label: 'The post list still responds to the category filter',
          run: ctx => ctx.match(BLOG, /searchParams/),
        },
      ],
    },
    {
      id: 4,
      title: 'Blog post page',
      checks: [
        {
          label: 'A dynamic blog post route exists (e.g. /blog/[id])',
          run: ctx => findPostPage(ctx) !== null,
        },
        {
          label: 'The post page is cached and tagged per post',
          run: (ctx) => {
            const f = findPostPage(ctx)
            if (!f)
              return false
            const s = ctx.code(f) ?? ''
            return /['"]use cache['"]/.test(s) && /cacheTag\(/.test(s)
          },
        },
        {
          label: 'A real blog post page renders (live check)',
          run: async (ctx) => {
            if (!findPostPage(ctx))
              return false
            if (!ctx.serverUp)
              return ctx.unverified('needs a running app')
            const href = await ctx.discoverHref('/blog', /href="(\/blog\/[\w-]+)"/)
            if (!href)
              return { pass: false, note: 'no post links found on /blog' }
            const res = await ctx.http(href)
            return res !== null && res.status === 200
          },
        },
      ],
    },
    {
      id: 5,
      title: 'Cache revalidation route',
      checks: [
        {
          label: 'A route handler calls revalidateTag',
          run: ctx => findRevalidateRoute(ctx) !== null,
        },
        {
          label: 'The route is secured against unauthorized calls',
          run: (ctx) => {
            const f = findRevalidateRoute(ctx)
            if (!f)
              return false
            return /secret|authorization|401|403/i.test(ctx.code(f) ?? '')
          },
        },
        {
          label: 'Unauthorized requests are rejected (live check)',
          run: async (ctx) => {
            const f = findRevalidateRoute(ctx)
            if (!f)
              return false
            const routePath = `/${f.replace(/^src[/\\]app[/\\]/, '').replace(/[/\\]route\.ts$/, '').replaceAll('\\', '/')}`
            const res = await ctx.http(routePath)
            if (!res)
              return ctx.unverified('needs a running app')
            return res.status >= 400 && res.status < 500
          },
        },
      ],
    },
    {
      id: 6,
      title: 'Dynamic featured posts on the post page',
      checks: [
        {
          label: 'The post page has a featured posts section',
          run: (ctx) => {
            const f = findPostPage(ctx)
            return f !== null && /featured/i.test(ctx.code(f) ?? '')
          },
        },
        {
          label: 'The section streams inside a Suspense boundary',
          run: (ctx) => {
            const f = findPostPage(ctx)
            return f !== null && /<Suspense/.test(ctx.code(f) ?? '')
          },
        },
        {
          run: 'manual',
          label: 'The featured section stays dynamic (fresh on every request)',
          note: 'check your server console — featured posts should fetch on every request, the cached post only once',
        },
      ],
    },
    {
      id: 7,
      title: 'Bonus tasks',
      optional: true,
      checks: [
        {
          label: 'A custom cache profile is defined in next.config.ts',
          run: ctx => ctx.match('next.config.ts', /cacheLife:\s*\{/),
        },
        {
          run: 'manual',
          label: 'The category filter highlights the active category',
          note: 'open /blog and click a category — does it look selected?',
        },
        {
          run: 'manual',
          label: 'Deployed and verified caching in production',
          note: 'dev mode does not cache like production — deploy to verify',
        },
      ],
    },
  ],
}
