import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/seo-landing-page";
import { spanishClassesLanding } from "@/lib/seo/seo-landings";
import { siteName, siteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: spanishClassesLanding.metadata.title,
  description: spanishClassesLanding.metadata.description,
  alternates: {
    canonical: spanishClassesLanding.path,
  },
  openGraph: {
    title: spanishClassesLanding.metadata.title,
    description: spanishClassesLanding.metadata.description,
    url: spanishClassesLanding.path,
    siteName,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: spanishClassesLanding.metadata.title,
    description: spanishClassesLanding.metadata.description,
  },
};

export default function SpanishClassesPage() {
  return <SeoLandingPage content={spanishClassesLanding} />;
}
