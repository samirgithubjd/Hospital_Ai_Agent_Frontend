import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/login'];
const adminRoutes = ['/dashboard', '/calls', '/patients', '/appointments', '/ai-settings', '/settings'];
const doctorRoutes = ['/doctor'];
const patientRoutes = ['/patient'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  const path = request.nextUrl.pathname;

  // Check if route is public
  if (publicRoutes.includes(path)) {
    // If user is already logged in, redirect to appropriate dashboard
    if (token) {
      switch (userRole) {
        case 'doctor':
          return NextResponse.redirect(new URL('/doctor/dashboard', request.url));
        case 'patient':
          return NextResponse.redirect(new URL('/patient/dashboard', request.url));
        case 'admin':
        default:
          return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  // Protected routes - require token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based route protection
  if (adminRoutes.some(route => path === route || path.startsWith(route + '/'))) {
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (doctorRoutes.some(route => path.startsWith(route + '/'))) {
    if (userRole !== 'doctor') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (patientRoutes.some(route => path.startsWith(route + '/'))) {
    if (userRole !== 'patient') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
