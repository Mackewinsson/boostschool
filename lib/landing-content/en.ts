import type { LandingContent } from "./types";

export const en: LandingContent = {
  metadata: {
    title: "Bilingual Boost | English and Spanish with Paulina Poloca",
    description:
      "Get organized, grow, and learn English and Spanish with Paulina Poloca. Personalized online classes, real conversation from day one, and a free trial lesson.",
  },
  ui: {
    openMenuAria: "Open menu",
    themeToggleAria: "Toggle theme",
    languageToggleAria: "Change language",
    copyright: "All rights reserved.",
  },
  brand: {
    name: "Bilingual Boost",
    badge: "Free trial lesson",
    tagline: "English and Spanish with Paulina Poloca",
  },
  nav: {
    ctaLabel: "Book your trial lesson",
    links: [
      { label: "About me", href: "#sobre-mi" },
      { label: "Classes", href: "#programas" },
      { label: "Method", href: "#resultados" },
      { label: "Testimonials", href: "#testimonios" },
      { label: "Pricing", href: "#planes" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "#contacto" },
    ],
  },
  hero: {
    titleBefore: "Get organized, grow, and learn ",
    titleHighlight: "English/Spanish",
    subtitle:
      "Personalized online classes with Paulina Poloca — so you can speak freely and learn with confidence.",
    primaryCta: "Book your trial lesson",
    secondaryCta: "See classes",
  },
  stats: [
    { value: "5+ years", label: "teaching with passion" },
    { value: "3 languages", label: "fluent · +2 learning" },
    { value: "FREE", label: "your first trial lesson", hrefKey: "calendly" },
  ],
  about: {
    label: "About me",
    title: "Hi! I'm Paulina",
    imageAlt: "Paulina Poloca, English and Spanish teacher",
    paragraphs: [
      "I'm an English and Spanish teacher, and I've been teaching with joy, warmth, and passion for over 5 years.",
      "I love connecting with people, helping them loosen up when they speak, and showing that learning a language is also a way to grow as a person and feel better about yourself. And yes — it can be fun and transformative too!",
      "I speak 3 languages fluently and I'm currently learning 2 more. That's why I understand exactly the difficulties, doubts, or blocks you might have when learning a foreign language.",
      "I've been on that path too, and I know how to help you overcome the fear of speaking so you feel more confident and free when you express yourself.",
    ],
  },
  featuresSection: {
    label: "Online classes",
    title: "Why take classes with me?",
  },
  features: [
    {
      title: "Fully personalized approach",
      description:
        "I adapt the content, pace, and topics to your level, your goals, and your learning style.",
    },
    {
      title: "Empathy and clarity",
      description:
        "I've learned languages too, so I know exactly what it feels like to start from scratch or hit a plateau. I'll guide you step by step with empathy and clarity.",
    },
    {
      title: "Good vibes — you speak from day one",
      description:
        "Classes are relaxed and stress-free, but full of motivation. You won't get bored doing mechanical exercises — here the focus is on speaking from the very first day.",
    },
  ],
  outcomesSection: {
    label: "Method",
    title: "What are classes like? How do I teach?",
    linkText: "Book your trial lesson",
  },
  outcomes: [
    {
      title: "Real conversation",
      description:
        "In every session we work on real conversation — the kind you need to get around the world, make friends, speak at work, or express your deepest ideas.",
    },
    {
      title: "Language immersion",
      description:
        "I create an immersive language environment, as if you were living in an English- or Spanish-speaking country.",
    },
    {
      title: "Personalized corrections",
      description:
        "If you want to speak fluently, feel heard, and get useful corrections, you're in the right place. Everything is always tailored to each student, with personalized corrections and tips.",
    },
  ],
  testimonialsSection: {
    label: "Reviews",
    title: "What my students say on Google",
  },
  testimonialsEmbed: {
    viewAllLabel: "See all reviews on Google",
    fallbackText: "We'll connect Google reviews soon.",
    poweredByLabel: "Reviews from Google",
  },
  plansSection: {
    label: "Pricing",
    title: "Pricing and duration",
  },
  plans: {
    title: "Pricing and duration",
    description:
      "First trial lesson (30 min): FREE! Choose what you need or mix and match based on your goals.",
    monthlyLabel: "Trial lesson",
    monthlyPrice: "FREE",
    priceSubtext: "30 minutes · no commitment",
    cta: "Book your trial lesson",
    note: "Book online with Calendly. Easy payment — details coming soon.",
    features: [
      { plain: "30 min → €11" },
      { plain: "45 min → €16" },
      { plain: "60 min → €20" },
      {
        plain:
          "English: practical conversation, general, grammar, goal-based (travel, exams…)",
      },
      {
        before: "Business English — message me via ",
        link: { label: "Contact", hrefKey: "contact" },
        after: " for a personalized proposal",
      },
      {
        plain:
          "Spanish: practical conversation, general, grammar, goal-based",
      },
      {
        before: "English and Spanish group classes (2–3 people) — 60 min, €15 per person. ",
        link: { label: "Message me on WhatsApp", hrefKey: "whatsapp" },
        after: " to coordinate.",
      },
    ],
  },
  faqSection: {
    label: "Frequently asked questions",
    title: "We've got your answers",
  },
  faqs: [
    {
      question: "What do you need?",
      answer: {
        plain:
          "A good internet connection, a notebook and a pen, a willingness to learn, positive energy, and an open mind.",
      },
    },
    {
      question: "How do I get started?",
      answer: {
        plain:
          "Message me on WhatsApp or email — or use the contact form — tell me briefly who you are, your goals, and what you'd like to work on. Pick a day and time for your trial lesson. See you in class!",
      },
    },
    {
      question: "Do you offer business English?",
      answer: {
        before: "Yes. For business or corporate English, message me in the ",
        link: { label: "Contact", hrefKey: "contact" },
        after:
          " section for a personalized proposal: individual classes and groups of 2.",
      },
    },
  ],
  contact: {
    label: "Contact",
    title: "Write to me",
    description:
      "Tell me who you are, your goals, and what you'd like to work on. I'll get back to you as soon as possible.",
    fields: {
      name: "Full name",
      namePlaceholder: "Your full name",
      email: "Email",
      emailPlaceholder: "you@email.com",
      message: "Message",
      messagePlaceholder: "Tell me your goals and what you'd like to work on…",
      submit: "Send message",
    },
    whatsappLabel: "WhatsApp",
    note: "We'll connect the form submission soon.",
  },
  finalCta: {
    titleBefore: "Tell me what you need and ",
    titleHighlight: "let's get started",
    subtitle:
      "If you're looking for someone who'll cheer you on, listen to you, and help you speak with confidence and optimism… welcome!",
    cta: "Book your trial lesson",
  },
  mobileStickyCta: "Book your trial lesson",
};
