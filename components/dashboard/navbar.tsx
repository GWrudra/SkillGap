"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

const navItems = [
  { href: "/dashboard/pathways", label: "PATHWAYS" },
  { href: "/dashboard", label: "DASHBOARD" },
  { href: "/dashboard/history", label: "HISTORY" },
]

export function DashboardNavbar({ user }: { user: SupabaseUser }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.push("/")
    router.refresh()
  }

  // Get current UTC time for the UI
  const now = new Date()
  const utcTime = `${now.getUTCHours().toString().padStart(2, '0')}:${now.getUTCMinutes().toString().padStart(2, '0')} UTC`
  const initials = user.user_metadata?.full_name 
    ? user.user_metadata.full_name.charAt(0).toUpperCase() 
    : user.email?.charAt(0).toUpperCase() || "U"

  return (
    <header className="w-full bg-background border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-foreground flex items-center justify-center">
            <span className="text-background font-mono text-[10px] font-bold tracking-wider">CG</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl leading-none">SkillGap.</span>
            <span className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground mt-1">Career Intelligence</span>
          </div>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[10px] uppercase tracking-[0.15em] transition-colors ${
                  isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          <span className="hidden md:inline text-[10px] uppercase tracking-[0.15em] text-accent">
            {utcTime}
          </span>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted flex items-center justify-center text-xs font-serif text-muted-foreground">
              {initials}
            </div>
            <span className="hidden md:inline text-[10px] uppercase tracking-[0.15em] text-foreground">
              {user.user_metadata?.full_name || "USER"}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
          >
            LOG OUT
          </button>
        </div>
      </div>
    </header>
  )
}
