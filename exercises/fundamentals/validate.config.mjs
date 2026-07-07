/**
 * Progress checks for the README tasks. Run with `pnpm validate`.
 * These are heuristics — they tell you whether a task looks complete,
 * not how to complete it.
 */

const SLUG_PAGE = 'src/app/products/[slug]/page.tsx'

async function findProductPath(ctx) {
  for (const page of ['/products', '/']) {
    const href = await ctx.discoverHref(page, /href="(\/products\/[a-z0-9][\w-]*)"/i)
    if (href)
      return href
  }
  return null
}

export default {
  exercise: 'Equipment Catalog (Next.js Fundamentals)',
  probe: /Caterpillar Equipment Catalog/,
  tasks: [
    {
      id: 1,
      title: 'Convert homepage to a Server Component',
      checks: [
        {
          label: 'Homepage no longer uses \'use client\' or useEffect',
          run: ctx => ctx.noMatch('src/app/page.tsx', /['"]use client['"]|useEffect/),
        },
        {
          label: 'Homepage is an async component that loads data directly',
          run: ctx => ctx.match('src/app/page.tsx', /export default async function/)
            && ctx.match('src/app/page.tsx', /from\s+["']@\/api["']/),
        },
        {
          label: 'Products are present in the server-rendered HTML (live check)',
          run: async (ctx) => {
            const res = await ctx.http('/')
            if (!res)
              return ctx.unverified('needs a running app')
            return res.status === 200 && /href="\/products\/[a-z0-9]/i.test(res.body)
          },
        },
      ],
    },
    {
      id: 2,
      title: 'Replace <a> with <Link>',
      checks: [
        {
          label: 'product-card.tsx uses <Link> for navigation',
          run: ctx => ctx.match('src/components/product-card.tsx', /from\s+["']next\/link["']/)
            && ctx.noMatch('src/components/product-card.tsx', /<a\s/),
        },
        {
          label: 'category-filter.tsx uses <Link> for navigation',
          run: ctx => ctx.match('src/components/category-filter.tsx', /from\s+["']next\/link["']/)
            && ctx.noMatch('src/components/category-filter.tsx', /<a\s/),
        },
        {
          label: 'No internal <a href="/..."> links remain in pages',
          run: ctx => !ctx.matchInDir('src/app', /<a\s[^>]*href=["']\//),
        },
      ],
    },
    {
      id: 3,
      title: 'Product detail page',
      checks: [
        {
          label: 'src/app/products/[slug]/page.tsx exists',
          run: ctx => ctx.exists(SLUG_PAGE),
        },
        {
          label: 'Missing products trigger notFound()',
          run: ctx => ctx.match(SLUG_PAGE, /notFound\(\)/),
        },
        {
          label: 'A real product page renders successfully (live check)',
          run: async (ctx) => {
            if (!ctx.serverUp)
              return ctx.unverified('needs a running app')
            const path = await findProductPath(ctx)
            if (!path)
              return { pass: false, note: 'no product links found on the homepage or /products yet' }
            const res = await ctx.http(path)
            return res !== null && res.status === 200
          },
        },
        {
          label: 'An unknown product URL returns a 404 (live check)',
          run: async (ctx) => {
            if (!ctx.exists(SLUG_PAGE))
              return false
            const res = await ctx.http('/products/definitely-not-a-real-product')
            if (!res)
              return ctx.unverified('needs a running app')
            return res.status === 404
          },
        },
      ],
    },
    {
      id: 4,
      title: 'Loading states',
      checks: [
        {
          label: 'src/app/products/loading.tsx exists',
          run: ctx => ctx.exists('src/app/products/loading.tsx'),
        },
      ],
    },
    {
      id: 5,
      title: 'Error handling',
      checks: [
        {
          label: 'src/app/products/error.tsx exists and is a Client Component',
          run: ctx => ctx.match('src/app/products/error.tsx', /['"]use client['"]/),
        },
        {
          label: 'The error boundary offers a way to recover',
          run: ctx => ctx.match('src/app/products/error.tsx', /reset/),
        },
      ],
    },
    {
      id: 6,
      title: 'Server Action form',
      checks: [
        {
          label: 'A Server Action is defined (\'use server\')',
          run: ctx => ctx.matchInDir('src', /['"]use server['"]/),
        },
        {
          label: 'A form submits to the action',
          run: ctx => ctx.matchInDir('src', /<form[^>]*action=\{/),
        },
        {
          label: 'Form state is handled with useActionState',
          run: ctx => ctx.matchInDir('src', /useActionState/),
        },
      ],
    },
    {
      id: 7,
      title: 'generateStaticParams',
      optional: true,
      checks: [
        {
          label: 'The product detail page pre-generates pages at build time',
          run: ctx => ctx.match(SLUG_PAGE, /generateStaticParams/),
        },
      ],
    },
  ],
}
