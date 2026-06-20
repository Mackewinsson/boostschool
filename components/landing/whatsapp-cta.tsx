import { MessageCircle } from "lucide-react";
import type { ContactSection } from "@/lib/landing-content/types";
import { contactPhone, externalLinkProps, siteLinks } from "@/lib/site-links";

type WhatsAppCtaProps = {
  whatsapp: ContactSection["whatsapp"];
};

export function WhatsAppCta({ whatsapp }: WhatsAppCtaProps) {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-card px-3 text-xs font-medium uppercase tracking-wider text-fg-muted">
            {whatsapp.divider}
          </span>
        </div>
      </div>

      <a
        href={siteLinks.whatsapp}
        aria-label={whatsapp.ariaLabel}
        className="group mt-5 flex w-full items-center gap-4 rounded-xl border border-accent/25 bg-accent/10 px-4 py-3.5 transition-all duration-300 hover:border-accent/40 hover:bg-accent/15 hover:shadow-[0_0_24px_rgb(var(--brand-from-rgb)/0.12)]"
        {...externalLinkProps(siteLinks.whatsapp)}
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-from to-brand-to text-white shadow-sm transition group-hover:scale-105">
          <MessageCircle size={22} strokeWidth={2} aria-hidden="true" />
        </span>
        <span className="min-w-0 text-left">
          <span className="block text-sm font-semibold text-fg">{whatsapp.title}</span>
          <span className="mt-0.5 block text-sm text-fg-muted">
            {contactPhone.display}
            <span className="mx-1.5 text-fg-faint" aria-hidden="true">
              ·
            </span>
            {whatsapp.hint}
          </span>
        </span>
      </a>
    </div>
  );
}
