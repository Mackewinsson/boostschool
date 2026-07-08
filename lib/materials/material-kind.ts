import { FileText, Headphones, Link2, Video, type LucideIcon } from "lucide-react";
import type { MaterialKind } from "./types";

export function detectMaterialKind(url: string): MaterialKind {
  const lower = url.toLowerCase();

  if (
    lower.includes("youtube.com") ||
    lower.includes("youtu.be") ||
    lower.includes("vimeo.com")
  ) {
    return "video";
  }

  if (
    lower.includes("drive.google.com") ||
    lower.includes("docs.google.com") ||
    lower.endsWith(".pdf")
  ) {
    return "document";
  }

  if (
    lower.includes("spotify.com") ||
    lower.includes("soundcloud.com") ||
    /\.(mp3|wav|ogg|m4a)(\?|$)/.test(lower)
  ) {
    return "audio";
  }

  return "link";
}

export function getMaterialKindIcon(kind: MaterialKind): LucideIcon {
  switch (kind) {
    case "video":
      return Video;
    case "document":
      return FileText;
    case "audio":
      return Headphones;
    default:
      return Link2;
  }
}

export function isMaterialNew(assignedAt: string | undefined, completedAt: string | null | undefined): boolean {
  if (!assignedAt || completedAt) {
    return false;
  }
  const assigned = new Date(assignedAt).getTime();
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return assigned >= weekAgo;
}
