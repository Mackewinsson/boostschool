import { Star } from "lucide-react";
import Image from "next/image";
import type { LandingContent } from "@/lib/landing-content/types";
import { fetchGoogleReviews } from "@/lib/google-reviews";
import { externalLinkProps, siteLinks } from "@/lib/site-links";

type GoogleReviewsEmbedProps = {
  embed: LandingContent["testimonialsEmbed"];
};

function ReviewStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          fill={i < rating ? "currentColor" : "none"}
          className={i < rating ? "" : "text-fg-faint"}
        />
      ))}
    </div>
  );
}

function GoogleMapsEmbed({ embed }: GoogleReviewsEmbedProps) {
  return (
    <div className="mt-10">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <iframe
          src={siteLinks.googleMapsEmbedUrl}
          title={embed.mapEmbedTitle}
          className="h-[min(28rem,70vh)] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      {siteLinks.googleReviewsUrl && (
        <div className="mt-6 text-center">
          <a
            href={siteLinks.googleReviewsUrl}
            className="text-sm font-medium text-accent transition hover:text-accent-alt"
            {...externalLinkProps(siteLinks.googleReviewsUrl)}
          >
            {embed.viewAllLabel}
          </a>
        </div>
      )}

      <p className="mt-4 text-center text-xs text-fg-faint">{embed.poweredByLabel}</p>
    </div>
  );
}

function ReviewsFallback({ embed }: GoogleReviewsEmbedProps) {
  if (siteLinks.googleMapsEmbedUrl) {
    return <GoogleMapsEmbed embed={embed} />;
  }

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

export async function GoogleReviewsEmbed({ embed }: GoogleReviewsEmbedProps) {
  const reviews = await fetchGoogleReviews();

  if (!reviews?.length) {
    return <ReviewsFallback embed={embed} />;
  }

  return (
    <div className="mt-10">
      <div className="grid gap-5 md:grid-cols-3">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-from/20 hover:bg-card-hover"
          >
            <ReviewStars rating={review.rating} />
            <p className="mt-4 flex-1 text-sm leading-relaxed text-fg-soft">
              &quot;{review.text}&quot;
            </p>
            <div className="mt-5 flex items-center gap-3">
              {review.authorPhotoUri ? (
                <Image
                  src={review.authorPhotoUri}
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 shrink-0 rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-from to-brand-to text-sm font-bold text-white">
                  {review.authorName.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-fg">{review.authorName}</p>
                {review.relativeTime && (
                  <p className="text-xs text-fg-muted">{review.relativeTime}</p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {siteLinks.googleReviewsUrl && (
        <div className="mt-8 text-center">
          <a
            href={siteLinks.googleReviewsUrl}
            className="text-sm font-medium text-accent transition hover:text-accent-alt"
            {...externalLinkProps(siteLinks.googleReviewsUrl)}
          >
            {embed.viewAllLabel}
          </a>
        </div>
      )}

      <p className="mt-4 text-center text-xs text-fg-faint">{embed.poweredByLabel}</p>
    </div>
  );
}
