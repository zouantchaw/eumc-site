import { NextResponse } from "next/server";

export function middleware(request) {
  // Only apply to /api routes (except /api/auth)
  if (
    !request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname === "/api/auth"
  ) {
    return NextResponse.next();
  }

  // Check for admin session cookie
  const adminSession = request.cookies.get("admin_session");

  if (!adminSession) {
    // Instead of returning error body, redirect to admin login
    // or return 401 status without body
    const response = new NextResponse(null, {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
      },
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/((?!api/auth).*)"],
};
