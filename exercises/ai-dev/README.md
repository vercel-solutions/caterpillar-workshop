# AI-Assisted Development Workshop - Caterpillar Edition

> **Slides:** [https://caterpillar-workshop-slides.vercel.app/ai-dev](https://caterpillar-workshop-slides.vercel.app/ai-dev)


Practice using AI tools to build a real Next.js application. You'll use your AI coding tool of choice to complete a jobsite maintenance task board app for Caterpillar.

## Prerequisites

- Node.js 18+ installed
- An AI coding tool installed (one of: GitHub Copilot, Cursor, or Claude Code)
- Basic knowledge of Next.js App Router

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Visit http://localhost:3000
```

## Current Implementation

The app has a working **dashboard page** showing task statistics and an **API layer** (`src/api.ts`) with mock data. What's missing:

- The **board page** (`/board`) is a stub — no task columns or cards
- The **task detail page** (`/tasks/[id]`) is a stub — no task info displayed
- The `src/components/` directory is empty — no reusable components exist
- No search, filtering, metadata, or error handling

## Tasks

### Task 1: Explore the Codebase with AI

Before building anything, use your AI tool to understand the project:
- Ask it to explain the data model in `src/api.ts`
- Ask it to describe the project structure and conventions
- Ask it what types are available and how data fetching works

**Goal:** Get comfortable using AI to navigate and understand code.

### Task 2: Build the Task Board

Use AI to implement the `/board` page at `src/app/board/page.tsx`:
- Fetch tasks and columns from the API
- Create a `TaskCard` component in `src/components/`
- Create a `Column` component that renders a list of TaskCards
- Display all columns in a horizontal layout
- Each task card should show: title, priority badge, assignee name, and tags
- Clicking a task card should link to `/tasks/[id]`

**Goal:** Practice multi-file generation and following existing patterns.

### Task 3: Create the Task Detail Page

Use AI to implement the `/tasks/[id]` page:
- Get the task ID from route params
- Fetch task data and assignee info from the API
- Display all task fields with proper formatting
- Add a back link to the board
- Handle the case where a task ID doesn't exist (show 404)

**Goal:** Practice explaining requirements to AI and using plan mode.

### Task 4: Add Search & Filter

Use AI to add interactivity to the board page:
- Add a search input that filters tasks by title
- Add priority filter buttons (All, High, Medium, Low)
- Keep the board layout working while filtering

**Goal:** Practice iterating on existing code with AI assistance.

### Task 5: Metadata & Error Handling

Use AI to improve the app's production readiness:
- Add `generateMetadata` to the task detail page
- Add `loading.tsx` files for loading states
- Add `error.tsx` for error boundaries
- Add a proper `not-found.tsx` for invalid task IDs

**Goal:** Practice asking AI about Next.js best practices.

### Task 6: Connect the Next.js Devtools MCP

Give your AI tool real-time visibility into your running app by connecting the **Next.js Devtools MCP server** ([docs](https://nextjs.org/docs/app/guides/mcp)):

1. **Start the dev server** if it isn't running already (`pnpm dev`)
2. **Add the MCP server** by creating a `.mcp.json` file at the project root:
   ```json
   {
     "mcpServers": {
       "next-devtools": {
         "command": "npx",
         "args": ["-y", "next-devtools-mcp@latest"]
       }
     }
   }
   ```
   Most AI tools (Claude Code, Cursor, Windsurf, VS Code Copilot) will automatically pick up this file. Restart your AI tool after creating it.
3. **Verify the connection:** Ask your AI tool _"What routes does this app have?"_ — it should answer using live data from your dev server, not just by reading files
4. **Use it to improve your app:** The MCP server gives your AI tool access to tools like `get_errors`, `get_routes`, `get_page_metadata`, and `get_logs`. Try prompts like:
   - _"Are there any build or runtime errors in my app?"_
   - _"What does the route tree look like? Which pages are static vs dynamic?"_
   - _"Get the metadata for the /board page — is anything missing?"_
   - _"Check the server logs for any warnings"_
5. **Fix something with live context:** Ask your AI tool to find and fix a real issue using the MCP tools. For example:
   - _"Check for errors and fix them"_
   - _"Review the page metadata for all routes and add any that's missing"_

**Goal:** Experience how MCP servers give AI tools live context beyond just reading files.

### Task 7: Create Your Own Skill

Now that you've built the app, capture the patterns you liked into a **reusable skill** you can use in future projects:

1. **Reflect on the exercise:** Look back at the code you generated. Which patterns, prompts, or approaches worked well? Think about:
   - Component patterns (e.g., how you structured TaskCard, Column, etc.)
   - Data fetching patterns (e.g., Server Components with `Promise.all`)
   - Error handling patterns (e.g., `notFound()`, `error.tsx`, `loading.tsx`)
   - Search/filter patterns (e.g., URL search params vs client state)
   - Any custom approach your AI tool got right that you'd want to replicate

2. **Create the skill file:** Create a markdown file in `.agents/skills/` (e.g., `.agents/skills/my-patterns/SKILL.md`) with:
   - A clear name and description of when to use it
   - Step-by-step instructions your AI tool should follow
   - Code examples from this exercise that represent the "right way"
   - Any gotchas or anti-patterns to avoid

3. **Test it:** Start a new conversation with your AI tool and invoke the skill. Does it produce code that follows your patterns? Iterate on the skill until it does.

**Goal:** Turn exercise learnings into a portable, reusable skill that makes your AI tool smarter in future projects.

### Task 8: Bonus — Add a Feature

Use AI to add a feature of your choice:
- Dark mode toggle
- Task creation form with a Server Action
- Drag-and-drop task reordering
- Assignee filter with avatar display
- Anything else you want to try!

**Goal:** Open-ended AI collaboration on a feature you design.

## Checking Your Progress

Run the progress checker at any time to see how complete each task looks:

```bash
pnpm validate
```

It checks each README task and shows a completion meter — it is guidance while you work, not a grade. Some live checks start the app briefly (or reuse your running dev server).

## Resources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

---

**Happy coding with AI!**
