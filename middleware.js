import { NextResponse } from "next/server";

// Routes that require authentication
const PROTECTED_PREFIXES = ["/admin", "/learner", "/superadmin"];

// Public routes that should NOT be redirected
const PUBLIC_ROUTES = ["/", "/login", "/register", "/contact", "/policy", "/terms"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip API routes and static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/logo") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if the route is protected
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Check for access token in cookies or Authorization header
  // Note: Since we're using localStorage for tokens (client-side),
  // the middleware primarily serves as a fallback guard.
  // The real auth check happens in the AuthContext on the client side.
  // For server-side protection, we'd need to switch to httpOnly cookies.
  //
  // For now, we allow the request through and let client-side AuthContext
  // handle the redirect. This can be enhanced later with cookie-based auth.

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
