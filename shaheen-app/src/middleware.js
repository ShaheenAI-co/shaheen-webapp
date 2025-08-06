import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Create the i18n middleware
const intlMiddleware = createMiddleware(routing);

// Define protected routes (customize as needed)
const isProtectedRoute = createRouteMatcher([
 '/(en|ar)/dashboard(.*)',
  '/(en|ar)/profile(.*)',


]);

export default clerkMiddleware(async (auth, req) => {
  // Skip internationalization for API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    // For API routes, only apply authentication if needed
    if (isProtectedRoute(req)) {
      await auth.protect();
    }
    return;
  }

  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  
  // Return the i18n middleware to handle internationalization
  return intlMiddleware(req);
});

export const config = {
  // Updated matcher that combines both patterns
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};