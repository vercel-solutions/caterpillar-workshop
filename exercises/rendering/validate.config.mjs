/**
 * Progress checks for the README tasks. Run with `pnpm validate`.
 * These are heuristics — they tell you whether a task looks complete,
 * not how to complete it.
 *
 * Several checks inspect the `next build` route table, which takes a
 * minute. Stop your dev server first so the build can run.
 */

const HOME = 'src/app/page.tsx'
const ARTICLES = 'src/app/articles/page.tsx'
const ARTICLE = 'src/app/articles/[slug]/page.tsx'
const DASHBOARD = 'src/app/dashboard/page.tsx'

async function routeSymbol(ctx, route) {
  const build = await ctx.buildRoutes()
  if (build.skipped)
    return { unknown: true, note: 'stop your dev server and re-run to verify the build output' }
  if (!build.ok)
    return { unknown: true, note: '`pnpm build` failed — fix build errors to verify this' }
  return build.routes.get(route) ?? null
}

function expectSymbol(route, symbols, note) {
  return async (ctx) => {
    const sym = await routeSymbol(ctx, route)
    if (sym && typeof sym === 'object')
      return sym
    if (sym === null)
      return { pass: false, note: `${route} was not found in the build output` }
    return { pass: symbols.includes(sym), note: sym && !symbols.includes(sym) ? note : undefined }
  }
}

export default {
  exercise: 'Newsroom (Rendering Strategies)',
  server: false,
  probe: /Caterpillar Newsroom/,
  tasks: [
    {
      id: 1,
      title: 'Identify rendering strategies',
      checks: [
        {
          run: 'manual',
          label: 'Each page has a comment naming its current mode, its correct mode, and why',
          note: 'review your comments on /, /articles, /articles/[slug], and /dashboard',
        },
      ],
    },
    {
      id: 2,
      title: 'Static article pages',
      checks: [
        {
          label: 'Article pages no longer force dynamic rendering',
          run: ctx => ctx.noMatch(ARTICLE, /force-dynamic/),
        },
        {
          label: 'Article pages are pre-generated with generateStaticParams',
          run: ctx => ctx.match(ARTICLE, /generateStaticParams/),
        },
        {
          label: 'Build output shows /articles/[slug] as static (build check)',
          run: expectSymbol('/articles/[slug]', ['●', '○', '◐'], 'the build still renders it dynamically'),
        },
      ],
    },
    {
      id: 3,
      title: 'Homepage ISR',
      checks: [
        {
          label: 'Homepage no longer forces dynamic rendering',
          run: ctx => ctx.noMatch(HOME, /force-dynamic/),
        },
        {
          label: 'Homepage revalidates every 60 seconds',
          run: ctx => ctx.match(HOME, /export const revalidate\s*=\s*60/),
        },
        {
          label: 'Homepage data fetches don\'t run as a sequential waterfall',
          run: ctx => ctx.match(HOME, /Promise\.all/) || ctx.countMatches(HOME, /<Suspense/) >= 2,
        },
        {
          label: 'Build output shows / as static (build check)',
          run: expectSymbol('/', ['○', '●', '◐'], 'the build still renders it dynamically'),
        },
      ],
    },
    {
      id: 4,
      title: 'Dashboard streaming',
      checks: [
        {
          label: 'Dashboard sections stream in separate Suspense boundaries',
          run: (ctx) => {
            const n = ctx.countMatches(DASHBOARD, /<Suspense/)
            if (n >= 3)
              return true
            return { pass: false, note: n > 0 ? `found ${n} boundary(ies) — the README asks for three sections` : undefined }
          },
        },
        {
          label: 'Suspense boundaries have skeleton fallbacks',
          run: ctx => ctx.match(DASHBOARD, /fallback=/),
        },
        {
          label: 'Dashboard stays dynamic (build check)',
          run: expectSymbol('/dashboard', ['ƒ', 'λ'], 'the dashboard must stay dynamic — it reads cookies'),
        },
      ],
    },
    {
      id: 5,
      title: 'Articles page streaming',
      checks: [
        {
          label: 'The article list streams inside a Suspense boundary',
          run: ctx => ctx.match(ARTICLES, /<Suspense/) && ctx.match(ARTICLES, /fallback=/),
        },
        {
          label: 'The articles page stays dynamic (build check)',
          run: expectSymbol('/articles', ['ƒ', 'λ'], 'it should stay dynamic — it reads searchParams'),
        },
      ],
    },
    {
      id: 6,
      title: 'dynamicParams',
      optional: true,
      checks: [
        {
          label: 'Unknown article slugs return 404 instead of rendering dynamically',
          run: ctx => ctx.match(ARTICLE, /dynamicParams\s*=\s*false/),
        },
      ],
    },
  ],
}
