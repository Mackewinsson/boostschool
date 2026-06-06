export type Locale = "es" | "en" | "pl";

export const LOCALES: Locale[] = ["es", "en", "pl"];
export const DEFAULT_LOCALE: Locale = "es";
export const LOCALE_COOKIE = "locale";

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function getNextLocale(current: Locale): Locale {
  const index = LOCALES.indexOf(current);
  return LOCALES[(index + 1) % LOCALES.length];
}
