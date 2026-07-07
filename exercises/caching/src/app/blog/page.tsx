import { getBlogPosts, getCategories } from "@/api"
import BlogPosts from "@/components/blog-posts"
import CategoryFilter from "@/components/category-filter"

export const dynamic = "force-dynamic"

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const [categories, posts] = await Promise.all([getCategories(), getBlogPosts(category)])

  return (
    <div className="container mx-auto flex flex-col gap-8 px-4 py-8">
      <header>
        <h1 className="mb-4 text-4xl font-bold">Cat Insights</h1>
        <p className="text-muted-foreground">
          Insights and thought leadership from Caterpillar on construction, mining, energy, and
          forestry. Dive into articles that explore the equipment, technology, and strategies that
          keep jobsites productive and fleets running.
        </p>
      </header>

      <CategoryFilter categories={categories} />

      <BlogPosts posts={posts} />
    </div>
  )
}
