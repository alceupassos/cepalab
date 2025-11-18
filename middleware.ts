import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicPaths = ["/auth/login", "/auth/error", "/api", "/_next", "/favicon.ico"];
  if (publicPaths.some((p) => pathname.startsWith(p))) return NextResponse.next();
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.redirect(new URL("/auth/login", request.url));
  const ts = Number((token as any).otpVerifiedAt || 0);
  const ok = Date.now() - ts < 24 * 60 * 60 * 1000;
  if (!ok) return NextResponse.redirect(new URL("/auth/login", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/(.*)"]
};