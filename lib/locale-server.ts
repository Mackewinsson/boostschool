import { cookies, headers } from "next/headers";
import { getPostLocale } from "./blog/posts";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from "./locale";
import { fixedLocaleLandingPaths } from "./seo/seo-landings";

export async function getLocaleFromCookies(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return value && isLocale(value) ? value : DEFAULT_LOCALE;
}

/**
 * Resolves the `<html lang>` for the current request. Most routes are
 * locale-agnostic (their content follows the visitor's `locale` cookie), but
 * a few routes always render fixed-language content (SEO landing pages, and
 * blog posts which only exist in one language). For those, the served
 * `lang` attribute must match the actual content language regardless of the
 * visitor's cookie — otherwise crawlers with no cookie (e.g. Googlebot) see a
 * mismatched `lang="es"` on English/Polish-only pages.
 */
export async function getHtmlLang(): Promise<Locale> {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "";

  const fixedLocale = fixedLocaleLandingPaths[pathname];
  if (fixedLocale) {
    return fixedLocale;
  }

  const blogMatch = pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (blogMatch) {
    const postLocale = await getPostLocale(blogMatch[1]);
    if (postLocale) {
      return postLocale;
    }
  }

  return getLocaleFromCookies();
}
