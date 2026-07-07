import Link from "next/link"

import { getTasks } from "@/api"

export default async function HomePage() {
  const tasks = await getTasks()

  const byStatus = {
    backlog: tasks.filter(t => t.status === "backlog").length,
    todo: tasks.filter(t => t.status === "todo").length,
    "in-progress": tasks.filter(t => t.status === "in-progress").length,
    done: tasks.filter(t => t.status === "done").length,
  }

  const byPriority = {
    high: tasks.filter(t => t.priority === "high").length,
    medium: tasks.filter(t => t.priority === "medium").length,
    low: tasks.filter(t => t.priority === "low").length,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of the Caterpillar jobsite task board — {tasks.length} total tasks
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-6">
          <p className="text-muted-foreground text-sm font-medium">Backlog</p>
          <p className="text-3xl font-bold">{byStatus.backlog}</p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-muted-foreground text-sm font-medium">To Do</p>
          <p className="text-3xl font-bold">{byStatus.todo}</p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-muted-foreground text-sm font-medium">In Progress</p>
          <p className="text-3xl font-bold">{byStatus["in-progress"]}</p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-muted-foreground text-sm font-medium">Done</p>
          <p className="text-3xl font-bold">{byStatus.done}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-6">
          <p className="text-sm font-medium text-red-500">High Priority</p>
          <p className="text-3xl font-bold">{byPriority.high}</p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-sm font-medium text-yellow-500">Medium Priority</p>
          <p className="text-3xl font-bold">{byPriority.medium}</p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-sm font-medium text-green-500">Low Priority</p>
          <p className="text-3xl font-bold">{byPriority.low}</p>
        </div>
      </div>

      <Link
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        href="/board"
      >
        Go to Board
        <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  )
}
