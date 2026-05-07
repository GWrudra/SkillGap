"use client"

import Link from "next/link"

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden px-6 pb-8 pt-8 md:pb-12 md:pt-12">
      <div className="mx-auto max-w-7xl">
        {/* Issue Tag */}
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px w-8 bg-foreground" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Issue 01 / 2026 — Career Intelligence Quarterly
          </span>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          {/* Left Column - Main Headline */}
          <div className="flex flex-col">
            <h1 className="font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl lg:text-[56px]">
              Know exactly{" "}
              <em className="not-italic text-accent">{"what's missing"}</em>{" "}
              between you and the role you want.
            </h1>
            
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              SkillGap is an AI-powered career intelligence platform. Build your profile, 
              name your target role, and receive a rigorous, personalized diagnostic — 
              readiness score, prioritized gaps, and a sequenced roadmap to close them.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/auth/signup"
                className="flex items-center gap-2 border border-foreground bg-transparent px-5 py-3 text-xs font-medium uppercase tracking-[0.1em] text-foreground transition-colors hover:bg-foreground hover:text-primary-foreground"
              >
                Start Your Analysis
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link
                href="/pathways"
                className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.1em] text-foreground transition-colors hover:text-foreground/70"
              >
                Explore Career Pathways
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 7H11M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Column - Stats Cards */}
          <div className="flex flex-col gap-4">
            {/* Live Index Card */}
            <div className="bg-[#1a1a1a] p-6 text-white">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">Live Index</span>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-serif text-5xl font-light">72</span>
                <span className="text-xs text-white/60">/100 AVG READINESS</span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-xs text-white/60">1,284 ANALYSES</span>
                <span className="flex items-center gap-1 text-xs text-green-400">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 9V3M6 3L3 6M6 3L9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  12.4%
                </span>
              </div>
            </div>

            {/* Top Role Card */}
            <div className="border border-border bg-card p-6">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Top Role Searched</span>
              <h3 className="mt-2 font-serif text-xl">Machine Learning Engineer</h3>
              <span className="mt-2 block text-xs text-muted-foreground">TIME-TO-READINESS: 9 MO (MEDIAN)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
