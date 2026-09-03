CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  locale TEXT NOT NULL DEFAULT 'es',
  scheduled_at TIMESTAMPTZ,
  meet_url TEXT,
  schedule_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE materials
  ALTER COLUMN url DROP NOT NULL;

ALTER TABLE materials
  ADD COLUMN IF NOT EXISTS schedule_id UUID;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'parent')),
  clerk_user_id TEXT UNIQUE,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS student_materials (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  completion_status TEXT,
  reviewed_at TIMESTAMPTZ,
  notes TEXT,
  PRIMARY KEY (user_id, material_id),
  CONSTRAINT student_materials_completion_status_check
    CHECK (completion_status IS NULL OR completion_status IN ('done', 'not_done', 'partial'))
);

-- Legacy clerk_user_id column (safe no-ops on already-migrated DBs)
ALTER TABLE student_materials
  ADD COLUMN IF NOT EXISTS clerk_user_id TEXT;

ALTER TABLE student_materials
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

ALTER TABLE student_materials
  ADD COLUMN IF NOT EXISTS user_id UUID;

ALTER TABLE student_materials
  DROP CONSTRAINT IF EXISTS student_materials_user_id_fkey;

ALTER TABLE student_materials
  ADD CONSTRAINT student_materials_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_student_materials_user_id
  ON student_materials (user_id);

ALTER TABLE materials
  ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;

ALTER TABLE materials
  ADD COLUMN IF NOT EXISTS meet_url TEXT;

ALTER TABLE student_materials
  ADD COLUMN IF NOT EXISTS completion_status TEXT;

ALTER TABLE student_materials
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

ALTER TABLE student_materials
  ADD COLUMN IF NOT EXISTS notes TEXT;

ALTER TABLE student_materials
  DROP CONSTRAINT IF EXISTS student_materials_completion_status_check;

ALTER TABLE student_materials
  ADD CONSTRAINT student_materials_completion_status_check
  CHECK (completion_status IS NULL OR completion_status IN ('done', 'not_done', 'partial'));

UPDATE student_materials
SET completion_status = 'done'
WHERE completed_at IS NOT NULL AND completion_status IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS student_materials_user_material_uidx
  ON student_materials (user_id, material_id)
  WHERE user_id IS NOT NULL;

-- Finish legacy clerk_user_id → user_id PK migration when possible
ALTER TABLE student_materials
  ALTER COLUMN clerk_user_id DROP NOT NULL;

ALTER TABLE users
  DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users
  ADD CONSTRAINT users_role_check
  CHECK (role IN ('admin', 'teacher', 'student', 'parent'));

CREATE TABLE IF NOT EXISTS parent_students (
  parent_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (parent_user_id, student_user_id)
);

CREATE TABLE IF NOT EXISTS student_class_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  weekday SMALLINT CHECK (weekday IS NULL OR weekday BETWEEN 0 AND 6),
  time_local TIME,
  weekday_2 SMALLINT,
  time_local_2 TIME,
  timezone TEXT NOT NULL DEFAULT 'Europe/Warsaw',
  meet_url TEXT,
  title_template TEXT NOT NULL DEFAULT 'Clase',
  horizon_weeks INT NOT NULL DEFAULT 6,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Allow Meet-only schedules (class-by-class students, no fixed weekday/time)
ALTER TABLE student_class_schedules
  ALTER COLUMN weekday DROP NOT NULL;

ALTER TABLE student_class_schedules
  ALTER COLUMN time_local DROP NOT NULL;

ALTER TABLE student_class_schedules
  DROP CONSTRAINT IF EXISTS student_class_schedules_weekday_check;

ALTER TABLE student_class_schedules
  ADD CONSTRAINT student_class_schedules_weekday_check
  CHECK (weekday IS NULL OR weekday BETWEEN 0 AND 6);

-- Optional second weekly slot (same Meet URL as the first slot)
ALTER TABLE student_class_schedules
  ADD COLUMN IF NOT EXISTS weekday_2 SMALLINT;

ALTER TABLE student_class_schedules
  ADD COLUMN IF NOT EXISTS time_local_2 TIME;

ALTER TABLE student_class_schedules
  DROP CONSTRAINT IF EXISTS student_class_schedules_weekday_2_check;

ALTER TABLE student_class_schedules
  ADD CONSTRAINT student_class_schedules_weekday_2_check
  CHECK (weekday_2 IS NULL OR weekday_2 BETWEEN 0 AND 6);

ALTER TABLE student_class_schedules
  DROP CONSTRAINT IF EXISTS student_class_schedules_second_slot_check;

ALTER TABLE student_class_schedules
  ADD CONSTRAINT student_class_schedules_second_slot_check
  CHECK (
    (weekday_2 IS NULL AND time_local_2 IS NULL)
    OR (weekday_2 IS NOT NULL AND time_local_2 IS NOT NULL)
  );

ALTER TABLE materials
  DROP CONSTRAINT IF EXISTS materials_schedule_id_fkey;

ALTER TABLE materials
  ADD CONSTRAINT materials_schedule_id_fkey
  FOREIGN KEY (schedule_id) REFERENCES student_class_schedules(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS materials_schedule_occurrence_uidx
  ON materials (schedule_id, scheduled_at)
  WHERE schedule_id IS NOT NULL AND scheduled_at IS NOT NULL;

-- Remove demo placeholder that linked to a personal site
DELETE FROM student_materials
WHERE material_id IN (
  SELECT id FROM materials
  WHERE lower(title) = 'guia' AND url ILIKE '%mackewinsson.com%'
);

DELETE FROM materials
WHERE lower(title) = 'guia' AND url ILIKE '%mackewinsson.com%';

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
