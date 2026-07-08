import type { LinkHrefKey } from "@/lib/site-links";

export type NavLink = {
  label: string;
  href: string;
};

export type Stat = {
  label: string;
  value: string;
  hrefKey?: "booking";
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
  kind?: "duration" | "class" | "business" | "group";
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
  whatsapp: {
    divider: string;
    title: string;
    hint: string;
    ariaLabel: string;
  };
  successTitle: string;
  successBody: string;
  errorGeneric: string;
  errorName: string;
  errorEmail: string;
  errorMessage: string;
  privacyNote: string;
  privacyLinkLabel: string;
};

export type UiStrings = {
  openMenuAria: string;
  themeToggleAria: string;
  languageToggleAria: string;
  copyright: string;
  privacyLinkLabel: string;
  portalNavLabel: string;
  signInNavLabel: string;
  blogLinkLabel: string;
  resourcesLinkLabel: string;
};

export type TestimonialsEmbed = {
  viewAllLabel: string;
  fallbackText: string;
  poweredByLabel: string;
  mapEmbedTitle: string;
};

export type BookingPageSection = {
  metadata: {
    title: string;
    description: string;
  };
  title: string;
  subtitle: string;
  backLabel: string;
  fallbackText: string;
};

export type BlogPageSection = {
  metadata: {
    title: string;
    description: string;
  };
  label: string;
  title: string;
  subtitle: string;
  backLabel: string;
  emptyLabel: string;
  readMoreLabel: string;
  readingTimeLabel: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaLabel: string;
  backToBlogLabel: string;
};

export type BlogSection = SectionHeading & {
  viewAllLabel: string;
  emptyLabel: string;
  readMoreLabel: string;
  readingTimeLabel: string;
};

export type LeadMagnetFormCopy = {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  submitLabel: string;
  privacyNote: string;
  privacyLinkLabel: string;
  successTitle: string;
  successBody: string;
  downloadLabel: string;
  errorGeneric: string;
  errorName: string;
  errorEmail: string;
};

export type LeadMagnetSection = SectionHeading & {
  description: string;
  bullets: string[];
  form: LeadMagnetFormCopy;
};

export type LeadMagnetPageSection = {
  metadata: {
    title: string;
    description: string;
  };
  label: string;
  title: string;
  subtitle: string;
  backLabel: string;
  bullets: string[];
  form: LeadMagnetFormCopy;
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
    classTypesLabel: string;
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
  leadMagnetSection: LeadMagnetSection;
  leadMagnetPage: LeadMagnetPageSection;
  blogSection: BlogSection;
  blogPage: BlogPageSection;
  bookingPage: BookingPageSection;
};
