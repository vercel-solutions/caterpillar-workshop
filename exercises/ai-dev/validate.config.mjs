/**
 * Progress checks for the README tasks. Run with `pnpm validate`.
 * These are heuristics — they tell you whether a task looks complete,
 * not how to complete it.
 */

const BOARD = 'src/app/board/page.tsx'
const TASK = 'src/app/tasks/[id]/page.tsx'

export default {
  exercise: 'Jobsite Task Board (AI-Assisted Development)',
  probe: /Caterpillar Jobsite Task Board/,
  tasks: [
    {
      id: 1,
      title: 'Explore the codebase with AI',
      checks: [
        {
          run: 'manual',
          label: 'You used your AI tool to explain the data model and project structure',
          note: 'can you describe what src/api.ts exposes without opening it?',
        },
      ],
    },
    {
      id: 2,
      title: 'Build the task board',
      checks: [
        {
          label: 'The board page fetches tasks and columns',
          run: ctx => ctx.match(BOARD, /getTasks\(/) && ctx.match(BOARD, /getColumns\(/),
        },
        {
          label: 'TaskCard and Column components exist in src/components/',
          run: ctx => ctx.findFile('src/components', /task-?card\.tsx$/i) !== null
            && ctx.findFile('src/components', /column\.tsx$/i) !== null,
        },
        {
          label: 'Task cards link to their detail pages (live check)',
          run: async (ctx) => {
            const res = await ctx.http('/board')
            if (!res)
              return ctx.unverified('needs a running app')
            return res.status === 200 && /href="\/tasks\//.test(res.body)
          },
        },
      ],
    },
    {
      id: 3,
      title: 'Task detail page',
      checks: [
        {
          label: 'The detail page loads the task and its assignee',
          run: ctx => ctx.match(TASK, /getTask\(/) && ctx.match(TASK, /getUser\(/),
        },
        {
          label: 'Missing task IDs trigger notFound()',
          run: ctx => ctx.match(TASK, /notFound\(\)/),
        },
        {
          label: 'A real task page renders (live check)',
          run: async (ctx) => {
            if (!ctx.serverUp)
              return ctx.unverified('needs a running app')
            const href = await ctx.discoverHref('/board', /href="(\/tasks\/[\w-]+)"/)
            if (!href)
              return { pass: false, note: 'no task links found on /board yet' }
            const res = await ctx.http(href)
            return res !== null && res.status === 200
          },
        },
        {
          label: 'An unknown task ID returns a 404 (live check)',
          run: async (ctx) => {
            if (!ctx.match(TASK, /notFound\(\)/))
              return false
            const res = await ctx.http('/tasks/this-task-does-not-exist')
            if (!res)
              return ctx.unverified('needs a running app')
            return res.status === 404
          },
        },
      ],
    },
    {
      id: 4,
      title: 'Search & filter',
      checks: [
        {
          label: 'The board has a search input (live check)',
          run: async (ctx) => {
            const res = await ctx.http('/board')
            if (!res)
              return ctx.unverified('needs a running app')
            return res.body.includes('<input')
          },
        },
        {
          label: 'Tasks can be filtered by title',
          run: ctx => ctx.matchInDir('src', /\.filter\([\s\S]{0,300}?(title|search)/i),
        },
        {
          label: 'Priority filter options are available',
          run: ctx => ctx.files('src').some((f) => {
            const s = ctx.code(f) ?? ''
            return /priority/i.test(s) && /\bAll\b/.test(s) && /\b(High|Medium|Low)\b/.test(s)
          }),
        },
      ],
    },
    {
      id: 5,
      title: 'Metadata & error handling',
      checks: [
        {
          label: 'The task detail page generates metadata',
          run: ctx => ctx.match(TASK, /generateMetadata/),
        },
        {
          label: 'loading.tsx exists for the board and/or task detail',
          run: ctx => ctx.files('src/app').some(f => f.endsWith('loading.tsx')),
        },
        {
          label: 'An error boundary exists and is a Client Component',
          run: (ctx) => {
            const f = ctx.files('src/app').find(x => x.endsWith('error.tsx'))
            return f !== undefined && /['"]use client['"]/.test(ctx.code(f) ?? '')
          },
        },
        {
          label: 'Invalid task IDs get their own not-found page',
          run: ctx => ctx.exists('src/app/tasks/[id]/not-found.tsx') || ctx.exists('src/app/tasks/not-found.tsx'),
        },
      ],
    },
    {
      id: 6,
      title: 'Connect the Next.js Devtools MCP',
      checks: [
        {
          label: '.mcp.json configures the next-devtools server',
          run: ctx => ctx.match('.mcp.json', /next-devtools/),
        },
        {
          run: 'manual',
          label: 'Your AI tool answers questions using live app data',
          note: 'ask it "what routes does this app have?" — the answer should come from the dev server, not the files',
        },
      ],
    },
    {
      id: 7,
      title: 'Create your own skill',
      checks: [
        {
          label: 'A skill file exists under .agents/skills/',
          run: ctx => ctx.files('.agents/skills').some(f => f.endsWith('.md')),
        },
        {
          run: 'manual',
          label: 'You tested the skill in a fresh conversation',
          note: 'does your AI tool follow the patterns when you invoke it?',
        },
      ],
    },
    {
      id: 8,
      title: 'Add a feature',
      optional: true,
      checks: [
        {
          run: 'manual',
          label: 'You designed and shipped a feature of your choice with AI',
          note: 'dark mode, task creation, drag-and-drop, assignee filter — anything you like',
        },
      ],
    },
  ],
}
