-- 1. Tabel paket wisata
CREATE TABLE IF NOT EXISTS public.travel_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price BIGINT NOT NULL,
  duration TEXT NOT NULL,
  image_url TEXT NOT NULL,
  features TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabel mobil
CREATE TABLE IF NOT EXISTS public.available_cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  capacity INT NOT NULL,
  price_per_day BIGINT NOT NULL,
  image_url TEXT NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabel FAQ
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabel pemesanan
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  pickup_point TEXT NOT NULL,
  destination TEXT NOT NULL,
  travel_date DATE NOT NULL,
  package_id UUID REFERENCES public.travel_packages(id) ON DELETE SET NULL,
  car_id UUID REFERENCES public.available_cars(id) ON DELETE SET NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.travel_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.available_cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read travel_packages" ON public.travel_packages FOR SELECT USING (true);
CREATE POLICY "public read available_cars" ON public.available_cars FOR SELECT USING (true);
CREATE POLICY "public read faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);

-- Seed data
INSERT INTO public.travel_packages (title, description, price, duration, image_url, features) VALUES
('Paket Bromo Sunrise Tour', 'Nikmati keindahan matahari terbit spektakuler di Gunung Bromo dengan Jeep 4x4 offroad. Harga sudah termasuk tiket masuk, jeep, dan dokumentasi.', 750000, '1 Hari (Full Day)', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80', ARRAY['Jeep 4x4 Private','Tiket Masuk Bromo','Driver & BBM','Dokumentasi Foto','Penjemputan Malang/Surabaya']),
('Paket Liburan Bali Classic', 'Jelajahi keindahan Bali: Kuta, Ubud, Tanah Lot, dan Uluwatu. Sudah termasuk hotel bintang 3 dan makan siang khas Bali.', 2450000, '3 Hari 2 Malam', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', ARRAY['Hotel Bintang 3 (2 Malam)','Tiket Masuk Wisata','Mobil Private + Driver','Makan Sesuai Program','Welcome Drink']),
('Paket Eksotis Nusa Penida', 'Susuri pantai ikonik Nusa Penida: Kelingking Beach, Broken Beach, dan Crystal Bay. Termasuk fastboat PP.', 1200000, '2 Hari 1 Malam', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80', ARRAY['Tiket Fastboat PP','Hotel & Sarapan','Snorkeling 3 Spot','Driver & Guide Lokal','Makan Siang']);

INSERT INTO public.available_cars (name, type, capacity, price_per_day, image_url) VALUES
('Toyota Avanza', 'MPV (Manual/Matic)', 7, 450000, 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'),
('Toyota Innova Reborn', 'Premium MPV (Matic)', 7, 750000, 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=600&q=80'),
('Toyota Hiace Commuter', 'Microbus (Manual)', 15, 1100000, 'https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?auto=format&fit=crop&w=600&q=80'),
('Mitsubishi Pajero Sport', 'SUV 4x4 (Matic)', 7, 1200000, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80');

INSERT INTO public.faqs (question, answer, category) VALUES
('Bagaimana cara memesan paket travel?', 'Isi formulir pemesanan di halaman ini atau klik tombol WhatsApp untuk menghubungi CS kami secara langsung.', 'Pemesanan'),
('Apakah harga sudah termasuk sopir dan BBM?', 'Ya, semua paket dan sewa mobil sudah termasuk sopir berpengalaman dan biaya BBM (non lepas kunci).', 'Biaya'),
('Apakah bisa batalkan atau ubah jadwal?', 'Pembatalan gratis maksimal H-3. Perubahan jadwal bisa dilakukan via WhatsApp minimal 24 jam sebelum keberangkatan.', 'Kebijakan'),
('Titik penjemputan mana saja?', 'Kami menjemput gratis di Bandara, Stasiun, Hotel, atau rumah di area Malang, Batu, dan Surabaya.', 'Layanan');
