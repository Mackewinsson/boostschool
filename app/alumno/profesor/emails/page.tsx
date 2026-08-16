import { AdminButton } from "@/components/admin/admin-button";
import { isDatabaseConfigured } from "@/lib/db/client";
import {
  getEmailTemplate,
  LEAD_MAGNET_WELCOME_TEMPLATE_ID,
} from "@/lib/crm/templates";
import { updateEmailTemplateAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function TeacherEmailsPage() {
  if (!isDatabaseConfigured()) {
    return (
      <div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Emails
        </h1>
        <p className="mt-3 text-base text-fg-muted">
          DATABASE_URL no esta configurada.
        </p>
      </div>
    );
  }

  const template = await getEmailTemplate(LEAD_MAGNET_WELCOME_TEMPLATE_ID);

  if (!template) {
    return (
      <div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Emails
        </h1>
        <p className="mt-3 text-base text-fg-muted">
          No hay plantillas. Ejecuta `npm run db:migrate`.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
        Emails
      </h1>
      <p className="mt-3 max-w-3xl text-base text-fg-muted">
        Plantilla de bienvenida del lead magnet. Variables:{" "}
        <code>{"{{name}}"}</code>, <code>{"{{download_url}}"}</code>
      </p>

      <div className="admin-card mt-8">
        <h2 className="admin-section-title">Bienvenida - guia gratis</h2>
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
                  style={{ minHeight: "280px", fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.8rem" }}
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
                  style={{ minHeight: "280px", fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.8rem" }}
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
                  style={{ minHeight: "280px", fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.8rem" }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <AdminButton type="submit" variant="primary">
              Guardar plantilla
            </AdminButton>
          </div>
        </form>
      </div>
    </div>
  );
}
