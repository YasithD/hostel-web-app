import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isUserRoute = createRouteMatcher(["/dashboard(.*)"]);
const isPublicRoute = createRouteMatcher(["/login", "/sign-up", "/reset-password(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const currentUrl = new URL(req.url);
  const isApiRequest = currentUrl.pathname.startsWith("/api");
  const isAdminUser = sessionClaims?.metadata.role === "admin";

  // If authenticated
  if (userId) {
    if (isPublicRoute(req)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (isAdminRoute(req) && !isAdminUser) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (isUserRoute(req) && isAdminUser) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  // If not authenticated
  if (!userId) {
    if (!isPublicRoute(req) && !isApiRequest) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
