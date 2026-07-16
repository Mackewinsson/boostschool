import reviewsJson from "@/data/google-reviews.json";
import type { Locale } from "@/lib/locale";
import { siteLinks } from "@/lib/site-links";

type LocalizedString = Record<Locale, string>;

type RawReview = {
  author: string;
  rating: number;
  relativeTime: LocalizedString;
  text: LocalizedString;
};

export type StaticReview = {
  author: string;
  rating: number;
  text: string;
  relativeTime: string;
};

export type ReviewsPlaceData = {
  name: string;
  rating: number;
  totalReviews: number;
  mapsUrl: string;
  reviews: StaticReview[];
};

function pickLocalized(value: LocalizedString, locale: Locale): string {
  return value[locale] || value.es || value.en || value.pl || "";
}

export function getReviewsPlaceData(locale: Locale): ReviewsPlaceData | null {
  const reviews = reviewsJson.reviews as RawReview[];
  if (!reviews?.length) {
    return null;
  }

  return {
    name: reviewsJson.name,
    rating: reviewsJson.rating,
    totalReviews: reviewsJson.totalReviews,
    mapsUrl: siteLinks.googleReviewsUrl,
    reviews: reviews.map((review) => ({
      author: review.author,
      rating: review.rating,
      text: pickLocalized(review.text, locale),
      relativeTime: pickLocalized(review.relativeTime, locale),
    })),
  };
}
