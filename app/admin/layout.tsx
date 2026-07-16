import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { isAdminUser } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!isAdminUser(user)) {
    redirect("/");
  }

  return (
    <div className="admin-layout-container">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          Bilingual <span>Boost</span>
        </div>
        <AdminNav />
        <div
          style={{
            padding: "1rem 1.25rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          <Link href="/" className="admin-muted" style={{ fontSize: "0.85rem" }}>
            ← Volver al sitio
          </Link>
        </div>
      </aside>

      <div className="admin-main-area">
        <header className="admin-header">
          <UserButton />
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
