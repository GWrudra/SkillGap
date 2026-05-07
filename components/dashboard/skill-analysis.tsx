"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, Sparkles, AlertCircle, Target, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  full_name: string | null
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

interface SkillAnalysisProps {
  user: User
  profile: Profile | null
  skillGaps: SkillGap[]
}

// Simulated AI analysis - in production, this would call an AI API
const analyzeSkills = async (targetRole: string, currentSkills: string[]) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Role-specific skill requirements (simulated)
  const roleRequirements: Record<string, { skill: string; required: number }[]> = {
    "software engineer": [
      { skill: "JavaScript", required: 8 },
      { skill: "TypeScript", required: 7 },
      { skill: "React", required: 8 },
      { skill: "Node.js", required: 7 },
      { skill: "Git", required: 8 },
      { skill: "System Design", required: 6 },
      { skill: "Testing", required: 7 },
      { skill: "CI/CD", required: 5 },
    ],
    "product manager": [
      { skill: "Product Strategy", required: 8 },
      { skill: "User Research", required: 7 },
      { skill: "Data Analysis", required: 7 },
      { skill: "Agile/Scrum", required: 8 },
      { skill: "Roadmap Planning", required: 8 },
      { skill: "Stakeholder Management", required: 7 },
      { skill: "Technical Understanding", required: 6 },
    ],
    "data scientist": [
      { skill: "Python", required: 9 },
      { skill: "Machine Learning", required: 8 },
      { skill: "Statistics", required: 8 },
      { skill: "SQL", required: 7 },
      { skill: "Data Visualization", required: 7 },
      { skill: "Deep Learning", required: 6 },
      { skill: "Feature Engineering", required: 7 },
    ],
    default: [
      { skill: "Communication", required: 8 },
      { skill: "Problem Solving", required: 8 },
      { skill: "Leadership", required: 6 },
      { skill: "Time Management", required: 7 },
      { skill: "Technical Skills", required: 7 },
    ],
  }

  const normalizedRole = targetRole.toLowerCase()
  let requirements = roleRequirements.default

  for (const [role, reqs] of Object.entries(roleRequirements)) {
    if (normalizedRole.includes(role)) {
      requirements = reqs
      break
    }
  }

  // Calculate skill gaps
  const gaps = requirements.map(req => {
    const hasSkill = currentSkills.some(s => 
      s.toLowerCase().includes(req.skill.toLowerCase()) ||
      req.skill.toLowerCase().includes(s.toLowerCase())
    )
    const currentLevel = hasSkill ? Math.floor(Math.random() * 3) + 4 : Math.floor(Math.random() * 3) + 1
    const gap = req.required - currentLevel

    let severity: string
    if (gap >= 4) severity = "high"
    else if (gap >= 2) severity = "medium"
    else severity = "low"

    return {
      skill_name: req.skill,
      current_level: currentLevel,
      required_level: req.required,
      gap_severity: severity,
    }
  })

  // Calculate readiness score
  const totalRequired = requirements.reduce((sum, r) => sum + r.required, 0)
  const totalCurrent = gaps.reduce((sum, g) => sum + g.current_level, 0)
  const readinessScore = Math.round((totalCurrent / totalRequired) * 100)

  return { gaps, readinessScore }
}

export function SkillAnalysis({ user, profile, skillGaps }: SkillAnalysisProps) {
  const [analyzing, setAnalyzing] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const runAnalysis = async () => {
    if (!profile?.target_role) return

    setAnalyzing(true)

    try {
      const { gaps, readinessScore } = await analyzeSkills(
        profile.target_role,
        profile.current_skills || []
      )

      if (supabase) {
        // Delete existing skill gaps
        await supabase
          .from("skill_gaps")
          .delete()
          .eq("user_id", user.id)

        // Insert new skill gaps
        const gapsToInsert = gaps.map(gap => ({
          user_id: user.id,
          ...gap,
        }))

        await supabase.from("skill_gaps").insert(gapsToInsert)

        // Update readiness score
        await supabase
          .from("profiles")
          .update({ readiness_score: readinessScore })
          .eq("id", user.id)

        // Generate learning paths
        await generateLearningPaths(gaps)
      }

      router.refresh()
    } catch (error) {
      console.error("Analysis error:", error)
    }

    setAnalyzing(false)
  }

  const generateLearningPaths = async (gaps: typeof skillGaps) => {
    if (!supabase) return

    // Delete existing learning paths
    await supabase
      .from("learning_paths")
      .delete()
      .eq("user_id", user.id)

    // Generate paths based on gaps
    const paths = gaps
      .filter(g => g.gap_severity !== "low")
      .map((gap, index) => ({
        user_id: user.id,
        title: `Master ${gap.skill_name}`,
        description: `Comprehensive learning path to improve your ${gap.skill_name} skills from level ${gap.current_level} to ${gap.required_level}.`,
        resource_url: `https://www.google.com/search?q=learn+${encodeURIComponent(gap.skill_name)}+course`,
        estimated_hours: (gap.required_level - gap.current_level) * 10,
        priority: index + 1,
        is_completed: false,
      }))

    if (paths.length > 0) {
      await supabase.from("learning_paths").insert(paths)
    }
  }

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

  if (!profile?.target_role) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Set Your Target Role First
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Before we can analyze your skill gaps, you need to define your career goal.
          </p>
          <Button asChild>
            <Link href="/dashboard/profile">
              Update Profile
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Analysis Action Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI-Powered Analysis
          </CardTitle>
          <CardDescription>
            Analyze your skills against the requirements for {profile.target_role}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Current Skills: {(profile.current_skills || []).join(", ") || "None specified"}
              </p>
            </div>
            <Button onClick={runAnalysis} disabled={analyzing}>
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {skillGaps.length > 0 ? "Re-run Analysis" : "Run Analysis"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {skillGaps.length > 0 && (
        <>
          {/* Readiness Score */}
          <Card>
            <CardHeader>
              <CardTitle>Readiness Score</CardTitle>
              <CardDescription>
                How prepared you are for {profile.target_role}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Progress value={profile.readiness_score || 0} className="h-4" />
                </div>
                <span className="text-3xl font-bold text-primary">
                  {profile.readiness_score || 0}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Skill Gaps Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Gap Breakdown</CardTitle>
              <CardDescription>
                Detailed analysis of each skill requirement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {skillGaps.map((gap) => (
                  <div key={gap.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className={`w-4 h-4 ${getSeverityColor(gap.gap_severity)}`} />
                        <span className="font-medium text-foreground">{gap.skill_name}</span>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getSeverityBg(gap.gap_severity)} ${getSeverityColor(gap.gap_severity)}`}>
                        {gap.gap_severity} priority
                      </span>
                    </div>
                    <div className="relative">
                      <div className="flex h-3 rounded-full bg-muted overflow-hidden">
                        <div
                          className="bg-primary/50 transition-all"
                          style={{ width: `${(gap.current_level / 10) * 100}%` }}
                        />
                        <div
                          className="bg-primary/20"
                          style={{ width: `${((gap.required_level - gap.current_level) / 10) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Current: {gap.current_level}/10</span>
                        <span>Required: {gap.required_level}/10</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
