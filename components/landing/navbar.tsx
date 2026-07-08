"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LandingContent } from "@/lib/landing-content";
import type { Locale } from "@/lib/locale";
import { externalLinkProps, resolveNavHref, siteLinks } from "@/lib/site-links";
import { PortalNavLink } from "./portal-nav-link";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";

type NavbarProps = {
  locale: Locale;
  brand: LandingContent["brand"];
  nav: LandingContent["nav"];
  ui: LandingContent["ui"];
};

const navLinkClass =
  "whitespace-nowrap text-xs font-medium text-fg-muted transition-colors duration-200 hover:text-fg lg:text-sm";

function NavLink({
  href,
  label,
  onClick,
  className = navLinkClass,
}: {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  const resolved = resolveNavHref(href);

  return (
    <Link href={resolved} onClick={onClick} className={className}>
      {label}
    </Link>
  );
}

export function Navbar({ locale, brand, nav, ui }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const bookingLinkProps = externalLinkProps(siteLinks.booking);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-border-nav bg-canvas/85 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 sm:px-6 lg:gap-3 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <span className="text-lg font-extrabold tracking-tight text-fg lg:text-xl">
            {brand.name.split(" ")[0]}
          </span>
          <span className="ml-1 bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-lg font-extrabold tracking-tight text-transparent lg:ml-1.5 lg:text-xl">
            {brand.name.split(" ")[1]}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Main"
          className="hidden min-w-0 flex-1 items-center justify-center gap-2 lg:flex xl:gap-3"
        >
          {nav.links.map((link) => (
            <NavLink key={`${link.href}-${link.label}`} href={link.href} label={link.label} />
          ))}
          <PortalNavLink
            portalLabel={ui.portalNavLabel}
            signInLabel={ui.signInNavLabel}
            className={navLinkClass}
          />
        </nav>

        {/* Desktop controls */}
        <div className="ml-auto flex shrink-0 items-center gap-2 lg:gap-3">
          <LanguageToggle locale={locale} ariaLabel={ui.languageToggleAria} />
          <ThemeToggle ariaLabel={ui.themeToggleAria} />
          <a
            href={siteLinks.booking}
            className="btn-glow hidden items-center justify-center rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-4 py-2 text-xs font-semibold text-white transition-all duration-300 hover:scale-[1.03] md:inline-flex lg:px-5 lg:py-2.5 lg:text-sm"
            {...bookingLinkProps}
          >
            {nav.ctaLabel}
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen(!open)}
          aria-label={ui.openMenuAria}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-strong bg-card text-fg-muted transition hover:bg-card-hover hover:text-fg lg:hidden"
        >
          {open ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M2 2l12 12M14 2L2 14" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M2 4h12M2 8h12M2 12h12" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${
          open ? "max-h-[min(32rem,85vh)] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-h-[min(32rem,85vh)] overflow-y-auto border-t border-border-nav bg-canvas/95 px-4 pb-5 pt-3 backdrop-blur-xl">
          <nav className="flex flex-col gap-1">
            {nav.links.map((link) => (
              <NavLink
                key={`${link.href}-${link.label}`}
                href={link.href}
                label={link.label}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-fg-soft transition hover:bg-card hover:text-fg"
              />
            ))}
            <PortalNavLink
              portalLabel={ui.portalNavLabel}
              signInLabel={ui.signInNavLabel}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-fg-soft transition hover:bg-card hover:text-fg"
              onClick={() => setOpen(false)}
            />
          </nav>
          <a
            href={siteLinks.booking}
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-5 py-3 text-sm font-semibold text-white"
            {...bookingLinkProps}
          >
            {nav.ctaLabel}
          </a>
        </div>
      </div>
    </header>
  );
}
