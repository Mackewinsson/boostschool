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
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
