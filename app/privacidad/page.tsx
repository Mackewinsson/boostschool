import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/landing/navbar";
import { getLandingContent } from "@/lib/landing-content";
import { getPrivacyContent } from "@/lib/legal/privacy-content";
import { getLocaleFromCookies } from "@/lib/locale-server";
import { siteUrl } from "@/lib/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const content = getPrivacyContent(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: content.metadata.title,
    description: content.metadata.description,
    alternates: {
      canonical: "/privacidad",
    },
  };
}

export default async function PrivacidadPage() {
  const locale = await getLocaleFromCookies();
  const { brand, nav, ui } = getLandingContent(locale);
  const content = getPrivacyContent(locale);

  return (
    <div className="min-h-screen bg-canvas text-fg">
      <Navbar locale={locale} brand={brand} nav={nav} ui={ui} />

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-24 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted transition hover:text-accent"
        >
          <span aria-hidden="true">←</span>
          {content.backLabel}
        </Link>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {content.title}
        </h1>
        <p className="mt-2 text-sm text-fg-muted">{content.lastUpdated}</p>

        <div className="prose prose-invert mt-8 max-w-none space-y-4 text-base leading-relaxed text-fg-soft">
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </main>
    </div>
  );
}
