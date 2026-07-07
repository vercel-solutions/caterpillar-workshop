import { faker } from "@faker-js/faker"

import { delay } from "./utils"

export type Employee = ReturnType<typeof generateData>["employees"][number]

export type Department = ReturnType<typeof generateData>["departments"][number]

function generateData() {
  faker.seed(123)

  const departments = [
    { name: "Construction Industries", slug: "construction-industries", employeeCount: 0 },
    { name: "Resource Industries", slug: "resource-industries", employeeCount: 0 },
    { name: "Energy & Transportation", slug: "energy-transportation", employeeCount: 0 },
    { name: "Cat Financial", slug: "cat-financial", employeeCount: 0 },
    { name: "Dealer Services", slug: "dealer-services", employeeCount: 0 },
  ]

  const skillPool = [
    "Hydraulics",
    "Powertrain Engineering",
    "Telematics",
    "Fleet Management",
    "Diesel Engines",
    "Product Link",
    "VisionLink",
    "Supply Chain",
    "Dealer Operations",
    "Heavy Equipment",
    "Mechatronics",
    "Welding",
    "CAD / Creo",
    "Data Analysis",
    "Reliability Engineering",
    "Parts & Service",
    "Autonomy",
    "Project Management",
    "Leadership",
    "Communication",
  ]

  const employees = []

  for (let i = 0; i < 30; i++) {
    const dept = departments[i % 5]
    const skills = faker.helpers.arrayElements(skillPool, { min: 3, max: 5 })

    employees.push({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      avatar: `https://avatars.githubusercontent.com/u/${faker.number.int({ min: 1000, max: 99999 })}`,
      department: dept.slug,
      role: faker.person.jobTitle(),
      email: faker.internet.email().toLowerCase(),
      phone: faker.phone.number(),
      joinDate: faker.date.past({ years: 5 }).toISOString(),
      skills,
    })

    dept.employeeCount++
  }

  return { departments, employees }
}

const { departments: DEPARTMENTS, employees: EMPLOYEES } = generateData()

export async function getEmployees(department?: string): Promise<Employee[]> {
  console.info(
    `[API] Fetching employees${department ? ` for department: ${department}` : ""} (250ms delay)`,
  )

  await delay(250)

  if (department) {
    return EMPLOYEES.filter(emp => emp.department === department)
  }

  return EMPLOYEES
}

export async function getDepartments(): Promise<Department[]> {
  console.info("[API] Fetching departments (100ms delay)")

  await delay(100)

  return DEPARTMENTS
}
