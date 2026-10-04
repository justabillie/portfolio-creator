import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth";

const SESSION_COOKIE = "portfolio_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const payload = token ? await verifySessionToken(token) : null;

  const isAuthPage = pathname === "/login" || pathname === "/register";

  // Protect dashboard
  if (pathname.startsWith("/dashboard") && !payload) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from login/register to dashboard
  if (isAuthPage && payload) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Only apply to auth-protected pages. Nothing about /demo, /u/*, or /.
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
