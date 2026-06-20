import Link from "next/link";
import { getLandingContent } from "@/lib/landing-content";
import type { Locale } from "@/lib/locale";
import { CalEmbed } from "./cal-embed";
import { Navbar } from "./navbar";
import { WhatsAppCta } from "./whatsapp-cta";

type BookingPageViewProps = {
  locale: Locale;
};

export function BookingPageView({ locale }: BookingPageViewProps) {
  const { bookingPage, brand, contact, nav, ui } = getLandingContent(locale);

  return (
    <div className="min-h-screen bg-canvas text-fg">
      <Navbar locale={locale} brand={brand} nav={nav} ui={ui} />

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-24 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted transition hover:text-accent"
        >
          <span aria-hidden="true">←</span>
          {bookingPage.backLabel}
        </Link>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {bookingPage.title}
        </h1>
        <p className="mt-3 text-base text-fg-muted">{bookingPage.subtitle}</p>

        <div className="mt-8">
          <CalEmbed
            fallbackText={bookingPage.fallbackText}
            contactLabel={contact.title}
          />
        </div>

        <WhatsAppCta whatsapp={contact.whatsapp} />
      </main>
    </div>
  );
}
