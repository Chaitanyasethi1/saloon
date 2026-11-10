import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets and API passes through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Allow unrestricted access to public paths
  const publicPaths = ["/", "/login", "/register", "/forgot-password", "/salon", "/display", "/token"];
  const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (isPublic) {
    return NextResponse.next();
  }

  // Dashboard role protection headers
  const response = NextResponse.next();
  response.headers.set("x-queuewise-path", pathname);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
