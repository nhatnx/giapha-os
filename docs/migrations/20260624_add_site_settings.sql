-- ============================================================
-- Site settings table
-- Stores configurable key-value pairs for the site (name, icon, etc.)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can read settings
CREATE POLICY "Authenticated read site_settings"
  ON public.site_settings FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only admins can insert/update/delete
CREATE POLICY "Admin write site_settings"
  ON public.site_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Seed defaults (safe to re-run)
INSERT INTO public.site_settings (key, value)
  VALUES ('site_name', 'Gia Phả OS'), ('site_icon_url', NULL)
  ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- Storage bucket for settings assets (site icon, etc.)
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
  VALUES ('settings', 'settings', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read settings bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'settings');

CREATE POLICY "Admin upload settings bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'settings'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin update settings bucket"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'settings'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin delete settings bucket"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'settings'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
