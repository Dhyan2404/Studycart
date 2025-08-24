import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  const isAccessingAdmin = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  // If trying to access any admin page (except login) without a token, redirect to login
  if (isAccessingAdmin && !isLoginPage && !sessionToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If trying to access login page WITH a token, redirect to dashboard
  if (isLoginPage && sessionToken) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
