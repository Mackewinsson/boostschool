import { isLocale, type Locale } from "@/lib/locale";

export function isValidHttpsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function parseLocale(value: string | undefined): Locale {
  if (value && isLocale(value)) {
    return value;
  }
  return "es";
}
