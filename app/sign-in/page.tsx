import type { Metadata } from "next";
import { LanguageToggle } from "@/components/landing/language-toggle";
import { SignInForm } from "@/components/student/sign-in-form";
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
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-canvas px-4 py-16 text-fg [color-scheme:dark]">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <LanguageToggle locale={locale} ariaLabel={portal.languageToggleAria} />
      </div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">{portal.signInTitle}</h1>
        <p className="mt-2 text-sm text-fg-muted">{portal.signInSubtitle}</p>
      </div>
      <SignInForm copy={portal} />
    </div>
  );
}
