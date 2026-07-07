/**
 * Progress checks for the README tasks. Run with `pnpm validate`.
 * These are heuristics — they tell you whether a task looks complete,
 * not how to complete it.
 */

const COMPONENTS = [
  ['SearchBar', /^search-?bar\.tsx$/i],
  ['DepartmentFilter', /^department-?filter\.tsx$/i],
  ['EmployeeCard', /^employee-?card\.tsx$/i],
  ['EmployeeGrid', /^employee-?grid\.tsx$/i],
]

export default {
  exercise: 'Employee Directory (React Fundamentals)',
  server: false,
  probe: /Caterpillar Employee Directory/,
  tasks: [
    {
      id: 1,
      title: 'Replace `any` with proper types',
      checks: [
        {
          label: 'Employee/Department types are imported from api.ts',
          run: ctx => ctx.files('src').some((f) => {
            const s = ctx.code(f) ?? ''
            return /from\s+["']@\/api["']/.test(s) && /\b(Employee|Department)\b/.test(s)
          }),
        },
        {
          label: 'No `any` types remain anywhere in src/',
          run: ctx => !ctx.matchInDir('src', /:\s*any\b|<any[>,)\]]|\bas any\b/),
        },
        {
          label: 'The project type-checks cleanly (tsc --noEmit)',
          run: (ctx) => {
            const r = ctx.typecheck()
            return r.ok ? true : { pass: false, note: 'run `pnpm check-types` to see the errors' }
          },
        },
      ],
    },
    {
      id: 2,
      title: 'Extract components with typed props',
      checks: [
        ...COMPONENTS.map(([name, file]) => ({
          label: `${name} component exists in src/components/`,
          run: ctx => ctx.findFile('src/components', file) !== null,
        })),
        {
          label: 'Extracted components declare a props interface or type',
          run: (ctx) => {
            const found = COMPONENTS
              .map(([, file]) => ctx.findFile('src/components', file))
              .filter(Boolean)
            if (found.length === 0)
              return false
            return found.every(f => /(interface|type)\s+\w*Props/.test(ctx.code(f) ?? ''))
          },
        },
        {
          label: 'page.tsx renders the extracted components',
          run: (ctx) => {
            const page = ctx.code('src/app/page.tsx') ?? ''
            const used = COMPONENTS.filter(([name]) => new RegExp(`<${name}[\\s/>]`).test(page)).length
            return used >= 3
          },
        },
      ],
    },
    {
      id: 3,
      title: 'Employee detail modal component',
      checks: [
        {
          label: 'EmployeeDetail component exists in src/components/',
          run: ctx => ctx.findFile('src/components', /^employee-?detail\.tsx$/i) !== null,
        },
        {
          label: 'The detail view shows contact info and skills',
          run: (ctx) => {
            const f = ctx.findFile('src/components', /^employee-?detail\.tsx$/i)
            if (!f)
              return false
            const s = ctx.code(f) ?? ''
            return /email/i.test(s) && /phone/i.test(s) && /skills/i.test(s)
          },
        },
      ],
    },
    {
      id: 4,
      title: 'Combined filtering',
      checks: [
        {
          label: 'Search and department filters are applied together',
          run: (ctx) => {
            return ctx.files('src').some((f) => {
              const s = ctx.code(f) ?? ''
              const blocks = s.match(/\.filter\([\s\S]{0,400}?\)\s*[\n;)]/g) ?? []
              return blocks.some(b => /search/i.test(b) && /department/i.test(b))
            })
          },
        },
      ],
    },
    {
      id: 5,
      title: 'Empty state per filter',
      checks: [
        {
          label: 'The empty state message changes with the active filters',
          run: (ctx) => {
            const messages = new Set()
            let dynamic = false
            for (const f of ctx.files('src')) {
              const s = ctx.code(f) ?? ''
              for (const m of s.matchAll(/No employees[^"'`<\n]*/gi)) {
                messages.add(m[0].trim())
                if (m[0].includes('${'))
                  dynamic = true
              }
            }
            return dynamic || messages.size >= 2
          },
        },
      ],
    },
    {
      id: 6,
      title: 'Selection context',
      checks: [
        {
          label: 'src/components/selection-context.tsx exists',
          run: ctx => ctx.findFile('src/components', /selection-?context/i) !== null,
        },
        {
          label: 'It exports SelectionProvider and a useSelection() hook',
          run: (ctx) => {
            const f = ctx.findFile('src/components', /selection-?context/i)
            if (!f)
              return false
            const s = ctx.code(f) ?? ''
            return /createContext/.test(s)
              && /export function SelectionProvider|export const SelectionProvider/.test(s)
              && /export function useSelection|export const useSelection/.test(s)
          },
        },
        {
          label: 'The page wraps its content in <SelectionProvider>',
          run: ctx => ctx.match('src/app/page.tsx', /<SelectionProvider>/),
        },
        {
          label: 'EmployeeCard and EmployeeDetail read selection from context',
          run: (ctx) => {
            const card = ctx.findFile('src/components', /^employee-?card\.tsx$/i)
            const detail = ctx.findFile('src/components', /^employee-?detail\.tsx$/i)
            if (!card || !detail)
              return false
            return /useSelection\(/.test(ctx.code(card) ?? '') && /useSelection\(/.test(ctx.code(detail) ?? '')
          },
        },
      ],
    },
    {
      id: 7,
      title: 'Sort toggle',
      optional: true,
      checks: [
        {
          label: 'Employees can be sorted by name or join date',
          run: ctx => ctx.files('src').some((f) => {
            const s = ctx.code(f) ?? ''
            return /\.sort\(/.test(s) && (/localeCompare/.test(s) || /joinDate/.test(s))
          }),
        },
      ],
    },
  ],
}
