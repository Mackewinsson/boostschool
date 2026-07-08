import type { LandingContent } from "./types";

export const pl: LandingContent = {
  metadata: {
    title: "Bilingual Boost | Angielski i hiszpański z Pauliną Poloca",
    description:
      "Rozwijaj się i ucz angielskiego oraz hiszpańskiego z Pauliną. Spersonalizowane lekcje online, rozmowa od pierwszego dnia i darmowa lekcja próbna.",
  },
  ui: {
    openMenuAria: "Otwórz menu",
    themeToggleAria: "Zmień motyw",
    languageToggleAria: "Zmień język",
    copyright: "Wszelkie prawa zastrzeżone.",
    privacyLinkLabel: "Prywatność",
    portalNavLabel: "Moja strefa",
    signInNavLabel: "Zaloguj się",
    blogLinkLabel: "Blog",
    resourcesLinkLabel: "Darmowy przewodnik",
  },
  brand: {
    name: "Bilingual Boost",
    badge: "Darmowa lekcja próbna",
    tagline: "Angielski i hiszpański z Pauliną Poloca",
  },
  nav: {
    ctaLabel: "Zarezerwuj lekcję próbną",
    links: [
      { label: "Lekcje", href: "#programas" },
      { label: "Metoda", href: "#resultados" },
      { label: "O mnie", href: "#sobre-mi" },
      { label: "Opinie", href: "#testimonios" },
      { label: "Cennik", href: "#planes" },
      { label: "FAQ", href: "#faq" },
      { label: "Kontakt", href: "#contacto" },
    ],
  },
  hero: {
    titleBefore: "Rozwijaj się i ucz ",
    titleHighlight: "angielskiego/hiszpańskiego",
    subtitle:
      "Spersonalizowane lekcje online z Pauliną — mów płynnie, na chillu i z pewnością siebie!",
    primaryCta: "Zarezerwuj lekcję próbną",
    secondaryCta: "Zobacz lekcje",
  },
  stats: [
    { value: "5+ lat", label: "nauczania z pasją" },
    { value: "3 języki", label: "płynnie · +2 w nauce" },
    { value: "ZA DARMO", label: "pierwsza lekcja próbna", hrefKey: "booking" },
  ],
  about: {
    label: "O mnie",
    title: "Cześć! Jestem Paulina",
    imageAlt: "Paulina Poloca, nauczycielka angielskiego i hiszpańskiego",
    paragraphs: [
      "Jestem nauczycielką angielskiego i hiszpańskiego i od ponad 5 lat uczę z radością, ciepłem i pasją.",
      "Uwielbiam nawiązywać kontakt z ludźmi, pomagać im uczyć się i pokazywać, że nauka języka to także sposób na rozwój osobisty i lepsze samopoczucie. I tak — może być przy tym zabawnie i transformacyjnie!",
      "Mówię płynnie w 3 językach i obecnie uczę się 2 kolejnych. Dlatego doskonale rozumiem trudności, wątpliwości i blokady, które możesz mieć przy nauce obcego języka.",
      "Sama przeszłam tę drogę i wiem, jak pomóc Ci przezwyciężyć strach przed mówieniem, żeby móc czuć się pewniej i swobodniej, kiedy mówisz!",
    ],
  },
  featuresSection: {
    label: "Lekcje online",
    title: "Dlaczego warto uczyć się ze mną?",
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
      title: "Mów!",
      description:
        "Na każdej lekcji pracujemy nad tym żeby rozmawiać o tym, czego potrzebujesz: podróże, nawiązywanie znajomości, rozmowy w pracy…",
    },
    {
      title: "Immersja językowa",
      description:
        "Tworzę środowisko immersji językowej, jakbyś mieszkał/a w kraju anglo- lub hiszpańskojęzycznym.",
    },
    {
      title: "Personalizacja",
      description:
        "Jeśli chcesz mówić płynnie, poprawnie i dostawać przydatne wskazówki — jesteś we właściwym miejscu. Wszystko jest zawsze dopasowane do każdego ucznia, z indywidualnymi podejściem i tipami!",
    },
  ],
  testimonialsSection: {
    label: "Opinie",
    title: "Co mówią moi uczniowie w Google",
  },
  testimonialsEmbed: {
    viewAllLabel: "Zobacz wszystkie opinie w Google",
    fallbackText: "Przeczytaj opinie uczniów w Google Maps.",
    poweredByLabel: "Opinie z Google",
    mapEmbedTitle: "Bilingual Boost w Google Maps",
  },
  plansSection: {
    label: "Lekcje",
    title: "Lekcje i czas trwania",
  },
  plans: {
    title: "Lekcje i czas trwania",
    description:
      "Pierwsza lekcja próbna (30 min): ZA DARMO! Wybierz to, czego potrzebujesz, albo łącz według swoich celów.",
    monthlyLabel: "Lekcja próbna",
    monthlyPrice: "ZA DARMO",
    priceSubtext: "30 minut · bez zobowiązań",
    cta: "Zarezerwuj lekcję próbną",
    note: "Rezerwacja online przez Cal.com. Łatwa płatność — szczegóły wkrótce.",
    classTypesLabel: "Dostępne lekcje",
    features: [
      { plain: "30, 45 lub 60 minut", kind: "duration" },
      {
        plain:
          "Hiszpański: konwersacje, ogólny, gramatyka, według celów",
        kind: "class",
      },
      {
        plain:
          "Angielski: konwersacje, ogólny, gramatyka, według celów (turystyka, egzaminy…)",
        kind: "class",
      },
      {
        before:
          "Angielski biznesowy: komunikacja w firmie, spotkania, prezentacje. Napisz w ",
        link: { label: "Kontakcie", hrefKey: "contact" },
        after: ", aby uzyskać więcej informacji.",
        kind: "business",
      },
      {
        before:
          "Hiszpański biznesowy: komunikacja w firmie, spotkania, prezentacje. Napisz w ",
        link: { label: "Kontakcie", hrefKey: "contact" },
        after: ", aby uzyskać więcej informacji.",
        kind: "business",
      },
      {
        before:
          "Angielski i hiszpański w grupie (2–3 osoby) — 60 min. Napisz do mnie na WhatsApp lub przez ",
        link: { label: "formularz kontaktowy", hrefKey: "contact" },
        after: ", żeby ustalić szczegóły.",
        kind: "group",
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
          "Dobre połączenie internetowe, zeszyt i długopis, chęć do nauki oraz pozytywną energię i otwarty umysł.",
      },
    },
    {
      question: "Jak zacząć?",
      answer: {
        plain:
          "Napisz do mnie poprzez WhatsApp lub e-mail — albo użyj formularza kontaktowego — opowiedz krótko, kim jesteś, jakie masz cele i nad czym chcesz pracować. Wybierz dzień i godzinę lekcji próbnej. Do zobaczenia",
      },
    },
    {
      question: "Czy oferujesz angielski i hiszpański biznesowy?",
      answer: {
        before:
          "Tak. W sprawie angielskiego i hiszpańskiego biznesowego dla firm napisz do mnie w sekcji ",
        link: { label: "Kontakt", hrefKey: "contact" },
        after:
          " aby uzyskać indywidualną ofertę: lekcje indywidualne i w grupach 2–3-osobowych.",
      },
    },
  ],
  contact: {
    label: "Kontakt",
    title: "Napisz do mnie",
    description:
      "Opowiedz mi, kim jesteś, jakie masz cele i nad czym chcesz pracować. Odpowiem najszybciej jak to możliwe.",
    fields: {
      name: "Imię i nazwisko",
      namePlaceholder: "Twoje imię i nazwisko",
      email: "E-mail",
      emailPlaceholder: "twoj@email.com",
      message: "Treść wiadomości",
      messagePlaceholder: "Opowiedz o swoich celach i nad czym chciałbyś/abyś pracować…",
      submit: "Wyślij wiadomość",
    },
    whatsapp: {
      divider: "lub",
      title: "Napisz na WhatsApp",
      hint: "Szybka odpowiedź",
      ariaLabel: "Napisz do Bilingual Boost na WhatsApp pod numer +48 515 025 685",
    },
    successTitle: "Wiadomość wysłana!",
    successBody: "Dziękuję za kontakt. Odpowiem najszybciej jak to możliwe.",
    errorGeneric: "Nie udało się wysłać wiadomości. Spróbuj ponownie.",
    errorName: "Wpisz imię, aby kontynuować.",
    errorEmail: "Wpisz prawidłowy adres e-mail.",
    errorMessage: "Wpisz wiadomość o długości co najmniej 10 znaków.",
    privacyNote: "Wysyłając formularz, akceptujesz naszą",
    privacyLinkLabel: "politykę prywatności",
  },
  finalCta: {
    titleBefore: "Powiedz, czego potrzebujesz i ",
    titleHighlight: "zaczynamy",
    subtitle:
      "Jeśli szukasz kogoś, kto Cię zmotywuje, wysłucha i pomoże mówić z pewnością siebie i optymizmem… jesteś we właściwym miejscu!",
    cta: "Zarezerwuj lekcję próbną",
  },
  mobileStickyCta: "Zarezerwuj lekcję próbną",
  leadMagnetSection: {
    label: "Darmowy materiał",
    title: "Pobierz przewodnik, jak mówić z pewnością",
    description:
      "Praktyczny PDF z pomysłami, jak swobodniej mówić, uporządkować naukę i iść do przodu bez blokady.",
    bullets: [
      "Proste nawyki do codziennej praktyki",
      "Jak przełamać strach mówienia już teraz",
      "Jasny plan na kolejny tydzień nauki",
    ],
    form: {
      nameLabel: "Imię",
      namePlaceholder: "Twoje imię",
      emailLabel: "E-mail",
      emailPlaceholder: "twoj@email.com",
      submitLabel: "Chcę darmowy przewodnik",
      privacyNote: "Używamy Twojego e-maila tylko do wysyłki przewodnika i okazjonalnych tipów. Zobacz naszą",
      privacyLinkLabel: "politykę prywatności",
      successTitle: "Gotowe! Twój przewodnik czeka",
      successBody: "Sprawdź skrzynkę lub pobierz przewodnik od razu przyciskiem poniżej.",
      downloadLabel: "Pobierz przewodnik PDF",
      errorGeneric: "Nie udało się przetworzyć żądania. Spróbuj ponownie.",
      errorName: "Wpisz imię, aby kontynuować.",
      errorEmail: "Wpisz poprawny adres e-mail.",
    },
  },
  leadMagnetPage: {
    metadata: {
      title: "Darmowy przewodnik",
      description:
        "Pobierz darmowy przewodnik Bilingual Boost, aby mówić po angielsku lub hiszpańsku z większą pewnością.",
    },
    label: "Darmowy materiał",
    title: "Darmowy przewodnik: mów z pewnością",
    subtitle:
      "Zostaw imię i e-mail, a wyślę Ci PDF od razu. Idealne, jeśli chcesz zacząć już teraz we własnym tempie.",
    backLabel: "Wróć na stronę główną",
    bullets: [
      "PDF do pobrania od razu",
      "Tipy do zastosowania w tym tygodniu",
      "Podejście oparte na rozmowie, bez stresu",
    ],
    form: {
      nameLabel: "Imię",
      namePlaceholder: "Twoje imię",
      emailLabel: "E-mail",
      emailPlaceholder: "twoj@email.com",
      submitLabel: "Wyślij mi darmowy przewodnik",
      privacyNote: "Używamy Twojego e-maila tylko do wysyłki przewodnika i okazjonalnych tipów. Zobacz naszą",
      privacyLinkLabel: "politykę prywatności",
      successTitle: "Gotowe! Twój przewodnik czeka",
      successBody: "Sprawdź skrzynkę lub pobierz przewodnik od razu przyciskiem poniżej.",
      downloadLabel: "Pobierz przewodnik PDF",
      errorGeneric: "Nie udało się przetworzyć żądania. Spróbuj ponownie.",
      errorName: "Wpisz imię, aby kontynuować.",
      errorEmail: "Wpisz poprawny adres e-mail.",
    },
  },
  blogSection: {
    label: "Blog",
    title: "Porady, jak uczyć się z pewnością",
    viewAllLabel: "Zobacz wszystkie artykuły",
    emptyLabel: "Wkrótce opublikujemy nowe artykuły.",
    readMoreLabel: "Czytaj więcej",
    readingTimeLabel: "{minutes} min czytania",
  },
  blogPage: {
    metadata: {
      title: "Blog | Bilingual Boost",
      description:
        "Praktyczne porady, jak uczyć się angielskiego i hiszpańskiego z pewnością, przez rozmowę i skuteczne nawyki.",
    },
    label: "Blog",
    title: "Porady, jak uczyć się z pewnością",
    subtitle:
      "Jasne, praktyczne pomysły, żeby swobodniej mówić, uporządkować naukę i iść do przodu.",
    backLabel: "Wróć na stronę główną",
    emptyLabel: "Brak artykułów w tym języku.",
    readMoreLabel: "Czytaj więcej",
    readingTimeLabel: "{minutes} min czytania",
    ctaTitle: "Chcesz przećwiczyć to na lekcji?",
    ctaSubtitle: "Zarezerwuj darmową lekcję próbną i ułożymy Twój plan.",
    ctaLabel: "Zarezerwuj lekcję próbną",
    backToBlogLabel: "Wróć do bloga",
  },
  bookingPage: {
    metadata: {
      title: "Rezerwacja lekcji próbnej | Bilingual Boost",
      description:
        "Zarezerwuj darmową 30-minutową lekcję próbną z Pauliną Poloca. Wybierz dzień i godzinę online.",
    },
    title: "Zarezerwuj lekcję próbną",
    subtitle: "30 minut · za darmo · bez zobowiązań",
    backLabel: "Wróć na stronę główną",
    fallbackText:
      "Gdy uruchomimy kalendarz, napisz do mnie na WhatsApp lub użyj formularza kontaktowego.",
  },
};
