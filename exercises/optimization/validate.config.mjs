/**
 * Progress checks for the README tasks. Run with `pnpm validate`.
 * These are heuristics — they tell you whether a task looks complete,
 * not how to complete it.
 */

const HOME = 'src/app/page.tsx'
const LAYOUT = 'src/app/layout.tsx'
const PROJECTS = 'src/app/projects/page.tsx'
const PROJECT = 'src/app/projects/[slug]/page.tsx'
const CONTACT = 'src/app/contact/page.tsx'

export default {
  exercise: 'Fleet Showcase (Optimization & Performance)',
  probe: /Caterpillar Fleet Showcase/,
  tasks: [
    {
      id: 1,
      title: 'Image optimization',
      checks: [
        {
          label: 'No raw <img> tags remain in src/',
          run: ctx => !ctx.matchInDir('src', /<img[\s>]/),
        },
        {
          label: 'next/image is used instead',
          run: ctx => ctx.matchInDir('src', /from\s+["']next\/image["']/),
        },
        {
          label: 'The hero image is prioritized for LCP',
          run: ctx => ctx.match(HOME, /priority/),
        },
        {
          label: 'Responsive images declare a sizes attribute',
          run: ctx => ctx.matchInDir('src', /sizes=/),
        },
        {
          label: 'next.config.ts allows the external image hosts',
          run: ctx => ctx.match('next.config.ts', /remotePatterns/) && ctx.match('next.config.ts', /picsum\.photos/),
        },
        {
          label: 'The homepage serves optimized images (live check)',
          run: async (ctx) => {
            const res = await ctx.http('/')
            if (!res)
              return ctx.unverified('needs a running app')
            return res.body.includes('/_next/image')
          },
        },
      ],
    },
    {
      id: 2,
      title: 'Font optimization',
      checks: [
        {
          label: 'The Google Fonts <link> tag is gone from the layout',
          run: ctx => ctx.noMatch(LAYOUT, /fonts\.googleapis\.com/),
        },
        {
          label: 'Inter is loaded via next/font',
          run: ctx => ctx.match(LAYOUT, /from\s+["']next\/font\/google["']/) && ctx.match(LAYOUT, /Inter/),
        },
        {
          label: 'The inline fontFamily style is removed',
          run: ctx => ctx.noMatch(LAYOUT, /fontFamily:\s*["']'?Inter/),
        },
        {
          label: 'No external font requests in the rendered page (live check)',
          run: async (ctx) => {
            const res = await ctx.http('/')
            if (!res)
              return ctx.unverified('needs a running app')
            return !res.body.includes('fonts.googleapis.com')
          },
        },
      ],
    },
    {
      id: 3,
      title: 'Fix data waterfalls',
      checks: [
        {
          label: 'Homepage data loads in parallel (or streams per section)',
          run: ctx => ctx.match(HOME, /Promise\.all/) || ctx.countMatches(HOME, /<Suspense/) >= 2,
        },
      ],
    },
    {
      id: 4,
      title: 'Server Component extraction',
      checks: [
        {
          label: 'The projects page is no longer a Client Component',
          run: ctx => ctx.noMatch(PROJECTS, /['"]use client['"]/) && ctx.noMatch(PROJECTS, /useEffect/),
        },
        {
          label: 'ProjectFilter stays a Client Component',
          run: ctx => ctx.match('src/components/project-filter.tsx', /['"]use client['"]/),
        },
        {
          label: 'Projects appear in the server-rendered HTML (live check)',
          run: async (ctx) => {
            const res = await ctx.http('/projects')
            if (!res)
              return ctx.unverified('needs a running app')
            return res.status === 200 && /href="\/projects\/[a-z0-9]/i.test(res.body)
          },
        },
      ],
    },
    {
      id: 5,
      title: 'Metadata & SEO',
      checks: [
        {
          label: 'The layout metadata includes a description',
          run: ctx => ctx.match(LAYOUT, /description:/),
        },
        {
          label: 'Project detail pages generate their own metadata',
          run: ctx => ctx.match(PROJECT, /generateMetadata/),
        },
        {
          label: 'A sitemap exists at the app root',
          run: ctx => ctx.exists('src/app/sitemap.ts') || ctx.exists('src/app/sitemap.tsx'),
        },
        {
          label: '/sitemap.xml responds (live check)',
          run: async (ctx) => {
            if (!ctx.exists('src/app/sitemap.ts') && !ctx.exists('src/app/sitemap.tsx'))
              return false
            const res = await ctx.http('/sitemap.xml')
            if (!res)
              return ctx.unverified('needs a running app')
            return res.status === 200
          },
        },
      ],
    },
    {
      id: 6,
      title: 'Bundle optimization',
      checks: [
        {
          label: 'No barrel imports from "@/components" remain',
          run: ctx => !ctx.matchInDir('src/app', /from\s+["']@\/components["']/),
        },
        {
          label: 'The Chart on the contact page is lazy-loaded',
          run: ctx => ctx.match(CONTACT, /next\/dynamic/) && ctx.match(CONTACT, /dynamic\(/),
        },
      ],
    },
    {
      id: 7,
      title: 'Loading states',
      optional: true,
      checks: [
        {
          label: 'At least one loading.tsx exists under src/app/',
          run: ctx => ctx.files('src/app').some(f => f.endsWith('loading.tsx')),
        },
      ],
    },
    {
      id: 8,
      title: 'Link prefetching',
      optional: true,
      checks: [
        {
          label: 'Critical nav links opt into prefetching',
          run: ctx => ctx.match(LAYOUT, /prefetch/),
        },
      ],
    },
  ],
}
