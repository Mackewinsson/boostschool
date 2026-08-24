import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

function isTeacherRoute(pathname: string) {
  return (
    pathname.startsWith("/alumno/profesor") ||
    pathname.startsWith("/api/alumno/materials") ||
    pathname.startsWith("/api/alumno/assignments") ||
    pathname.startsWith("/api/alumno/students") ||
    pathname.startsWith("/api/alumno/parents")
  );
}

function isStudentPortalRoute(pathname: string) {
  return (
    pathname === "/alumno" ||
    pathname.startsWith("/alumno/redirect") ||
    pathname.startsWith("/api/alumno/my-materials")
  );
}

function isPrivateRoute(pathname: string) {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/alumno") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/api/")
  );
}

function unauthorizedApiResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);

  if (!isPrivateRoute(pathname)) {
    response.headers.delete("X-Robots-Tag");
    response.headers.set("X-Robots-Tag", "index, follow");
    return response;
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (pathname.startsWith("/sign-in")) {
    if (session) {
      const url = request.nextUrl.clone();
      url.pathname = "/alumno/redirect";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return response;
  }

  if (pathname.startsWith("/api/alumno/")) {
    if (!session) {
      return unauthorizedApiResponse();
    }
    if (isTeacherRoute(pathname) && session.role !== "teacher" && session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (
      pathname.startsWith("/api/alumno/my-materials") &&
      request.method === "PATCH" &&
      session.role === "parent"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return response;
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/alumno")) {
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      url.search = "";
      return NextResponse.redirect(url);
    }

    if (isTeacherRoute(pathname) && session.role !== "teacher" && session.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/alumno";
      url.search = "";
      return NextResponse.redirect(url);
    }

    if (
      isStudentPortalRoute(pathname) &&
      session.role !== "student" &&
      session.role !== "parent" &&
      !pathname.startsWith("/alumno/profesor")
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/alumno/profesor";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
