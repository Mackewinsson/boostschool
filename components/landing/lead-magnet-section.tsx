import { FileDown } from "lucide-react";
import { getLandingContent } from "@/lib/landing-content";
import type { Locale } from "@/lib/locale";
import { LeadMagnetForm } from "./lead-magnet-form";

type LeadMagnetSectionProps = {
  locale: Locale;
};

export function LeadMagnetSection({ locale }: LeadMagnetSectionProps) {
  const { leadMagnetSection } = getLandingContent(locale);

  return (
    <section
      id="recursos"
      className="border-y border-section-border bg-section py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              {leadMagnetSection.label}
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-bold sm:text-4xl">
              {leadMagnetSection.title}
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-fg-muted">
              {leadMagnetSection.description}
            </p>
            <ul className="mt-6 space-y-3">
              {leadMagnetSection.bullets.map((bullet) => (
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

          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <LeadMagnetForm locale={locale} copy={leadMagnetSection.form} idPrefix="home-lead" />
          </div>
        </div>
      </div>
    </section>
  );
}
