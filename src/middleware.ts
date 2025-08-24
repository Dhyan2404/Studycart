
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // --- Admin Authentication Logic ---
  const sessionToken = request.cookies.get('auth_token')?.value;
  const isAccessingAdmin = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  if (isAccessingAdmin && !isLoginPage && !sessionToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (isLoginPage && sessionToken) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }
  
  // --- Visitor Cookie Logic ---
  // Ensure a visitor ID is set for tracking purchases
  let visitorId = request.cookies.get('visitorId')?.value;
  if (!visitorId) {
    visitorId = uuidv4();
    // Use the existing response object to set the cookie
    response.cookies.set('visitorId', visitorId, { 
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
      sameSite: 'lax',
    });
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
