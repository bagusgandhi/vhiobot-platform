import { withAuth } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';

import { type NextRequest, NextResponse } from 'next/server';

export default withAuth({
  pages: {
    signIn: '/admin-login',
    error: undefined
  },
});

export async function middleware(req: NextRequest) {
  const token: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });


  const isAdminPage = req.nextUrl?.pathname.startsWith('/admin');


  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.rewrite(url);
  }

  if (isAdminPage && token?.account?.response?.role !== 'ADMINISTRATOR') {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.rewrite(url);
  }

  // User has access, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/chat'],
};
