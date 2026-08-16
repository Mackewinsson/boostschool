import { GmailSignatureCard } from "@/components/admin/gmail-signature-card";

export const dynamic = "force-dynamic";

export default function AdminFirmaPage() {
  return (
    <div>
      <h1 className="admin-page-title">Firma de Gmail</h1>
      <p
        className="admin-muted"
        style={{ marginTop: "-0.75rem", marginBottom: "1.25rem" }}
      >
        Firma lista para pegar en Gmail. Cópiala desde aquí; no hace falta
        editar HTML.
      </p>
      <GmailSignatureCard />
    </div>
  );
}
