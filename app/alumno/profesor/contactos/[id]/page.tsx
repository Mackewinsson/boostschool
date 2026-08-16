import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminButton } from "@/components/admin/admin-button";
import { getContactMessageById } from "@/lib/crm/contacts";
import { teacherPaths } from "@/lib/teacher/paths";
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

export default async function TeacherContactDetailPage({ params }: PageProps) {
  const { id } = await params;
  const message = await getContactMessageById(id);
  if (!message) {
    notFound();
  }

  return (
    <div>
      <Link
        href={teacherPaths.contacts}
        className="mt-6 inline-flex text-sm font-medium text-fg-muted transition hover:text-accent"
      >
        ? Volver a contactos
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
        {message.name}
      </h1>
      <p className="mt-3 text-base text-fg-muted">
        {message.email} | {message.locale.toUpperCase()} |{" "}
        {formatDate(message.createdAt)}
      </p>

      <div className="admin-grid mt-8">
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
                Marcar como leido
              </AdminButton>
            </form>
          ) : (
            <p className="admin-muted" style={{ marginBottom: "1rem" }}>
              Leido el {formatDate(message.readAt)}
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
