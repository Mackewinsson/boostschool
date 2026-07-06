import Link from "next/link";
import { FileDown } from "lucide-react";
import { LeadMagnetForm } from "@/components/landing/lead-magnet-form";
import { Navbar } from "@/components/landing/navbar";
import { getLandingContent } from "@/lib/landing-content";
import type { Locale } from "@/lib/locale";

type LeadMagnetPageViewProps = {
  locale: Locale;
};

export function LeadMagnetPageView({ locale }: LeadMagnetPageViewProps) {
  const { leadMagnetPage, brand, nav, ui } = getLandingContent(locale);

  return (
    <div className="min-h-screen bg-canvas text-fg">
      <Navbar locale={locale} brand={brand} nav={nav} ui={ui} />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted transition hover:text-accent"
        >
          <span aria-hidden="true">←</span>
          {leadMagnetPage.backLabel}
        </Link>

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              {leadMagnetPage.label}
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {leadMagnetPage.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-fg-muted">
              {leadMagnetPage.subtitle}
            </p>
            <ul className="mt-6 space-y-3">
              {leadMagnetPage.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-3 text-sm leading-relaxed text-fg-muted"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-from/20 text-accent">
                    <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-brand-from/30 bg-card p-6 sm:p-8">
            <LeadMagnetForm
              locale={locale}
              copy={leadMagnetPage.form}
              idPrefix="page-lead"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
