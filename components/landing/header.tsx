"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

export function Header() {
  const [currentTime, setCurrentTime] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getUTCHours().toString().padStart(2, "0")
      const minutes = now.getUTCMinutes().toString().padStart(2, "0")
      setCurrentTime(`${hours}:${minutes} UTC`)
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center bg-foreground text-xs font-semibold tracking-tight text-primary-foreground">
            CG
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight">SkillGap.</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Career Intelligence</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link 
            href="/#features" 
            className="text-xs font-medium uppercase tracking-[0.15em] text-foreground/80 transition-colors hover:text-foreground"
          >
            Features
          </Link>
        </nav>

        {/* Right side */}
        <div className="hidden items-center gap-4 md:flex">
          <span className="text-xs text-muted-foreground">{currentTime}</span>
          <Link
            href="/auth/login"
            className="text-xs font-medium uppercase tracking-[0.1em] text-accent transition-colors hover:text-accent/80"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="flex items-center gap-2 bg-foreground px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] text-primary-foreground transition-colors hover:bg-foreground/90"
          >
            Begin Analysis
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="p-2 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background md:hidden">
          <div className="space-y-4 px-6 py-4">
            <Link
              href="/#features"
              className="block text-xs font-medium uppercase tracking-[0.15em] text-foreground/80"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <div className="flex flex-col gap-3 pt-4">
              <Link
                href="/auth/login"
                className="text-xs font-medium uppercase tracking-[0.1em] text-accent"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="flex w-full items-center justify-center gap-2 bg-foreground px-4 py-3 text-xs font-medium uppercase tracking-[0.1em] text-primary-foreground"
              >
                Begin Analysis
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
