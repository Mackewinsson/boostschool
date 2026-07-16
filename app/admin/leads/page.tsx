import Link from "next/link";
import { AdminButton } from "@/components/admin/admin-button";
import { isDatabaseConfigured } from "@/lib/db/client";
import { listLeads } from "@/lib/crm/leads";
import { createLeadAction } from "./actions";

export const dynamic = "force-dynamic";

function formatDate(value: string): string {
  return new Date(value).toLocaleString("es", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminLeadsPage() {
  if (!isDatabaseConfigured()) {
    return (
      <div>
        <h1 className="admin-page-title">Leads</h1>
        <p className="admin-muted">DATABASE_URL no está configurada.</p>
      </div>
    );
  }

  const leads = await listLeads();

  return (
    <div>
      <h1 className="admin-page-title">Leads</h1>

      <div className="admin-grid">
        <div className="admin-card admin-card--flush">
          <div style={{ padding: "1.25rem 1.5rem" }}>
            <h2 className="admin-section-title" style={{ marginBottom: 0 }}>
              Registrados ({leads.length})
            </h2>
            <p className="admin-muted" style={{ margin: "0.35rem 0 0" }}>
              Haz clic en una fila para editar.
            </p>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Idioma</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", color: "var(--fg-muted)" }}>
                    Todavía no hay leads.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="admin-row-clickable">
                    <td colSpan={4} style={{ padding: 0 }}>
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1.2fr 1.4fr 0.6fr 1fr",
                          padding: 0,
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        <span style={{ padding: "0.85rem 1rem", fontWeight: 600 }}>
                          {lead.name}
                        </span>
                        <span
                          style={{
                            padding: "0.85rem 1rem",
                            color: "var(--fg-muted)",
                          }}
                        >
                          {lead.email}
                        </span>
                        <span style={{ padding: "0.85rem 1rem" }}>
                          {lead.locale.toUpperCase()}
                        </span>
                        <span
                          style={{
                            padding: "0.85rem 1rem",
                            color: "var(--fg-faint)",
                            fontSize: "0.85rem",
                          }}
                        >
                          {formatDate(lead.createdAt)}
                        </span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-card admin-sticky-sidebar">
          <h2 className="admin-section-title">Agregar lead</h2>
          <form action={createLeadAction} className="admin-form">
            <div className="admin-field">
              <label className="admin-label" htmlFor="lead-name">
                Nombre
              </label>
              <input
                id="lead-name"
                className="admin-input"
                name="name"
                required
                minLength={2}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="lead-email">
                Email
              </label>
              <input
                id="lead-email"
                className="admin-input"
                name="email"
                type="email"
                required
              />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="lead-locale">
                Idioma
              </label>
              <select
                id="lead-locale"
                className="admin-select"
                name="locale"
                defaultValue="es"
              >
                <option value="es">ES</option>
                <option value="en">EN</option>
                <option value="pl">PL</option>
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="lead-notes">
                Notas
              </label>
              <textarea id="lead-notes" className="admin-textarea" name="notes" />
            </div>
            <AdminButton type="submit" variant="primary">
              Guardar lead
            </AdminButton>
          </form>
        </div>
      </div>
    </div>
  );
}
