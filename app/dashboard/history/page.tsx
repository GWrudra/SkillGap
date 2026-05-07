"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react"

interface HistoryEntry {
  id: string
  date: string
  targetRole: string
  readinessScore: number
  skillGapsCount: number
  strengthsCount: number
  summary: string
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([])

  useEffect(() => {
    try {
      const hist = localStorage.getItem("skillgap_history")
      if (hist) setHistory(JSON.parse(hist))
    } catch {}
  }, [])

  const clearHistory = () => {
    localStorage.removeItem("skillgap_history")
    setHistory([])
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f9f7f2]">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
        
        <div className="mb-4">
          <Link href="/dashboard" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mb-8">
            <ArrowLeft className="w-3 h-3" /> BACK TO DASHBOARD
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-6">
              § ANALYSIS HISTORY
            </div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-none mb-4">
              Your history.
            </h1>
            <p className="text-muted-foreground">Every analysis you've run, tracked over time.</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 border border-border px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-red-600 hover:border-red-300 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> CLEAR ALL
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="border border-border bg-background p-16 flex flex-col items-center justify-center text-center">
            <p className="font-serif text-3xl text-muted-foreground mb-8">No analyses yet.</p>
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-foreground/90 transition-colors"
            >
              RUN YOUR FIRST ANALYSIS <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ) : (
          <div className="border border-border divide-y divide-border">
            {history.map((entry, i) => {
              const date = new Date(entry.date)
              const formatted = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
              const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
              
              return (
                <Link key={entry.id} href="/dashboard/analysis" className="block bg-background p-8 hover:bg-muted/30 transition-colors group cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3 flex-wrap">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground">
                          #{history.length - i}
                        </span>
                        <span className="font-serif text-2xl group-hover:text-accent transition-colors">{entry.targetRole}</span>
                        <span className={`text-[10px] uppercase tracking-[0.2em] font-mono font-bold px-3 py-1 ${
                          entry.readinessScore >= 70 
                            ? 'bg-green-100 text-green-800' 
                            : entry.readinessScore >= 40 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {entry.readinessScore}% READY
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{entry.summary}</p>
                      <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground">
                        <span>{entry.skillGapsCount} SKILL GAPS</span>
                        <span>{entry.strengthsCount} STRENGTHS</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="text-right">
                        <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground">{formatted}</div>
                        <div className="text-[10px] font-mono text-muted-foreground mt-1">{time}</div>
                        <div className="font-serif text-4xl mt-4">
                          {entry.readinessScore}<span className="text-lg text-muted-foreground">%</span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
