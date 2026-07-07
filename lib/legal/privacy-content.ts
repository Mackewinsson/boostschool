import type { Locale } from "@/lib/locale";

export type PrivacyContent = {
  metadata: {
    title: string;
    description: string;
  };
  title: string;
  lastUpdated: string;
  backLabel: string;
  paragraphs: string[];
};

const privacyContent: Record<Locale, PrivacyContent> = {
  es: {
    metadata: {
      title: "Política de privacidad | Bilingual Boost",
      description:
        "Cómo Bilingual Boost recopila, usa y protege tus datos personales al descargar recursos o contactarnos.",
    },
    title: "Política de privacidad",
    lastUpdated: "Última actualización: 7 de julio de 2026",
    backLabel: "Volver al inicio",
    paragraphs: [
      "Bilingual Boost (Paulina Poloca) es responsable del tratamiento de los datos personales que nos proporcionas a través de este sitio web.",
      "Recopilamos tu nombre y correo electrónico cuando descargas la guía gratis en /recursos o cuando nos escribes mediante el formulario de contacto. Usamos estos datos para enviarte el recurso solicitado, responder a tus mensajes y, si te registraste para la guía, enviarte tips ocasionales sobre aprendizaje de idiomas.",
      "La base legal del tratamiento es tu consentimiento al enviar el formulario y nuestro interés legítimo en responder consultas sobre clases de inglés y español.",
      "Compartimos datos únicamente con proveedores necesarios para operar el servicio, como Resend (envío de correos) y Vercel (alojamiento del sitio). No vendemos ni cedemos tus datos a terceros con fines comerciales.",
      "Conservamos tus datos mientras mantengas relación con nosotros o hasta que solicites su eliminación. Puedes darte de baja de correos informativos respondiendo a cualquier mensaje o escribiéndonos por WhatsApp o el formulario de contacto.",
      "Tienes derecho a acceder, rectificar, suprimir u oponerte al tratamiento de tus datos, así como a presentar una reclamación ante la autoridad de protección de datos de tu país.",
      "Para ejercer tus derechos o resolver dudas sobre privacidad, escríbenos mediante el formulario de contacto del sitio o por WhatsApp.",
    ],
  },
  en: {
    metadata: {
      title: "Privacy policy | Bilingual Boost",
      description:
        "How Bilingual Boost collects, uses, and protects your personal data when you download resources or contact us.",
    },
    title: "Privacy policy",
    lastUpdated: "Last updated: July 7, 2026",
    backLabel: "Back to home",
    paragraphs: [
      "Bilingual Boost (Paulina Poloca) is the data controller for personal data you provide through this website.",
      "We collect your name and email when you download the free guide at /recursos or contact us via the contact form. We use this data to deliver the requested resource, reply to your messages, and, if you signed up for the guide, send occasional language-learning tips.",
      "The legal basis is your consent when submitting a form and our legitimate interest in responding to inquiries about English and Spanish classes.",
      "We share data only with service providers needed to run the site, such as Resend (email delivery) and Vercel (hosting). We do not sell or share your data with third parties for commercial purposes.",
      "We keep your data while you maintain a relationship with us or until you request deletion. You can unsubscribe from informational emails by replying to any message or contacting us via WhatsApp or the contact form.",
      "You have the right to access, rectify, erase, or object to the processing of your data, and to lodge a complaint with your local data protection authority.",
      "To exercise your rights or ask privacy questions, contact us via the site contact form or WhatsApp.",
    ],
  },
  pl: {
    metadata: {
      title: "Polityka prywatności | Bilingual Boost",
      description:
        "Jak Bilingual Boost zbiera, wykorzystuje i chroni Twoje dane osobowe przy pobieraniu materiałów lub kontakcie z nami.",
    },
    title: "Polityka prywatności",
    lastUpdated: "Ostatnia aktualizacja: 7 lipca 2026",
    backLabel: "Wróć na stronę główną",
    paragraphs: [
      "Bilingual Boost (Paulina Poloca) jest administratorem danych osobowych przekazywanych przez tę stronę.",
      "Zbieramy Twoje imię i adres e-mail, gdy pobierasz darmowy przewodnik na /recursos lub kontaktujesz się przez formularz. Wykorzystujemy te dane, aby dostarczyć materiał, odpowiedzieć na wiadomości oraz — jeśli zapisałeś/aś się na przewodnik — wysyłać okazjonalne wskazówki dotyczące nauki języków.",
      "Podstawą prawną jest Twoja zgoda przy wysyłaniu formularza oraz nasz uzasadniony interes w odpowiadaniu na zapytania o lekcje angielskiego i hiszpańskiego.",
      "Udostępniamy dane wyłącznie dostawcom niezbędnym do działania serwisu, takim jak Resend (e-mail) i Vercel (hosting). Nie sprzedajemy ani nie udostępniamy danych stronom trzecim w celach komercyjnych.",
      "Przechowujemy dane, dopóki utrzymujesz z nami kontakt lub do momentu żądania usunięcia. Możesz zrezygnować z informacyjnych e-maili, odpowiadając na wiadomość lub kontaktując się przez WhatsApp lub formularz.",
      "Masz prawo dostępu, sprostowania, usunięcia lub sprzeciwu wobec przetwarzania danych oraz prawo złożenia skargi do organu ochrony danych.",
      "Aby skorzystać ze swoich praw lub zadać pytania o prywatność, napisz przez formularz kontaktowy lub WhatsApp.",
    ],
  },
};

export function getPrivacyContent(locale: Locale): PrivacyContent {
  return privacyContent[locale];
}
