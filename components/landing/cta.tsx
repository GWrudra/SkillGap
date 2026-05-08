import Link from "next/link"
import { Sparkles } from "lucide-react"

export function CTA() {
  return (
    <section className="w-full bg-background px-6 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">§ Begin</span>
            </div>
            <h2 className="font-serif text-3xl leading-tight md:text-4xl lg:text-[42px]">
              Stop guessing.{" "}
              <em className="not-italic text-accent">Start engineering</em>{" "}
              your next role.
            </h2>
            <div className="mt-8">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 bg-accent px-5 py-3 text-xs font-medium uppercase tracking-[0.1em] text-white transition-colors hover:bg-accent/90"
              >
                Create Free Account
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col justify-center lg:items-end">
          </div>
        </div>
      </div>
    </section>
  )
}
