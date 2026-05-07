const steps = [
  {
    number: "01",
    title: "Build your profile",
    description: "Skills, target role, experience, education. Tag-based and structured.",
  },
  {
    number: "02",
    title: "Run the analysis",
    description: "Claude Sonnet 4.5 reviews your profile against the role and outputs a structured assessment.",
  },
  {
    number: "03",
    title: "Execute the roadmap",
    description: "Sequenced learning steps, prioritized gaps, curated resources. Re-run any time.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-[#1a1a1a] px-6 py-16 text-white md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-4 md:gap-8">
          {/* Left Column */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">§ Process</span>
            </div>
            <h2 className="font-serif text-2xl leading-tight md:text-3xl">
              Three steps.<br />
              <span className="text-accent">Two minutes.</span>
            </h2>
          </div>

          {/* Steps */}
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col">
              <span className="mb-3 text-xs text-accent">{step.number}</span>
              <h3 className="mb-2 text-lg font-medium">{step.title}</h3>
              <p className="text-sm leading-relaxed text-white/60">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
