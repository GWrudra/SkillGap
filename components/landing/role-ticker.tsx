"use client"

const roles = [
  "Data Scientist",
  "Product Manager",
  "UX Designer",
  "ML Engineer",
  "Software Engineer",
  "DevOps Engineer",
  "Data Analyst",
  "Cloud Architect",
]

export function RoleTicker() {
  return (
    <section className="w-full overflow-hidden border-y border-border bg-background py-6">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...roles, ...roles].map((role, index) => (
          <div key={index} className="flex items-center">
            <span className="mx-4 text-accent">•</span>
            <span className="font-serif text-xl italic text-foreground/80 md:text-2xl">{role}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
