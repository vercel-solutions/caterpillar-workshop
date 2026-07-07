"use client"

export function ProjectFilter({
  categories,
  selected,
  onSelect,
}: {
  categories: any[]
  selected: string
  onSelect: (cat: string) => void
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button
        type="button"
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          selected === ""
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-accent"
        }`}
        onClick={() => onSelect("")}
      >
        All
      </button>
      {categories.map((cat: any) => (
        <button
          key={cat.slug}
          type="button"
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            selected === cat.slug
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-accent"
          }`}
          onClick={() => onSelect(cat.slug)}
        >
          {cat.name}
          {" "}
          (
          {cat.count}
          )
        </button>
      ))}
    </div>
  )
}
