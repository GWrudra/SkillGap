import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/dashboard/profile-form"

export default async function ProfilePage() {
  const supabase = await createClient()

  if (!supabase) {
    // Dummy data when Supabase is not configured
    return (
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Your Profile
          </h1>
          <p className="text-muted-foreground">
            Update your information and career goals to get personalized recommendations.
          </p>
        </div>

        <ProfileForm user={{ id: "demo", email: "demo@example.com" }} initialProfile={null} />
      </div>
    )
  }

  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single()

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Your Profile
        </h1>
        <p className="text-muted-foreground">
          Update your information and career goals to get personalized recommendations.
        </p>
      </div>

      <ProfileForm user={user!} initialProfile={profile} />
    </div>
  )
}
