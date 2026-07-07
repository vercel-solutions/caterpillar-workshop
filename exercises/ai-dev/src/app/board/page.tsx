// TODO: Build the task board view
// This page should display tasks organized by status columns (Backlog, To Do, In Progress, Done)
//
// Use your AI tool to help you:
// 1. Fetch tasks and columns from the API (see src/api.ts)
// 2. Create a TaskCard component in src/components/
// 3. Create a Column component that renders a list of TaskCards
// 4. Display all columns in a horizontal layout
// 5. Each task card should show: title, priority badge, assignee name, and tags
// 6. Clicking a task card should link to /tasks/[id]

export default function BoardPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight">Task Board</h1>
      <p className="text-muted-foreground mt-2">
        Use AI tools to build this page!
      </p>
      {/* Your implementation here */}
    </div>
  )
}
