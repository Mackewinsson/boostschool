import type { Locale } from "@/lib/locale";
import { en } from "./en";
import { es } from "./es";
import { pl } from "./pl";
import type { StudentContent } from "./types";

const contentByLocale: Record<Locale, StudentContent> = { es, en, pl };

export function getStudentContent(locale: Locale): StudentContent {
  return contentByLocale[locale];
}
