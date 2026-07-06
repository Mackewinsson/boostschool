import type { Metadata } from "next";
import { LeadMagnetPageView } from "@/components/landing/lead-magnet-page";
import { getLandingContent } from "@/lib/landing-content";
import { getLocaleFromCookies } from "@/lib/locale-server";
import { siteUrl } from "@/lib/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const { leadMagnetPage } = getLandingContent(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: leadMagnetPage.metadata.title,
    description: leadMagnetPage.metadata.description,
    alternates: {
      canonical: "/recursos",
    },
    openGraph: {
      title: leadMagnetPage.metadata.title,
      description: leadMagnetPage.metadata.description,
      url: "/recursos",
    },
  };
}

export default async function RecursosPage() {
  const locale = await getLocaleFromCookies();

  return <LeadMagnetPageView locale={locale} />;
}
