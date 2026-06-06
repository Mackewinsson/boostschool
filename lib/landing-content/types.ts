export type NavLink = {
  label: string;
  href: string;
};

export type Stat = {
  label: string;
  value: string;
};

export type Feature = {
  title: string;
  description: string;
};

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

export type FaqItem = {
  question: string;
  answer: string;
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
  socialLinks: { label: string; href: string }[];
  note: string;
};

export type UiStrings = {
  openMenuAria: string;
  themeToggleAria: string;
  languageToggleAria: string;
  copyright: string;
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
  testimonials: Testimonial[];
  plansSection: SectionHeading;
  plans: {
    title: string;
    description: string;
    monthlyLabel: string;
    monthlyPrice: string;
    priceSubtext: string;
    cta: string;
    note: string;
    features: string[];
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
