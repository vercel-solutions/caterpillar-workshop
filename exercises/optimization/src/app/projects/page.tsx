"use client"

import { useEffect, useState } from "react"

// ANTI-PATTERN: Barrel import pulls in ALL components
import { ProjectCard, ProjectFilter, ProjectGrid } from "@/components"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/projects")
      .then(res => res.json())
      .then((data) => {
        setProjects(data.projects)
        setCategories(data.categories)
        setLoading(false)
      })
  }, [])

  const filteredProjects = selectedCategory
    ? projects.filter((p: any) => p.category === selectedCategory)
    : projects

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">All Equipment</h1>
        <p className="text-muted-foreground mt-2">Explore the complete Cat fleet</p>
      </div>

      <ProjectFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {loading
        ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-muted h-72 animate-pulse rounded-lg" />
              ))}
            </div>
          )
        : (
            <ProjectGrid>
              {filteredProjects.map((project: any) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </ProjectGrid>
          )}
    </div>
  )
}
