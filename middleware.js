import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

/**
 * middleware.js
 * Demonstrates: Protected Routes, Authorization, Session Management
 * Runs at the Edge Runtime for fast authentication checks
 */

// Routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/report/new", "/profile", "/admin"];
// Routes that require admin role
const ADMIN_ROUTES     = ["/admin"];
// Routes that require officer or admin
const OFFICER_ROUTES   = ["/cases"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if route needs protection
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAdmin     = ADMIN_ROUTES.some((r)     => pathname.startsWith(r));
  const isOfficer   = OFFICER_ROUTES.some((r)   => pathname.startsWith(r));

  if (!isProtected && !isAdmin && !isOfficer) {
    return NextResponse.next();
  }

  const token = request.cookies.get("cybetron_token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifyToken(token);

  if (!payload) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("cybetron_token");
    return response;
  }

  // Admin route check
  if (isAdmin && payload.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Officer route check
  if (isOfficer && !["officer", "admin"].includes(payload.role)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Inject user info into headers for downstream use
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id",   payload.userId);
  requestHeaders.set("x-user-role", payload.role);
  requestHeaders.set("x-user-name", payload.name);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/report/new",
    "/profile/:path*",
    "/admin/:path*",
    "/cases/:path*",
  ],
};

