import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === '1'
  const bypassSecret = process.env.NEXT_PUBLIC_MAINTENANCE_BYPASS_SECRET
  
  // Allow all static files and admin routes
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/static') ||
    req.nextUrl.pathname.startsWith('/admin') ||
    req.nextUrl.pathname.startsWith('/auth/admin') ||
    req.nextUrl.pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // If maintenance mode is off, proceed normally
  if (!isMaintenanceMode) {
    return NextResponse.next()
  }

  // Check for bypass cookie (for emergency access)
  const bypassCookie = req.cookies.get('maintenance_bypass')
  if (bypassSecret && bypassCookie?.value === bypassSecret) {
    return NextResponse.next()
  }

  // Show maintenance page with proper headers
  return NextResponse.rewrite(new URL('/maintenance', req.url), {
    status: 503,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Retry-After': '3600',
    },
  })
}

// Match all routes except static files
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}