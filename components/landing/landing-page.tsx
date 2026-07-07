import {
  BarChart3,
  Briefcase,
  Clock,
  Compass,
  MessageSquare,
  Users,
} from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";
import { getLandingContent } from "@/lib/landing-content";
import type { Locale } from "@/lib/locale";
import {
  externalLinkProps,
  resolveHrefKey,
  siteLinks,
} from "@/lib/site-links";
import { GoogleReviewsEmbed } from "./google-reviews-embed";
import { BlogSection } from "@/components/blog/blog-section";
import { LeadMagnetSection } from "@/components/landing/lead-magnet-section";
import { LinkedLineText } from "./linked-line";
import { PricingFeatures } from "./pricing-features";
import { ContactForm } from "./contact-form";
import { Navbar } from "./navbar";

// Íconos de sección (orden = orden del array en landing-content)
const featureIcons = [MessageSquare, Users, Clock];
const outcomeIcons = [Briefcase, Compass, BarChart3];

const bookingLinkProps = externalLinkProps(siteLinks.booking);

type LandingPageProps = {
  locale: Locale;
};

export function LandingPage({ locale }: LandingPageProps) {
  const {
    about,
    brand,
    contact,
    faqSection,
    faqs,
    features,
    featuresSection,
    finalCta,
    hero,
    mobileStickyCta,
    nav,
    outcomes,
    outcomesSection,
    plans,
    plansSection,
    stats,
    testimonialsEmbed,
    testimonialsSection,
    ui,
  } = getLandingContent(locale);

  return (
    <div className="min-h-screen bg-canvas text-fg">
      <Navbar locale={locale} brand={brand} nav={nav} ui={ui} />

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[700px] w-[700px] rounded-full bg-brand-to/20 blur-[140px]" />
        <div className="pointer-events-none absolute -left-40 top-10 h-[600px] w-[600px] rounded-full bg-brand-from/15 blur-[140px]" />

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-20 lg:px-10">
          {/* Badge */}
          <a
            href={siteLinks.booking}
            className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 transition-all duration-200 hover:border-accent/40 hover:bg-accent/15"
            {...bookingLinkProps}
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            <span className="text-sm font-semibold text-accent">{brand.badge}</span>
          </a>

          {/* Headline */}
          <h1 className="mt-7 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            {hero.titleBefore}
            <span className="bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">
              {hero.titleHighlight}
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg">
            {hero.subtitle}
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a
              href={siteLinks.booking}
              className="btn-glow inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-7 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02] sm:w-auto"
              {...bookingLinkProps}
            >
              {hero.primaryCta}
            </a>
            <a
              href="#programas"
              className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-card px-7 py-3.5 text-base font-semibold text-fg transition-all duration-300 hover:bg-card-hover sm:w-auto"
            >
              {hero.secondaryCta}
            </a>
          </div>

          {/* Stats */}
          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => {
              const statHref = stat.hrefKey
                ? resolveHrefKey(stat.hrefKey)
                : undefined;
              const content = (
                <>
                  <p className="text-3xl font-extrabold text-accent">{stat.value}</p>
                  <p className="mt-1.5 text-sm text-fg-muted">{stat.label}</p>
                </>
              );

              if (statHref) {
                return (
                  <a
                    key={stat.label}
                    href={statHref}
                    className="rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/25 hover:bg-card-hover"
                    {...externalLinkProps(statHref)}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5"
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ABOUT ───────────────────────────────────────────────── */}
      <section
        id="sobre-mi"
        className="border-y border-section-border bg-section py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {about.label}
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">{about.title}</h2>
          <div className="mt-10 grid items-start gap-8 md:grid-cols-2 md:gap-12">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <Image
                src="/paulina.png"
                alt={about.imageAlt}
                width={600}
                height={600}
                className="aspect-square w-full object-cover"
                priority
              />
            </div>
            <div className="space-y-4">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="text-sm leading-relaxed text-fg-muted sm:text-base">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────── */}
      <section id="programas" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          {featuresSection.label}
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">
          {featuresSection.title}
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = featureIcons[i];
            return (
              <article
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-from/25 hover:bg-card-hover"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-from/20 to-brand-to/20 text-accent">
                  <Icon size={20} />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── OUTCOMES ────────────────────────────────────────────── */}
      <section
        id="resultados"
        className="border-y border-section-border bg-section py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-alt">
                {outcomesSection.label}
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                {outcomesSection.title}
              </h2>
            </div>
            <a
              href={siteLinks.booking}
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-accent-alt/30 bg-brand-to/10 px-5 py-2.5 text-sm font-semibold text-accent-alt transition-all duration-300 hover:bg-brand-to/20"
              {...bookingLinkProps}
            >
              {outcomesSection.linkText}
            </a>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {outcomes.map((outcome, i) => {
              const Icon = outcomeIcons[i];
              return (
                <article
                  key={outcome.title}
                  className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-to/25 hover:bg-card-hover"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-to/20 to-brand-from/20 text-accent-alt">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{outcome.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                    {outcome.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────── */}
      <section
        id="testimonios"
        className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-10"
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          {testimonialsSection.label}
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">
          {testimonialsSection.title}
        </h2>
        <Suspense
          fallback={
            <p className="mt-10 text-center text-sm text-fg-muted">
              {testimonialsEmbed.fallbackText}
            </p>
          }
        >
          <GoogleReviewsEmbed embed={testimonialsEmbed} />
        </Suspense>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────── */}
      <section
        id="planes"
        className="border-y border-section-border bg-section py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              {plansSection.label}
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{plans.title}</h2>
            <p className="mt-4 text-base text-fg-muted">{plans.description}</p>
          </div>

          <div className="mx-auto mt-10 max-w-md">
            <div className="card-glow relative rounded-3xl border border-brand-from/30 bg-card p-8">
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-from/10 via-transparent to-brand-to/10" />
              <div className="relative">
                <p className="text-xs uppercase tracking-widest text-fg-muted">
                  {plans.monthlyLabel}
                </p>
                <p className="mt-2 text-5xl font-extrabold text-fg">
                  {plans.monthlyPrice}
                </p>
                <p className="mt-1 text-sm text-fg-muted">{plans.priceSubtext}</p>

                <div className="mt-7">
                  <PricingFeatures
                    features={plans.features}
                    classTypesLabel={plans.classTypesLabel}
                  />
                </div>

                <a
                  href={siteLinks.booking}
                  className="btn-glow mt-8 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-6 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02]"
                  {...bookingLinkProps}
                >
                  {plans.cta}
                </a>
                <p className="mt-4 text-center text-xs text-fg-faint">{plans.note}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LeadMagnetSection locale={locale} />

      <BlogSection locale={locale} />

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section id="faq" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          {faqSection.label}
        </p>
        <h2 className="mt-3 max-w-xl text-3xl font-bold sm:text-4xl">
          {faqSection.title}
        </h2>
        <div className="mt-8 space-y-3">
          {faqs.map((faq) => (
            <article
              key={faq.question}
              className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-border-strong hover:bg-card-hover"
            >
              <h3 className="font-semibold text-fg">{faq.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                <LinkedLineText line={faq.answer} />
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA BANNER ────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-from/40 via-border to-brand-to/40 p-px">
          <div className="relative overflow-hidden rounded-3xl bg-canvas-up px-8 py-14 text-center sm:px-16">
            <div className="pointer-events-none absolute left-1/2 top-0 h-60 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-from/20 blur-[80px]" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-40 w-60 rounded-full bg-brand-to/15 blur-[60px]" />
            <h2 className="relative text-3xl font-extrabold sm:text-4xl">
              {finalCta.titleBefore}
              <span className="bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">
                {finalCta.titleHighlight}
              </span>
            </h2>
            <p className="relative mt-4 text-fg-muted">{finalCta.subtitle}</p>
            <a
              href={siteLinks.booking}
              className="btn-glow relative mt-8 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02]"
              {...bookingLinkProps}
            >
              {finalCta.cta}
            </a>
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────── */}
      <section id="contacto" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          {contact.label}
        </p>
        <h2 className="mt-3 max-w-xl text-3xl font-bold sm:text-4xl">{contact.title}</h2>
        <p className="mt-4 max-w-lg text-base text-fg-muted">{contact.description}</p>

        <div className="mx-auto mt-10 max-w-lg">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <ContactForm locale={locale} copy={contact} />
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-canvas">
        <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pb-10 lg:px-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <span className="text-lg font-extrabold text-fg">
                {brand.name.split(" ")[0]}
              </span>
              <span className="ml-1.5 bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-lg font-extrabold text-transparent">
                {brand.name.split(" ")[1]}
              </span>
              <p className="mt-1 text-sm text-fg-faint">
                © {new Date().getFullYear()} {brand.name}. {ui.copyright}
              </p>
            </div>
            <nav className="flex flex-wrap gap-5">
              {nav.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-fg-muted transition hover:text-fg"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/privacidad"
                className="text-sm text-fg-muted transition hover:text-fg"
              >
                {ui.privacyLinkLabel}
              </a>
            </nav>
          </div>
        </div>
      </footer>

      {/* ── MOBILE STICKY CTA ───────────────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border-strong bg-canvas/90 px-4 py-3 backdrop-blur-md sm:hidden">
        <a
          href={siteLinks.booking}
          className="btn-glow inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-6 py-3 text-sm font-semibold text-white transition active:scale-[0.99]"
          {...bookingLinkProps}
        >
          {mobileStickyCta}
        </a>
      </div>
    </div>
  );
}
