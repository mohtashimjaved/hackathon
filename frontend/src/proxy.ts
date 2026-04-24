import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js 16 Proxy File (formerly Middleware)
 * Handles redirection logic based on authentication state.
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Define public routes that logged-in users should NOT see
  const authRoutes = ['/login', '/register'];

  // If user is logged in and tries to access login/register, redirect to dashboard
  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Optional: Redirect non-logged-in users from protected routes
  // const protectedRoutes = ['/dashboard', '/feed', '/requests', '/leaderboard'];
  // if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}

// Configuration for the proxy
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
