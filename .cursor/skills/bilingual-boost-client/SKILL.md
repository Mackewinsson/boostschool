---
name: bilingual-boost-client
description: Brief de contenido de Paulina Poloca para Bilingual Boost. Usar al editar copy, metadata o documentación del sitio. No cambiar colores/fuentes salvo fase de diseño explícita.
---

# Bilingual Boost — Brief de la clienta (Paulina Poloca)

## Regla de oro

**El copy vive en `lib/landing-content.ts`.** No inventar métricas agregadas falsas. Español neutro LATAM. La versión en inglés del brief es referencia de traducción, no copy publicado.

---

## Marca y voz

| Campo | Valor |
|---|---|
| **Nombre** | Bilingual Boost |
| **Tagline** | Inglés y español con Paulina Poloca |
| **Subtítulo EN (referencia)** | English with Paulina Poloca |
| **Lema** | Organízate, supérate y aprende inglés/español |
| **Slang EN (referencia)** | Poloca with a Spanish twist teaching Spanish |
| **Tagline EN (referencia)** | More than just a language: a journey for personal growth |
| **Persona** | Paulina Poloca — profe de inglés y español, 5+ años, alegría, cercanía, pasión |
| **Tono** | Cercano, optimista, empático, sin corporativismo |

### Colores y tipografía (fase diseño — pendiente)

- Colores propuestos: `#FFD93D`, `#FFA726`
- Fuentes propuestas: Quicksand Medium o Nunito Sans Medium; display: Superclarendon

---

## Estado en la web (renderizado)

| Bloque del brief | En la web | Export |
|---|---|---|
| Lema + CTAs | Sí | `hero`, `brand`, `nav` |
| Sobre mí (4 párrafos + foto) | Sí | `about` → `#sobre-mi` |
| Por qué clases conmigo | Sí | `features` |
| Cómo son las clases | Sí | `outcomes` |
| Qué necesitas / Cómo empezar | Sí | `faqs` |
| Tipos de clase (inglés / español) | Sí | `plans.features` |
| Precios 11 / 16 / 20 € + trial GRATIS | Sí | `plans` |
| Testimonios | Placeholder | `testimonials` |
| Contacto (formulario + redes) | Sí (UI estática) | `contact` → `#contacto` |
| Cierre “Dime qué necesitas…” | Sí | `finalCta` |

---

## Precios confirmados (español)

| Duración | Precio |
|---|---|
| Clase de prueba | 30 min — GRATIS |
| Clase online | 30 min — 11 € |
| Clase online | 45 min — 16 € |
| Clase online | 60 min — 20 € |

**Pendiente:** método de pago, Calendly/Google Calendar URLs, envío real del formulario.

---

## Placeholders pendientes (Paulina)

- URLs de Instagram, TikTok, WhatsApp
- Correo de contacto
- Integración Calendly
- Testimonios reales de alumnos

---

## Fuera de alcance (no implementar sin pedido explícito)

- Paleta `#FFD93D` / `#FFA726` y fuentes del brief
- Sitio bilingüe EN completo
- Email automático de bienvenida
- Packs de 4 clases, asesoría, cursos, coaching, tips de aprendizaje

---

## Mapeo brief → exports (`landing-content.ts`)

| Export | Contenido del brief |
|---|---|
| `brand`, `hero` | Lema, badge, tagline, CTAs |
| `stats` | 5+ años, 3 idiomas +2 aprendiendo, prueba gratis |
| `about` | Sobre mí completo |
| `featuresSection`, `features` | Por qué tener clases conmigo |
| `outcomesSection`, `outcomes` | Cómo son las clases |
| `testimonialsSection`, `testimonials` | Placeholders |
| `plansSection`, `plans` | Precios, tipos de clase, trial gratis |
| `faqSection`, `faqs` | Qué necesitas, cómo empezar, inglés empresarial |
| `contact` | Formulario + redes |
| `finalCta` | Cierre del brief |
| `nav` | 7 links incl. Sobre mí y Contacto |
