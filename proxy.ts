import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const cookieRole = request.cookies.get("edubridge_role")?.value;
  const cookieToken = request.cookies.get("edubridge_token")?.value;
  const pathname = request.nextUrl.pathname;

  // Protected routes require authentication
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding")) {
    if (!cookieToken) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Role-based routing checks for dashboard
    if (pathname.startsWith("/dashboard/student") && cookieRole !== "student") {
      return NextResponse.redirect(new URL("/dashboard/" + cookieRole, request.url));
    }
    if (pathname.startsWith("/dashboard/volunteer") && cookieRole !== "volunteer") {
      return NextResponse.redirect(new URL("/dashboard/" + cookieRole, request.url));
    }
    if (pathname.startsWith("/dashboard/admin") && cookieRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard/" + cookieRole, request.url));
    }
    
    // Allow through
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*"],
};
