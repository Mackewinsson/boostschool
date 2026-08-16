import Link from "next/link";
import { isDatabaseConfigured } from "@/lib/db/client";
import { listContactMessages } from "@/lib/crm/contacts";
import { teacherPaths } from "@/lib/teacher/paths";

export const dynamic = "force-dynamic";

function formatDate(value: string): string {
  return new Date(value).toLocaleString("es", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function previewMessage(message: string): string {
  const compact = message.replaceAll(/\s+/g, " ").trim();
  return compact.length > 80 ? `${compact.slice(0, 80)}...` : compact;
}

export default async function TeacherContactsPage() {
  if (!isDatabaseConfigured()) {
    return (
      <div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Contactos
        </h1>
        <p className="mt-3 text-base text-fg-muted">
          DATABASE_URL no esta configurada.
        </p>
      </div>
    );
  }

  const messages = await listContactMessages();

  return (
    <div>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
        Contactos
      </h1>
      <p className="mt-3 max-w-3xl text-base text-fg-muted">
        Mensajes del formulario de contacto ({messages.length})
      </p>

      <div className="admin-card admin-card--flush mt-8">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Estado</th>
              <th>Nombre</th>
              <th>Email / mensaje</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{ textAlign: "center", color: "var(--fg-muted)" }}
                >
                  Todavia no hay mensajes.
                </td>
              </tr>
            ) : (
              messages.map((item) => (
                <tr key={item.id} className="admin-row-clickable">
                  <td colSpan={4} style={{ padding: 0 }}>
                    <Link
                      href={teacherPaths.contact(item.id)}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "0.7fr 1fr 1.8fr 1fr",
                        padding: 0,
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      <span style={{ padding: "0.85rem 1rem" }}>
                        {item.readAt ? (
                          <span className="admin-badge admin-badge--muted">
                            Leido
                          </span>
                        ) : (
                          <span className="admin-badge admin-badge--active">
                            Nuevo
                          </span>
                        )}
                      </span>
                      <span
                        style={{ padding: "0.85rem 1rem", fontWeight: 600 }}
                      >
                        {item.name}
                      </span>
                      <span style={{ padding: "0.85rem 1rem" }}>
                        <div style={{ color: "var(--fg-muted)" }}>{item.email}</div>
                        <div
                          style={{
                            fontSize: "0.85rem",
                            color: "var(--fg-faint)",
                            marginTop: 2,
                          }}
                        >
                          {previewMessage(item.message)}
                        </div>
                      </span>
                      <span
                        style={{
                          padding: "0.85rem 1rem",
                          color: "var(--fg-faint)",
                          fontSize: "0.85rem",
                        }}
                      >
                        {formatDate(item.createdAt)}
                      </span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
