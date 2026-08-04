import reviewsJson from "@/data/google-reviews.json";
import { siteAuthor, siteName, siteUrl } from "@/lib/site-config";
import { siteLinks } from "@/lib/site-links";

const orgId = `${siteUrl}/#org`;
const personId = `${siteUrl}/#paulina`;
const websiteId = `${siteUrl}/#website`;

/** Google Maps coordinates for the Bilingual Boost place listing. */
export const businessGeo = {
  latitude: 52.244203,
  longitude: 21.2776013,
} as const;

export function organizationJsonLd() {
  return {
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": orgId,
    name: siteName,
    url: siteUrl,
    description:
      "Online English and Spanish classes with Paulina Poloca. Serving Sulejówek, Stara Miłosna, and students worldwide.",
    founder: { "@id": personId },
    areaServed: [
      { "@type": "City", "name": "Sulejówek" },
      { "@type": "City", "name": "Stara Miłosna" },
      { "@type": "City", "name": "Warszawa" },
      { "@type": "Country", "name": "Poland" },
      "Worldwide",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sulejówek",
      addressRegion: "Mazowieckie",
      addressCountry: "PL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: businessGeo.latitude,
      longitude: businessGeo.longitude,
    },
    telephone: "+48515025685",
    priceRange: "€€",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: reviewsJson.rating,
      reviewCount: reviewsJson.totalReviews,
      bestRating: 5,
      worstRating: 1,
    },
    sameAs: [siteLinks.googleReviewsUrl],
  };
}

export function personJsonLd() {
  return {
    "@type": "Person",
    "@id": personId,
    name: siteAuthor,
    jobTitle: "English and Spanish teacher",
    url: `${siteUrl}/#sobre-mi`,
    worksFor: { "@id": orgId },
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: siteUrl,
    name: siteName,
    inLanguage: ["es", "en", "pl"],
    publisher: { "@id": orgId },
  };
}

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [websiteJsonLd(), organizationJsonLd(), personJsonLd()],
  };
}

type CourseJsonLdInput = {
  name: string;
  description: string;
  url: string;
  inLanguage: string;
  priceFromEur?: number;
};

export function courseJsonLd({
  name,
  description,
  url,
  inLanguage,
  priceFromEur = 0,
}: CourseJsonLdInput) {
  const absoluteUrl = url.startsWith("http") ? url : `${siteUrl}${url}`;

  return {
    "@type": "Course",
    name,
    description,
    url: absoluteUrl,
    inLanguage,
    provider: { "@id": orgId },
    offers: {
      "@type": "Offer",
      price: String(priceFromEur),
      priceCurrency: "EUR",
      category: "Free trial lesson",
      url: `${siteUrl}${siteLinks.booking}`,
      availability: "https://schema.org/InStock",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      instructor: { "@id": personId },
    },
  };
}

type FaqEntry = { question: string; answer: string };

export function faqPageJsonLd(faqs: FaqEntry[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbListJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path.startsWith("http") ? item.path : `${siteUrl}${item.path}`,
    })),
  };
}

export function serviceLandingJsonLd(input: {
  course: CourseJsonLdInput;
  faqs: FaqEntry[];
  breadcrumbs: { name: string; path: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationJsonLd(),
      personJsonLd(),
      courseJsonLd(input.course),
      faqPageJsonLd(input.faqs),
      breadcrumbListJsonLd(input.breadcrumbs),
    ],
  };
}
