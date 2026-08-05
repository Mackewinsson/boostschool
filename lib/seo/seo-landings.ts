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
  /** Optional link to a related local landing page, rendered near the CTA. */
  relatedLink?: {
    label: string;
    href: string;
  };
};

export const spanishClassesLanding: SeoLandingContent = {
  path: "/spanish-classes",
  htmlLang: "en",
  chromeLocale: "en",
  metadata: {
    // Root layout's title template appends " | Bilingual Boost" automatically.
    title: "Spanish Classes Near Me | Online Tutor + Free Trial",
    description:
      "Looking for Spanish classes near me or Spanish tutors near me? Bilingual Boost is 100% online — your nearest Spanish tutor from anywhere. Free 30-min trial from €11.",
  },
  label: "Spanish tutor near me · 100% online",
  title: "Spanish classes near me? We're online, so we're always close by",
  subtitle:
    "Personalized 1:1 Spanish lessons online — the same personal attention as a Spanish tutor near you, without the commute. Free 30-minute trial.",
  paragraphs: [
    "Searching for \"Spanish classes near me\" or a \"Spanish tutor near me\"? Bilingual Boost teaches 100% online, so wherever you live, we're effectively your nearest Spanish tutor — no commute, no waiting room, just a video call from your sofa.",
    "Every lesson is tailored to your level and goals: travel Spanish, conversation practice, work meetings, or building confidence from scratch. You speak from day one, with clear corrections and a supportive pace.",
    "Book a free trial lesson to meet Paulina Poloca, map your goals, and see if the fit feels right — no commitment.",
  ],
  highlights: [
    {
      title: "Your nearest Spanish tutor, online",
      description:
        "No physical distance to worry about — private 1:1 lessons come to you, wherever you live.",
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
      question: "Do you have Spanish tutors near me?",
      answer:
        "Bilingual Boost teaches 100% online, so there's no \"near me\" distance limit — you get the same 1:1 attention as an in-person tutor from wherever you live, on your schedule.",
    },
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
    // Root layout's title template appends " | Bilingual Boost" automatically.
    title: "Angielski Sulejówek | Lekcje Online 1:1 | Darmowa Próba",
    description:
      "Angielski Sulejówek: lekcje 1:1 online z Pauliną Poloca — bez dojazdów, rozmowa od pierwszej lekcji. Także Stara Miłosna. Darmowa lekcja próbna 30 min.",
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
  relatedLink: {
    label: "Szukasz szkoły językowej w Starej Miłosnej? Zobacz tę stronę →",
    href: "/szkola-jezykowa-stara-milosna",
  },
};

export const szkolaJezykowaStaraMilosnaLanding: SeoLandingContent = {
  path: "/szkola-jezykowa-stara-milosna",
  htmlLang: "pl",
  chromeLocale: "pl",
  metadata: {
    // Root layout's title template appends " | Bilingual Boost" automatically.
    title: "Szkoła Językowa Stara Miłosna | Angielski i Hiszpański Online",
    description:
      "Szkoła językowa Stara Miłosna: angielski i hiszpański online dla dzieci i dorosłych z Pauliną Poloca. Bez dojazdów. Darmowa lekcja próbna 30 min.",
  },
  label: "Szkoła językowa · Stara Miłosna",
  title: "Szkoła językowa Stara Miłosna — angielski i hiszpański online",
  subtitle:
    "Bilingual Boost to szkoła językowa prowadzona przez Paulinę Poloca, z lekcjami online dla mieszkańców Starej Miłosnej: dzieci, młodzieży i dorosłych.",
  paragraphs: [
    "Szukasz szkoły językowej w Starej Miłosnej? Zamiast dojeżdżać na stacjonarne zajęcia, umów lekcję online 1:1 — ten sam kontakt z nauczycielem, bez straty czasu w drodze do Sulejówka czy Warszawy.",
    "Prowadzę zajęcia z angielskiego i hiszpańskiego dla różnych grup wiekowych: dzieci szkolne, nastolatków przygotowujących się do egzaminów oraz dorosłych, którzy chcą mówić pewnie w pracy i podróży.",
    "Każda lekcja jest dopasowana do ucznia — poziomu, tempa i celu. Zarezerwuj darmową lekcję próbną (30 min) i sprawdź, jak wygląda nauka online w naszej szkole językowej.",
  ],
  highlights: [
    {
      title: "Szkoła językowa bez dojazdów",
      description:
        "Lekcje online dla Starej Miłosnej — oszczędzasz czas dojazdu do Sulejówka czy Warszawy, a jakość zajęć zostaje taka sama.",
    },
    {
      title: "Angielski i hiszpański, każdy wiek",
      description:
        "Zajęcia dla dzieci, nastolatków i dorosłych — materiał i tempo dopasowane do ucznia.",
    },
    {
      title: "Darmowa lekcja próbna",
      description:
        "30 minut za darmo. Potem lekcje od 11 € (30 min), 16 € (45 min) lub 20 € (60 min).",
    },
  ],
  faqs: [
    {
      question: "Czy macie szkołę językową stacjonarną w Starej Miłosnej?",
      answer:
        "Zajęcia prowadzę online, co dla mieszkańców Starej Miłosnej oznacza brak dojazdów i pełną elastyczność godzin — kontakt z nauczycielem zostaje taki sam jak na zajęciach stacjonarnych.",
    },
    {
      question: "Czy szkoła językowa jest odpowiednia dla dzieci?",
      answer:
        "Tak. Prowadzę lekcje angielskiego i hiszpańskiego dla dzieci, nastolatków i dorosłych, dopasowane do wieku, poziomu i celu nauki.",
    },
    {
      question: "Jak zapisać się do szkoły językowej Bilingual Boost?",
      answer:
        "Zarezerwuj darmową lekcję próbną online (30 min). Poznamy poziom i cele ucznia i zaproponujemy plan nauki.",
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
    name: "Szkoła językowa — Stara Miłosna / online",
    description:
      "Lekcje angielskiego i hiszpańskiego online dla Starej Miłosnej, dla dzieci i dorosłych. Darmowa lekcja próbna 30 min.",
    inLanguage: "pl",
  },
  relatedLink: {
    label: "Szukasz angielskiego w Sulejówku? Zobacz tę stronę →",
    href: "/angielski-sulejowek",
  },
};

export const seoLandings = {
  spanishClasses: spanishClassesLanding,
  angielskiSulejowek: angielskiSulejowekLanding,
  szkolaJezykowaStaraMilosna: szkolaJezykowaStaraMilosnaLanding,
} as const;

/** Maps each fixed-language landing page's path to its `<html lang>` value. */
export const fixedLocaleLandingPaths: Record<string, "en" | "pl"> =
  Object.fromEntries(
    Object.values(seoLandings).map((landing) => [landing.path, landing.htmlLang]),
  );
