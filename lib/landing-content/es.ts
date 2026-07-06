import type { LandingContent } from "./types";

export const es: LandingContent = {
  metadata: {
    title: "Bilingual Boost | Inglés y español con Paulina Poloca",
    description:
      "Organízate, supérate y aprende inglés y español con Paulina Poloca (English with Paulina Poloca). Clases online personalizadas, conversación desde el primer día, clase de prueba gratis.",
  },
  ui: {
    openMenuAria: "Abrir menú",
    themeToggleAria: "Cambiar tema",
    languageToggleAria: "Cambiar idioma",
    copyright: "Todos los derechos reservados.",
  },
  brand: {
    name: "Bilingual Boost",
    badge: "Clase de prueba gratis",
    tagline: "Inglés y español con Paulina Poloca",
  },
  nav: {
    ctaLabel: "Reserva tu clase de prueba",
    links: [
      { label: "Sobre mí", href: "#sobre-mi" },
      { label: "Clases", href: "#programas" },
      { label: "Metodología", href: "#resultados" },
      { label: "Testimonios", href: "#testimonios" },
      { label: "Clases", href: "#planes" },
      { label: "FAQ", href: "#faq" },
      { label: "Blog", href: "/blog" },
      { label: "Guía gratis", href: "/recursos" },
      { label: "Contacto", href: "#contacto" },
    ],
  },
  hero: {
    titleBefore: "Organízate, supérate y aprende ",
    titleHighlight: "inglés/español",
    subtitle:
      "Clases online personalizadas con Paulina Poloca — para que te sueltes al hablar y aprendas con confianza.",
    primaryCta: "Reserva tu clase de prueba",
    secondaryCta: "Ver clases",
  },
  stats: [
    { value: "5+ años", label: "enseñando con pasión" },
    { value: "3 idiomas", label: "con fluidez · +2 aprendiendo" },
    { value: "GRATIS", label: "tu primera clase de prueba", hrefKey: "booking" },
  ],
  about: {
    label: "Sobre mí",
    title: "¡Hola! Soy Paulina",
    imageAlt: "Paulina Poloca, profe de inglés y español",
    paragraphs: [
      "Soy profe de inglés y español, y enseño con mucha alegría, cercanía y pasión desde hace más de 5 años.",
      "Me encanta conectar con otras personas, ayudarlas a soltarse al hablar y demostrar que aprender un idioma también es una forma de crecer como persona y sentirse mejor con uno mismo. Y sí, también puede ser divertido y transformador!!",
      "Hablo 3 idiomas con fluidez y actualmente estoy aprendiendo 2 más. Por eso, entiendo perfectamente las dificultades, dudas o bloqueos que puedes tener al aprender una lengua extranjera.",
      "Yo también he pasado por ese camino, y sé cómo ayudarte a superar el miedo a hablar para que te sientas más seguro/a y libre al expresarte.",
    ],
  },
  featuresSection: {
    label: "Clases online",
    title: "¿Por qué tener clases conmigo?",
  },
  features: [
    {
      title: "Enfoque completamente personalizado",
      description:
        "Adapto el contenido, la velocidad y los temas a tu nivel, tus objetivos y tu estilo de aprendizaje.",
    },
    {
      title: "Empatía y claridad",
      description:
        "Yo también he aprendido idiomas, así que entiendo perfectamente lo que se siente al empezar desde cero o al estancarse. Te acompaño paso a paso, con empatía y claridad.",
    },
    {
      title: "Buen rollo, hablas desde el primer día",
      description:
        "Las clases son con buen rollo, sin estrés, pero con mucha motivación. No te aburrirás haciendo ejercicios mecánicos: aquí el enfoque está en hablar desde el primer día.",
    },
  ],
  outcomesSection: {
    label: "Metodología",
    title: "¿Cómo son las clases? ¿Cómo enseño?",
    linkText: "Reserva tu clase de prueba",
  },
  outcomes: [
    {
      title: "Conversación real",
      description:
        "En cada sesión trabajamos la conversación real: la que necesitas para moverte por el mundo, hacer amigos, hablar en el trabajo o expresar tus ideas más profundas.",
    },
    {
      title: "Inmersión en el idioma",
      description:
        "Creo un entorno de inmersión en el idioma, como si vivieras en un país angloparlante o hispanohablante.",
    },
    {
      title: "Correcciones personalizadas",
      description:
        "Si quieres hablar con soltura, sentirte escuchado/a y recibir correcciones útiles, aquí tienes tu sitio. Todo está siempre ajustado a cada alumno, con correcciones y consejos personalizados.",
    },
  ],
  testimonialsSection: {
    label: "Reseñas",
    title: "Lo que dicen mis alumnos en Google",
  },
  testimonialsEmbed: {
    viewAllLabel: "Ver todas las reseñas en Google",
    fallbackText: "Próximamente conectaremos las reseñas de Google.",
    poweredByLabel: "Reseñas de Google",
    mapEmbedTitle: "Bilingual Boost en Google Maps",
  },
  plansSection: {
    label: "Clases",
    title: "Clases y duración",
  },
  plans: {
    title: "Clases y duración",
    description:
      "Primera clase de prueba (30 min): ¡GRATIS! Elige lo que necesites o combínalo según tus objetivos.",
    monthlyLabel: "Clase de prueba",
    monthlyPrice: "GRATIS",
    priceSubtext: "30 minutos · sin compromiso",
    cta: "Reserva tu clase de prueba",
    note: "Reserva online con Cal.com. Pago fácil — detalles próximamente.",
    classTypesLabel: "Clases disponibles",
    features: [
      { plain: "30, 45 o 60 minutos", kind: "duration" },
      {
        plain:
          "Español: conversación práctica, general, gramática, por objetivos",
        kind: "class",
      },
      {
        plain:
          "Inglés: conversación práctica, general, gramática, por objetivos (turismo, exámenes…)",
        kind: "class",
      },
      {
        before:
          "Inglés de negocios: comunicación empresarial, reuniones, presentaciones. Escríbeme en ",
        link: { label: "Contacto", hrefKey: "contact" },
        after: " para más detalles.",
        kind: "business",
      },
      {
        before:
          "Español de negocios: comunicación empresarial, reuniones, presentaciones. Escríbeme en ",
        link: { label: "Contacto", hrefKey: "contact" },
        after: " para más detalles.",
        kind: "business",
      },
      {
        before:
          "Clases grupales de inglés y español (2–3 personas) — 60 min. Escríbeme por WhatsApp o usa el ",
        link: { label: "formulario de contacto", hrefKey: "contact" },
        after: " para coordinar.",
        kind: "group",
      },
    ],
  },
  faqSection: {
    label: "Preguntas frecuentes",
    title: "Resolvemos tus dudas",
  },
  faqs: [
    {
      question: "¿Qué necesitas tú?",
      answer: {
        plain:
          "Una buena conexión a internet, un cuaderno y un lapicero, ganas de aprender, energía positiva y una mente abierta.",
      },
    },
    {
      question: "¿Cómo empezar?",
      answer: {
        plain:
          "Escríbeme por WhatsApp o correo — o usa el formulario de contacto — cuéntame brevemente quién eres, tus objetivos y qué te gustaría trabajar. Elige día y hora para tu clase de prueba. ¡Nos vemos en clase!",
      },
    },
    {
      question: "¿Ofreces inglés y español empresarial?",
      answer: {
        before:
          "Sí. Para inglés y español empresarial para empresas, escríbeme en la sección ",
        link: { label: "Contacto", hrefKey: "contact" },
        after:
          " para una propuesta personalizada: clases individuales y en grupos de 2-3 personas.",
      },
    },
  ],
  contact: {
    label: "Contacto",
    title: "Escríbeme",
    description:
      "Cuéntame quién eres, tus objetivos y qué te gustaría trabajar. Te respondo lo antes posible.",
    fields: {
      name: "Nombre y apellido",
      namePlaceholder: "Tu nombre completo",
      email: "Correo",
      emailPlaceholder: "tu@correo.com",
      message: "Contenido del mensaje",
      messagePlaceholder: "Cuéntame tus objetivos y qué te gustaría trabajar…",
      submit: "Enviar mensaje",
    },
    whatsapp: {
      divider: "o",
      title: "Escríbeme por WhatsApp",
      hint: "Respuesta rápida",
      ariaLabel: "Escribir a Bilingual Boost por WhatsApp al +48 515 025 685",
    },
    note: "Próximamente conectaremos el envío del formulario.",
  },
  finalCta: {
    titleBefore: "Dime qué necesitas y ",
    titleHighlight: "arrancamos",
    subtitle:
      "Si estás buscando a alguien que te anime, te escuche y te ayude a hablar con seguridad y mucho optimismo… ¡bienvenido/a!",
    cta: "Reserva tu clase de prueba",
  },
  mobileStickyCta: "Reserva tu clase de prueba",
  leadMagnetSection: {
    label: "Recurso gratis",
    title: "Descarga tu guía para hablar con confianza",
    description:
      "Un PDF práctico con ideas para soltarte al hablar, organizar tu estudio y avanzar sin quedarte bloqueado/a.",
    bullets: [
      "Hábitos sencillos para practicar todos los días",
      "Cómo perder el miedo a hablar desde ya",
      "Plan claro para tu próxima semana de estudio",
    ],
    form: {
      nameLabel: "Nombre",
      namePlaceholder: "Tu nombre",
      emailLabel: "Correo",
      emailPlaceholder: "tu@correo.com",
      submitLabel: "Quiero la guía gratis",
      privacyNote: "Usamos tu correo solo para enviarte la guía y tips ocasionales. Puedes darte de baja cuando quieras.",
      successTitle: "¡Listo! Tu guía te espera",
      successBody: "Revisa tu correo o descarga la guía ahora mismo con el botón de abajo.",
      downloadLabel: "Descargar guía PDF",
      errorGeneric: "No pudimos procesar tu solicitud. Inténtalo de nuevo.",
      errorName: "Escribe tu nombre para continuar.",
      errorEmail: "Escribe un correo válido.",
    },
  },
  leadMagnetPage: {
    metadata: {
      title: "Guía gratis | Bilingual Boost",
      description:
        "Descarga gratis la guía de Bilingual Boost para hablar inglés o español con más confianza.",
    },
    label: "Recurso gratis",
    title: "Guía gratis para hablar con confianza",
    subtitle:
      "Déjame tu nombre y correo y te envío el PDF al instante. Ideal si quieres empezar ya, a tu ritmo.",
    backLabel: "Volver al inicio",
    bullets: [
      "PDF descargable al momento",
      "Tips aplicables esta misma semana",
      "Enfoque conversacional, sin estrés",
    ],
    form: {
      nameLabel: "Nombre",
      namePlaceholder: "Tu nombre",
      emailLabel: "Correo",
      emailPlaceholder: "tu@correo.com",
      submitLabel: "Enviarme la guía gratis",
      privacyNote: "Usamos tu correo solo para enviarte la guía y tips ocasionales. Puedes darte de baja cuando quieras.",
      successTitle: "¡Listo! Tu guía te espera",
      successBody: "Revisa tu correo o descarga la guía ahora mismo con el botón de abajo.",
      downloadLabel: "Descargar guía PDF",
      errorGeneric: "No pudimos procesar tu solicitud. Inténtalo de nuevo.",
      errorName: "Escribe tu nombre para continuar.",
      errorEmail: "Escribe un correo válido.",
    },
  },
  blogSection: {
    label: "Blog",
    title: "Tips para aprender con confianza",
    viewAllLabel: "Ver todos los artículos",
    emptyLabel: "Próximamente publicaremos nuevos artículos.",
    readMoreLabel: "Leer más",
    readingTimeLabel: "{minutes} min de lectura",
  },
  blogPage: {
    metadata: {
      title: "Blog | Bilingual Boost",
      description:
        "Consejos prácticos para aprender inglés y español con confianza, conversación real y hábitos que funcionan.",
    },
    label: "Blog",
    title: "Tips para aprender con confianza",
    subtitle:
      "Ideas claras y prácticas para soltarte al hablar, organizar tu estudio y avanzar con buen rollo.",
    backLabel: "Volver al inicio",
    emptyLabel: "Aún no hay artículos publicados en este idioma.",
    readMoreLabel: "Leer más",
    readingTimeLabel: "{minutes} min de lectura",
    ctaTitle: "¿Quieres practicar esto en clase?",
    ctaSubtitle: "Reserva tu clase de prueba gratis y armamos tu plan personalizado.",
    ctaLabel: "Reserva tu clase de prueba",
    backToBlogLabel: "Volver al blog",
  },
  bookingPage: {
    metadata: {
      title: "Reservar clase de prueba | Bilingual Boost",
      description:
        "Reserva tu clase de prueba gratis de 30 minutos con Paulina Poloca. Elige día y hora online.",
    },
    title: "Reserva tu clase de prueba",
    subtitle: "30 minutos · gratis · sin compromiso",
    backLabel: "Volver al inicio",
    fallbackText:
      "Mientras activamos el calendario, escríbeme por WhatsApp o usa el formulario de contacto.",
  },
};
