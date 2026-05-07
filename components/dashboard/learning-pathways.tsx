"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Clock, ExternalLink, BookOpen, Target } from "lucide-react"
import Link from "next/link"

interface LearningPath {
  id: string
  title: string
  description: string | null
  resource_url: string | null
  estimated_hours: number | null
  priority: number
  is_completed: boolean
}

interface LearningPathwaysProps {
  userId: string
  learningPaths: LearningPath[]
}

export function LearningPathways({ userId, learningPaths }: LearningPathwaysProps) {
  const [paths, setPaths] = useState(learningPaths)
  const [updating, setUpdating] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const toggleCompletion = async (pathId: string, currentStatus: boolean) => {
    if (!supabase) return

    setUpdating(pathId)

    const { error } = await supabase
      .from("learning_paths")
      .update({ is_completed: !currentStatus })
      .eq("id", pathId)

    if (!error) {
      setPaths(paths.map(p => 
        p.id === pathId ? { ...p, is_completed: !currentStatus } : p
      ))
      router.refresh()
    }

    setUpdating(null)
  }

  const completedCount = paths.filter(p => p.is_completed).length
  const totalCount = paths.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  if (paths.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Learning Paths Yet
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Complete your skill gap analysis to receive personalized learning recommendations.
          </p>
          <Button asChild>
            <Link href="/dashboard/analysis">
              <Target className="w-4 h-4 mr-2" />
              Run Skill Analysis
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            {completedCount} of {totalCount} learning paths completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Progress value={progressPercent} className="h-3" />
            </div>
            <span className="text-2xl font-bold text-primary">{progressPercent}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Learning Paths List */}
      <div className="space-y-4">
        {paths.map((path) => (
          <Card
            key={path.id}
            className={path.is_completed ? "bg-primary/5 border-primary/20" : ""}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleCompletion(path.id, path.is_completed)}
                  disabled={updating === path.id}
                  className="mt-1 flex-shrink-0"
                >
                  {path.is_completed ? (
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={`font-semibold ${path.is_completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                        {path.title}
                      </h3>
                      {path.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {path.description}
                        </p>
                      )}
                    </div>
                    <span className="flex-shrink-0 text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      Priority {path.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    {path.estimated_hours && (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{path.estimated_hours} hours</span>
                      </div>
                    )}

                    {path.resource_url && (
                      <a
                        href={path.resource_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Start Learning</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Completion Message */}
      {completedCount === totalCount && totalCount > 0 && (
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="py-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Congratulations!
            </h3>
            <p className="text-muted-foreground mb-4">
              {"You've completed all your learning paths. Consider re-running your skill analysis to track your progress."}
            </p>
            <Button asChild>
              <Link href="/dashboard/analysis">Re-run Analysis</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
