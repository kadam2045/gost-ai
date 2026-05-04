import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

import { clerkAuthPaths } from "@/lib/clerk"

const isPublicRoute = createRouteMatcher([...clerkAuthPaths.publicRoutes])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
