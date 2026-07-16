import reviewsJson from "@/data/google-reviews.json";
import { siteLinks } from "@/lib/site-links";

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

/** @deprecated Prefer StaticReview / getReviewsPlaceData for the landing cards */
export type GoogleReview = {
  id: string;
  authorName: string;
  authorPhotoUri?: string;
  rating: number;
  text: string;
  relativeTime: string;
};

export function getReviewsPlaceData(): ReviewsPlaceData | null {
  if (!reviewsJson.reviews?.length) {
    return null;
  }

  return {
    name: reviewsJson.name,
    rating: reviewsJson.rating,
    totalReviews: reviewsJson.totalReviews,
    mapsUrl: siteLinks.googleReviewsUrl,
    reviews: reviewsJson.reviews,
  };
}

/** Kept for optional live Places API use; landing prefers static JSON. */
export async function fetchGoogleReviews(): Promise<GoogleReview[] | null> {
  const place = getReviewsPlaceData();
  if (!place) {
    return null;
  }

  return place.reviews.map((review, index) => ({
    id: `static-${index}`,
    authorName: review.author,
    rating: review.rating,
    text: review.text,
    relativeTime: review.relativeTime,
  }));
}
