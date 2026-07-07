import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";
import { getLandingContent } from "@/lib/landing-content";
import { getLocaleFromCookies } from "@/lib/locale-server";
import { siteName, siteUrl } from "@/lib/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const { metadata } = getLandingContent(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: "/",
      siteName,
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
    },
  };
}

export default async function Home() {
  const locale = await getLocaleFromCookies();

  return <LandingPage locale={locale} />;
}
