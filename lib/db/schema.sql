CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'es',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS student_materials (
  clerk_user_id TEXT NOT NULL,
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (clerk_user_id, material_id)
);

CREATE INDEX IF NOT EXISTS idx_student_materials_user
  ON student_materials (clerk_user_id);

ALTER TABLE student_materials
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  locale TEXT NOT NULL DEFAULT 'es',
  source TEXT NOT NULL DEFAULT 'lead_magnet',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'es',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at
  ON contact_messages (created_at DESC);

CREATE TABLE IF NOT EXISTS email_templates (
  id TEXT PRIMARY KEY,
  subject_es TEXT NOT NULL,
  subject_en TEXT NOT NULL,
  subject_pl TEXT NOT NULL,
  body_html_es TEXT NOT NULL,
  body_html_en TEXT NOT NULL,
  body_html_pl TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO email_templates (
  id,
  subject_es,
  subject_en,
  subject_pl,
  body_html_es,
  body_html_en,
  body_html_pl
) VALUES (
  'lead_magnet_welcome',
  'Tu guía gratis de Bilingual Boost',
  'Your free Bilingual Boost guide',
  'Twój darmowy przewodnik Bilingual Boost',
  '<p>¡Hola {{name}}!</p><p>Gracias por registrarte. Aquí tienes tu guía gratis para soltarte al hablar y organizar tu aprendizaje.</p><p><a href="{{download_url}}">Descargar guía PDF</a></p><p>Si el botón no funciona, copia y pega este enlace:<br /><a href="{{download_url}}">{{download_url}}</a></p>',
  '<p>Hi {{name}}!</p><p>Thanks for signing up. Here is your free guide to speak more freely and organize your learning.</p><p><a href="{{download_url}}">Download PDF guide</a></p><p>If the button does not work, copy and paste this link:<br /><a href="{{download_url}}">{{download_url}}</a></p>',
  '<p>Cześć {{name}}!</p><p>Dziękuję za zapis. Oto Twój darmowy przewodnik, który pomoże Ci swobodniej mówić i uporządkować naukę.</p><p><a href="{{download_url}}">Pobierz przewodnik PDF</a></p><p>Jeśli przycisk nie działa, skopiuj i wklej ten link:<br /><a href="{{download_url}}">{{download_url}}</a></p>'
)
ON CONFLICT (id) DO NOTHING;
