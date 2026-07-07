import { getFeaturedProjects, getTeamMembers, getTestimonials } from "@/api"

export default async function HomePage() {
  // ANTI-PATTERN: Sequential fetches create waterfall (250ms + 500ms + 300ms = 1050ms)
  const projects = await getFeaturedProjects()
  const team = await getTeamMembers()
  const testimonials = await getTestimonials()

  return (
    <div>
      {/* Hero Section */}
      <section className="mb-16 text-center">
        {/* ANTI-PATTERN: Using <img> instead of next/image, no priority for LCP */}
        <img
          alt="Caterpillar Fleet Showcase Hero"
          className="mx-auto mb-8 h-64 w-full rounded-lg object-cover"
          src="https://picsum.photos/seed/hero/1200/400"
        />
        <h1 className="text-5xl font-bold tracking-tight">Equipment That Moves the World</h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-xl">
          Caterpillar builds the machines, engines, and technology that power construction, mining, and energy worldwide.
        </p>
      </section>

      {/* Featured Projects */}
      <section className="mb-16">
        <h2 className="mb-6 text-3xl font-bold">Featured Equipment</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <a
              key={project.id}
              className="bg-card border-border overflow-hidden rounded-lg border transition-shadow hover:shadow-lg"
              href={`/projects/${project.slug}`}
            >
              {/* ANTI-PATTERN: <img> without optimization */}
              <img
                alt={project.name}
                className="h-48 w-full object-cover"
                src={project.image}
              />
              <div className="p-4">
                <h3 className="font-semibold">{project.name}</h3>
                <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                  {project.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {project.technologies.slice(0, 3).map(tech => (
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
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="mb-6 text-3xl font-bold">Our Engineers</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map(member => (
            <div key={member.id} className="bg-card border-border rounded-lg border p-6 text-center">
              {/* ANTI-PATTERN: <img> for avatars */}
              <img
                alt={member.name}
                className="mx-auto h-24 w-24 rounded-full object-cover"
                src={member.avatar}
              />
              <h3 className="mt-4 font-semibold">{member.name}</h3>
              <p className="text-muted-foreground text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <h2 className="mb-6 text-3xl font-bold">What Our Customers Say</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map(testimonial => (
            <div
              key={testimonial.id}
              className="bg-card border-border rounded-lg border p-6"
            >
              <p className="text-foreground/80 italic">
                &ldquo;
                {testimonial.quote}
                &rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <img
                  alt={testimonial.author}
                  className="h-10 w-10 rounded-full"
                  src={testimonial.avatar}
                />
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-muted-foreground text-sm">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
