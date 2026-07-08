import Image from "next/image";
import Link from "next/link";
import { FileDown } from "lucide-react";
import { LeadMagnetForm } from "@/components/landing/lead-magnet-form";
import { getLandingContent } from "@/lib/landing-content";
import type { Locale } from "@/lib/locale";

type LeadMagnetPageViewProps = {
  locale: Locale;
};

export function LeadMagnetPageView({ locale }: LeadMagnetPageViewProps) {
  const { leadMagnetPage, about, stats, brand, ui } = getLandingContent(locale);

  return (
    <div className="min-h-screen bg-canvas text-fg">
      {/* Minimal header: logo only, no nav links to keep focus on the form */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="text-lg font-extrabold">
          <span className="text-fg">{brand.name.split(" ")[0]}</span>
          <span className="ml-1.5 bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">
            {brand.name.split(" ")[1]}
          </span>
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-fg-muted transition hover:text-accent"
        >
          {leadMagnetPage.backLabel}
        </Link>
      </header>

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-brand-to/20 blur-[140px]" />
        <div className="pointer-events-none absolute -left-40 top-40 h-[500px] w-[500px] rounded-full bg-brand-from/15 blur-[140px]" />

        {/* ── HERO + FORM ─────────────────────────────────────── */}
        <section className="relative mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 sm:pt-16">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                {leadMagnetPage.label}
              </p>
              <h1 className="mt-6 text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl">
                {leadMagnetPage.title}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">
                {leadMagnetPage.subtitle}
              </p>
              <ul className="mt-7 space-y-3.5">
                {leadMagnetPage.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-3 text-sm leading-relaxed text-fg-muted sm:text-base"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-from/20 text-accent">
                      <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-glow rounded-3xl border border-brand-from/30 bg-card p-6 sm:p-8 lg:sticky lg:top-8">
              <LeadMagnetForm
                locale={locale}
                copy={leadMagnetPage.form}
                idPrefix="page-lead"
              />
            </div>
          </div>
        </section>

        {/* ── TRUST ───────────────────────────────────────────── */}
        <section className="relative border-t border-section-border bg-section py-14">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
              <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-border sm:h-32 sm:w-32">
                <Image
                  src="/paulina.png"
                  alt={about.imageAlt}
                  width={256}
                  height={256}
                  className="aspect-square w-full object-cover"
                />
              </div>
              <div>
                <p className="text-lg font-bold text-fg">{about.title}</p>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted sm:text-base">
                  {about.paragraphs[0]}
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <p className="text-2xl font-extrabold text-accent">{stat.value}</p>
                  <p className="mt-1 text-sm text-fg-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-3 px-4 py-8 text-sm text-fg-faint sm:flex-row sm:items-center sm:px-6">
          <p>
            © {new Date().getFullYear()} {brand.name}. {ui.copyright}
          </p>
          <Link href="/privacidad" className="transition hover:text-fg">
            {ui.privacyLinkLabel}
          </Link>
        </div>
      </footer>
    </div>
  );
}
