const bilingualBoostWhatsappUrl = "https://wa.me/48515025685";

export const contactPhone = {
  display: "+48 515 025 685",
  whatsappUrl: bilingualBoostWhatsappUrl,
} as const;

const bilingualBoostCalLink = "paulina-łaczmanska-cozgba/clase-de-prueba";
const bilingualBoostCalNamespace = "clase-de-prueba";

const bilingualBoostMapsPlaceUrl =
  "https://www.google.com/maps/place/Bilingual+Boost/@52.244203,21.2776013,17z/data=!4m6!3m5!1s0x471ed780178a953d:0xa54f4b85291fa03e!8m2!3d52.244203!4d21.2776013!16s%2Fg%2F11npd2g9y4";

const bilingualBoostMapsEmbedUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d978.038624!2d21.2776013!3d52.244203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ed780178a953d%3A0xa54f4b85291fa03e!2sBilingual%20Boost!5e0!3m2!1sen!2spl!4v1718841600000!5m2!1sen!2spl";

export const siteLinks = {
  blog: "/blog",
  resources: "/recursos",
  booking: "/reserva",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL ?? contactPhone.whatsappUrl,
  contact: "#contacto",
  googleReviewsUrl:
    process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL ?? bilingualBoostMapsPlaceUrl,
  googleMapsEmbedUrl:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ?? bilingualBoostMapsEmbedUrl,
} as const;

export type LinkHrefKey = keyof Pick<
  typeof siteLinks,
  "booking" | "whatsapp" | "contact"
>;

export function getCalLink(): string | null {
  const direct = process.env.NEXT_PUBLIC_CAL_LINK?.trim();
  if (direct) {
    return direct.replace(/^\/+/, "");
  }

  const bookingUrl =
    process.env.NEXT_PUBLIC_BOOKING_URL?.trim() ??
    process.env.NEXT_PUBLIC_CALENDLY_URL?.trim();
  if (bookingUrl) {
    if (bookingUrl.startsWith("http")) {
      try {
        const { pathname } = new URL(bookingUrl);
        const slug = pathname.replace(/^\/+/, "");
        if (slug) {
          return slug;
        }
      } catch {
        // fall through to default
      }
    } else {
      const slug = bookingUrl.replace(/^\/+/, "");
      if (slug) {
        return slug;
      }
    }
  }

  return bilingualBoostCalLink;
}

export function getCalNamespace(): string {
  return process.env.NEXT_PUBLIC_CAL_NAMESPACE?.trim() || bilingualBoostCalNamespace;
}

export function resolveHrefKey(key: LinkHrefKey): string {
  return siteLinks[key];
}

export function isExternalHref(href: string): boolean {
  return href.startsWith("http");
}

/** Hash section links must point at the home page from any route. */
export function resolveNavHref(href: string): string {
  if (href.startsWith("#")) {
    return `/${href}`;
  }
  return href;
}

export function externalLinkProps(href: string) {
  return isExternalHref(href)
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};
}
