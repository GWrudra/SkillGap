"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, ArrowLeft, AlertTriangle, CheckCircle, BookOpen, ExternalLink, Play, RefreshCw } from "lucide-react"

interface SkillGap {
  skill: string
  currentLevel: number
  requiredLevel: number
  severity: "critical" | "high" | "medium" | "low"
  description: string
}

interface Strength {
  skill: string
  level: number
  relevance: string
}

interface LearningPath {
  title: string
  provider: string
  type: string
  estimatedHours: number
  priority: "critical" | "high" | "medium"
  skillsAddressed: string[]
  url: string
  cost?: string
}

interface CareerInsights {
  timeToReady: string
  marketDemand: string
  salaryRange: string
  topAdvice: string
}

interface AnalysisResult {
  readinessScore: number
  summary: string
  targetRole: string
  skillGaps: SkillGap[]
  strengths: Strength[]
  learningPaths: LearningPath[]
  careerInsights: CareerInsights
}

export function AnalysisResults() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"gaps" | "strengths" | "paths">("gaps")
  const router = useRouter()

  useEffect(() => {
    const stored = sessionStorage.getItem("analysis_result")
    if (stored) {
      try {
        setAnalysis(JSON.parse(stored))
      } catch {
        setError("Failed to load analysis data.")
      }
    } else {
      // Try loading from latest analysis
      const latest = localStorage.getItem("skillgap_latest_analysis")
      if (latest) {
        try {
          setAnalysis(JSON.parse(latest))
        } catch {
          setError("No analysis data found. Please run an analysis first.")
        }
      } else {
        setError("No analysis data found. Please run an analysis first.")
      }
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#f9f7f2] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-foreground border-t-transparent mx-auto mb-6" />
          <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground">LOADING RESULTS...</p>
        </div>
      </div>
    )
  }

  if (error || !analysis) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#f9f7f2] flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="font-serif text-3xl mb-4">{error || "Something went wrong."}</h2>
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-foreground/90 transition-colors"
          >
            RUN ANALYSIS <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    )
  }

  const severityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-600"
      case "high": return "text-accent"
      case "medium": return "text-yellow-600"
      default: return "text-muted-foreground"
    }
  }

  const severityBg = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-50 border-red-200"
      case "high": return "bg-orange-50 border-orange-200"
      case "medium": return "bg-yellow-50 border-yellow-200"
      default: return "bg-muted border-border"
    }
  }

  const levelBar = (current: number, required: number) => {
    const segments = 5
    return (
      <div className="flex gap-1">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 transition-colors ${
              i < current ? 'bg-foreground' : i < required ? 'bg-accent/30' : 'bg-border'
            }`}
          />
        ))}
      </div>
    )
  }

  // Circular score SVG
  const circumference = 2 * Math.PI * 90
  const strokeDashoffset = circumference - (analysis.readinessScore / 100) * circumference

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f9f7f2]">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">

        {/* Hero Header - matching the screenshot */}
        <div className="mb-16">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-8">
            — CAREER DIAGNOSTIC REPORT
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12">
            <div className="flex-1 max-w-2xl">
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight mb-8">
                Target: <span className="text-accent">{analysis.targetRole}</span>
              </h1>
              <p className="text-muted-foreground leading-relaxed text-lg mb-10">{analysis.summary}</p>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-4 flex-wrap">
                <Link
                  href="/dashboard/profile"
                  className="border border-border px-5 py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-muted transition-colors"
                >
                  EDIT PROFILE
                </Link>
                <Link
                  href="/dashboard"
                  className="bg-foreground text-background px-5 py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-foreground/90 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-3 h-3" /> RE-RUN
                </Link>
                <Link
                  href="/dashboard/pathways"
                  className="text-[10px] uppercase tracking-[0.2em] text-foreground hover:text-accent transition-colors flex items-center gap-1"
                >
                  EXPLORE PATHWAYS →
                </Link>
              </div>
            </div>

            {/* Circular Score */}
            <div className="shrink-0 flex flex-col items-center">
              <div className="relative w-[220px] h-[220px]">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#e5e3dc" strokeWidth="4" />
                  <circle
                    cx="100" cy="100" r="90"
                    fill="none"
                    stroke="#ff4d00"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">READINESS</div>
                  <div className="font-serif text-6xl">{analysis.readinessScore}</div>
                  <div className="text-sm text-muted-foreground">/ 100</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border mb-16">
          <div className="bg-background p-6 lg:p-8">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">TIME-TO-READINESS</div>
            <div className="font-serif text-2xl md:text-3xl">{analysis.careerInsights.timeToReady}</div>
          </div>
          <div className="bg-accent text-background p-6 lg:p-8">
            <div className="text-[10px] uppercase tracking-[0.2em] text-background/60 mb-4">SKILL GAPS</div>
            <div className="font-serif text-2xl md:text-3xl">{analysis.skillGaps.length}</div>
          </div>
          <div className="bg-background p-6 lg:p-8">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">CAREER STEPS</div>
            <div className="font-serif text-2xl md:text-3xl">{analysis.strengths.length}</div>
          </div>
          <div className="bg-background p-6 lg:p-8">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">RESOURCES</div>
            <div className="font-serif text-2xl md:text-3xl">{analysis.learningPaths.length}</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-8 border-b border-border mb-12">
          {[
            { key: "gaps" as const, label: "SKILL GAPS", count: analysis.skillGaps.length, icon: AlertTriangle },
            { key: "strengths" as const, label: "STRENGTHS", count: analysis.strengths.length, icon: CheckCircle },
            { key: "paths" as const, label: "LEARNING PATHS", count: analysis.learningPaths.length, icon: BookOpen },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 pb-4 text-[10px] uppercase tracking-[0.2em] font-mono transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-3 h-3" />
              {tab.label}
              <span className="bg-muted px-2 py-0.5 text-[9px]">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "gaps" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
            {analysis.skillGaps.map((gap, i) => (
              <div key={i} className={`p-8 ${severityBg(gap.severity)}`}>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-serif text-xl">{gap.skill}</h3>
                  <span className={`text-[10px] uppercase tracking-[0.2em] font-mono font-bold ${severityColor(gap.severity)}`}>
                    {gap.severity}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{gap.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground">
                    <span>CURRENT: {gap.currentLevel}</span>
                    <span>REQUIRED: {gap.requiredLevel}</span>
                  </div>
                  {levelBar(gap.currentLevel, gap.requiredLevel)}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "strengths" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
            {analysis.strengths.map((str, i) => (
              <div key={i} className="bg-background p-8">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-serif text-xl">{str.skill}</h3>
                  <span className="font-serif text-2xl text-accent">{str.level}/5</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{str.relevance}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "paths" && (
          <div className="space-y-0 border border-border">
            {analysis.learningPaths.map((path, i) => {
              const isYouTube = path.provider?.toLowerCase().includes('youtube') || path.url?.includes('youtube.com')
              const isCert = path.type === 'certification' || path.title?.toLowerCase().includes('certif')
              const isReading = path.type === 'reading' || path.provider?.toLowerCase().includes('geeksforgeeks') || path.provider?.toLowerCase().includes('mdn') || path.provider?.toLowerCase().includes('w3schools') || path.provider?.toLowerCase().includes('docs')
              const isProject = path.type === 'project' || path.provider?.toLowerCase().includes('leetcode') || path.provider?.toLowerCase().includes('hackerrank') || path.provider?.toLowerCase().includes('kaggle') || path.provider?.toLowerCase().includes('neetcode')
              const isFree = path.cost === 'free' || isYouTube || path.provider?.toLowerCase().includes('freecodecamp') || path.provider?.toLowerCase().includes('odin')
              const btnLabel = isYouTube ? 'WATCH' : isReading ? 'READ' : isProject ? 'BUILD' : 'START'
              
              return (
                <a
                  key={i}
                  href={path.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block p-8 ${i > 0 ? 'border-t border-border' : ''} bg-background hover:bg-muted/50 transition-colors group cursor-pointer`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className={`text-[10px] uppercase tracking-[0.2em] font-mono font-bold ${severityColor(path.priority)}`}>
                          {path.priority}
                        </span>
                        {isFree ? (
                          <span className="bg-green-100 text-green-800 px-3 py-1 text-[10px] uppercase tracking-[0.15em] font-mono font-bold">
                            ★ FREE
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 px-3 py-1 text-[10px] uppercase tracking-[0.15em] font-mono font-bold">
                            PAID
                          </span>
                        )}
                        {isCert && (
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 text-[10px] uppercase tracking-[0.15em] font-mono font-bold">
                            🎓 CERTIFICATION
                          </span>
                        )}
                        {isReading && !isCert && (
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 text-[10px] uppercase tracking-[0.15em] font-mono font-bold">
                            📖 READING
                          </span>
                        )}
                        {isProject && !isCert && (
                          <span className="bg-teal-100 text-teal-800 px-3 py-1 text-[10px] uppercase tracking-[0.15em] font-mono font-bold">
                            🛠 PROJECT
                          </span>
                        )}
                        <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground flex items-center gap-1">
                          {isYouTube && <Play className="w-3 h-3 text-red-500" />}
                          {path.provider}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl mb-3 group-hover:text-accent transition-colors flex items-center gap-2">
                        {path.title}
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {path.skillsAddressed.map((skill, j) => (
                          <span key={j} className="border border-border px-3 py-1 text-[10px] uppercase tracking-[0.1em] font-mono">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="text-right">
                        <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground">EST. TIME</div>
                        <div className="font-serif text-xl">{path.estimatedHours}h</div>
                      </div>
                      <div className="bg-foreground text-background px-6 py-3 text-[10px] uppercase tracking-[0.2em] group-hover:bg-accent transition-colors flex items-center gap-2">
                        {btnLabel} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 border-t border-border pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-muted-foreground text-sm">Want to refine your analysis? Update your profile and run again.</p>
          <div className="flex gap-4">
            <Link
              href="/dashboard/profile"
              className="border border-border px-6 py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-muted transition-colors"
            >
              EDIT PROFILE
            </Link>
            <Link
              href="/dashboard"
              className="bg-foreground text-background px-6 py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-foreground/90 transition-colors"
            >
              DASHBOARD
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
