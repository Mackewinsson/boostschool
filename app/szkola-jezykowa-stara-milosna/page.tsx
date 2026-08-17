import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/seo-landing-page";
import { szkolaJezykowaStaraMilosnaLanding } from "@/lib/seo/seo-landings";
import { siteName, siteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: szkolaJezykowaStaraMilosnaLanding.metadata.title,
  description: szkolaJezykowaStaraMilosnaLanding.metadata.description,
  alternates: {
    canonical: szkolaJezykowaStaraMilosnaLanding.path,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: szkolaJezykowaStaraMilosnaLanding.metadata.title,
    description: szkolaJezykowaStaraMilosnaLanding.metadata.description,
    url: szkolaJezykowaStaraMilosnaLanding.path,
    siteName,
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: szkolaJezykowaStaraMilosnaLanding.metadata.title,
    description: szkolaJezykowaStaraMilosnaLanding.metadata.description,
  },
};

export default function SzkolaJezykowaStaraMilosnaPage() {
  return <SeoLandingPage content={szkolaJezykowaStaraMilosnaLanding} />;
}
