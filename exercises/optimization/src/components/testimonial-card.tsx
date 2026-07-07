export function TestimonialCard({ testimonial }: { testimonial: any }) {
  return (
    <div className="bg-card border-border rounded-lg border p-6">
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
  )
}
