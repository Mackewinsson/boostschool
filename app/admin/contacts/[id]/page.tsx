import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminButton } from "@/components/admin/admin-button";
import { getContactMessageById } from "@/lib/crm/contacts";
import { deleteContactAction, markContactReadAction } from "../actions";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(value: string): string {
  return new Date(value).toLocaleString("es", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminContactDetailPage({ params }: PageProps) {
  const { id } = await params;
  const message = await getContactMessageById(id);
  if (!message) {
    notFound();
  }

  return (
    <div>
      <Link href="/admin/contacts" className="admin-back-link">
        ← Volver a contactos
      </Link>
      <h1 className="admin-page-title">{message.name}</h1>
      <p className="admin-muted" style={{ marginTop: "-0.75rem", marginBottom: "1.25rem" }}>
        {message.email} · {message.locale.toUpperCase()} ·{" "}
        {formatDate(message.createdAt)}
      </p>

      <div className="admin-grid">
        <div className="admin-card">
          <h2 className="admin-section-title">Mensaje</h2>
          <p className="admin-message-body">{message.message}</p>
        </div>

        <div className="admin-card">
          <h2 className="admin-section-title">Acciones</h2>
          {!message.readAt ? (
            <form action={markContactReadAction} style={{ marginBottom: "1rem" }}>
              <input type="hidden" name="id" value={message.id} />
              <AdminButton type="submit" variant="primary">
                Marcar como leído
              </AdminButton>
            </form>
          ) : (
            <p className="admin-muted" style={{ marginBottom: "1rem" }}>
              Leído el {formatDate(message.readAt)}
            </p>
          )}
          <form action={deleteContactAction}>
            <input type="hidden" name="id" value={message.id} />
            <AdminButton type="submit" variant="danger">
              Eliminar mensaje
            </AdminButton>
          </form>
        </div>
      </div>
    </div>
  );
}
