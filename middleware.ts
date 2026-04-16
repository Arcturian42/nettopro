import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    // Protect admin routes
    if (pathname.startsWith("/admin")) {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      // Not logged in - redirect to login
      if (!token) {
        const loginUrl = new URL("/connexion", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Not admin - redirect to home
      if (token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Protect dashboard routes
    if (pathname.startsWith("/tableau-de-bord")) {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token) {
        const loginUrl = new URL("/connexion", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // On error, allow the request to proceed to avoid blocking users
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin/:path*", "/tableau-de-bord/:path*"],
};
