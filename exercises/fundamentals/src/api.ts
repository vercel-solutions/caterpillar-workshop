import { faker } from "@faker-js/faker"

import { delay } from "./utils"

export type Product = ReturnType<typeof generateData>["products"][number]

export type Category = ReturnType<typeof generateData>["categories"][number]

function generateData() {
  faker.seed(123)

  const categories = [
    { name: "Excavators", slug: "excavators", productCount: 0 },
    { name: "Dozers", slug: "dozers", productCount: 0 },
    { name: "Wheel Loaders", slug: "wheel-loaders", productCount: 0 },
    { name: "Power Systems", slug: "power-systems", productCount: 0 },
    { name: "Parts & Attachments", slug: "parts-attachments", productCount: 0 },
  ]

  // Real Caterpillar model lines, grouped to match the category order above.
  const modelsByCategory: Record<string, string[]> = {
    excavators: [
      "308 CR Mini Excavator",
      "315 Hydraulic Excavator",
      "320 Hydraulic Excavator",
      "323 Hydraulic Excavator",
      "336 Hydraulic Excavator",
      "349 Hydraulic Excavator",
      "374 Large Excavator",
      "395 Large Excavator",
    ],
    dozers: [
      "D1 Dozer",
      "D3 Dozer",
      "D5 Dozer",
      "D6 Dozer",
      "D7 Dozer",
      "D8T Dozer",
      "D9 Dozer",
      "D11 Dozer",
    ],
    "wheel-loaders": [
      "906 Compact Wheel Loader",
      "926 Small Wheel Loader",
      "950 GC Wheel Loader",
      "966 Wheel Loader",
      "972 Wheel Loader",
      "980 Wheel Loader",
      "982 Wheel Loader",
      "988 Wheel Loader",
    ],
    "power-systems": [
      "C7.1 Industrial Diesel Engine",
      "C9.3 ACERT Industrial Engine",
      "C13 Industrial Diesel Engine",
      "C15 Diesel Generator Set",
      "C18 Diesel Generator Set",
      "C27 Diesel Generator Set",
      "C32 Diesel Generator Set",
      "G3516 Gas Generator Set",
    ],
    "parts-attachments": [
      "Cat GET Bucket Teeth (Advansys)",
      "Heavy-Duty Excavator Bucket",
      "Cat H120 Hydraulic Hammer",
      "Cat Severe-Duty Air Filter",
      "Cat HYDO Advanced 10 Hydraulic Oil",
      "Cat Undercarriage Track Group",
      "Cat Multi-Processor Grapple",
      "Cat Auger Drive Attachment",
    ],
  }

  const descriptors = [
    "Engineered for maximum uptime and lower owning and operating costs on demanding jobsites.",
    "Built to deliver fuel efficiency, durability, and the power to move more material per hour.",
    "Factory-equipped with Cat Product Link telematics for fleet visibility and remote diagnostics.",
    "Designed for construction, mining, and quarry applications where reliability is non-negotiable.",
    "Backed by the Cat dealer network for parts, service, and rebuild support worldwide.",
  ]

  const products = []

  for (let i = 0; i < 40; i++) {
    const cat = categories[i % 5]
    const modelIndex = Math.floor(i / 5)
    const name = modelsByCategory[cat.slug][modelIndex]
    // Attachments and parts are priced far lower than full machines.
    const price = cat.slug === "parts-attachments"
      ? Number.parseFloat(faker.commerce.price({ min: 29, max: 9999 }))
      : Number.parseFloat(faker.commerce.price({ min: 89000, max: 1250000 }))

    products.push({
      id: faker.string.uuid(),
      name,
      slug: faker.helpers.slugify(name).toLowerCase(),
      description: faker.helpers.arrayElement(descriptors),
      price,
      category: cat.slug,
      image: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/800/600`,
      rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
      reviewCount: faker.number.int({ min: 0, max: 500 }),
      inStock: faker.datatype.boolean({ probability: 0.8 }),
      featured: i < 8,
    })

    cat.productCount++
  }

  return { categories, products }
}

const { categories: CATEGORIES, products: PRODUCTS } = generateData()

export async function getProducts(category?: string): Promise<Product[]> {
  console.info(
    `[API] Fetching products${category ? ` for category: ${category}` : ""} (300ms delay)`,
  )

  await delay(300)

  if (category) {
    return PRODUCTS.filter(p => p.category === category)
  }

  return PRODUCTS
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  console.info(`[API] Fetching product: ${slug} (200ms delay)`)

  await delay(200)

  return PRODUCTS.find(p => p.slug === slug) ?? null
}

export async function getCategories(): Promise<Category[]> {
  console.info("[API] Fetching categories (100ms delay)")

  await delay(100)

  return CATEGORIES
}

export async function getFeaturedProducts(): Promise<Product[]> {
  console.info("[API] Fetching featured products (250ms delay)")

  await delay(250)

  return PRODUCTS.filter(p => p.featured)
}
