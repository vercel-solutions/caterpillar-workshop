import { faker } from "@faker-js/faker"

import { delay } from "./utils"

faker.seed(42)

const statuses = ["backlog", "todo", "in-progress", "done"] as const
const priorities = ["low", "medium", "high"] as const
const tags = ["inspection", "hydraulics", "engine", "electrical", "preventive", "safety"] as const

const jobsiteRoles = [
  "Service Technician",
  "Fleet Manager",
  "Heavy Equipment Operator",
  "Maintenance Supervisor",
  "Field Mechanic",
  "Parts Coordinator",
]

const taskTitles = [
  "Replace hydraulic hose on the 320 excavator",
  "500-hour service on the D6 dozer",
  "Diagnose fault code on the 966 wheel loader",
  "Swap GET bucket teeth before next dig",
  "Inspect undercarriage track tension",
  "Run Product Link diagnostics on jobsite fleet",
  "Schedule oil sampling for the C13 engine",
  "Recalibrate grade control on the dozer",
  "Order replacement air and fuel filters",
  "Repair coolant leak on generator set",
  "Update VisionLink geofence for the quarry",
  "Lubricate pins and bushings on the 745 truck",
  "Replace worn cutting edge on the loader bucket",
  "Investigate excessive fuel burn on 336 excavator",
  "Complete pre-shift safety inspection checklist",
  "Rebuild final drive on the 988 wheel loader",
  "Calibrate payload weighing system",
  "Winterize idle machines in the yard",
]

function generateData() {
  const users = Array.from({ length: 6 }, (_, i) => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${faker.person.firstName()}`,
    role: jobsiteRoles[i % jobsiteRoles.length],
  }))

  const tasks = Array.from({ length: 18 }, (_, i) => {
    const assignee = faker.helpers.arrayElement(users)

    return {
      id: faker.string.nanoid(8),
      title: taskTitles[i % taskTitles.length],
      description: faker.lorem.paragraph(),
      status: faker.helpers.arrayElement(statuses),
      priority: faker.helpers.arrayElement(priorities),
      assigneeId: assignee.id,
      assigneeName: assignee.name,
      tags: faker.helpers.arrayElements(tags, { min: 1, max: 3 }),
      createdAt: faker.date.recent({ days: 30 }).toISOString(),
    }
  })

  const columns = [
    { id: "backlog", title: "Backlog", status: "backlog" as const },
    { id: "todo", title: "To Do", status: "todo" as const },
    { id: "in-progress", title: "In Progress", status: "in-progress" as const },
    { id: "done", title: "Done", status: "done" as const },
  ]

  return { users, tasks, columns }
}

const data = generateData()

export type Task = (typeof data)["tasks"][number]
export type User = (typeof data)["users"][number]
export type Column = (typeof data)["columns"][number]
export type Status = (typeof statuses)[number]
export type Priority = (typeof priorities)[number]

export async function getTasks(): Promise<Task[]> {
  console.info("[API] Fetching tasks (300ms delay)")
  await delay(300)

  return data.tasks
}

export async function getTask(id: string): Promise<Task | undefined> {
  console.info(`[API] Fetching task ${id} (150ms delay)`)
  await delay(150)

  return data.tasks.find(t => t.id === id)
}

export async function getUsers(): Promise<User[]> {
  console.info("[API] Fetching users (200ms delay)")
  await delay(200)

  return data.users
}

export async function getUser(id: string): Promise<User | undefined> {
  console.info(`[API] Fetching user ${id} (100ms delay)`)
  await delay(100)

  return data.users.find(u => u.id === id)
}

export async function getColumns(): Promise<Column[]> {
  console.info("[API] Fetching columns (50ms delay)")
  await delay(50)

  return data.columns
}

export async function getTasksByStatus(status: Status): Promise<Task[]> {
  console.info(`[API] Fetching tasks with status ${status} (200ms delay)`)
  await delay(200)

  return data.tasks.filter(t => t.status === status)
}
