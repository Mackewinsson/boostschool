import type { Metadata } from "next";
import { BookingPageView } from "@/components/landing/booking-page";
import { getLandingContent } from "@/lib/landing-content";
import { getLocaleFromCookies } from "@/lib/locale-server";
import { siteName, siteUrl } from "@/lib/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const { bookingPage } = getLandingContent(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: bookingPage.metadata.title,
    description: bookingPage.metadata.description,
    alternates: {
      canonical: "/reserva",
    },
    openGraph: {
      title: bookingPage.metadata.title,
      description: bookingPage.metadata.description,
      url: "/reserva",
      siteName,
      type: "website",
    },
  };
}

export default async function ReservaPage() {
  const locale = await getLocaleFromCookies();

  return <BookingPageView locale={locale} />;
}
