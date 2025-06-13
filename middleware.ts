import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define the path(s) you want to protect
const protectedPaths = ["/home"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path))

  if (isProtectedPath) {
    // Check for an auth token cookie (you must set this cookie after login)
    const authToken = request.cookies.get("auth-token")?.value

    if (!authToken) {
      // Redirect to login if not authenticated
      const url = new URL("/login", request.url)
      url.searchParams.set("from", pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/home/:path*"],
}