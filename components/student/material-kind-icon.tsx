import { FileText, Headphones, Link2, Video } from "lucide-react";
import type { MaterialKind } from "@/lib/materials/types";

type MaterialKindIconProps = {
  kind: MaterialKind;
  size?: number;
  className?: string;
};

export function MaterialKindIcon({ kind, size = 22, className }: MaterialKindIconProps) {
  const props = { size, "aria-hidden": true as const, className };

  switch (kind) {
    case "video":
      return <Video {...props} />;
    case "document":
      return <FileText {...props} />;
    case "audio":
      return <Headphones {...props} />;
    default:
      return <Link2 {...props} />;
  }
}
