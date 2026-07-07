import Link from "next/link"
import { notFound } from "next/navigation"

import { getProjectBySlug } from "@/api"

// ANTI-PATTERN: No generateMetadata, no generateStaticParams

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center text-sm"
        href="/projects"
      >
        &larr; Back to Projects
      </Link>

      {/* ANTI-PATTERN: <img> without next/image */}
      <img
        alt={project.name}
        className="mb-6 h-64 w-full rounded-lg object-cover md:h-96"
        src={project.image}
      />

      <h1 className="text-4xl font-bold tracking-tight">{project.name}</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.technologies.map(tech => (
          <span
            key={tech}
            className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="text-muted-foreground mt-4 flex items-center gap-4 text-sm">
        <span className="capitalize">{project.category.replace("-", " ")}</span>
        <span>{project.year}</span>
      </div>

      <div className="mt-8">
        <p className="text-foreground/80 leading-relaxed">{project.description}</p>
      </div>
    </div>
  )
}
