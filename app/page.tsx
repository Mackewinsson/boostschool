import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";
import { getLandingContent } from "@/lib/landing-content";
import { getLocaleFromCookies } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const { metadata } = getLandingContent(locale);

  return {
    title: metadata.title,
    description: metadata.description,
  };
}

export default async function Home() {
  const locale = await getLocaleFromCookies();

  return <LandingPage locale={locale} />;
}
