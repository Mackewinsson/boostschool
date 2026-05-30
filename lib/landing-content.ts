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

export const brand = {
  name: "Bilingual Boost",
  badge: "Clase de prueba gratis",
  tagline: "Inglés y español con Paulina Poloca",
};

export const nav = {
  ctaLabel: "Reserva tu clase de prueba",
  links: [
    { label: "Sobre mí", href: "#sobre-mi" },
    { label: "Clases", href: "#programas" },
    { label: "Metodología", href: "#resultados" },
    { label: "Testimonios", href: "#testimonios" },
    { label: "Precios", href: "#planes" },
    { label: "FAQ", href: "#faq" },
    { label: "Contacto", href: "#contacto" },
  ] as NavLink[],
};

export const hero = {
  titleBefore: "Organízate, supérate y aprende ",
  titleHighlight: "inglés/español",
  subtitle:
    "Clases online personalizadas con Paulina Poloca — para que te sueltes al hablar y aprendas con confianza.",
  primaryCta: "Reserva tu clase de prueba",
  secondaryCta: "Ver clases",
};

export const stats: Stat[] = [
  { value: "5+ años", label: "enseñando con pasión" },
  { value: "3 idiomas", label: "con fluidez · +2 aprendiendo" },
  { value: "GRATIS", label: "tu primera clase de prueba" },
];

export const about: AboutSection = {
  label: "Sobre mí",
  title: "¡Hola! Soy Paulina",
  imageAlt: "Paulina Poloca, profe de inglés y español",
  paragraphs: [
    "Soy profe de inglés y español, y enseño con mucha alegría, cercanía y pasión desde hace más de 5 años.",
    "Me encanta conectar con otras personas, ayudarlas a soltarse al hablar y demostrar que aprender un idioma también es una forma de crecer como persona y sentirse mejor con uno mismo. Y sí, también puede ser divertido y transformador!!",
    "Hablo 3 idiomas con fluidez y actualmente estoy aprendiendo 2 más. Por eso, entiendo perfectamente las dificultades, dudas o bloqueos que puedes tener al aprender una lengua extranjera.",
    "Yo también he pasado por ese camino, y sé cómo ayudarte a superar el miedo a hablar para que te sientas más seguro/a y libre al expresarte.",
  ],
};

export const featuresSection: SectionHeading = {
  label: "Clases online",
  title: "¿Por qué tener clases conmigo?",
};

export const features: Feature[] = [
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
];

export const outcomesSection: SectionHeading & { linkText: string } = {
  label: "Metodología",
  title: "¿Cómo son las clases? ¿Cómo enseño?",
  linkText: "Reserva tu clase de prueba",
};

export const outcomes: Feature[] = [
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
];

export const testimonialsSection: SectionHeading = {
  label: "Testimonios",
  title: "Próximamente: historias de alumnos",
};

export const testimonials: Testimonial[] = [
  {
    name: "Próximamente",
    role: "Testimonios de alumnos",
    quote:
      "Estamos recopilando experiencias reales de quienes aprendieron con Paulina. Si ya tomaste clases, ¡tu historia puede aparecer aquí!",
  },
  {
    name: "Próximamente",
    role: "Testimonios de alumnos",
    quote:
      "¿Qué cambió en tu confianza al hablar? ¿Qué te gustó del enfoque de Paulina? ¿Recomendarías las clases a un amigo/a?",
  },
  {
    name: "Próximamente",
    role: "Testimonios de alumnos",
    quote:
      "Mientras tanto, reserva tu clase de prueba gratis y cuéntame tus objetivos — me encantará conocerte.",
  },
];

export const plansSection: SectionHeading = {
  label: "Precios",
  title: "Precios y duración",
};

export const plans = {
  title: "Precios y duración",
  description:
    "Primera clase de prueba (30 min): ¡GRATIS! Elige lo que necesites o combínalo según tus objetivos.",
  monthlyLabel: "Clase de prueba",
  monthlyPrice: "GRATIS",
  priceSubtext: "30 minutos · sin compromiso",
  cta: "Reserva tu clase de prueba",
  note: "Pago fácil — detalles próximamente. Reserva online con Calendly o Google Calendar — próximamente.",
  features: [
    "30 min → 11 €",
    "45 min → 16 €",
    "60 min → 20 €",
    "Inglés: conversación práctica, general, gramática, por objetivos (turismo, exámenes…)",
    "Inglés empresarial — escríbeme en Contacto para propuesta personalizada",
    "Español: conversación práctica, general, gramática, por objetivos (sin español de negocios)",
  ],
};

export const faqSection: SectionHeading = {
  label: "Preguntas frecuentes",
  title: "Resolvemos tus dudas",
};

export const faqs: FaqItem[] = [
  {
    question: "¿Qué necesitas tú?",
    answer:
      "Una buena conexión a internet, ganas de aprender y energía positiva y mente abierta.",
  },
  {
    question: "¿Cómo empezar?",
    answer:
      "Escríbeme por WhatsApp o correo — o usa el formulario de contacto —, cuéntame brevemente quién eres, tus objetivos y qué te gustaría trabajar. Elige día y hora para tu clase de prueba. ¡Nos vemos en clase!",
  },
  {
    question: "¿Ofreces inglés empresarial?",
    answer:
      "Sí. Para inglés de negocios o empresarial, escríbeme en la sección Contacto para una propuesta personalizada: clases individuales y en grupos de 2 personas.",
  },
];

export const contact: ContactSection = {
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
  socialLinks: [
    { label: "Instagram", href: "#" },
    { label: "TikTok", href: "#" },
    { label: "WhatsApp", href: "#" },
  ],
  note: "Próximamente conectaremos el envío del formulario y los enlaces de redes.",
};

export const finalCta = {
  titleBefore: "Dime qué necesitas y ",
  titleHighlight: "arrancamos",
  subtitle:
    "Si estás buscando a alguien que te anime, te escuche y te ayude a hablar con seguridad y mucho optimismo… ¡bienvenido/a!",
  cta: "Reserva tu clase de prueba",
};

export const mobileStickyCta = "Reserva tu clase de prueba";
