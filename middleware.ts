import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for age verification on NSFW routes
  if (pathname.startsWith('/nsfw') || pathname.includes('/nsfw')) {
    const ageVerified = request.cookies.get('age-verified')?.value === 'true';
    
    if (!ageVerified) {
      // Redirect to home with age verification modal
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('verify', 'true');
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
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