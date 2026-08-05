import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { WhatsAppCta } from "@/components/landing/whatsapp-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { getLandingContent } from "@/lib/landing-content";
import { serviceLandingJsonLd } from "@/lib/seo/json-ld";
import type { SeoLandingContent } from "@/lib/seo/seo-landings";
import { siteName } from "@/lib/site-config";
import { externalLinkProps } from "@/lib/site-links";

type SeoLandingPageProps = {
  content: SeoLandingContent;
};

export function SeoLandingPage({ content }: SeoLandingPageProps) {
  const { brand, contact, nav, ui } = getLandingContent(content.chromeLocale);
  const bookingLinkProps = externalLinkProps(content.ctaHref);

  const jsonLd = serviceLandingJsonLd({
    course: {
      name: content.course.name,
      description: content.course.description,
      url: content.path,
      inLanguage: content.course.inLanguage,
      priceFromEur: 0,
    },
    faqs: content.faqs,
    breadcrumbs: [
      { name: siteName, path: "/" },
      { name: content.title, path: content.path },
    ],
  });

  return (
    <div className="min-h-screen bg-canvas text-fg">
      <JsonLd data={jsonLd} />
      <Navbar locale={content.chromeLocale} brand={brand} nav={nav} ui={ui} />

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-brand-to/20 blur-[140px]" />
        <div className="pointer-events-none absolute -left-40 top-40 h-[500px] w-[500px] rounded-full bg-brand-from/15 blur-[140px]" />

        <div className="relative mx-auto max-w-3xl px-4 pb-20 pt-24 sm:px-6 lg:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted transition hover:text-accent"
          >
            <span aria-hidden="true">←</span>
            {content.backLabel}
          </Link>

          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {content.label}
          </p>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {content.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-fg-muted sm:text-lg">
            {content.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={content.ctaHref}
              className="btn-glow inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              {...bookingLinkProps}
            >
              {content.ctaLabel}
            </a>
            <Link
              href={content.secondaryCtaHref}
              className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-fg transition hover:border-accent/40 hover:text-accent"
            >
              {content.secondaryCtaLabel}
            </Link>
          </div>

          <div className="mt-12 space-y-5 text-base leading-relaxed text-fg-muted">
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>

          <section className="mt-14" aria-labelledby="seo-highlights">
            <h2 id="seo-highlights" className="text-xl font-bold tracking-tight">
              {content.highlightsTitle}
            </h2>
            <ul className="mt-6 space-y-4">
              {content.highlights.map((item) => (
                <li
                  key={item.title}
                  className="flex gap-3 rounded-2xl border border-border bg-card p-5"
                >
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-semibold text-fg">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-fg-muted">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14" aria-labelledby="seo-faq">
            <h2 id="seo-faq" className="text-xl font-bold tracking-tight">
              {content.faqTitle}
            </h2>
            <div className="mt-6 space-y-4">
              {content.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-border bg-card px-5 py-4"
                >
                  <summary className="cursor-pointer list-none font-semibold text-fg marker:content-none [&::-webkit-details-marker]:hidden">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <div className="mt-12 rounded-2xl border border-brand-from/30 bg-card p-6 text-center sm:p-8">
            <p className="text-lg font-bold text-fg">{content.ctaLabel}</p>
            <a
              href={content.ctaHref}
              className="btn-glow mt-5 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              {...bookingLinkProps}
            >
              {content.ctaLabel}
            </a>
          </div>

          {content.relatedLink ? (
            <p className="mt-6 text-center text-sm text-fg-muted">
              <Link
                href={content.relatedLink.href}
                className="font-medium text-accent transition hover:underline"
              >
                {content.relatedLink.label}
              </Link>
            </p>
          ) : null}

          <WhatsAppCta whatsapp={contact.whatsapp} />
        </div>
      </main>
    </div>
  );
}
