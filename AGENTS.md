<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Bilingual Boost — Guía del proyecto para agentes de IA

## Descripción

**Bilingual Boost** es el sitio de **Paulina Poloca** (profe de inglés y español online):

1. **Marketing / landing** — convertir visitantes en alumnos (copy cercano, beneficio primero).
2. **Portal `/alumno`** — clases, deberes y materiales para **profe**, **alumno** y **padre**.

Idiomas de UI del portal: **ES / EN / PL** (`lib/student-content/`). Landing: mismos locales en `lib/landing-content/`. Copy de marketing en **español neutro LATAM** salvo que se pida explícitamente otro idioma.

### Brief de la clienta

Fuente autoritativa de copy y reglas de contenido:

`.cursor/skills/bilingual-boost-client/SKILL.md`

**Reglas de copy:**

| Superficie | Dónde editar |
|---|---|
| Landing | `lib/landing-content/{es,en,pl}.ts` (+ `types.ts`) |
| Portal alumno/profe | `lib/student-content/{es,en,pl}.ts` (+ `types.ts`) |

No hardcodear strings visibles en componentes. Cambios de estilo (colores, fuentes) requieren fase de diseño explícita.

### Placeholders / pendientes (confirmar con Paulina)

- Método de pago concreto
- URLs: Calendly, WhatsApp, Instagram, TikTok, correo
- Testimonios reales de alumnos
- Envío funcional del formulario de contacto
- Colores `#FFD93D` / `#FFA726` y fuentes Quicksand/Nunito/Superclarendon (fase diseño)

---

## Stack técnico

| Tecnología | Versión | Rol |
|---|---|---|
| Next.js | 16.x (App Router) | Framework |
| React | 19.x | UI |
| TypeScript | 5.x | Lenguaje |
| Tailwind CSS | 4.x | Estilos |
| Neon / Postgres | — | Datos del portal |
| Playwright | — | E2E (`e2e/`) |
| lucide-react | última | Íconos |

> **Importante:** Next.js 16 + Tailwind v4 tienen cambios de ruptura. Leer docs en `node_modules/next/dist/docs/` antes de inventar APIs.

---

## Estructura de archivos (alto nivel)

```
/
├── app/
│   ├── globals.css              ← tokens de color del tema
│   ├── layout.tsx               ← layout raíz
│   ├── page.tsx                 ← landing
│   ├── api/alumno/              ← APIs del portal (materials, schedules, sessions…)
│   └── alumno/                  ← portal autenticado
│       ├── page.tsx             ← alumno / padre
│       └── profesor/            ← área profe (+ leads, contactos, emails, firma)
│
├── components/
│   ├── landing/                 ← marketing
│   └── student/                 ← portal (dashboards, tabla de clases, horario…)
│
├── lib/
│   ├── landing-content/         ← copy landing ES/EN/PL
│   ├── student-content/         ← copy portal ES/EN/PL
│   ├── materials/               ← repo, schedules, realign, tipos
│   ├── db/                      ← cliente Neon + schema.sql
│   └── auth/                    ← usuarios / sesión
│
├── e2e/                         ← Playwright (flujo clases + deberes)
└── .cursor/rules/               ← reglas de agentes (p. ej. rendimiento)
```

---

## Portal `/alumno` (modelo de producto)

### Roles

| Rol | Ruta | Puede |
|---|---|---|
| **teacher** | `/alumno/profesor` | Horario, tabla de clases, deberes, estado, extras, Meet |
| **student** | `/alumno` | Ver clases, deberes, Meet, apuntes |
| **parent** | `/alumno` (read-only dashboard) | Vinculado a un alumno: ve clases, deberes y **si los hizo**; **sin** Meet ni apuntes |

`GET /api/alumno/my-materials` devuelve `readOnly: true` para padres.

### Tabla de clases (núcleo)

Componente compartido: `components/student/class-session-table.tsx`.

Cada fila = una clase con fecha/hora:

- **Profe:** edita fecha/hora + deberes (`description`) → botón **Guardar** (guarda ambos). Cambiar la fecha de **una** fila la deja fija (`original_scheduled_at`): el próximo “Guardar horario” no la devuelve al slot semanal ni recrea esa ocurrencia. Marca hecho: Pendiente / Sí / No / Parcial.
- **Alumno:** ve deberes o mensaje vacío; puede unirse a Meet; apuntes. **Sin** estado hecho/pendiente.
- **Padre:** dashboard del alumno vinculado: ve deberes y badge de estado (Pendiente / Sí / No / Parcial). **Sin** Meet, sin apuntes, sin editar estado.
- Estado hecho lo marca solo la profe (`student_materials.completion_status`); el padre lo ve, el alumno no.
- **Extras** (materiales sin `scheduled_at`) van fuera de la tabla.

Deberes vacíos → copy `homeworkEmpty` (“Todavía no hay deberes…”).

### Horario por alumno

`components/student/student-schedule-panel.tsx` + `POST /api/alumno/schedules`.

| Modo | Comportamiento |
|---|---|
| **Horario fijo** | Lista de **N** clases por semana (máx. 7): día + hora 24h (Warsaw) + Meet (mismo enlace en todas) + “Generar próximas clases”. Al guardar, **realinea** las clases semanales futuras a esos días/horas y conserva textos de deberes. |
| **Clase a clase** | Solo Meet; profe añade fechas con “Crear clase”. `active` queda en false. |

Al pasar de “clase a clase” → “horario fijo”, el checkbox de generar debe arrancar **activo** (si no, el upsert guarda `active: false` y **no realinea**).

Dos slots con el mismo día y hora → error `duplicate_slot` / copy `scheduleErrorDuplicateSlot` (en el formulario, no un genérico).

Lógica de slots / TZ / realign: `lib/materials/schedule-generate.ts` + `lib/materials/schedule-slots.ts`

- Zona por defecto: `Europe/Warsaw`, hora en **24h** (`20:00` = 8 pm).
- Slots en `student_class_schedules.weekly_slots` (JSONB). Las columnas `weekday` / `time_local` / `weekday_2` / `time_local_2` duplican los dos primeros por compatibilidad.
- `realignFutureSessionsForSchedule`: solo toca filas con `schedule_id` de ese horario y **sin** `original_scheduled_at`. No borra extras ni clases creadas a mano (`Crear clase`, `schedule_id` null).
- Unique `(schedule_id, scheduled_at)` en materials — el realign desacopla `schedule_id` antes de reasignar.

### Datos clave

| Tabla | Uso |
|---|---|
| `materials` | Clase o extra (`scheduled_at`, `meet_url`, `description` = deberes, `schedule_id`, `original_scheduled_at` si se movió una sola fecha) |
| `student_materials` | Asignación + `completion_status` + `notes` |
| `student_class_schedules` | Horario semanal (`weekly_slots`) o Meet-only por alumno |

Schema: `lib/db/schema.sql`. Migrar: `npm run db:migrate`. En Vercel el deploy corre `vercel-build` (migrate + `next build`) con el `DATABASE_URL` del proyecto.

### APIs relevantes

| Ruta | Uso |
|---|---|
| `/api/alumno/schedules` | GET/POST horario; POST dispara realign si hay slot fijo |
| `/api/alumno/sessions` | POST clase puntual |
| `/api/alumno/materials` | CRUD materiales (+ genera shells semanales en GET) |
| `/api/alumno/my-materials` | Vista alumno/padre |
| `/api/alumno/assignments` | Estado de deberes |

### E2E

```bash
npm run test:e2e                 # Playwright
npm run test:e2e:ui
```

Helpers: `e2e/helpers.ts` (`saveWeeklySchedule`, `rowWithText`, …).  
Specs: `e2e/homework-flow.spec.ts`, `e2e/auth.spec.ts`.

Los e2e escriben en la **misma** DB configurada en `.env.local` — pueden dejar basura tipo `Realign homework (realign-…)` visible al alumno. Limpiar o usar DB aparte para demos.

---

## Sistema de colores (tema)

**Nunca hardcodear colores de marca en componentes.** Fuente: `app/globals.css` (`:root` + `@theme inline`).

### Variables en `:root`

```css
:root {
  --brand-from:     #06b6d4;
  --brand-to:       #8b5cf6;
  --accent:         #22d3ee;
  --accent-alt:     #a78bfa;
  --canvas:         #030712;
  --canvas-up:      #07101f;
  --brand-from-rgb: 6 182 212;
}
```

### Clases útiles

| Clase | Uso |
|---|---|
| `from-brand-from`, `to-brand-to` | Gradientes CTA |
| `text-accent`, `text-accent-alt` | Labels, íconos |
| `bg-canvas`, `bg-canvas-up` | Fondos |
| `.btn-glow`, `.card-glow` | Brillos (landing) |

---

## Landing (marketing)

Copy: `lib/landing-content/`. Página: `components/landing/landing-page.tsx`.

Slots habituales: hero, stats, sobre mí, programas, resultados, testimonios, planes, FAQ, contacto, CTA final.

Iconos de `features` / `outcomes` por **índice** en `landing-page.tsx` — si crece el array de copy, añadir ícono.

---

## Rendimiento

Regla obligatoria: `.cursor/rules/no-performance-regressions.mdc`

- No bloquear first paint / LCP con DB o auth en rutas públicas.
- Auth y peso del portal solo en `/alumno` (y rutas gated).
- Preferir Suspense / cache / dynamic import para trabajo no crítico.

---

## Comandos

```bash
npm run dev              # localhost:3000
npm run build
npm run start
npm run lint             # debe pasar limpio
npm run db:migrate
npm run db:seed-test-users
npm run test:e2e
```

En Vercel el deploy usa `vercel-build` (`db:migrate` + `next build`) con el `DATABASE_URL` del proyecto.

---

## Reglas de desarrollo

1. **DRY copy:** landing → `lib/landing-content/`; portal → `lib/student-content/`. Colores → `app/globals.css`.
2. **Tokens de tema:** `text-accent`, `bg-canvas`, `from-brand-from` — no hex de marca ni `text-cyan-400` ad hoc.
3. **`"use client"`** solo con estado, efectos o eventos de browser.
4. **Lint limpio** antes de commit.
5. **Portal:** cambios de horario semanal deben realinear clases futuras; no dejar `active: false` por accidente al guardar horario fijo.
6. **Padre:** vinculado a un alumno; ve si hizo los deberes (solo lectura). Sin Meet; sin apuntes. **Alumno:** sin estado de deberes (solo la profe marca hecho/pendiente).
7. **Accesibilidad:** roles semánticos; `aria-label` en controles solo-ícono.
8. **Commits / push:** solo si el usuario lo pide.
