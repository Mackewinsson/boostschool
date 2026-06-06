"use client";

import { useRouter } from "next/navigation";
import {
  getNextLocale,
  LOCALE_COOKIE,
  type Locale,
} from "@/lib/locale";

type LanguageToggleProps = {
  locale: Locale;
  ariaLabel: string;
};

export function LanguageToggle({ locale, ariaLabel }: LanguageToggleProps) {
  const router = useRouter();

  const toggle = () => {
    const next = getNextLocale(locale);
    localStorage.setItem(LOCALE_COOKIE, next);
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;SameSite=Lax`;
    document.documentElement.lang = next;
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      aria-label={ariaLabel}
      className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-border-strong bg-card px-2 text-xs font-bold tracking-wide text-fg-muted transition-all duration-200 hover:bg-card-hover hover:text-fg"
    >
      {locale.toUpperCase()}
    </button>
  );
}
