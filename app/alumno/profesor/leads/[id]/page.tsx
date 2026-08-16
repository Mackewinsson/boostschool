import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminButton } from "@/components/admin/admin-button";
import { getLeadById } from "@/lib/crm/leads";
import { teacherPaths } from "@/lib/teacher/paths";
import { deleteLeadAction, updateLeadAction } from "../actions";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TeacherLeadDetailPage({ params }: PageProps) {
  const { id } = await params;
  const lead = await getLeadById(id);
  if (!lead) {
    notFound();
  }

  return (
    <div>
      <Link
        href={teacherPaths.leads}
        className="mt-6 inline-flex text-sm font-medium text-fg-muted transition hover:text-accent"
      >
        ? Volver a leads
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
        {lead.name}
      </h1>
      <p className="mt-3 text-base text-fg-muted">
        {lead.email} | origen: {lead.source}
      </p>

      <div className="admin-grid mt-8">
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
            Esta accion no se puede deshacer.
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
