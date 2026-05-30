<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Bilingual Boost — Guía del proyecto para agentes de IA

## Descripción

**Bilingual Boost** es la landing page de **Paulina Poloca** — profe de inglés y español online. Todo el copy está en **español neutro LATAM**. El objetivo es convertir visitantes en alumnos mediante copy cercano y directo al beneficio.

### Brief de la clienta

La fuente autoritativa del copy y reglas de contenido está en:

`.cursor/skills/bilingual-boost-client/SKILL.md`

**Regla de copy:** cambios de texto van en `lib/landing-content.ts`. Cambios de estilo (colores, fuentes) requieren fase de diseño explícita.

### Placeholders pendientes (confirmar con Paulina)

- Método de pago concreto
- URLs: Calendly, WhatsApp, Instagram, TikTok, correo
- Testimonios reales de alumnos
- Envío funcional del formulario de contacto

### Copy aún no implementado (fase diseño)

- Colores `#FFD93D` / `#FFA726` y fuentes Quicksand/Nunito/Superclarendon
- Widget Calendly integrado
- Versión EN del sitio
- Tips de aprendizaje, cursos, packs

---

## Stack técnico

| Tecnología | Versión | Rol |
|---|---|---|
| Next.js | 16.x (App Router) | Framework principal |
| React | 19.x | UI |
| TypeScript | 5.x | Lenguaje |
| Tailwind CSS | 4.x | Estilos |
| lucide-react | última | Íconos SVG |

> **Importante:** Este proyecto usa **Next.js 16** con **App Router** y **Tailwind CSS v4**. Ambas versiones tienen cambios de ruptura respecto a versiones anteriores. No asumas APIs de versiones anteriores.

---

## Estructura de archivos

```
/
├── app/
│   ├── globals.css          ← ÚNICA fuente de verdad para colores del tema
│   ├── layout.tsx           ← Layout raíz (metadata, fuentes, lang="es")
│   └── page.tsx             ← Página de entrada → monta <LandingPage />
│
├── components/
│   └── landing/
│       ├── landing-page.tsx ← Página completa (server component)
│       └── navbar.tsx       ← Navbar sticky con glassmorphism (client component)
│
├── lib/
│   └── landing-content.ts   ← Toda la data de la landing (copy, stats, FAQs, etc.)
│
└── public/                  ← Assets estáticos
```

---

## Sistema de colores (tema)

**Regla principal: nunca hardcodear colores de marca en los componentes.**

Todos los colores del sitio se definen en `app/globals.css` en el bloque `:root`. Tailwind los registra como utilidades via `@theme inline`.

### Variables en `:root`

```css
:root {
  --brand-from:     #06b6d4;   /* inicio del gradiente principal */
  --brand-to:       #8b5cf6;   /* fin del gradiente principal    */
  --accent:         #22d3ee;   /* acento primario (texto, iconos) */
  --accent-alt:     #a78bfa;   /* acento secundario              */
  --canvas:         #030712;   /* fondo base de la página        */
  --canvas-up:      #07101f;   /* fondo de secciones elevadas    */
  --brand-from-rgb: 6 182 212; /* RGB de --brand-from (para sombras con alpha) */
}
```

### Clases Tailwind generadas

| Clase | Uso habitual |
|---|---|
| `from-brand-from`, `to-brand-to` | Gradientes en botones, avatares |
| `text-accent`, `text-accent-alt` | Labels de sección, íconos, badges |
| `bg-accent/10`, `border-accent/25` | Fondos y bordes tintados de acento |
| `bg-brand-from/20`, `bg-brand-to/20` | Íconos de features/outcomes |
| `bg-canvas`, `bg-canvas-up` | Fondos de secciones |
| `border-brand-from/30` | Bordes de tarjeta de precio |

### Clases CSS especiales (en `globals.css`)

| Clase | Descripción |
|---|---|
| `.btn-glow` | Sombra de brillo para botones CTA. Se intensifica en hover. |
| `.card-glow` | Sombra halo exterior para la tarjeta de precio. |

> Para cambiar toda la paleta del sitio: editar únicamente el bloque `:root` en `app/globals.css`. Recordar actualizar también `--brand-from-rgb` si se cambia `--brand-from`.

---

## Contenido / Copy (`lib/landing-content.ts`)

Toda la información de la landing está centralizada aquí. **No escribir strings de copy directamente en los componentes.**

### Exports disponibles

| Export | Tipo | Descripción |
|---|---|---|
| `brand` | objeto | Nombre, badge y tagline |
| `nav` | objeto | Links de navegación (7) y `ctaLabel` |
| `hero` | objeto | Título (before/highlight), subtítulo, CTAs |
| `stats` | `Stat[]` | 3 credenciales de Paulina |
| `about` | `AboutSection` | Sobre mí — 4 párrafos + alt de foto |
| `featuresSection` | `SectionHeading` | Label y título de “Por qué clases conmigo” |
| `features` | `Feature[]` | 3 pilares del enfoque |
| `outcomesSection` | `SectionHeading` + linkText | Label y título de “Cómo son las clases” |
| `outcomes` | `Feature[]` | 3 aspectos de la metodología |
| `testimonialsSection` | `SectionHeading` | Label y título de testimonios |
| `testimonials` | `Testimonial[]` | Placeholders hasta tener testimonios reales |
| `plansSection` | `SectionHeading` | Label de sección precios |
| `plans` | objeto | Trial gratis, 11/16/20 €, tipos de clase, CTA |
| `faqSection` | `SectionHeading` | Label y título FAQ |
| `faqs` | `FaqItem[]` | Requisitos, cómo empezar, inglés empresarial |
| `contact` | `ContactSection` | Formulario estático + redes (placeholders) |
| `finalCta` | objeto | Banner final de cierre |
| `mobileStickyCta` | string | CTA sticky mobile |

### Mapeo brief → slots de la página

| Slot UI | Export(s) |
|---|---|
| Hero | `brand`, `hero` |
| 3 stats | `stats` |
| Sobre mí `#sobre-mi` | `about` |
| Features `#programas` | `featuresSection`, `features` |
| Outcomes `#resultados` | `outcomesSection`, `outcomes` |
| Testimonios `#testimonios` | `testimonialsSection`, `testimonials` |
| Pricing `#planes` | `plansSection`, `plans` |
| FAQ `#faq` | `faqSection`, `faqs` |
| CTA final | `finalCta` |
| Contacto `#contacto` | `contact` |

### Tipos definidos

```ts
type Stat        = { value: string; label: string }
type Feature     = { title: string; description: string }
type Testimonial = { name: string; role: string; quote: string }
type FaqItem     = { question: string; answer: string }
type NavLink     = { label: string; href: string }
type AboutSection = { label: string; title: string; paragraphs: string[]; imageAlt: string }
type ContactSection = { label: string; title: string; description: string; fields: object; socialLinks: NavLink[]; note: string }
```

---

## Arquitectura de componentes

```
page.tsx  (Server Component)
└── LandingPage  (Server Component)
    ├── Navbar         ← "use client" — maneja scroll y menú mobile
    ├── Hero section
    ├── About section      (#sobre-mi)
    ├── Features section   (#programas)
    ├── Outcomes section   (#resultados)
    ├── Testimonials section (#testimonios)
    ├── Pricing section    (#planes)
    ├── FAQ section        (#faq)
    ├── Final CTA Banner
    ├── Contact section    (#contacto)
    ├── Footer
    └── Mobile sticky CTA  (solo visible en < sm)
```

### Iconos de sección

Los íconos de `features` y `outcomes` se mapean por **índice de array** en `landing-page.tsx`:

```ts
const featureIcons = [MessageSquare, Users, Clock];
const outcomeIcons = [Briefcase, Compass, BarChart3];
```

Si se agregan más items al array en `landing-content.ts`, hay que agregar un ícono correspondiente aquí.

---

## Comandos

```bash
npm run dev     # Servidor de desarrollo en localhost:3000
npm run build   # Build de producción
npm run start   # Servidor de producción
npm run lint    # ESLint (debe pasar sin errores antes de cada commit)
```

---

## Reglas de desarrollo

1. **DRY:** Todo el copy va en `lib/landing-content.ts`. Todo color de marca va en `app/globals.css`.
2. **Tokens de tema:** Usar siempre las clases Tailwind de token (`text-accent`, `bg-canvas`, `from-brand-from`) — nunca hardcodear hex ni clases de Tailwind builtin como `text-cyan-400` para colores de marca.
3. **Componentes client:** Solo marcar `"use client"` cuando sea estrictamente necesario (estado, efectos, eventos del browser). `Navbar` es el único client component actualmente.
4. **Lint limpio:** Correr `npm run lint` después de cada cambio. Debe pasar sin errores ni warnings.
5. **Idioma:** Todo el copy visible para el usuario va en **español neutro LATAM**. Sin regionalismos de España.
6. **Accesibilidad:** Mantener `lang="es"` en `<html>`, usar roles semánticos (`<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`, `<section>`), y `aria-label` en botones sin texto visible.
