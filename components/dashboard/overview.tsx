"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Target, BookOpen, TrendingUp, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
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

export function DashboardOverview({ user, profile, skillGaps, learningPaths }: OverviewProps) {
  const readinessScore = profile?.readiness_score || 0
  const completedPaths = learningPaths.filter(p => p.is_completed).length
  const totalPaths = learningPaths.length

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-destructive"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-primary"
      default:
        return "text-muted-foreground"
    }
  }

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-destructive/10"
      case "medium":
        return "bg-yellow-100"
      case "low":
        return "bg-primary/10"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Welcome back, {profile?.full_name || user.user_metadata?.full_name || "there"}!
        </h1>
        <p className="text-muted-foreground">
          {"Here's an overview of your career readiness and learning progress."}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <span className="text-2xl font-bold text-foreground">{readinessScore}%</span>
            </div>
            <p className="text-sm font-medium text-foreground">Readiness Score</p>
            <Progress value={readinessScore} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <span className="text-2xl font-bold text-foreground">{skillGaps.length}</span>
            </div>
            <p className="text-sm font-medium text-foreground">Skill Gaps</p>
            <p className="text-xs text-muted-foreground mt-1">
              {skillGaps.filter(g => g.gap_severity === "high").length} high priority
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <span className="text-2xl font-bold text-foreground">{totalPaths}</span>
            </div>
            <p className="text-sm font-medium text-foreground">Learning Paths</p>
            <p className="text-xs text-muted-foreground mt-1">
              {completedPaths} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                {totalPaths > 0 ? Math.round((completedPaths / totalPaths) * 100) : 0}%
              </span>
            </div>
            <p className="text-sm font-medium text-foreground">Progress</p>
            <p className="text-xs text-muted-foreground mt-1">Keep going!</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Target Role Card */}
        <Card>
          <CardHeader>
            <CardTitle>Target Role</CardTitle>
            <CardDescription>Your career goal</CardDescription>
          </CardHeader>
          <CardContent>
            {profile?.target_role ? (
              <div>
                <p className="text-xl font-semibold text-foreground mb-4">{profile.target_role}</p>
                <div className="flex items-center gap-2">
                  <Progress value={readinessScore} className="flex-1 h-3" />
                  <span className="text-sm font-medium text-primary">{readinessScore}% ready</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No target role set yet</p>
                <Button asChild>
                  <Link href="/dashboard/profile">Set Your Goal</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skill Gaps Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Skill Gaps</CardTitle>
              <CardDescription>Areas to focus on</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/analysis">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {skillGaps.length > 0 ? (
              <div className="space-y-4">
                {skillGaps.slice(0, 4).map((gap) => (
                  <div key={gap.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${getSeverityBg(gap.gap_severity)} flex items-center justify-center`}>
                        <AlertCircle className={`w-4 h-4 ${getSeverityColor(gap.gap_severity)}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{gap.skill_name}</p>
                        <p className="text-xs text-muted-foreground">
                          Level {gap.current_level} → {gap.required_level}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getSeverityBg(gap.gap_severity)} ${getSeverityColor(gap.gap_severity)}`}>
                      {gap.gap_severity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No skill gaps analyzed yet</p>
                <Button asChild>
                  <Link href="/dashboard/analysis">Run Analysis</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Learning Paths Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recommended Learning Paths</CardTitle>
              <CardDescription>Curated resources to close your skill gaps</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/pathways">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {learningPaths.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {learningPaths.slice(0, 4).map((path) => (
                  <div
                    key={path.id}
                    className={`p-4 rounded-lg border ${path.is_completed ? "bg-primary/5 border-primary/20" : "bg-card border-border"}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-foreground">{path.title}</h4>
                      {path.is_completed && (
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                    {path.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {path.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      {path.estimated_hours && (
                        <span className="text-xs text-muted-foreground">
                          {path.estimated_hours} hours
                        </span>
                      )}
                      {path.resource_url && (
                        <a
                          href={path.resource_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          Start Learning →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Complete your skill analysis to get personalized learning recommendations
                </p>
                <Button asChild>
                  <Link href="/dashboard/analysis">Start Analysis</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
