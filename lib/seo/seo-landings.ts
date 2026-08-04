import { siteLinks } from "@/lib/site-links";

export type SeoLandingFaq = {
  question: string;
  answer: string;
};

export type SeoLandingContent = {
  path: string;
  htmlLang: "en" | "pl";
  /** Locale used for shared chrome (navbar, brand) */
  chromeLocale: "en" | "pl";
  metadata: {
    title: string;
    description: string;
  };
  label: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
  highlights: { title: string; description: string }[];
  faqs: SeoLandingFaq[];
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  backLabel: string;
  highlightsTitle: string;
  faqTitle: string;
  course: {
    name: string;
    description: string;
    inLanguage: string;
  };
};

export const spanishClassesLanding: SeoLandingContent = {
  path: "/spanish-classes",
  htmlLang: "en",
  chromeLocale: "en",
  metadata: {
    title: "Online Spanish Classes & Tutor | Free Trial | Bilingual Boost",
    description:
      "1:1 online Spanish classes with Paulina Poloca. Real conversation from day one. Book a free 30-min trial — from €11.",
  },
  label: "Online Spanish tutor",
  title: "Online Spanish classes with a real conversation focus",
  subtitle:
    "Personalized 1:1 Spanish lessons online — so you speak with confidence, not just pass grammar tests. Free 30-minute trial.",
  paragraphs: [
    "Looking for Spanish classes or a Spanish tutor near you? Bilingual Boost offers fully online 1:1 Spanish classes you can take from anywhere — with the same personal attention as an in-person tutor.",
    "Every lesson is tailored to your level and goals: travel Spanish, conversation practice, work meetings, or building confidence from scratch. You speak from day one, with clear corrections and a supportive pace.",
    "Book a free trial lesson to meet Paulina Poloca, map your goals, and see if the fit feels right — no commitment.",
  ],
  highlights: [
    {
      title: "1:1 online Spanish tutor",
      description:
        "Private lessons online with a teacher who adapts topics, speed, and feedback to you.",
    },
    {
      title: "Conversation from day one",
      description:
        "Real speaking practice for travel, work, and everyday life — not endless worksheets.",
    },
    {
      title: "Clear pricing + free trial",
      description:
        "30 min free trial. Then online classes from €11 (30 min), €16 (45 min), or €20 (60 min).",
    },
  ],
  faqs: [
    {
      question: "Are your Spanish classes online?",
      answer:
        "Yes. All Spanish classes are online and personalized 1:1. You can book a free 30-minute trial lesson.",
    },
    {
      question: "Do you offer Spanish tutors for beginners?",
      answer:
        "Yes. Lessons are adapted to your level — from absolute beginner to advanced conversation practice.",
    },
    {
      question: "How much do online Spanish classes cost?",
      answer:
        "Online classes start at €11 for 30 minutes, €16 for 45 minutes, and €20 for 60 minutes. The first trial lesson is free.",
    },
  ],
  ctaLabel: "Book your free trial",
  ctaHref: siteLinks.booking,
  secondaryCtaLabel: "See prices on the home page",
  secondaryCtaHref: "/#planes",
  backLabel: "Back to home",
  highlightsTitle: "Why learn with Bilingual Boost",
  faqTitle: "FAQ",
  course: {
    name: "Online Spanish Classes",
    description:
      "Personalized online Spanish classes with real conversation from day one. Free 30-minute trial.",
    inLanguage: "en",
  },
};

export const angielskiSulejowekLanding: SeoLandingContent = {
  path: "/angielski-sulejowek",
  htmlLang: "pl",
  chromeLocale: "pl",
  metadata: {
    title:
      "Angielski Sulejówek & Stara Miłosna | Lekcje online | Bilingual Boost",
    description:
      "Szkoła językowa z Pauliną Poloca: angielski i hiszpański online dla Sulejówka i Starej Miłosnej. Darmowa lekcja próbna 30 min.",
  },
  label: "Sulejówek · Stara Miłosna",
  title: "Angielski w Sulejówku i Starej Miłosnej — lekcje online",
  subtitle:
    "Bilingual Boost to szkoła językowa z Pauliną Poloca: angielski i hiszpański online dla uczniów z Sulejówka, Starej Miłosnej i okolic Warszawy.",
  paragraphs: [
    "Szukasz angielskiego w Sulejówku albo szkoły językowej w Starej Miłosnej? Prowadzę spersonalizowane lekcje 1:1 online — wygodnie z domu, z jasnym planem i rozmową od pierwszej lekcji.",
    "Uczę angielskiego i hiszpańskiego z naciskiem na pewność siebie w mówieniu: praca, szkoła, podróże albo codzienna konwersacja. Dopasowuję tempo i materiał do Ciebie (lub do dziecka).",
    "Zarezerwuj darmową lekcję próbną (30 min), poznajmy się i ustalimy Twój cel — bez zobowiązań.",
  ],
  highlights: [
    {
      title: "Angielski online dla Sulejówka",
      description:
        "Lekcje 1:1 online dla mieszkańców Sulejówka i okolic — elastyczne terminy, realna konwersacja.",
    },
    {
      title: "Szkoła językowa Stara Miłosna",
      description:
        "Angielski i hiszpański z lokalnym nauczycielem (Bilingual Boost), dostępne także online.",
    },
    {
      title: "Darmowa lekcja próbna",
      description:
        "30 minut za darmo. Potem lekcje od 11 € (30 min), 16 € (45 min) lub 20 € (60 min).",
    },
  ],
  faqs: [
    {
      question: "Czy lekcje angielskiego są stacjonarne w Sulejówku?",
      answer:
        "Główna oferta to lekcje online 1:1. Obsługuję uczniów z Sulejówka, Starej Miłosnej i okolic Warszawy — szczegóły formy zajęć ustalimy na lekcji próbnej.",
    },
    {
      question: "Czy to szkoła językowa także dla dzieci?",
      answer:
        "Tak. Prowadzę lekcje angielskiego i hiszpańskiego dostosowane do wieku i poziomu, w przyjaznej atmosferze sprzyjającej mówieniu.",
    },
    {
      question: "Jak zacząć naukę angielskiego?",
      answer:
        "Zarezerwuj darmową lekcję próbną online (30 min). Poznamy Twoje cele i ułożymy plan nauki.",
    },
  ],
  ctaLabel: "Zarezerwuj darmową lekcję próbną",
  ctaHref: siteLinks.booking,
  secondaryCtaLabel: "Zobacz cennik",
  secondaryCtaHref: "/#planes",
  backLabel: "Wróć do strony głównej",
  highlightsTitle: "Dlaczego warto",
  faqTitle: "FAQ",
  course: {
    name: "Lekcje angielskiego — Sulejówek / online",
    description:
      "Spersonalizowane lekcje angielskiego online dla Sulejówka i Starej Miłosnej. Darmowa lekcja próbna 30 min.",
    inLanguage: "pl",
  },
};

export const seoLandings = {
  spanishClasses: spanishClassesLanding,
  angielskiSulejowek: angielskiSulejowekLanding,
} as const;
