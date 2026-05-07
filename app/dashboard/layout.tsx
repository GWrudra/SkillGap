import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardNavbar } from "@/components/dashboard/navbar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  let user = null
  if (supabase) {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    user = authUser
  } else {
    // Demo user when Supabase not configured
    user = { id: "demo", email: "demo@example.com" }
  }

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardNavbar user={user} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
