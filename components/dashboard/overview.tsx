"use client"

import { useState, useEffect } from "react"
import { Target, BookOpen, TrendingUp, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  full_name: string | null
  email: string | null
  target_role: string | null
  current_skills: string[] | null
  readiness_score: number | null
}

interface SkillGap {
  id: string
  skill_name: string
  current_level: number
  required_level: number
  gap_severity: string
}

interface LearningPath {
  id: string
  title: string
  description: string | null
  resource_url: string | null
  estimated_hours: number | null
  priority: number
  is_completed: boolean
}

interface OverviewProps {
  user: User
  profile: Profile | null
  skillGaps: SkillGap[]
  learningPaths: LearningPath[]
}

interface HistoryEntry {
  id: string
  date: string
  targetRole: string
  readinessScore: number
  skillGapsCount: number
  strengthsCount: number
  summary: string
}

interface LatestAnalysis {
  readinessScore: number
  targetRole: string
  summary: string
  skillGaps: Array<{ skill: string; severity: string }>
  strengths: Array<{ skill: string }>
}

export function DashboardOverview({ user, profile, skillGaps, learningPaths }: OverviewProps) {
  const [latestAnalysis, setLatestAnalysis] = useState<LatestAnalysis | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [savedProfile, setSavedProfile] = useState<{ targetRole?: string; skills?: string[]; targetCategory?: string; experience?: string; currentStatus?: string; education?: string; learningStyle?: string } | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    try {
      const latest = localStorage.getItem("skillgap_latest_analysis")
      if (latest) setLatestAnalysis(JSON.parse(latest))
      
      const hist = localStorage.getItem("skillgap_history")
      if (hist) setHistory(JSON.parse(hist))
      
      const prof = localStorage.getItem("skillgap_profile")
      if (prof) setSavedProfile(JSON.parse(prof))
    } catch {}
  }, [])
  
  const readinessScore = latestAnalysis?.readinessScore || profile?.readiness_score || 0
  const hasAnalysis = !!latestAnalysis
  const hasProfile = !!savedProfile?.targetRole || !!profile?.target_role
  
  // Calculate real profile completion - only count explicitly filled fields
  const profileFields = [
    savedProfile?.skills && savedProfile.skills.length >= 3,     // need at least 3 skills
    !!savedProfile?.targetRole,
    savedProfile?.education && savedProfile.education !== "",     // must be explicitly set
    savedProfile?.skills && savedProfile.skills.length >= 5,     // bonus for 5+ skills
  ]
  const filledCount = profileFields.filter(Boolean).length
  const profileCompletion = hasProfile ? Math.round((filledCount / profileFields.length) * 100) : 0
  
  const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
  const firstName = profile?.full_name?.split(' ')[0].toUpperCase() || user.user_metadata?.full_name?.split(' ')[0].toUpperCase() || "USER"

  // Direct run analysis using saved profile
  const handleRunAnalysis = async () => {
    if (!savedProfile?.targetRole || !savedProfile?.skills?.length) {
      router.push("/dashboard/profile")
      return
    }
    
    setIsRunning(true)
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: savedProfile.skills,
          targetRole: savedProfile.targetRole,
          experience: savedProfile.experience || "1",
          currentStatus: savedProfile.currentStatus || "EMPLOYED",
          education: savedProfile.education || "",
          learningStyle: savedProfile.learningStyle || "VIDEO",
        }),
      })

      if (!res.ok) throw new Error("Analysis failed")

      const data = await res.json()
      sessionStorage.setItem("analysis_result", JSON.stringify(data))
      
      const historyEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        targetRole: savedProfile.targetRole,
        readinessScore: data.readinessScore,
        skillGapsCount: data.skillGaps?.length || 0,
        strengthsCount: data.strengths?.length || 0,
        summary: data.summary,
      }
      const existingHistory = JSON.parse(localStorage.getItem("skillgap_history") || "[]")
      existingHistory.unshift(historyEntry)
      localStorage.setItem("skillgap_history", JSON.stringify(existingHistory.slice(0, 20)))
      localStorage.setItem("skillgap_latest_analysis", JSON.stringify(data))
      
      router.push("/dashboard/analysis")
    } catch {
      setIsRunning(false)
      alert("Analysis failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Running overlay */}
      {isRunning && (
        <div className="fixed inset-0 z-50 bg-foreground flex items-center justify-center">
          <div className="text-center text-background">
            <div className="mb-12">
              <div className="w-16 h-16 border-2 border-background/30 border-t-background animate-spin mx-auto" />
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-background/50 mb-4">§ ANALYZING</div>
            <h2 className="font-serif text-4xl md:text-5xl mb-4">Processing your profile...</h2>
            <p className="text-background/60 text-sm max-w-md mx-auto">Our AI is comparing your skills against industry standards for {savedProfile?.targetRole}.</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 animate-fade-in-up">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-6">
              — DASHBOARD / {formattedDate}
            </div>
            <h1 className="font-serif text-6xl md:text-7xl lg:text-[80px] leading-none mb-6">
              Hello, <span className="text-accent">{firstName}</span>.
            </h1>
            <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
              {hasAnalysis 
                ? `Your latest readiness score: ${readinessScore}% for ${latestAnalysis?.targetRole}`
                : "Let's build your profile and run your first diagnostic."
              }
            </p>
          </div>
          <div>
            {hasProfile ? (
              <button
                onClick={handleRunAnalysis}
                className="inline-flex items-center justify-center bg-foreground text-background px-6 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-foreground/90 transition-colors"
              >
                ↻ RE-RUN ANALYSIS
              </button>
            ) : (
              <Link
                href="/dashboard/profile"
                className="inline-flex items-center justify-center bg-foreground text-background px-6 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-foreground/90 transition-colors"
              >
                + SET UP PROFILE
              </Link>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-border border border-border stagger-children">
          
          {/* Left panel: Latest Readiness */}
          <div className="bg-background md:col-span-6 p-8 lg:p-12 flex flex-col justify-between min-h-[400px]">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-12">
                § LATEST READINESS
              </div>
              {hasAnalysis ? (
                <>
                  <h2 className="font-serif text-7xl md:text-8xl text-foreground mb-4">
                    {readinessScore}<span className="text-3xl text-muted-foreground">%</span>
                  </h2>
                  <div className="h-2 bg-border mb-6">
                    <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${readinessScore}%` }} />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{latestAnalysis?.summary}</p>
                </>
              ) : (
                <h2 className="font-serif text-5xl md:text-6xl text-foreground">
                  No analysis yet
                </h2>
              )}
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-8">
              {hasAnalysis ? (
                <Link href="/dashboard/analysis" className="hover:text-accent transition-colors">
                  VIEW FULL ANALYSIS REPORT →
                </Link>
              ) : (
                "RUN YOUR FIRST ANALYSIS TO SEE YOUR SCORE."
              )}
            </div>
          </div>

          {/* Middle panel: Profile */}
          <div className="bg-[#f2f0e9] md:col-span-3 p-8 lg:p-12 flex flex-col justify-between border-l border-border">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-12">
                § PROFILE
              </div>
              {savedProfile?.targetRole ? (
                <>
                  <div className="font-serif text-3xl md:text-4xl text-foreground mb-1">{savedProfile.targetRole}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-8">{savedProfile.targetCategory || 'TECH'}</div>
                  <div className="flex gap-8 border-t border-border/50 pt-6">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">SKILLS</div>
                      <div className="font-serif text-3xl">{savedProfile.skills?.length || 0}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">YEARS EXP</div>
                      <div className="font-serif text-3xl">{savedProfile.experience || '1'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">SCORE</div>
                      <div className="font-serif text-3xl">{readinessScore}<span className="text-sm text-muted-foreground">%</span></div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="font-serif text-5xl md:text-6xl text-foreground mb-2">0%</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">NOT SET UP</div>
                </>
              )}
            </div>
            <div className="border-t border-border/50 pt-4">
              <Link href="/dashboard/profile" className="text-[10px] uppercase tracking-[0.2em] text-foreground hover:text-accent transition-colors flex items-center gap-1">
                EDIT PROFILE ↗
              </Link>
            </div>
          </div>

          {/* Right panel: Quick Actions */}
          <div className="bg-foreground text-background md:col-span-3 p-8 lg:p-10 flex flex-col border-l border-border">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-12">
              § QUICK ACTIONS
            </div>
            <div className="flex flex-col">
              <button onClick={handleRunAnalysis} className="group flex items-center justify-between py-4 border-b border-background/20 text-[10px] uppercase tracking-[0.2em] text-background hover:text-accent transition-colors text-left">
                <span className="flex items-center gap-2"><TrendingUp className="w-3 h-3" /> RUN ANALYSIS</span>
                <ArrowRight className="w-3 h-3 -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <Link href="/dashboard/pathways" className="group flex items-center justify-between py-4 border-b border-background/20 text-[10px] uppercase tracking-[0.2em] text-background hover:text-accent transition-colors">
                <span className="flex items-center gap-2"><Target className="w-3 h-3" /> EXPLORE CAREER PATHWAYS</span>
                <ArrowRight className="w-3 h-3 -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
              <Link href="/dashboard/history" className="group flex items-center justify-between py-4 border-b border-background/20 text-[10px] uppercase tracking-[0.2em] text-background hover:text-accent transition-colors">
                <span className="flex items-center gap-2"><BookOpen className="w-3 h-3" /> VIEW HISTORY</span>
                <ArrowRight className="w-3 h-3 -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
              <Link href="/dashboard/profile" className="group flex items-center justify-between py-4 text-[10px] uppercase tracking-[0.2em] text-background hover:text-accent transition-colors">
                <span className="flex items-center gap-2">+ EDIT PROFILE</span>
                <ArrowRight className="w-3 h-3 -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Bottom panel: Analysis Log */}
          <div className="bg-background md:col-span-12 p-8 lg:p-12 border-t border-border flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  § ANALYSIS LOG
                </div>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground">History</h2>
              </div>
              {history.length > 0 && (
                <Link href="/dashboard/history" className="text-[10px] uppercase tracking-[0.2em] text-foreground hover:text-accent transition-colors flex items-center gap-1">
                  ALL →
                </Link>
              )}
            </div>

            {history.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <p className="font-serif text-3xl text-muted-foreground mb-8">No analyses yet.</p>
                <Link
                  href="/dashboard/profile"
                  className="inline-flex items-center justify-center bg-foreground text-background px-6 py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-foreground/90 transition-colors"
                >
                  BUILD PROFILE
                </Link>
              </div>
            ) : (
              <div className="space-y-0 border border-border divide-y divide-border">
                {history.slice(0, 5).map((entry) => {
                  const date = new Date(entry.date)
                  const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
                  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                  return (
                    <Link key={entry.id} href="/dashboard/analysis" className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-background hover:bg-muted/30 transition-colors group cursor-pointer">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="font-serif text-xl group-hover:text-accent transition-colors">{entry.targetRole}</span>
                          <span className={`text-[10px] uppercase tracking-[0.2em] font-mono font-bold ${
                            entry.readinessScore >= 70 ? 'text-green-600' : entry.readinessScore >= 40 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {entry.readinessScore}% READY
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{entry.summary}</p>
                      </div>
                      <div className="flex items-center gap-6 mt-3 md:mt-0 shrink-0">
                        <div className="text-right">
                          <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground">{formatted}</div>
                          <div className="text-[10px] font-mono text-muted-foreground">{time}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
