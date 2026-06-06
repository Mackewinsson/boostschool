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
      { label: "Precios", href: "#planes" },
      { label: "FAQ", href: "#faq" },
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
    { value: "GRATIS", label: "tu primera clase de prueba", hrefKey: "calendly" },
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
  },
  plansSection: {
    label: "Precios",
    title: "Precios y duración",
  },
  plans: {
    title: "Precios y duración",
    description:
      "Primera clase de prueba (30 min): ¡GRATIS! Elige lo que necesites o combínalo según tus objetivos.",
    monthlyLabel: "Clase de prueba",
    monthlyPrice: "GRATIS",
    priceSubtext: "30 minutos · sin compromiso",
    cta: "Reserva tu clase de prueba",
    note: "Reserva online con Calendly. Pago fácil — detalles próximamente.",
    features: [
      { plain: "30 min → 11 €" },
      { plain: "45 min → 16 €" },
      { plain: "60 min → 20 €" },
      {
        plain:
          "Inglés: conversación práctica, general, gramática, por objetivos (turismo, exámenes…)",
      },
      {
        before: "Inglés empresarial — escríbeme en ",
        link: { label: "Contacto", hrefKey: "contact" },
        after: " para una propuesta personalizada",
      },
      {
        plain:
          "Español: conversación práctica, general, gramática, por objetivos",
      },
      {
        before: "Inglés y español en grupo (2–3 personas) — 60 min, 15 € por persona. ",
        link: { label: "Escríbeme por WhatsApp", hrefKey: "whatsapp" },
        after: " para coordinar.",
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
          "Una buena conexión a internet, ganas de aprender y energía positiva y mente abierta.",
      },
    },
    {
      question: "¿Cómo empezar?",
      answer: {
        plain:
          "Escríbeme por WhatsApp o correo — o usa el formulario de contacto —, cuéntame brevemente quién eres, tus objetivos y qué te gustaría trabajar. Elige día y hora para tu clase de prueba. ¡Nos vemos en clase!",
      },
    },
    {
      question: "¿Ofreces inglés empresarial?",
      answer: {
        before: "Sí. Para inglés de negocios o empresarial, escríbeme en la sección ",
        link: { label: "Contacto", hrefKey: "contact" },
        after:
          " para una propuesta personalizada: clases individuales y en grupos de 2 personas.",
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
    whatsappLabel: "WhatsApp",
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
};
