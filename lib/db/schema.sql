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
  PRIMARY KEY (clerk_user_id, material_id)
);

CREATE INDEX IF NOT EXISTS idx_student_materials_user
  ON student_materials (clerk_user_id);
