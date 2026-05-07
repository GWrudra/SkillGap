import { createClient } from "@/lib/supabase/server"
import { SkillAnalysis } from "@/components/dashboard/skill-analysis"

export default async function AnalysisPage() {
  const supabase = await createClient()

  if (!supabase) {
    // Dummy data when Supabase is not configured
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Skill Gap Analysis
          </h1>
          <p className="text-muted-foreground">
            Analyze your skills against your target role and identify areas for improvement.
          </p>
        </div>
        <SkillAnalysis profile={null} skillGaps={[]} />
      </div>
    )
  }

  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single()

  const { data: skillGaps } = await supabase
    .from("skill_gaps")
    .select("*")
    .eq("user_id", user?.id)
    .order("gap_severity", { ascending: false })

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Skill Gap Analysis
        </h1>
        <p className="text-muted-foreground">
          Analyze your skills against your target role and identify areas for improvement.
        </p>
      </div>

      <SkillAnalysis
        user={user!}
        profile={profile}
        skillGaps={skillGaps || []}
      />
    </div>
  )
}
