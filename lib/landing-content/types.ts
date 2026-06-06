import type { LinkHrefKey } from "@/lib/site-links";

export type NavLink = {
  label: string;
  href: string;
};

export type Stat = {
  label: string;
  value: string;
  hrefKey?: "calendly";
};

export type Feature = {
  title: string;
  description: string;
};

export type LinkedLine = {
  before?: string;
  link?: { label: string; hrefKey: LinkHrefKey };
  after?: string;
  plain?: string;
};

export type FaqItem = {
  question: string;
  answer: LinkedLine;
};

export type SectionHeading = {
  label: string;
  title: string;
};

export type AboutSection = {
  label: string;
  title: string;
  paragraphs: string[];
  imageAlt: string;
};

export type ContactSection = {
  label: string;
  title: string;
  description: string;
  fields: {
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    submit: string;
  };
  whatsappLabel: string;
  note: string;
};

export type UiStrings = {
  openMenuAria: string;
  themeToggleAria: string;
  languageToggleAria: string;
  copyright: string;
};

export type TestimonialsEmbed = {
  viewAllLabel: string;
  fallbackText: string;
  poweredByLabel: string;
};

export type LandingContent = {
  metadata: {
    title: string;
    description: string;
  };
  ui: UiStrings;
  brand: {
    name: string;
    badge: string;
    tagline: string;
  };
  nav: {
    ctaLabel: string;
    links: NavLink[];
  };
  hero: {
    titleBefore: string;
    titleHighlight: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
  };
  stats: Stat[];
  about: AboutSection;
  featuresSection: SectionHeading;
  features: Feature[];
  outcomesSection: SectionHeading & { linkText: string };
  outcomes: Feature[];
  testimonialsSection: SectionHeading;
  testimonialsEmbed: TestimonialsEmbed;
  plansSection: SectionHeading;
  plans: {
    title: string;
    description: string;
    monthlyLabel: string;
    monthlyPrice: string;
    priceSubtext: string;
    cta: string;
    note: string;
    features: LinkedLine[];
  };
  faqSection: SectionHeading;
  faqs: FaqItem[];
  contact: ContactSection;
  finalCta: {
    titleBefore: string;
    titleHighlight: string;
    subtitle: string;
    cta: string;
  };
  mobileStickyCta: string;
};
