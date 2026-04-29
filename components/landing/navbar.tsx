"use client";

import { useEffect, useState } from "react";
import { brand, nav } from "@/lib/landing-content";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        {/* Logo */}
        <a href="#" className="flex shrink-0 items-center">
          <span className="text-xl font-extrabold tracking-tight text-fg">
            {brand.name.split(" ")[0]}
          </span>
          <span className="ml-1.5 bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
            {brand.name.split(" ")[1]}
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-fg-muted transition-colors duration-200 hover:text-fg"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop controls */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <a
            href="#planes"
            className="btn-glow inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03]"
          >
            Empezar gratis
          </a>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            aria-label="Abrir menú"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-strong bg-card text-fg-muted transition hover:bg-card-hover hover:text-fg"
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
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-border-nav bg-canvas/95 px-4 pb-5 pt-3 backdrop-blur-xl">
          <nav className="flex flex-col gap-1">
            {nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-fg-soft transition hover:bg-card hover:text-fg"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href="#planes"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-5 py-3 text-sm font-semibold text-white"
          >
            Empezar gratis
          </a>
        </div>
      </div>
    </header>
  );
}
