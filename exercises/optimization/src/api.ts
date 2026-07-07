import { faker } from "@faker-js/faker"

import { delay } from "./utils"

export type Project = ReturnType<typeof generateData>["projects"][number]

export type TeamMember = ReturnType<typeof generateData>["teamMembers"][number]

export type Testimonial = ReturnType<typeof generateData>["testimonials"][number]

export type ProjectCategory = ReturnType<typeof generateData>["projectCategories"][number]

function generateData() {
  faker.seed(123)

  const projectCategories = [
    { name: "Construction", slug: "construction", count: 0 },
    { name: "Mining", slug: "mining", count: 0 },
    { name: "Energy & Transportation", slug: "energy-transportation", count: 0 },
    { name: "Forestry", slug: "forestry", count: 0 },
  ]

  // Equipment capabilities/technologies shown as tags on each showcase item.
  const techPool = [
    "Grade Control",
    "Cat Autonomy",
    "Product Link Telematics",
    "VisionLink",
    "Electric Drive",
    "ACERT Engine",
    "Payload Weighing",
    "Cat Command (Remote Operation)",
    "Fuel Efficiency",
    "Heavy-Duty Undercarriage",
    "Hydraulic Hybrid",
    "Advansys GET",
    "Reman Components",
    "Integrated Technology",
    "Severe-Duty Build",
    "Low Emissions",
  ]

  // Flagship Cat machines featured in the showcase.
  const machineNames = [
    "Cat 395 Large Excavator",
    "Cat D11 Dozer",
    "Cat 988 Wheel Loader",
    "Cat 797F Mining Truck",
    "Cat 6060 Hydraulic Mining Shovel",
    "Cat 793 Off-Highway Truck",
    "Cat C175 Diesel Generator Set",
    "Cat 3512E Locomotive Engine",
    "Cat XQ425 Power Module",
    "Cat 320 Hydraulic Excavator",
    "Cat 336 Hydraulic Excavator",
    "Cat 950 GC Wheel Loader",
    "Cat 745 Articulated Truck",
    "Cat MH3250 Material Handler",
    "Cat 558 Forest Machine",
    "Cat 548 Log Loader",
    "Cat D5 Dozer",
    "Cat 980 Wheel Loader",
    "Cat 352 Hydraulic Excavator",
    "Cat G3520 Gas Generator Set",
  ]

  const projects = []

  for (let i = 0; i < 20; i++) {
    const cat = projectCategories[i % 4]
    const name = machineNames[i]

    projects.push({
      id: faker.string.uuid(),
      name,
      slug: faker.helpers.slugify(name).toLowerCase(),
      description: faker.lorem.paragraph(3),
      category: cat.slug,
      image: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/800/600`,
      technologies: faker.helpers.arrayElements(techPool, { min: 3, max: 6 }),
      featured: i < 6,
      year: faker.date.past({ years: 3 }).getFullYear(),
    })

    cat.count++
  }

  const teamMembers = []

  for (let i = 0; i < 8; i++) {
    teamMembers.push({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      role: faker.person.jobTitle(),
      bio: faker.lorem.paragraph(2),
      avatar: `https://avatars.githubusercontent.com/u/${faker.number.int({ min: 1000, max: 99999 })}`,
      socialUrl: `https://twitter.com/${faker.internet.username()}`,
    })
  }

  // Caterpillar dealers and contractors who run Cat fleets.
  const customerCompanies = [
    "Finning (Cat Dealer)",
    "Holt Cat",
    "Toromont Cat",
    "Empire Cat",
    "Ziegler Cat",
    "Thompson Machinery (Cat Dealer)",
  ]

  const customerQuotes = [
    "Our Cat fleet delivers the uptime we need to hit aggressive jobsite deadlines.",
    "Product Link telematics gave us real visibility into machine hours and fuel burn.",
    "The dealer support and parts availability keep our equipment working, not waiting.",
    "Cat machines hold up to the toughest mining conditions year after year.",
    "Lower owning and operating costs made the business case easy for our operations team.",
    "Grade control technology cut our rework and kept the crew productive all season.",
  ]

  const testimonials = []

  for (let i = 0; i < 6; i++) {
    testimonials.push({
      id: faker.string.uuid(),
      quote: customerQuotes[i],
      author: faker.person.fullName(),
      company: customerCompanies[i],
      avatar: `https://avatars.githubusercontent.com/u/${faker.number.int({ min: 1000, max: 99999 })}`,
    })
  }

  return { projects, projectCategories, teamMembers, testimonials }
}

const data = generateData()

export async function getProjects(category?: string): Promise<Project[]> {
  console.info(
    `[API] Fetching projects${category ? ` for category: ${category}` : ""} (250ms delay)`,
  )

  await delay(250)

  if (category) {
    return data.projects.filter(p => p.category === category)
  }

  return data.projects
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  console.info(`[API] Fetching project: ${slug} (200ms delay)`)

  await delay(200)

  return data.projects.find(p => p.slug === slug) ?? null
}

export async function getFeaturedProjects(): Promise<Project[]> {
  console.info("[API] Fetching featured projects (250ms delay)")

  await delay(250)

  return data.projects.filter(p => p.featured)
}

export async function getProjectCategories(): Promise<ProjectCategory[]> {
  return data.projectCategories
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  console.info("[API] Fetching team members (500ms delay)")

  await delay(500)

  return data.teamMembers
}

export async function getTestimonials(): Promise<Testimonial[]> {
  console.info("[API] Fetching testimonials (300ms delay)")

  await delay(300)

  return data.testimonials
}
