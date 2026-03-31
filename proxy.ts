import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't need protection
  const isAuthRoute = pathname.startsWith('/auth') || pathname === '/';
  
  // Example of how we check for role
  // We rely on a cookie 'edubridge_user_role' set by our login page
  const userRoleCookie = request.cookies.get('edubridge_user_role')?.value;
  
  // 1. If trying to access dashboard but no role cookie, back to login
  if (pathname.startsWith('/dashboard') && !userRoleCookie) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // 2. Route Protection Based on Role
  if (pathname.startsWith('/dashboard/admin') && userRoleCookie !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard/' + userRoleCookie, request.url));
  }
  
  if (pathname.startsWith('/dashboard/volunteer') && userRoleCookie !== 'volunteer') {
    // If Admin tries to view it, let them maybe? Let's just strictly enforce for now.
    if (userRoleCookie !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard/' + userRoleCookie, request.url));
    }
  }
  
  if (pathname.startsWith('/dashboard/student') && userRoleCookie !== 'student') {
    if (userRoleCookie !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard/' + userRoleCookie, request.url));
    }
  }

  // 3. Prevent authenticated users from going to /auth login again
  if (pathname.startsWith('/auth/login') && userRoleCookie) {
    return NextResponse.redirect(new URL(`/dashboard/${userRoleCookie}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
