import { faker } from "@faker-js/faker"

import { delay } from "./utils"

export type Category = ReturnType<typeof generateData>["categories"][number]

export type BlogPost = ReturnType<typeof generateData>["blogPosts"][number]

function generateData(postCount: number = 50) {
  faker.seed(123)

  const categories = [
    {
      id: faker.string.uuid(),
      name: "Construction",
      slug: "construction",
      description: "Building and infrastructure insights",
      postCount: 0,
    },
    {
      id: faker.string.uuid(),
      name: "Mining",
      slug: "mining",
      description: "Surface and underground mining solutions",
      postCount: 0,
    },
    {
      id: faker.string.uuid(),
      name: "Energy & Transportation",
      slug: "energy-transportation",
      description: "Power generation and engine technology",
      postCount: 0,
    },
    {
      id: faker.string.uuid(),
      name: "Forestry",
      slug: "forestry",
      description: "Forestry and land management machines",
      postCount: 0,
    },
    {
      id: faker.string.uuid(),
      name: "Sustainability",
      slug: "sustainability",
      description: "Lower-emission and alternative-fuel solutions",
      postCount: 0,
    },
    {
      id: faker.string.uuid(),
      name: "Technology & Telematics",
      slug: "technology-telematics",
      description: "Connected equipment, autonomy, and data",
      postCount: 0,
    },
  ]

  const topicPool = [
    "Maximizing Fleet Uptime",
    "Lowering Owning and Operating Costs",
    "Getting More From Product Link Telematics",
    "Smarter Grade Control on Site",
    "Planning a Preventive Maintenance Schedule",
    "Choosing the Right Excavator for the Job",
    "Reducing Fuel Burn Across Your Fleet",
    "Extending Undercarriage Life",
    "Remote Operation With Cat Command",
    "Rebuilding Components With Cat Reman",
    "Improving Operator Safety and Comfort",
    "Scaling Up With Autonomous Haulage",
  ]

  const blogPosts = []

  for (let i = 0; i < postCount; i++) {
    const selectedCategory = faker.helpers.arrayElement(categories)
    const title = faker.helpers.arrayElement(topicPool)

    blogPosts.push({
      id: faker.string.uuid(),
      title: `${title} in ${selectedCategory.name}`,
      slug: faker.helpers.slugify(title).toLowerCase(),
      excerpt: faker.lorem.paragraph(2),
      content: faker.lorem.paragraphs(5, "\n\n"),
      category: selectedCategory.slug,
      author: {
        name: faker.person.fullName(),
        avatar: faker.image.avatar(),
      },
      publishedAt: faker.date.recent({ days: 30 }).toISOString(),
      readTime: faker.number.int({ min: 3, max: 12 }),
      imageUrl: faker.image.urlPicsumPhotos({ width: 800, height: 400 }),
    })

    selectedCategory.postCount++
  }

  blogPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  return { categories, blogPosts }
}

const { categories: CATEGORIES, blogPosts: BLOG_POSTS } = generateData(50)

export async function getBlogPosts(category?: string): Promise<BlogPost[]> {
  console.info(
    `[API] Fetching blog posts${category ? ` for category: ${category}` : ""} (250ms delay)`,
  )

  await delay(250)

  if (category) {
    return BLOG_POSTS.filter(post => post.category === category)
  }

  return BLOG_POSTS
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  console.info("[API] Fetching featured posts (250ms delay)")

  await delay(1500)

  return BLOG_POSTS.toSorted(() => Math.random() - 0.5).slice(0, 3)
}

export async function getCategories(): Promise<Category[]> {
  console.info("[API] Fetching categories (250ms delay)")

  await delay(250)

  return CATEGORIES
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  console.info(`[API] Fetching blog post with slug: ${slug} (250ms delay)`)

  await delay(250)

  return BLOG_POSTS.find(post => post.slug === slug) ?? null
}
