import type { LandingContent } from "./types";

export const pl: LandingContent = {
  metadata: {
    title: "Bilingual Boost | Angielski i hiszpański z Pauliną Poloca",
    description:
      "Uporządkuj się, rozwijaj i ucz angielskiego oraz hiszpańskiego z Pauliną Poloca. Spersonalizowane lekcje online, rozmowa od pierwszego dnia i darmowa lekcja próbna.",
  },
  ui: {
    openMenuAria: "Otwórz menu",
    themeToggleAria: "Zmień motyw",
    languageToggleAria: "Zmień język",
    copyright: "Wszelkie prawa zastrzeżone.",
  },
  brand: {
    name: "Bilingual Boost",
    badge: "Darmowa lekcja próbna",
    tagline: "Angielski i hiszpański z Pauliną Poloca",
  },
  nav: {
    ctaLabel: "Zarezerwuj lekcję próbną",
    links: [
      { label: "O mnie", href: "#sobre-mi" },
      { label: "Lekcje", href: "#programas" },
      { label: "Metoda", href: "#resultados" },
      { label: "Opinie", href: "#testimonios" },
      { label: "Cennik", href: "#planes" },
      { label: "FAQ", href: "#faq" },
      { label: "Kontakt", href: "#contacto" },
    ],
  },
  hero: {
    titleBefore: "Uporządkuj się, rozwijaj i ucz się ",
    titleHighlight: "angielskiego/hiszpańskiego",
    subtitle:
      "Spersonalizowane lekcje online z Pauliną Poloca — żebyś swobodnie mówił/a i uczył/a się z pewnością siebie.",
    primaryCta: "Zarezerwuj lekcję próbną",
    secondaryCta: "Zobacz lekcje",
  },
  stats: [
    { value: "5+ lat", label: "nauczania z pasją" },
    { value: "3 języki", label: "płynnie · +2 w nauce" },
    { value: "ZA DARMO", label: "pierwsza lekcja próbna", hrefKey: "calendly" },
  ],
  about: {
    label: "O mnie",
    title: "Cześć! Jestem Paulina",
    imageAlt: "Paulina Poloca, nauczycielka angielskiego i hiszpańskiego",
    paragraphs: [
      "Jestem nauczycielką angielskiego i hiszpańskiego i od ponad 5 lat uczę z radością, ciepłem i pasją.",
      "Uwielbiam nawiązywać kontakt z ludźmi, pomagać im rozluźnić się podczas mówienia i pokazywać, że nauka języka to także sposób na rozwój osobisty i lepsze samopoczucie. I tak — może być przy tym zabawnie i transformacyjnie!",
      "Mówię płynnie w 3 językach i obecnie uczę się 2 kolejnych. Dlatego doskonale rozumiem trudności, wątpliwości i blokady, które możesz mieć przy nauce obcego języka.",
      "Sama przeszłam tę drogę i wiem, jak pomóc Ci przezwyciężyć strach przed mówieniem, żebyś czuł/a się pewniej i swobodniej, gdy się wypowiadasz.",
    ],
  },
  featuresSection: {
    label: "Lekcje online",
    title: "Dlaczego warto uczyć się u mnie?",
  },
  features: [
    {
      title: "W pełni spersonalizowane podejście",
      description:
        "Dostosowuję treść, tempo i tematy do Twojego poziomu, celów i stylu uczenia się.",
    },
    {
      title: "Empatia i jasność",
      description:
        "Sama uczyłam się języków, więc doskonale wiem, jak to jest zaczynać od zera albo utknąć w miejscu. Prowadzę Cię krok po kroku z empatią i jasnością.",
    },
    {
      title: "Luźna atmosfera — mówisz od pierwszego dnia",
      description:
        "Lekcje są w luźnej atmosferze, bez stresu, ale z dużą motywacją. Nie znudzą Cię mechaniczne ćwiczenia — tutaj skupiamy się na mówieniu od samego pierwszego dnia.",
    },
  ],
  outcomesSection: {
    label: "Metoda",
    title: "Jak wyglądają lekcje? Jak uczę?",
    linkText: "Zarezerwuj lekcję próbną",
  },
  outcomes: [
    {
      title: "Prawdziwa rozmowa",
      description:
        "Na każdej lekcji pracujemy nad prawdziwą rozmową — taką, której potrzebujesz, żeby poruszać się po świecie, nawiązywać znajomości, mówić w pracy albo wyrażać swoje najgłębsze myśli.",
    },
    {
      title: "Immersja językowa",
      description:
        "Tworzę środowisko immersji językowej, jakbyś mieszkał/a w kraju anglo- lub hiszpańskojęzycznym.",
    },
    {
      title: "Spersonalizowane poprawki",
      description:
        "Jeśli chcesz mówić płynnie, czuć się wysłuchany/a i dostawać przydatne poprawki — jesteś we właściwym miejscu. Wszystko jest zawsze dopasowane do każdego ucznia, z indywidualnymi poprawkami i wskazówkami.",
    },
  ],
  testimonialsSection: {
    label: "Opinie",
    title: "Co mówią moi uczniowie w Google",
  },
  testimonialsEmbed: {
    viewAllLabel: "Zobacz wszystkie opinie w Google",
    fallbackText: "Wkrótce podłączymy opinie z Google.",
    poweredByLabel: "Opinie z Google",
  },
  plansSection: {
    label: "Cennik",
    title: "Cennik i czas trwania",
  },
  plans: {
    title: "Cennik i czas trwania",
    description:
      "Pierwsza lekcja próbna (30 min): ZA DARMO! Wybierz to, czego potrzebujesz, albo łącz według swoich celów.",
    monthlyLabel: "Lekcja próbna",
    monthlyPrice: "ZA DARMO",
    priceSubtext: "30 minut · bez zobowiązań",
    cta: "Zarezerwuj lekcję próbną",
    note: "Rezerwacja online przez Calendly. Łatwa płatność — szczegóły wkrótce.",
    features: [
      { plain: "30 min → 11 €" },
      { plain: "45 min → 16 €" },
      { plain: "60 min → 20 €" },
      {
        plain:
          "Angielski: praktyczna rozmowa, ogólny, gramatyka, według celów (turystyka, egzaminy…)",
      },
      {
        before: "Angielski biznesowy — napisz do mnie w ",
        link: { label: "Kontakcie", hrefKey: "contact" },
        after: " po indywidualną ofertę",
      },
      {
        plain:
          "Hiszpański: praktyczna rozmowa, ogólny, gramatyka, według celów",
      },
      {
        before: "Angielski i hiszpański w grupie (2–3 osoby) — 60 min, 15 € za osobę. ",
        link: { label: "Napisz do mnie na WhatsApp", hrefKey: "whatsapp" },
        after: ", żeby ustalić szczegóły.",
      },
    ],
  },
  faqSection: {
    label: "Najczęściej zadawane pytania",
    title: "Odpowiadamy na Twoje pytania",
  },
  faqs: [
    {
      question: "Czego potrzebujesz?",
      answer: {
        plain:
          "Dobre połączenie internetowe, chęć do nauki oraz pozytywną energię i otwarty umysł.",
      },
    },
    {
      question: "Jak zacząć?",
      answer: {
        plain:
          "Napisz do mnie na WhatsApp lub mail — albo użyj formularza kontaktowego — opowiedz krótko, kim jesteś, jakie masz cele i nad czym chciałbyś/abyś pracować. Wybierz dzień i godzinę lekcji próbnej. Do zobaczenia na lekcji!",
      },
    },
    {
      question: "Czy oferujesz angielski biznesowy?",
      answer: {
        before: "Tak. W sprawie angielskiego biznesowego lub korporacyjnego napisz do mnie w sekcji ",
        link: { label: "Kontakt", hrefKey: "contact" },
        after:
          " po indywidualną ofertę: lekcje indywidualne i w grupach 2-osobowych.",
      },
    },
  ],
  contact: {
    label: "Kontakt",
    title: "Napisz do mnie",
    description:
      "Opowiedz mi, kim jesteś, jakie masz cele i nad czym chciałbyś/abyś pracować. Odpowiem najszybciej jak to możliwe.",
    fields: {
      name: "Imię i nazwisko",
      namePlaceholder: "Twoje imię i nazwisko",
      email: "E-mail",
      emailPlaceholder: "twoj@email.com",
      message: "Treść wiadomości",
      messagePlaceholder: "Opowiedz o swoich celach i nad czym chciałbyś/abyś pracować…",
      submit: "Wyślij wiadomość",
    },
    whatsappLabel: "WhatsApp",
    note: "Wkrótce podłączymy wysyłkę formularza.",
  },
  finalCta: {
    titleBefore: "Powiedz, czego potrzebujesz, a ",
    titleHighlight: "zaczynamy",
    subtitle:
      "Jeśli szukasz kogoś, kto Cię zmotywuje, wysłucha i pomoże mówić z pewnością siebie i optymizmem… witaj!",
    cta: "Zarezerwuj lekcję próbną",
  },
  mobileStickyCta: "Zarezerwuj lekcję próbną",
};
