import { GmailSignatureCard } from "@/components/admin/gmail-signature-card";

export const dynamic = "force-dynamic";

export default function TeacherFirmaPage() {
  return (
    <div>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
        Firma de Gmail
      </h1>
      <p className="mt-3 max-w-3xl text-base text-fg-muted">
        Firma lista para pegar en Gmail. Copiala desde aqui; no hace falta
        editar HTML.
      </p>
      <div className="mt-8">
        <GmailSignatureCard />
      </div>
    </div>
  );
}
