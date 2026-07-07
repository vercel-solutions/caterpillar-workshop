export function ProjectCard({ project }: { project: any }) {
  return (
    <a
      className="bg-card border-border overflow-hidden rounded-lg border transition-shadow hover:shadow-lg"
      href={`/projects/${project.slug}`}
    >
      <img
        alt={project.name}
        className="h-48 w-full object-cover"
        src={project.image}
      />
      <div className="p-4">
        <h3 className="font-semibold">{project.name}</h3>
        <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{project.description}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          {project.technologies.slice(0, 3).map((tech: string) => (
            <span
              key={tech}
              className="bg-secondary text-secondary-foreground rounded px-2 py-0.5 text-xs"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </a>
  )
}
