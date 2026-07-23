-- ====================================================
-- SKRIP SETUP SUPABASE STORAGE UNTUK UPLOAD GAMBAR
-- ====================================================

-- 1. Membuat bucket bernama 'thumbnails' jika belum ada
-- Dan mengaktifkan status public agar file dapat diakses langsung oleh publik
INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Kebijakan Keamanan RLS untuk Bucket 'thumbnails'
-- Catatan: RLS di storage.objects sudah aktif secara bawaan dari Supabase, 
-- sehingga kita tidak perlu (dan tidak boleh) melakukan ALTER TABLE pada storage.objects.

DROP POLICY IF EXISTS "Public Read thumbnails" ON storage.objects;
CREATE POLICY "Public Read thumbnails" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'thumbnails');

DROP POLICY IF EXISTS "Admin Upload thumbnails" ON storage.objects;
CREATE POLICY "Admin Upload thumbnails" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'thumbnails');

DROP POLICY IF EXISTS "Admin Update thumbnails" ON storage.objects;
CREATE POLICY "Admin Update thumbnails" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'thumbnails');

DROP POLICY IF EXISTS "Admin Delete thumbnails" ON storage.objects;
CREATE POLICY "Admin Delete thumbnails" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'thumbnails');
