import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

const isTeacherRoute = createRouteMatcher([
  "/alumno/profesor(.*)",
  "/api/alumno/materials(.*)",
  "/api/alumno/assignments(.*)",
  "/api/alumno/students(.*)",
]);

const isStudentRoute = createRouteMatcher([
  "/alumno(.*)",
  "/api/alumno/my-materials(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    await auth.protect();
  } else if (isTeacherRoute(req)) {
    await auth.protect();
  } else if (isStudentRoute(req)) {
    await auth.protect();
  }

  // Exposes the current pathname to Server Components (e.g. the root layout)
  // via `headers()`, since Next.js has no other way to read it there. Used to
  // set the correct `<html lang>` for fixed-language SEO landing pages.
  const response = NextResponse.next();
  response.headers.set("x-pathname", req.nextUrl.pathname);
  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
