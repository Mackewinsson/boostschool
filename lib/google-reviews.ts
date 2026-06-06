export type GoogleReview = {
  id: string;
  authorName: string;
  authorPhotoUri?: string;
  rating: number;
  text: string;
  relativeTime: string;
};

type PlacesReview = {
  name?: string;
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: { text?: string };
  authorAttribution?: {
    displayName?: string;
    photoUri?: string;
  };
};

const PLACE_LAT = 52.244203;
const PLACE_LNG = 21.2776013;
const TEXT_QUERY = "Bilingual Boost";

async function resolvePlaceId(apiKey: string): Promise<string | null> {
  const configured = process.env.GOOGLE_PLACE_ID?.trim();
  if (configured) {
    return configured.startsWith("places/") ? configured.slice(7) : configured;
  }

  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "places.id",
    },
    body: JSON.stringify({
      textQuery: TEXT_QUERY,
      locationBias: {
        circle: {
          center: { latitude: PLACE_LAT, longitude: PLACE_LNG },
          radius: 1000,
        },
      },
    }),
    next: { revalidate: 86_400 },
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { places?: { id?: string }[] };
  const rawId = data.places?.[0]?.id;
  if (!rawId) {
    return null;
  }

  return rawId.startsWith("places/") ? rawId.slice(7) : rawId;
}

export async function fetchGoogleReviews(): Promise<GoogleReview[] | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  const placeId = await resolvePlaceId(apiKey);
  if (!placeId) {
    return null;
  }

  const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "reviews",
    },
    next: { revalidate: 86_400 },
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { reviews?: PlacesReview[] };
  const reviews = data.reviews ?? [];

  return reviews
    .filter((review) => review.text?.text && review.authorAttribution?.displayName)
    .map((review, index) => ({
      id: review.name ?? `review-${index}`,
      authorName: review.authorAttribution!.displayName!,
      authorPhotoUri: review.authorAttribution?.photoUri,
      rating: review.rating ?? 5,
      text: review.text!.text!,
      relativeTime: review.relativePublishTimeDescription ?? "",
    }));
}
