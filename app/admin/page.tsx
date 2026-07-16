import Link from "next/link";
import { isDatabaseConfigured } from "@/lib/db/client";
import { getCrmDashboardStats } from "@/lib/crm/stats";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!isDatabaseConfigured()) {
    return (
      <div>
        <h1 className="admin-page-title">Resumen</h1>
        <p className="admin-muted">
          Configura DATABASE_URL para ver leads y contactos.
        </p>
      </div>
    );
  }

  const stats = await getCrmDashboardStats();

  return (
    <div>
      <h1 className="admin-page-title">Resumen</h1>
      <div className="admin-stats">
        <div className="admin-stat">
          <p className="admin-stat__value">{stats.leadsTotal}</p>
          <p className="admin-stat__label">Leads totales</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat__value">{stats.leadsLast7Days}</p>
          <p className="admin-stat__label">Leads (7 días)</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat__value">{stats.contactsTotal}</p>
          <p className="admin-stat__label">Mensajes de contacto</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat__value">{stats.contactsUnread}</p>
          <p className="admin-stat__label">Sin leer</p>
        </div>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <h2 className="admin-section-title">Accesos rápidos</h2>
          <p className="admin-muted" style={{ marginBottom: "1rem" }}>
            Gestiona captaciones del lead magnet y mensajes del formulario de
            contacto.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <Link href="/admin/leads" className="admin-btn admin-btn--primary">
              Ver leads
            </Link>
            <Link
              href="/admin/contacts"
              className="admin-btn admin-btn--secondary"
            >
              Ver contactos
            </Link>
            <Link href="/admin/emails" className="admin-btn admin-btn--quiet">
              Plantillas de email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
