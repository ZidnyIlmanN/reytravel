-- 5. Tabel artikel / blog
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  thumbnail_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Siapa saja (publik) bisa membaca artikel yang statusnya published
CREATE POLICY "public read published articles" ON public.articles 
  FOR SELECT USING (status = 'published');

-- 2. User terautentikasi (admin) bisa melakukan apa saja (CRUD) pada semua artikel
CREATE POLICY "admin all articles" ON public.articles 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
