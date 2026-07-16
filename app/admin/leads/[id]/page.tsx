import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminButton } from "@/components/admin/admin-button";
import { getLeadById } from "@/lib/crm/leads";
import { deleteLeadAction, updateLeadAction } from "../actions";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminLeadDetailPage({ params }: PageProps) {
  const { id } = await params;
  const lead = await getLeadById(id);
  if (!lead) {
    notFound();
  }

  return (
    <div>
      <Link href="/admin/leads" className="admin-back-link">
        ← Volver a leads
      </Link>
      <h1 className="admin-page-title">{lead.name}</h1>
      <p className="admin-muted" style={{ marginTop: "-0.75rem", marginBottom: "1.25rem" }}>
        {lead.email} · origen: {lead.source}
      </p>

      <div className="admin-grid">
        <div className="admin-card">
          <h2 className="admin-section-title">Editar lead</h2>
          <form action={updateLeadAction} className="admin-form">
            <input type="hidden" name="id" value={lead.id} />
            <div className="admin-field">
              <label className="admin-label" htmlFor="edit-name">
                Nombre
              </label>
              <input
                id="edit-name"
                className="admin-input"
                name="name"
                required
                defaultValue={lead.name}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="edit-locale">
                Idioma
              </label>
              <select
                id="edit-locale"
                className="admin-select"
                name="locale"
                defaultValue={lead.locale}
              >
                <option value="es">ES</option>
                <option value="en">EN</option>
                <option value="pl">PL</option>
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="edit-notes">
                Notas
              </label>
              <textarea
                id="edit-notes"
                className="admin-textarea"
                name="notes"
                defaultValue={lead.notes ?? ""}
              />
            </div>
            <AdminButton type="submit" variant="primary">
              Guardar cambios
            </AdminButton>
          </form>
        </div>

        <div className="admin-card">
          <h2 className="admin-section-title">Eliminar</h2>
          <p className="admin-muted" style={{ marginBottom: "1rem" }}>
            Esta acción no se puede deshacer.
          </p>
          <form action={deleteLeadAction}>
            <input type="hidden" name="id" value={lead.id} />
            <AdminButton type="submit" variant="danger">
              Eliminar lead
            </AdminButton>
          </form>
        </div>
      </div>
    </div>
  );
}
