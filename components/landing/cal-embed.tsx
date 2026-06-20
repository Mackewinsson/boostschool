"use client";

import Cal from "@calcom/embed-react";
import Link from "next/link";
import {
  contactPhone,
  externalLinkProps,
  getCalLink,
  siteLinks,
} from "@/lib/site-links";

type CalEmbedProps = {
  fallbackText: string;
  contactLabel: string;
};

export function CalEmbed({ fallbackText, contactLabel }: CalEmbedProps) {
  const calLink = getCalLink();

  if (!calLink) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm leading-relaxed text-fg-muted">{fallbackText}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={siteLinks.whatsapp}
            className="btn-glow inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02]"
            {...externalLinkProps(siteLinks.whatsapp)}
          >
            WhatsApp · {contactPhone.display}
          </a>
          <Link
            href={`/${siteLinks.contact}`}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-fg transition hover:bg-card-hover"
          >
            {contactLabel}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-6">
      <Cal
        calLink={calLink}
        style={{ width: "100%", height: "100%", minHeight: "32rem", overflow: "scroll" }}
        config={{ layout: "month_view" }}
      />
    </div>
  );
}
