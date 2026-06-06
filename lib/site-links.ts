export const siteLinks = {
  calendly: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "#contacto",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "#contacto",
  contact: "#contacto",
  googleReviewsUrl: process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL ?? "",
} as const;

export type LinkHrefKey = keyof Pick<
  typeof siteLinks,
  "calendly" | "whatsapp" | "contact"
>;

export function resolveHrefKey(key: LinkHrefKey): string {
  return siteLinks[key];
}

export function isExternalHref(href: string): boolean {
  return href.startsWith("http");
}

export function externalLinkProps(href: string) {
  return isExternalHref(href)
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};
}
