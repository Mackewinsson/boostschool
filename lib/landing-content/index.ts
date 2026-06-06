import type { Locale } from "@/lib/locale";
import { en } from "./en";
import { es } from "./es";
import { pl } from "./pl";
import type { LandingContent } from "./types";

const contentByLocale: Record<Locale, LandingContent> = {
  es,
  en,
  pl,
};

export function getLandingContent(locale: Locale): LandingContent {
  return contentByLocale[locale];
}

export type {
  AboutSection,
  ContactSection,
  FaqItem,
  Feature,
  LandingContent,
  LinkedLine,
  NavLink,
  SectionHeading,
  Stat,
  TestimonialsEmbed,
  UiStrings,
} from "./types";
