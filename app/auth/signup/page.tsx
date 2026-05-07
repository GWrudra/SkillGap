"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Header } from "@/components/landing/header"

export default function SignUpPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!supabase) {
      setError("Authentication not configured.")
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
          `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push("/auth/signup-success")
    }
  }

  const handleGoogleSignUp = async () => {
    setError(null)
    if (!supabase) {
      setError("Authentication not configured.")
      return
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
          `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl lg:grid-cols-2">
        {/* Left Panel - Manifesto */}
        <div className="hidden bg-card p-12 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-8 flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">— Manifesto</span>
            </div>
            <h1 className="font-serif text-4xl leading-[1.15] tracking-tight lg:text-5xl">
              Career growth<br />deserves{" "}
              <em className="not-italic text-accent">precision</em>,<br />
              not platitudes.
            </h1>
            <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
              {"We don't sell motivation. We deliver an honest, quantified read of where you are and a clear roadmap of what comes next."}
            </p>
          </div>
          <div className="border-t border-border pt-6">
            <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Trusted by professionals across 47 countries.
            </span>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">— New Account</span>
            </div>
            <h2 className="mb-2 font-serif text-4xl">Begin.</h2>
            <p className="mb-8 text-muted-foreground">Two minutes to your first analysis.</p>

            {error && (
              <div className="mb-6 border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleSignUp}
              className="mb-6 flex w-full items-center justify-center gap-2 border border-border bg-background py-3 text-xs font-medium uppercase tracking-[0.1em] transition-colors hover:bg-muted"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-4 text-xs uppercase tracking-[0.1em] text-muted-foreground">Or with email</span>
              </div>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-[0.1em] text-muted-foreground">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-[0.1em] text-muted-foreground">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-xs uppercase tracking-[0.1em] text-muted-foreground">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="8+ chars, 1 number, 1 special"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full border border-border bg-background px-4 py-3 pr-12 text-sm placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 bg-foreground py-3 text-xs font-medium uppercase tracking-[0.1em] text-primary-foreground transition-colors hover:bg-foreground/90 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 7H11M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-xs text-muted-foreground">
              Already a member?{" "}
              <Link href="/auth/login" className="font-medium uppercase tracking-[0.05em] text-foreground underline-offset-4 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
