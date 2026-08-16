import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase/proxy"

export async function middleware(request: NextRequest) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next()
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|sw\\.js|manifest\\.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}