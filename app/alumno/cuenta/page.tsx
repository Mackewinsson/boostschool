import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/components/student/change-password-form";
import { getAuthContext, getPortalPathForRole } from "@/lib/materials/auth";
import { getStudentContent } from "@/lib/student-content";
import { getLocaleFromCookies } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const { portal } = getStudentContent(locale);

  return {
    title: portal.accountTitle,
    robots: { index: false, follow: false },
  };
}

export default async function AccountPasswordPage() {
  const locale = await getLocaleFromCookies();
  const context = await getAuthContext();
  if (!context) {
    redirect("/sign-in");
  }

  const { portal } = getStudentContent(locale);
  const areaHref = getPortalPathForRole(context.role);

  return (
    <section className="mt-8 max-w-xl">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        {portal.accountTitle}
      </h1>
      <p className="mt-3 text-base text-fg-muted">{portal.accountHint}</p>
      <ChangePasswordForm copy={portal} />
      <p className="mt-8">
        <Link
          href={areaHref}
          className="text-sm font-medium text-fg-muted transition hover:text-accent"
        >
          ← {portal.myArea}
        </Link>
      </p>
    </section>
  );
}
