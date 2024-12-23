import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken')?.value;

  // Exclude image requests from middleware processing
  if (req.nextUrl.pathname.startsWith('/_next/image') || req.nextUrl.pathname.match(/\.(png|jpg|jpeg|gif|svg)$/)) {
    return NextResponse.next();
  }

  // If the user is not logged in and is not already on the /login page
  if (!token && !req.nextUrl.pathname.startsWith('/login')) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
