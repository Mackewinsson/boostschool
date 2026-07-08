import { ExternalLink, FileDown } from "lucide-react";
import type { Material } from "@/lib/materials/types";
import { externalLinkProps } from "@/lib/site-links";

type MaterialCardProps = {
  material: Material;
  openLabel: string;
};

export function MaterialCard({ material, openLabel }: MaterialCardProps) {
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-from/20 hover:bg-card-hover">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-from/20 text-accent">
        <FileDown size={22} aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-fg">{material.title}</h3>
      {material.description ? (
        <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">
          {material.description}
        </p>
      ) : (
        <div className="flex-1" />
      )}
      <a
        href={material.url}
        className="btn-glow mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02]"
        {...externalLinkProps(material.url)}
      >
        {openLabel}
        <ExternalLink size={16} aria-hidden="true" />
      </a>
    </article>
  );
}
