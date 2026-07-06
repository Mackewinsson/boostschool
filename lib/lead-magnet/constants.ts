import path from "node:path";

export const LEAD_MAGNET_FILENAME = "guia-bilingual-boost.pdf";
export const LEAD_MAGNET_FILE_PATH = path.join(
  process.cwd(),
  "private",
  "lead-magnet.pdf",
);
export const LEAD_MAGNET_TOKEN_TTL_MS = 60 * 60 * 1000;
