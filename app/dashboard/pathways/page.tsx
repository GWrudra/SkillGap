import { createClient } from "@/lib/supabase/server"
import { LearningPathways } from "@/components/dashboard/learning-pathways"

export default async function PathwaysPage() {
  const supabase = await createClient()

  if (!supabase) {
    // Dummy data when Supabase is not configured
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Learning Pathways
          </h1>
          <p className="text-muted-foreground">
            Curated learning resources to help you close your skill gaps.
          </p>
        </div>

        <LearningPathways
          userId="demo"
          learningPaths={[]}
        />
      </div>
    )
  }

  const { data: { user } } = await supabase.auth.getUser()

  const { data: learningPaths } = await supabase
    .from("learning_paths")
    .select("*")
    .eq("user_id", user?.id)
    .order("priority", { ascending: true })

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Learning Pathways
        </h1>
        <p className="text-muted-foreground">
          Curated learning resources to help you close your skill gaps.
        </p>
      </div>

      <LearningPathways
        userId={user!.id}
        learningPaths={learningPaths || []}
      />
    </div>
  )
}
