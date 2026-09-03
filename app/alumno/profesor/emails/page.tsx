import { AdminButton } from "@/components/admin/admin-button";
import { SendTestEmailPanel } from "@/components/admin/send-test-email-panel";
import { isDatabaseConfigured } from "@/lib/db/client";
import {
  getEmailTemplate,
  LEAD_MAGNET_WELCOME_TEMPLATE_ID,
} from "@/lib/crm/templates";
import { getAuthContext } from "@/lib/materials/auth";
import { getLocaleFromCookies } from "@/lib/locale-server";
import { buildAllTestEmailPreviews } from "@/lib/mail/preview";
import { getStudentContent } from "@/lib/student-content";
import { updateEmailTemplateAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function TeacherEmailsPage() {
  const locale = await getLocaleFromCookies();
  const { teacher: copy } = getStudentContent(locale);
  const context = await getAuthContext();

  if (!isDatabaseConfigured()) {
    return (
      <div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {copy.emailsTitle}
        </h1>
        <p className="mt-3 text-base text-fg-muted">DATABASE_URL no esta configurada.</p>
      </div>
    );
  }

  const template = await getEmailTemplate(LEAD_MAGNET_WELCOME_TEMPLATE_ID);
  const previews = buildAllTestEmailPreviews(template);

  return (
    <div>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
        {copy.emailsTitle}
      </h1>
      <p className="mt-3 max-w-3xl text-base text-fg-muted">{copy.emailsSubtitle}</p>

      <SendTestEmailPanel
        copy={copy}
        defaultTo={context?.email ?? ""}
        defaultLocale={locale}
        previews={previews}
      />

      {template ? (
        <div className="admin-card mt-8">
          <h2 className="admin-section-title">{copy.emailsLeadMagnetTitle}</h2>
          <p className="mt-2 text-sm text-fg-muted">{copy.emailsLeadMagnetHint}</p>
          <form action={updateEmailTemplateAction} className="admin-form">
            <input type="hidden" name="id" value={template.id} />

            <div className="admin-locale-grid">
              <div>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "var(--accent)",
                    marginBottom: "0.85rem",
                  }}
                >
                  Español
                </h3>
                <div className="admin-field" style={{ marginBottom: "0.85rem" }}>
                  <label className="admin-label" htmlFor="subject_es">
                    Asunto
                  </label>
                  <input
                    id="subject_es"
                    className="admin-input"
                    name="subject_es"
                    required
                    defaultValue={template.subjectEs}
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-label" htmlFor="body_html_es">
                    Cuerpo HTML
                  </label>
                  <textarea
                    id="body_html_es"
                    className="admin-textarea"
                    name="body_html_es"
                    required
                    defaultValue={template.bodyHtmlEs}
                    style={{
                      minHeight: "280px",
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.8rem",
                    }}
                  />
                </div>
              </div>

              <div>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "var(--accent)",
                    marginBottom: "0.85rem",
                  }}
                >
                  English
                </h3>
                <div className="admin-field" style={{ marginBottom: "0.85rem" }}>
                  <label className="admin-label" htmlFor="subject_en">
                    Subject
                  </label>
                  <input
                    id="subject_en"
                    className="admin-input"
                    name="subject_en"
                    required
                    defaultValue={template.subjectEn}
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-label" htmlFor="body_html_en">
                    HTML body
                  </label>
                  <textarea
                    id="body_html_en"
                    className="admin-textarea"
                    name="body_html_en"
                    required
                    defaultValue={template.bodyHtmlEn}
                    style={{
                      minHeight: "280px",
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.8rem",
                    }}
                  />
                </div>
              </div>

              <div>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "var(--accent)",
                    marginBottom: "0.85rem",
                  }}
                >
                  Polski
                </h3>
                <div className="admin-field" style={{ marginBottom: "0.85rem" }}>
                  <label className="admin-label" htmlFor="subject_pl">
                    Temat
                  </label>
                  <input
                    id="subject_pl"
                    className="admin-input"
                    name="subject_pl"
                    required
                    defaultValue={template.subjectPl}
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-label" htmlFor="body_html_pl">
                    Tresc HTML
                  </label>
                  <textarea
                    id="body_html_pl"
                    className="admin-textarea"
                    name="body_html_pl"
                    required
                    defaultValue={template.bodyHtmlPl}
                    style={{
                      minHeight: "280px",
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.8rem",
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <AdminButton type="submit" variant="primary">
                {copy.emailsSaveTemplate}
              </AdminButton>
            </div>
          </form>
        </div>
      ) : (
        <p className="mt-8 text-sm text-fg-muted">
          No hay plantillas. Ejecuta `npm run db:migrate`.
        </p>
      )}
    </div>
  );
}
