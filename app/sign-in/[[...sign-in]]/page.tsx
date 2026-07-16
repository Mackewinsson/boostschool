import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { getStudentContent } from "@/lib/student-content";
import { getLocaleFromCookies } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const { portal } = getStudentContent(locale);

  return {
    title: portal.signInTitle,
    robots: { index: false, follow: false },
  };
}

export default async function SignInPage() {
  const locale = await getLocaleFromCookies();
  const { portal } = getStudentContent(locale);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 py-16 text-fg [color-scheme:dark]">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">{portal.signInTitle}</h1>
        <p className="mt-2 text-sm text-fg-muted">{portal.signInSubtitle}</p>
      </div>
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-in"
        forceRedirectUrl="/alumno/redirect"
        fallbackRedirectUrl="/alumno/redirect"
      />
    </div>
  );
}
