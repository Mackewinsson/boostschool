import type { Metadata } from "next";
import { BookingPageView } from "@/components/landing/booking-page";
import { getLandingContent } from "@/lib/landing-content";
import { getLocaleFromCookies } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const { bookingPage } = getLandingContent(locale);

  return {
    title: bookingPage.metadata.title,
    description: bookingPage.metadata.description,
  };
}

export default async function ReservaPage() {
  const locale = await getLocaleFromCookies();

  return <BookingPageView locale={locale} />;
}
