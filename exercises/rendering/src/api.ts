import { faker } from "@faker-js/faker"

import { delay } from "./utils"

export type Article = ReturnType<typeof generateData>["articles"][number]

export type Category = ReturnType<typeof generateData>["categories"][number]

function generateData() {
  faker.seed(123)

  const categories = [
    { name: "Products & Innovation", slug: "products-innovation", articleCount: 0 },
    { name: "Construction", slug: "construction", articleCount: 0 },
    { name: "Mining", slug: "mining", articleCount: 0 },
    { name: "Sustainability", slug: "sustainability", articleCount: 0 },
    { name: "Dealers & Customers", slug: "dealers-customers", articleCount: 0 },
  ]

  // Caterpillar-flavored newsroom headlines, cycled across the categories above.
  const headlines = [
    "Caterpillar Unveils Next-Generation 350 Hydraulic Excavator",
    "New Cat Grade Technology Boosts Operator Productivity on Site",
    "Caterpillar Expands Autonomous Haulage to More Mine Sites",
    "Cat Electric Power Solutions Reach New Efficiency Milestone",
    "Dealer Network Celebrates 100 Years of Customer Support",
    "How the Cat 320 Excavator Is Built for Tighter Jobsites",
    "Caterpillar Introduces Battery-Electric Underground Loader",
    "Inside the Latest Cat Dozer Automation Upgrades",
    "Caterpillar Reports Progress on 2030 Sustainability Goals",
    "Cat Financial Launches New Equipment Financing Options",
    "Product Link Telematics Now Standard Across More Machines",
    "Caterpillar and Customers Tackle Largest Earthmoving Project Yet",
    "Cat Reman Keeps Components in Service and Out of Landfills",
    "New C13D Industrial Engine Delivers More Power, Lower Emissions",
    "Cat Rental Store Expands Fleet for Peak Construction Season",
    "Caterpillar Showcases Mining Innovations at MINExpo",
    "How Cat VisionLink Helps Fleets Cut Unplanned Downtime",
    "Caterpillar Invests in Workforce Training for Service Technicians",
    "Cat Wheel Loaders Get Smarter Payload Weighing",
    "Sustainable Jobsites: Caterpillar's Push Toward Alternative Fuels",
    "Caterpillar Dealers Roll Out Faster Parts Delivery",
    "New Cat Hydraulic Hammer Built for Demolition Crews",
    "Caterpillar Earns Recognition for Safety Innovation",
    "Cat Command Enables Remote Operation From Miles Away",
    "Caterpillar Helps Restore Infrastructure After Natural Disasters",
  ]

  const articles = []

  for (let i = 0; i < 25; i++) {
    const cat = categories[i % 5]
    const title = headlines[i]

    articles.push({
      id: faker.string.uuid(),
      title,
      slug: faker.helpers.slugify(title).toLowerCase(),
      excerpt: faker.lorem.paragraph(2),
      content: faker.lorem.paragraphs(8, "\n\n"),
      category: cat.slug,
      author: {
        name: faker.person.fullName(),
        avatar: `https://avatars.githubusercontent.com/u/${faker.number.int({ min: 1000, max: 99999 })}`,
      },
      publishedAt: faker.date.recent({ days: 30 }).toISOString(),
      readTime: faker.number.int({ min: 3, max: 15 }),
      image: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/800/400`,
      views: faker.number.int({ min: 100, max: 50000 }),
    })

    cat.articleCount++
  }

  articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  return { categories, articles }
}

const { categories: CATEGORIES, articles: ARTICLES } = generateData()

export async function getLatestArticles(): Promise<Article[]> {
  console.info("[API] Fetching latest articles (500ms delay)")

  await delay(500)

  return ARTICLES.slice(0, 10)
}

export async function getTrendingArticles(): Promise<Article[]> {
  console.info("[API] Fetching trending articles (1500ms delay)")

  await delay(1500)

  return ARTICLES.toSorted((a, b) => b.views - a.views).slice(0, 5)
}

export async function getArticles(category?: string): Promise<Article[]> {
  console.info(
    `[API] Fetching articles${category ? ` for category: ${category}` : ""} (500ms delay)`,
  )

  await delay(500)

  if (category) {
    return ARTICLES.filter(a => a.category === category)
  }

  return ARTICLES
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  console.info(`[API] Fetching article: ${slug} (200ms delay)`)

  await delay(200)

  return ARTICLES.find(a => a.slug === slug) ?? null
}

export async function getAllArticleSlugs(): Promise<string[]> {
  return ARTICLES.map(a => a.slug)
}

export async function getCategories(): Promise<Category[]> {
  console.info("[API] Fetching categories (100ms delay)")

  await delay(100)

  return CATEGORIES
}

export async function getDashboardStats(): Promise<{
  totalArticles: number
  totalViews: number
  topCategory: string
  recentPublished: number
}> {
  console.info("[API] Fetching dashboard stats (800ms delay)")

  await delay(800)

  const totalViews = ARTICLES.reduce((sum, a) => sum + a.views, 0)
  const categoryCounts = CATEGORIES.toSorted((a, b) => b.articleCount - a.articleCount)

  return {
    totalArticles: ARTICLES.length,
    totalViews,
    topCategory: categoryCounts[0].name,
    recentPublished: ARTICLES.filter(
      a => new Date(a.publishedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    ).length,
  }
}

export async function getUserPreferences(): Promise<{
  savedArticles: string[]
  preferredCategories: string[]
  lastVisited: string
}> {
  console.info("[API] Fetching user preferences (600ms delay)")

  await delay(600)

  return {
    savedArticles: ARTICLES.slice(0, 3).map(a => a.slug),
    preferredCategories: ["products-innovation", "mining"],
    lastVisited: new Date().toISOString(),
  }
}
