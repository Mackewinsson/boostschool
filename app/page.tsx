import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";
import { JsonLd } from "@/components/seo/json-ld";
import { getLandingContent } from "@/lib/landing-content";
import { getLocaleFromCookies } from "@/lib/locale-server";
import { homeJsonLd } from "@/lib/seo/json-ld";
import { siteName, siteUrl } from "@/lib/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const { metadata } = getLandingContent(locale);

  return {
    metadataBase: new URL(siteUrl),
    // Absolute avoids double brand from root title template (`%s | Bilingual Boost`).
    title: { absolute: `${metadata.title} | ${siteName}` },
    description: metadata.description,
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      title: `${metadata.title} | ${siteName}`,
      description: metadata.description,
      url: "/",
      siteName,
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${metadata.title} | ${siteName}`,
      description: metadata.description,
    },
  };
}

export default async function Home() {
  const locale = await getLocaleFromCookies();

  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <LandingPage locale={locale} />
    </>
  );
}
