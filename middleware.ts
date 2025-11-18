import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/cepalab'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const cookie = req.cookies.get('otp_validated_at');
  if (!cookie) {
    const url = new URL('/auth/login', req.url);
    return NextResponse.redirect(url);
  }

  try {
    const ts = new Date(decodeURIComponent(cookie.value)).getTime();
    const now = Date.now();
    const diffMs = now - ts;
    const oneDayMs = 24 * 60 * 60 * 1000;
    if (isNaN(ts) || diffMs > oneDayMs) {
      const url = new URL('/auth/login', req.url);
      return NextResponse.redirect(url);
    }
  } catch {
    const url = new URL('/auth/login', req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cepalab/:path*'],
};