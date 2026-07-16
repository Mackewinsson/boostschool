import type { LandingContent } from "@/lib/landing-content/types";
import type { Locale } from "@/lib/locale";
import {
  getReviewsPlaceData,
  type StaticReview,
} from "@/lib/google-reviews";
import { externalLinkProps, siteLinks } from "@/lib/site-links";

type GoogleReviewsEmbedProps = {
  locale: Locale;
  embed: LandingContent["testimonialsEmbed"];
};

const AVATAR_COLORS = [
  "#06b6d4",
  "#8b5cf6",
  "#0891b2",
  "#7c3aed",
  "#22d3ee",
  "#a78bfa",
  "#0e7490",
  "#6d28d9",
];

function formatLabel(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

function StarRating({
  rating,
  size = 14,
  ariaLabel,
}: {
  rating: number;
  size?: number;
  ariaLabel: string;
}) {
  return (
    <span className="inline-flex gap-0.5" aria-label={ariaLabel}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={star <= rating ? "#fbbf24" : "none"}
          stroke={star <= rating ? "#fbbf24" : "var(--fg-faint)"}
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ))}
    </span>
  );
}

function AuthorAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const bg = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
      style={{ background: bg }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="hidden h-5 w-5 shrink-0 opacity-50 sm:block"
      aria-hidden
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function ReviewCard({
  review,
  mapsUrl,
  ariaLabel,
  starsAriaLabel,
}: {
  review: StaticReview;
  mapsUrl: string;
  ariaLabel: string;
  starsAriaLabel: string;
}) {
  return (
    <a
      href={mapsUrl}
      aria-label={ariaLabel}
      className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-from/25 hover:bg-card-hover sm:p-5"
      {...externalLinkProps(mapsUrl)}
    >
      <div className="flex items-start gap-3">
        <AuthorAvatar name={review.author} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug text-fg">
            {review.author}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <StarRating
              rating={review.rating}
              size={14}
              ariaLabel={starsAriaLabel}
            />
            <span className="text-xs text-fg-faint">{review.relativeTime}</span>
          </div>
        </div>
        <GoogleMark />
      </div>
      {review.text ? (
        <p className="text-sm leading-relaxed text-fg-muted lg:line-clamp-4">
          {review.text}
        </p>
      ) : null}
    </a>
  );
}

function RatingSummary({
  rating,
  ratingCountText,
  mapsUrl,
  viewAllLabel,
  starsAriaLabel,
}: {
  rating: number;
  ratingCountText: string;
  mapsUrl: string;
  viewAllLabel: string;
  starsAriaLabel: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-brand-from/25 bg-gradient-to-br from-brand-from/20 via-card to-brand-to/20 p-5 text-center sm:flex-row sm:justify-between sm:gap-3 sm:p-6 sm:text-left">
      <div className="w-full sm:w-auto">
        <p className="text-3xl font-extrabold text-fg sm:text-4xl">
          {rating.toFixed(1)}
        </p>
        <div className="mt-1 flex justify-center sm:justify-start">
          <StarRating
            rating={Math.round(rating)}
            size={20}
            ariaLabel={starsAriaLabel}
          />
        </div>
        <p className="mt-1 text-sm text-fg-muted">{ratingCountText}</p>
      </div>
      <a
        href={mapsUrl}
        className="btn-glow inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-from to-brand-to px-5 py-3 text-sm font-bold text-white transition hover:scale-[1.02] sm:w-auto sm:py-2.5"
        {...externalLinkProps(mapsUrl)}
      >
        {viewAllLabel}
        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
        </svg>
      </a>
    </div>
  );
}

function ReviewsFallback({ embed }: Pick<GoogleReviewsEmbedProps, "embed">) {
  if (siteLinks.googleReviewsUrl) {
    return (
      <div className="mt-10 text-center">
        <a
          href={siteLinks.googleReviewsUrl}
          className="btn-glow inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02]"
          {...externalLinkProps(siteLinks.googleReviewsUrl)}
        >
          {embed.viewAllLabel}
        </a>
      </div>
    );
  }

  return (
    <p className="mt-10 text-center text-sm text-fg-muted">{embed.fallbackText}</p>
  );
}

export function GoogleReviewsEmbed({ locale, embed }: GoogleReviewsEmbedProps) {
  const place = getReviewsPlaceData(locale);

  if (!place) {
    return <ReviewsFallback embed={embed} />;
  }

  const ratingCountText = formatLabel(embed.ratingCountLabel, {
    count: place.totalReviews,
  });
  const summaryStarsLabel = formatLabel(embed.starsAriaLabel, {
    rating: Math.round(place.rating),
  });

  return (
    <div className="mt-10 space-y-6 sm:space-y-8">
      <RatingSummary
        rating={place.rating}
        ratingCountText={ratingCountText}
        mapsUrl={place.mapsUrl}
        viewAllLabel={embed.viewAllLabel}
        starsAriaLabel={summaryStarsLabel}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {place.reviews.map((review) => (
          <ReviewCard
            key={review.author}
            review={review}
            mapsUrl={place.mapsUrl}
            ariaLabel={formatLabel(embed.reviewAriaLabel, {
              author: review.author,
            })}
            starsAriaLabel={formatLabel(embed.starsAriaLabel, {
              rating: review.rating,
            })}
          />
        ))}
      </div>

      <p className="text-center text-xs text-fg-faint">{embed.poweredByLabel}</p>
    </div>
  );
}
