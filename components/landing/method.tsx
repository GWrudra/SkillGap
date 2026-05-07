import { Settings2, TrendingUp, BookOpen } from "lucide-react"

const features = [
  {
    number: "01",
    icon: Settings2,
    title: "Skill Gap Diagnostic",
    description: "A precise diagnostic of where you stand vs. where you aim. Honest. Quantified. Prioritized.",
  },
  {
    number: "02",
    icon: TrendingUp,
    title: "Readiness Scoring",
    description: "A single number — 0 to 100 — that captures your distance to the role you want. Recomputed every analysis.",
  },
  {
    number: "03",
    icon: BookOpen,
    title: "Curated Learning Paths",
    description: "Hand-picked resources from Coursera, MIT, freeCodeCamp, and the open web. No filler.",
  },
]

export function Method() {
  return (
    <section id="method" className="w-full bg-background px-6 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
          {/* Left Column */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">§ Method</span>
            </div>
            <h2 className="font-serif text-3xl leading-tight md:text-4xl lg:text-[42px]">
              A rigorous<br />diagnostic, not<br />a quiz.
            </h2>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.number}
                className="flex flex-col border border-border bg-card p-6"
              >
                <div className="mb-6 flex items-start justify-between">
                  <span className="text-xs text-muted-foreground">{feature.number}</span>
                  <feature.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="mb-3 text-base font-medium">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
