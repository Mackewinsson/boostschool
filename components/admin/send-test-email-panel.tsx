"use client";

import { useActionState, useMemo, useState } from "react";
import { AdminButton } from "@/components/admin/admin-button";
import { LOCALES, type Locale } from "@/lib/locale";
import {
  TEST_EMAIL_KINDS,
  previewKey,
  type TestEmailKind,
  type TestEmailPreview,
} from "@/lib/mail/preview";
import type { StudentContent } from "@/lib/student-content/types";
import { sendTestEmailAction, type SendTestEmailState } from "@/app/alumno/profesor/emails/actions";

const KIND_LABEL: Record<
  TestEmailKind,
  keyof Pick<
    StudentContent["teacher"],
    | "emailsTestKindHomeworkStudent"
    | "emailsTestKindHomeworkParent"
    | "emailsTestKindMaterialStudent"
    | "emailsTestKindMaterialParent"
    | "emailsTestKindLeadMagnet"
  >
> = {
  "homework-student": "emailsTestKindHomeworkStudent",
  "homework-parent": "emailsTestKindHomeworkParent",
  "material-student": "emailsTestKindMaterialStudent",
  "material-parent": "emailsTestKindMaterialParent",
  "lead-magnet": "emailsTestKindLeadMagnet",
};

const LOCALE_LABEL: Record<Locale, string> = {
  es: "Español",
  en: "English",
  pl: "Polski",
};

type SendTestEmailPanelProps = {
  copy: StudentContent["teacher"];
  defaultTo: string;
  defaultLocale: Locale;
  previews: Record<string, TestEmailPreview>;
};

export function SendTestEmailPanel({
  copy,
  defaultTo,
  defaultLocale,
  previews,
}: SendTestEmailPanelProps) {
  const [kind, setKind] = useState<TestEmailKind>("homework-student");
  const [emailLocale, setEmailLocale] = useState<Locale>(defaultLocale);
  const [state, formAction, pending] = useActionState<SendTestEmailState, FormData>(
    sendTestEmailAction,
    null,
  );

  const preview = useMemo(
    () => previews[previewKey(kind, emailLocale)],
    [previews, kind, emailLocale],
  );

  return (
    <div className="admin-card mt-8">
      <h2 className="admin-section-title">{copy.emailsTestTitle}</h2>
      <p className="mt-2 text-sm text-fg-muted">{copy.emailsTestHint}</p>

      <form action={formAction} className="admin-form mt-5">
        <div className="admin-locale-grid">
          <div className="admin-field">
            <label className="admin-label" htmlFor="test-email-kind">
              {copy.emailsTestKindLabel}
            </label>
            <select
              id="test-email-kind"
              name="kind"
              value={kind}
              onChange={(event) => setKind(event.target.value as TestEmailKind)}
              className="admin-input"
            >
              {TEST_EMAIL_KINDS.filter((item) => previews[previewKey(item, emailLocale)]).map(
                (item) => (
                  <option key={item} value={item}>
                    {copy[KIND_LABEL[item]]}
                  </option>
                ),
              )}
            </select>
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="test-email-locale">
              {copy.emailsTestLocaleLabel}
            </label>
            <select
              id="test-email-locale"
              name="emailLocale"
              value={emailLocale}
              onChange={(event) => setEmailLocale(event.target.value as Locale)}
              className="admin-input"
            >
              {LOCALES.map((item) => (
                <option key={item} value={item}>
                  {LOCALE_LABEL[item]}
                </option>
              ))}
            </select>
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="test-email-to">
              {copy.emailsTestToLabel}
            </label>
            <input
              id="test-email-to"
              className="admin-input"
              name="to"
              type="email"
              required
              defaultValue={defaultTo}
              autoComplete="email"
            />
          </div>
        </div>

        {state ? (
          <p
            className={
              state.ok ? "text-sm text-accent" : "text-sm text-red-400"
            }
            role="status"
          >
            {state.message}
          </p>
        ) : null}

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <AdminButton type="submit" variant="primary" disabled={pending}>
            {copy.emailsTestSend}
          </AdminButton>
        </div>
      </form>

      {preview ? (
        <div className="mt-6">
          <p className="admin-label">{copy.emailsTestPreview}</p>
          <p className="mt-1 text-sm font-semibold text-fg">{preview.subject}</p>
          <div
            className="mt-3 rounded-xl border border-border bg-canvas px-4 py-3 text-sm text-fg [&_a]:text-accent [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: preview.html }}
          />
        </div>
      ) : null}
    </div>
  );
}