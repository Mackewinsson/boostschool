import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/seo-landing-page";
import { angielskiSulejowekLanding } from "@/lib/seo/seo-landings";
import { siteName, siteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: angielskiSulejowekLanding.metadata.title,
  description: angielskiSulejowekLanding.metadata.description,
  alternates: {
    canonical: angielskiSulejowekLanding.path,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: angielskiSulejowekLanding.metadata.title,
    description: angielskiSulejowekLanding.metadata.description,
    url: angielskiSulejowekLanding.path,
    siteName,
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: angielskiSulejowekLanding.metadata.title,
    description: angielskiSulejowekLanding.metadata.description,
  },
};

export default function AngielskiSulejowekPage() {
  return <SeoLandingPage content={angielskiSulejowekLanding} />;
}
