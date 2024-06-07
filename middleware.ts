import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';
import { clerkMiddleware } from '@clerk/nextjs/server';

const publicRoutes = ['/api/webhooks/clerk'];

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent
) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  // Check if the path is a public route
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // If not a public route, use the Clerk middleware
  return clerkMiddleware(req, event);
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
