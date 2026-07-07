"use client";

import { useState } from "react";
import type { ContactSection } from "@/lib/landing-content/types";
import type { Locale } from "@/lib/locale";
import { PrivacyNote } from "./privacy-note";
import { WhatsAppCta } from "./whatsapp-cta";

type ContactFormProps = {
  locale: Locale;
  copy: ContactSection;
};

type FormStatus = "idle" | "loading" | "success" | "error";

export function ContactForm({ locale, copy }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (name.length < 2) {
      setStatus("error");
      setErrorMessage(copy.errorName);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setErrorMessage(copy.errorEmail);
      return;
    }

    if (message.length < 10) {
      setStatus("error");
      setErrorMessage(copy.errorMessage);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, locale }),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        setStatus("error");
        setErrorMessage(copy.errorGeneric);
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage(copy.errorGeneric);
    }
  }

  if (status === "success") {
    return (
      <>
        <div className="rounded-2xl border border-brand-from/30 bg-card p-6 text-center sm:p-8">
          <p className="text-lg font-semibold text-fg">{copy.successTitle}</p>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">{copy.successBody}</p>
        </div>
        <WhatsAppCta whatsapp={copy.whatsapp} />
      </>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-fg">
            {copy.fields.name}
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            disabled={status === "loading"}
            placeholder={copy.fields.namePlaceholder}
            className="mt-1.5 w-full rounded-xl border border-border bg-canvas px-4 py-2.5 text-sm text-fg placeholder:text-fg-faint focus:border-accent/50 focus:outline-none disabled:opacity-60"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-fg">
            {copy.fields.email}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={status === "loading"}
            placeholder={copy.fields.emailPlaceholder}
            className="mt-1.5 w-full rounded-xl border border-border bg-canvas px-4 py-2.5 text-sm text-fg placeholder:text-fg-faint focus:border-accent/50 focus:outline-none disabled:opacity-60"
          />
        </div>
        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium text-fg">
            {copy.fields.message}
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            required
            disabled={status === "loading"}
            placeholder={copy.fields.messagePlaceholder}
            className="mt-1.5 w-full resize-y rounded-xl border border-border bg-canvas px-4 py-2.5 text-sm text-fg placeholder:text-fg-faint focus:border-accent/50 focus:outline-none disabled:opacity-60"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-glow inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-6 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? "…" : copy.fields.submit}
        </button>
        {errorMessage ? (
          <p className="text-center text-sm text-red-400" role="alert">
            {errorMessage}
          </p>
        ) : null}
        <PrivacyNote note={copy.privacyNote} linkLabel={copy.privacyLinkLabel} />
      </form>
      <WhatsAppCta whatsapp={copy.whatsapp} />
    </>
  );
}
