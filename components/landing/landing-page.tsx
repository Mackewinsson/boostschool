import {
  BarChart3,
  Briefcase,
  Check,
  Clock,
  Compass,
  MessageSquare,
  Star,
  Users,
} from "lucide-react";
import { Navbar } from "./navbar";
import {
  brand,
  faqs,
  features,
  hero,
  nav,
  outcomes,
  plans,
  stats,
  testimonials,
} from "@/lib/landing-content";

// Icon sets para features y outcomes (orden coincide con los arrays en landing-content)
const featureIcons = [MessageSquare, Users, Clock];
const outcomeIcons = [Briefcase, Compass, BarChart3];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas text-white">
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20">
        {/* Blobs decorativos — consumen tokens de tema */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-[700px] w-[700px] rounded-full bg-brand-to/20 blur-[140px]" />
        <div className="pointer-events-none absolute top-10 -left-40 h-[600px] w-[600px] rounded-full bg-brand-from/15 blur-[140px]" />

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-20 lg:px-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            <span className="text-sm font-semibold text-accent">{brand.badge}</span>
          </div>

          {/* Headline */}
          <h1 className="mt-7 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Habla inglés con{" "}
            <span className="bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">
              confianza
            </span>{" "}
            en menos tiempo
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            {hero.subtitle}
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a
              href="#planes"
              className="btn-glow inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-7 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02] sm:w-auto"
            >
              {hero.primaryCta}
            </a>
            <a
              href="#programas"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:bg-white/10 sm:w-auto"
            >
              {hero.secondaryCta}
            </a>
          </div>

          {/* Stats */}
          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
              >
                <p className="text-3xl font-extrabold text-accent">{stat.value}</p>
                <p className="mt-1.5 text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────── */}
      <section id="programas" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Metodología
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">
          Aprende con una metodología pensada para hablar, no memorizar
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = featureIcons[i];
            return (
              <article
                key={feature.title}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-from/25 hover:bg-white/[0.05]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-from/20 to-brand-to/20 text-accent">
                  <Icon size={20} />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
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
        className="border-y border-white/[0.05] bg-white/[0.02] py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-alt">
                Resultados
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Resultados que se sienten en tu vida profesional y personal
              </h2>
            </div>
            <a
              href="#planes"
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-accent-alt/30 bg-brand-to/10 px-5 py-2.5 text-sm font-semibold text-accent-alt transition-all duration-300 hover:bg-brand-to/20"
            >
              Unirme a {brand.name}
            </a>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {outcomes.map((outcome, i) => {
              const Icon = outcomeIcons[i];
              return (
                <article
                  key={outcome.title}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-to/25 hover:bg-white/[0.05]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-to/20 to-brand-from/20 text-accent-alt">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{outcome.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
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
          Historias reales
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">
          Miles de estudiantes ya dieron el salto con {brand.name}
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <article
              key={t.name}
              className="flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-from/20"
            >
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-300">
                &quot;{t.quote}&quot;
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-from to-brand-to text-sm font-bold text-white">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────── */}
      <section
        id="planes"
        className="border-y border-white/[0.05] bg-white/[0.02] py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Planes
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{plans.title}</h2>
            <p className="mt-4 text-base text-slate-400">{plans.description}</p>
          </div>

          <div className="mx-auto mt-10 max-w-md">
            <div className="card-glow relative rounded-3xl border border-brand-from/30 bg-white/[0.04] p-8">
              {/* Overlay de gradiente interno */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-from/10 via-transparent to-brand-to/10" />
              <div className="relative">
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  {plans.monthlyLabel}
                </p>
                <p className="mt-2 text-5xl font-extrabold text-white">
                  {plans.monthlyPrice}
                </p>
                <p className="mt-1 text-sm text-slate-400">por mes · sin permanencia</p>

                <ul className="mt-7 space-y-3">
                  {plans.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                      <Check size={16} className="mt-0.5 shrink-0 text-accent" />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#"
                  className="btn-glow mt-8 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-6 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02]"
                >
                  {plans.cta}
                </a>
                <p className="mt-4 text-center text-xs text-slate-500">{plans.note}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section id="faq" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Preguntas frecuentes
        </p>
        <h2 className="mt-3 max-w-xl text-3xl font-bold sm:text-4xl">
          Resolvemos tus dudas
        </h2>
        <div className="mt-8 space-y-3">
          {faqs.map((faq) => (
            <article
              key={faq.question}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 transition-all duration-300 hover:border-white/[0.1]"
            >
              <h3 className="font-semibold text-white">{faq.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA BANNER ────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-from/40 via-white/5 to-brand-to/40 p-px">
          <div className="relative overflow-hidden rounded-3xl bg-canvas-up px-8 py-14 text-center sm:px-16">
            <div className="pointer-events-none absolute left-1/2 top-0 h-60 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-from/20 blur-[80px]" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-40 w-60 rounded-full bg-brand-to/15 blur-[60px]" />
            <h2 className="relative text-3xl font-extrabold sm:text-4xl">
              Tu próximo nivel en inglés{" "}
              <span className="bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">
                empieza hoy
              </span>
            </h2>
            <p className="relative mt-4 text-slate-400">
              Únete a miles de personas que ya cambiaron su historia con {brand.name}.
            </p>
            <a
              href="#planes"
              className="btn-glow relative mt-8 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02]"
            >
              Quiero inscribirme ahora
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] bg-canvas">
        <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pb-10 lg:px-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <span className="text-lg font-extrabold text-white">
                {brand.name.split(" ")[0]}
              </span>
              <span className="ml-1.5 text-lg font-extrabold bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">
                {brand.name.split(" ")[1]}
              </span>
              <p className="mt-1 text-sm text-slate-500">
                © {new Date().getFullYear()} {brand.name}. Todos los derechos reservados.
              </p>
            </div>
            <nav className="flex flex-wrap gap-5">
              {nav.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </footer>

      {/* ── MOBILE STICKY CTA ───────────────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-canvas/90 px-4 py-3 backdrop-blur-md sm:hidden">
        <a
          href="#planes"
          className="btn-glow inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-6 py-3 text-sm font-semibold text-white transition active:scale-[0.99]"
        >
          Empezar en {brand.name}
        </a>
      </div>
    </div>
  );
}
