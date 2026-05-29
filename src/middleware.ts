import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'
import { updateSession } from '@/lib/supabase/middleware'

const intlMiddleware = createMiddleware(routing)

const protectedRoutes = ['/dashboard', '/profile', '/scan', '/history']

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // First: refresh Supabase auth session
  const supabaseResponse = await updateSession(request)

  // Check if this is a protected route (strip locale prefix for comparison)
  const pathnameWithoutLocale = pathname.replace(/^\/(de|en)/, '') || '/'
  const isProtected = protectedRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  )

  if (isProtected) {
    // Check for auth cookie presence (session token)
    const hasAuthCookie = request.cookies.getAll().some(
      (cookie) => cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')
    )

    if (!hasAuthCookie) {
      const locale = pathname.match(/^\/(de|en)/)?.[1] || routing.defaultLocale
      const loginUrl = new URL(`/${locale}/login`, request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Apply i18n routing (handles locale detection, redirects)
  const intlResponse = intlMiddleware(request)

  // Merge Supabase cookies into the i18n response
  if (supabaseResponse && intlResponse) {
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      intlResponse.cookies.set(cookie.name, cookie.value)
    })
  }

  return intlResponse
}

export const config = {
  matcher: [
    // Match all pathnames except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
