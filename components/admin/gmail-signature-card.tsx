"use client";

import { useRef, useState } from "react";
import { AdminButton } from "@/components/admin/admin-button";
import {
  gmailSignatureHtml,
  gmailSignaturePlainText,
} from "@/lib/admin/gmail-signature";

type CopyState = "idle" | "copied" | "error";

async function copySignature(
  html: string,
  plain: string,
  preview: HTMLElement,
): Promise<void> {
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([plain], { type: "text/plain" }),
      }),
    ]);
    return;
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(preview);
    selection?.removeAllRanges();
    selection?.addRange(range);
    const ok = document.execCommand("copy");
    selection?.removeAllRanges();
    if (!ok) {
      throw new Error("COPY_FAILED");
    }
  }
}

export function GmailSignatureCard() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CopyState>("idle");

  async function handleCopy() {
    const preview = previewRef.current;
    if (!preview) {
      return;
    }

    try {
      await copySignature(gmailSignatureHtml, gmailSignaturePlainText, preview);
      setState("copied");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="text-xl font-bold text-fg">Vista previa</h2>
      <p className="mt-2 mb-4 text-sm text-fg-muted">
        Pulsa copiar y pegala en Gmail: Ajustes, Ver todos los ajustes, General,
        Firma.
      </p>

      <div
        ref={previewRef}
        className="admin-signature-preview"
        dangerouslySetInnerHTML={{ __html: gmailSignatureHtml }}
      />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "0.75rem",
          marginTop: "1rem",
        }}
      >
        <AdminButton type="button" variant="primary" onClick={handleCopy}>
          Copiar firma
        </AdminButton>
        {state === "copied" ? (
          <p className="m-0 text-sm text-accent">Copiada. Pegala en Gmail.</p>
        ) : null}
        {state === "error" ? (
          <p className="m-0 text-sm text-red-400">
            No se pudo copiar. Selecciona la firma y copia a mano.
          </p>
        ) : null}
      </div>
    </div>
  );
}
