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

export const brand = {
  name: "Bilingual Boost",
  badge: "Inscripciones abiertas",
};

export const nav = {
  links: [
    { label: "Programas", href: "#programas" },
    { label: "Resultados", href: "#resultados" },
    { label: "Testimonios", href: "#testimonios" },
    { label: "Planes", href: "#planes" },
    { label: "FAQ", href: "#faq" },
  ] as NavLink[],
};

export const hero = {
  title: "Habla inglés con confianza en menos tiempo",
  subtitle:
    "En Bilingual Boost aprendes con clases dinámicas, seguimiento real y un plan claro para avanzar semana a semana.",
  primaryCta: "Reserva tu clase de prueba",
  secondaryCta: "Ver programas",
};

export const stats: Stat[] = [
  { value: "+4,500", label: "estudiantes impulsaron su inglés" },
  { value: "92%", label: "de alumnos mejoran su fluidez en 90 días" },
  { value: "4.9/5", label: "calificación promedio de satisfacción" },
];

export const features: Feature[] = [
  {
    title: "Método práctico y conversacional",
    description:
      "Hablas desde la primera clase con actividades reales para trabajo, viajes y vida diaria.",
  },
  {
    title: "Mentores que te acompañan",
    description:
      "Recibes feedback personalizado, metas semanales y soporte constante para no perder el ritmo.",
  },
  {
    title: "Horarios flexibles para tu rutina",
    description:
      "Elige mañana, tarde o noche y estudia en vivo desde donde estés, sin frenar tus planes.",
  },
];

export const outcomes: Feature[] = [
  {
    title: "Más oportunidades laborales",
    description: "Mejora entrevistas, presentaciones y reuniones en inglés.",
  },
  {
    title: "Comunicación segura al viajar",
    description: "Exprésate con naturalidad en aeropuertos, hoteles y nuevas ciudades.",
  },
  {
    title: "Progreso visible cada mes",
    description: "Evalúa tu avance con indicadores simples y objetivos alcanzables.",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Camila R.",
    role: "Analista de marketing",
    quote:
      "Pensaba que nunca iba a soltarme al hablar. En Bilingual Boost gané seguridad y hoy participo en reuniones globales sin miedo.",
  },
  {
    name: "Diego M.",
    role: "Desarrollador de software",
    quote:
      "El cambio fue real. En tres meses pasé de evitar hablar inglés a liderar demos con clientes de EE. UU.",
  },
  {
    name: "Valentina P.",
    role: "Emprendedora",
    quote:
      "La metodología es clara y motivadora. Cada clase me deja herramientas concretas para usar en mi negocio.",
  },
];

export const plans = {
  title: "Elige tu impulso ideal",
  description:
    "Empieza hoy con una clase de prueba y descubre el plan que mejor se adapta a tu objetivo.",
  monthlyLabel: "Plan mensual desde",
  monthlyPrice: "USD 59",
  cta: "Quiero comenzar ahora",
  note: "Sin contratos largos. Puedes pausar o cambiar de nivel cuando lo necesites.",
  features: [
    "Clases en vivo con docentes certificados",
    "Grupos reducidos (máx. 8 personas)",
    "Materiales y grabaciones incluidos",
    "Seguimiento personalizado semanal",
    "Comunidad privada de práctica",
  ],
};

export const faqs: FaqItem[] = [
  {
    question: "¿En qué nivel debo estar para comenzar?",
    answer:
      "Puedes iniciar desde cero o con conocimientos previos. Evaluamos tu nivel y te ubicamos en el grupo correcto.",
  },
  {
    question: "¿Las clases son en vivo o grabadas?",
    answer:
      "Son clases en vivo con docentes y compañeros. También tendrás recursos de práctica para reforzar entre sesiones.",
  },
  {
    question: "¿Cuánto tiempo necesito para ver resultados?",
    answer:
      "La mayoría de estudiantes nota mejoras de fluidez y confianza durante las primeras 6 a 8 semanas.",
  },
];
