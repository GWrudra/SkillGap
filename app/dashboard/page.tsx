import { createClient } from "@/lib/supabase/server"
import { DashboardOverview } from "@/components/dashboard/overview"

export default async function DashboardPage() {
  const supabase = await createClient()

  if (!supabase) {
    // Dummy data when Supabase is not configured
    return (
      <DashboardOverview
        user={{ id: "demo", email: "demo@example.com" }}
        profile={null}
        skillGaps={[]}
        learningPaths={[]}
      />
    )
  }

  const { data: { user } } = await supabase.auth.getUser()

  // Get profile data
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single()

  // Get skill gaps
  const { data: skillGaps } = await supabase
    .from("skill_gaps")
    .select("*")
    .eq("user_id", user?.id)
    .order("gap_severity", { ascending: false })

  // Get learning paths
  const { data: learningPaths } = await supabase
    .from("learning_paths")
    .select("*")
    .eq("user_id", user?.id)
    .order("priority", { ascending: true })

  return (
    <DashboardOverview
      user={user!}
      profile={profile}
      skillGaps={skillGaps || []}
      learningPaths={learningPaths || []}
    />
  )
}
