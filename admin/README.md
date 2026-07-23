# Reytrans Admin Panel (Next.js + Supabase)

Ini adalah project admin panel untuk Reytrans yang digunakan untuk mengelola artikel/blog secara real-time. Project ini menggunakan **Next.js (App Router)**, **Supabase Auth**, dan **Supabase Database**.

## Fitur Utama

- 🔐 **Supabase Authentication**: Login aman dengan Email & Password khusus administrator.
- 🛡️ **Middleware Protection**: Semua rute dashboard dilindungi otomatis, pengguna yang belum login akan dialihkan ke `/login`.
- 📝 **CRUD Artikel**:
  - Daftar semua artikel dengan status (Draft/Published) dan tanggal update.
  - Form pembuatan artikel baru dengan auto-slug generator (otomatis membuat slug url yang bersih dari judul).
  - Form edit artikel dan fitur hapus artikel.
  - Preview thumbnail gambar cover secara real-time saat URL dimasukkan.
- 🌑 **Premium Dark Mode**: Tampilan UI bernuansa gelap yang modern dan bersih (seperti dashboard Vercel/Linear) menggunakan CSS Variables murni.

---

## Langkah Setup Supabase

Agar dashboard admin ini berfungsi dengan baik, silakan lakukan langkah berikut di Console Supabase Anda:

### 1. Buat Tabel `articles`
Masuk ke menu **SQL Editor** di dashboard Supabase Anda, lalu salin dan jalankan query berikut (atau gunakan file `schema_articles.sql` di root project ini):

```sql
-- Buat Tabel Artikel
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

-- Setup Policies
CREATE POLICY "public read published articles" ON public.articles 
  FOR SELECT USING (status = 'published');

CREATE POLICY "admin all articles" ON public.articles 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

### 2. Hubungkan Environment Variable
1. Buka file `.env.local` di dalam folder ini.
2. Ganti nilai berikut dengan credentials Supabase Anda (bisa didapatkan di **Project Settings > API**):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Buat User Admin di Supabase
1. Masuk ke dashboard Supabase Anda.
2. Pergi ke menu **Authentication > Users**.
3. Klik **Add User** dan masukkan email & password yang akan Anda gunakan untuk login ke panel admin.

---

## Cara Menjalankan Project Secara Lokal

1. Buka terminal di folder `reytrans/admin` ini.
2. Jalankan perintah untuk menginstal dependencies (jika belum):
   ```bash
   npm install
   ```
3. Jalankan server development:
   ```bash
   npm run dev
   ```
4. Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk masuk ke halaman login admin.
