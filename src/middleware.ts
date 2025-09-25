import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)", "/profile(.*)"]);
const isUserRoute = createRouteMatcher(["/dashboard(.*)", "/profile(.*)"]);
const isPublicRoute = createRouteMatcher(["/login", "/sign-up", "/"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Allow access to public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!userId) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Protect admin routes
  const role = (await auth()).sessionClaims?.metadata.role;
  if (isAdminRoute(req)) {
    if (role !== "admin") {
      const userUrl = new URL("/dashboard", req.url);
      return NextResponse.redirect(userUrl);
    }
  }

  // Protect user routes
  if (isUserRoute(req)) {
    if (role !== "user") {
      const adminUrl = new URL("/admin/dashboard", req.url);
      return NextResponse.redirect(adminUrl);
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
