'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Services
import {
  getTravelPackages,
  getAvailableCars,
  getFAQs,
  getPublishedArticles,
  createBooking,
  BookingInput,
  TravelPackage,
  AvailableCar,
  FAQ,
  Article,
} from '@/lib/supabase';

// Components
import AIChat from '@/components/AIChat';
import SocialProofToast from '@/components/SocialProofToast';
import ExitIntentPopup from '@/components/ExitIntentPopup';

// Fallback Mock Data if Supabase is offline/empty
const MOCK_PACKAGES: TravelPackage[] = [
  {
    id: 'charter-hiace',
    title: 'Charter Hiace Commuter PP',
    description: 'Armada Hiace Commuter kapasitas 15 orang untuk rombongan antar kota. Fasilitas AC & Karaoke. Sudah termasuk sopir, BBM, dan tol....',
    price: 1200000,
    duration: 'Harga Sesuai Rute',
    image_url: '/assets/hiace.png',
    features: ['Kapasitas 15 Penumpang', 'Include Sopir, BBM & Tol', 'AC & Sistem Karaoke', 'Jemput Sampai Lokasi', 'Cirebon ↔ Jakarta / Bandara', 'Majalengka ↔ Jakarta / Bandara'],
  },
  {
    id: 'charter-elf-long',
    title: 'Charter Elf Long Reguler',
    description: 'Armada Elf Long berkapasitas 20 orang, cocok untuk rombongan besar. Dilengkapi AC & Karaoke. Termasuk sopir, BBM, dan tol. Harga...',
    price: 1500000,
    duration: 'Harga Sesuai Rute',
    image_url: '/assets/elf.png',
    features: ['Kapasitas 20 Penumpang', 'Include Sopir, BBM & Tol', 'AC & Sistem Karaoke', 'Jemput Sampai Lokasi', 'Cirebon ↔ Jakarta / Bandara', 'Majalengka ↔ Jakarta / Bandara'],
  },
  {
    id: 'charter-privat',
    title: 'Charter Privat (Avanza / Innova)',
    description: 'Perjalanan privat eksklusif bersama keluarga atau rekan bisnis. Sopir berpengalaman, termasuk BBM & tol. Harga menyesuaikan rute..',
    price: 800000,
    duration: 'Harga Sesuai Rute',
    image_url: '/assets/avanza.jpg',
    features: ['Kapasitas 6 Penumpang', 'Include Sopir, BBM & Tol', 'AC Sejuk & Nyaman', 'Jemput Sampai Lokasi', 'Cirebon ↔ Jakarta / Bandara', 'Majalengka ↔ Jakarta / Bandara'],
  },
];

const MOCK_CARS: AvailableCar[] = [
  {
    id: 'calya',
    name: 'Toyota Calya',
    type: 'City Car (Manual)',
    capacity: 6,
    price_per_day: 250000,
    image_url: '/assets/calya.webp',
    is_available: true,
  },
  {
    id: 'avanza',
    name: 'Toyota Avanza',
    type: 'MPV (Manual/Matic)',
    capacity: 6,
    price_per_day: 250000,
    image_url: '/assets/avanza.jpg',
    is_available: true,
  },
  {
    id: 'innova',
    name: 'Toyota Innova',
    type: 'Premium MPV (Matic)',
    capacity: 6,
    price_per_day: 250000,
    image_url: '/assets/innova.jpg',
    is_available: true,
  },
  {
    id: 'hiace',
    name: 'Toyota Hiace Commuter',
    type: 'Microbus — AC & Karaoke',
    capacity: 15,
    price_per_day: 250000,
    image_url: '/assets/hiace.png',
    is_available: true,
  },
  {
    id: 'elf',
    name: 'Elf Long',
    type: 'Microbus — AC & Karaoke',
    capacity: 20,
    price_per_day: 250000,
    image_url: '/assets/elf.png',
    is_available: true,
  },
];

const MOCK_FAQS: FAQ[] = [
  {
    id: 'q1',
    question: 'Bagaimana cara memesan paket travel?',
    answer: 'Isi formulir pemesanan di halaman ini atau klik tombol WhatsApp untuk menghubungi CS kami secara langsung.',
    category: 'Pemesanan',
  },
  {
    id: 'q2',
    question: 'Apakah harga sudah termasuk sopir dan BBM?',
    answer: 'Ya, semua paket dan sewa mobil sudah termasuk sopir berpengalaman dan biaya BBM (non lepas kunci).',
    category: 'Biaya',
  },
  {
    id: 'q3',
    question: 'Apakah bisa batalkan atau ubah jadwal?',
    answer: 'Pembatalan gratis maksimal H-3. Perubahan jadwal bisa dilakukan via WhatsApp minimal 24 jam sebelum keberangkatan.',
    category: 'Kebijakan',
  },
  {
    id: 'q4',
    question: 'Titik penjemputan mana saja?',
    answer: 'Kami menjemput gratis di Bandara, Stasiun, Hotel, atau rumah di area Malang, Batu, dan Surabaya.',
    category: 'Layanan',
  },
];

const MOCK_ARTICLES: Article[] = [
  {
    id: 'art1',
    title: 'Rute perjalanan',
    slug: 'rute-perjalanan',
    excerpt: 'Jelajahi berbagai rute perjalanan reguler dan charter yang kami sediakan untuk kenyamanan perjalanan Anda.',
    thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbzzGFK2R38N9r5hmvuF4tra_zrCF_2dyzN1PHDEVhgSCdG3VCxW9X-gz1niy3Tq3NIX2fvxDjr2RzVjfXDQBNK59ZCtmze5LADyKttUL4QxuW5eMNJsCcl0n75LUUbvosSnBTxpbHJin46DAOm6T2WUGnTx4WyfI-k7G2CoIzCK3W7llHCIPkPhkd_azBk2rn9--ICTZIpph3W0XbyWry0ykxiCsfI7bXMrs2KnOf4AMtxDzw7YZU',
    status: 'published',
    created_at: '2026-07-19T00:00:00Z',
  },
  {
    id: 'art2',
    title: 'Apa itu charter',
    slug: 'apa-itu-charter',
    excerpt: 'Ketahui perbedaan layanan charter privat dibanding travel reguler untuk perjalanan dinas, wisata, keluarga kelompok secara fleksibel.',
    thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHipLi_z06G9k6j6_M_fU6XSHHWRxH8LwM0F4dwCTMOhNBSqlCyoIBWidZR4ZW2macE7AeremeNb6xH_upq5NhU0MlDV9kufYd-KEulkdt_764dWdYwSqAf1AO5YUe0VIMshISWytz6IbNWDbt3CDFiNXQg7wZRnj-bQSPz8R-YsuugbeqkM2D3Xy5dCnvCfoOVGBDMhNvEfBlQoB0af6puge0i865QasHGgMXD2I5qYFsfEU9eBsk',
    status: 'published',
    created_at: '2026-07-19T00:00:00Z',
  },
  {
    id: 'art3',
    title: 'Apa itu door to door',
    slug: 'apa-itu-door-to-door',
    excerpt: 'Layanan antar jemput langsung di depan pintu rumah Anda menuju alamat tujuan dengan aman, nyaman, dan tepat waktu tanpa repot.',
    thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-mCvi7abTPNPQTZ6Qlbj59n71KVtgYE_CXD0aR6BJXoNiivtto6TH8yXPBWNZKDqcjWcGyza02Sm7qteuMGEJkk8pBp-WvejkWjUmibCVtgkWoKJc68zSjwtyJUyzkyiPlcgblXplGoHYHlEVKcJDWm9Cu7bXx5KyhK182V2RdYRa7NcTxbF30PcamtZranXrMS08z07MGb9m8VhMvXo6LmryStJeoMc4KXTomWXXB0G5nd6D2NeY',
    status: 'published',
    created_at: '2026-07-19T00:00:00Z',
  },
];

export default function Page() {
  const [packages, setPackages] = useState<TravelPackage[]>(MOCK_PACKAGES);
  const [cars, setCars] = useState<AvailableCar[]>(MOCK_CARS);
  const [faqs, setFaqs] = useState<FAQ[]>(MOCK_FAQS);
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  // FAQ states & helpers matching Stitch design
  const [faqActive, setFaqActive] = useState<number | null>(null);
  const [faqFilter, setFaqFilter] = useState('Semua');

  const faqCategories = ['Semua', ...Array.from(new Set(faqs.map(f => f.category).filter(Boolean)))];
  const filteredFaqs = faqFilter === 'Semua' ? faqs : faqs.filter(f => f.category === faqFilter);

  // Form State
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    pickup: '', destination: '', date: '',
    passengers: '', serviceType: 'Reguler',
    packageId: '', carId: '', message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const dbPackages = await getTravelPackages();
        if (dbPackages && dbPackages.length > 0) setPackages(dbPackages);
      } catch (err) {}
      try {
        const dbCars = await getAvailableCars();
        if (dbCars && dbCars.length > 0) {
          const merged = [...dbCars];
          MOCK_CARS.forEach(mockCar => {
            const exists = dbCars.some(
              c => c.name.toLowerCase().replace(/[^a-z0-9]/g, '') === mockCar.name.toLowerCase().replace(/[^a-z0-9]/g, '')
            );
            if (!exists) {
              merged.push(mockCar);
            }
          });
          setCars(merged);
        } else {
          setCars(MOCK_CARS);
        }
      } catch (err) {}
      try {
        const dbFaqs = await getFAQs();
        if (dbFaqs && dbFaqs.length > 0) setFaqs(dbFaqs);
      } catch (err) {}
      try {
        const dbArticles = await getPublishedArticles();
        if (dbArticles && dbArticles.length > 0) setArticles(dbArticles);
      } catch (err) {}
    }
    loadData();
  }, []);

  const setF = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.pickup || !form.destination || !form.date) {
      alert('Harap lengkapi semua kolom wajib (Nama, WhatsApp, Tanggal, Jemput, Tujuan).');
      return;
    }
    setSubmitting(true);
    const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    const cleanCarId = form.carId && isUUID(form.carId) ? form.carId : null;
    const cleanPackageId = form.packageId && isUUID(form.packageId) ? form.packageId : null;
    
    let finalMessage = `[Tipe Layanan: ${form.serviceType}] [Penumpang: ${form.passengers || '-'}]`;
    if (form.message) finalMessage += ` ${form.message}`;

    const booking: BookingInput = {
      name: form.name,
      phone: form.phone,
      email: form.email || undefined,
      pickup_point: form.pickup,
      destination: form.destination,
      travel_date: form.date,
      package_id: cleanPackageId,
      car_id: cleanCarId,
      message: finalMessage.trim(),
    };

    try {
      const res = await createBooking(booking);
      if (res.success) {
        setSuccess(true);
        alert('Booking berhasil dikirim! Kami akan menghubungi Anda via WhatsApp.');
        setForm({
          name: '', phone: '', email: '', pickup: '', destination: '',
          date: '', passengers: '', serviceType: 'Reguler', packageId: '', carId: '', message: ''
        });
      } else {
        alert(res.error || 'Gagal mengirim pesanan');
      }
    } catch (err) {
      alert('Terjadi kesalahan, silahkan coba lagi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNavClick = (id: string) => {
    if (id === 'ai-chat') { setAiChatOpen(true); return; }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWA = () => {
    const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6285702710400';
    let text = `Halo Reytrans, saya ingin booking perjalanan.\n\n`;
    text += `- Layanan: ${form.serviceType}\n- Jemput: ${form.pickup}\n- Tujuan: ${form.destination}\n- Tanggal: ${form.date}\n- Penumpang: ${form.passengers || '-'}`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-background text-on-surface font-body-md selection:bg-primary/20">
      {/* Navigation */}
      <header className={`docked full-width top-0 fixed w-full h-[88px] z-[99] flex items-center transition-all duration-300 ${
        isScrolled ? 'bg-surface/90 glass-nav border-b border-outline-variant/30 shadow-sm' : 'bg-transparent border-transparent'
      }`}>
        <nav className="flex justify-between items-center px-margin-desktop w-full max-w-container-max mx-auto">
          <div className="flex items-center gap-2">
            <span className={`font-h3 text-h3 font-extrabold transition-colors ${isScrolled ? 'text-on-surface' : 'text-white'}`}>Reytrans</span>
          </div>
          <div className="hidden lg:flex items-center gap-8">
            <a className={`font-label-sm text-label-sm font-bold border-b-2 pb-1 transition-colors ${isScrolled ? 'text-primary border-primary' : 'text-white border-white'}`} href="#">Beranda</a>
            <button onClick={() => handleNavClick('services')} className={`font-label-sm text-label-sm transition-colors ${isScrolled ? 'text-on-surface-variant hover:text-primary' : 'text-white/80 hover:text-white'}`}>Layanan</button>
            <button onClick={() => handleNavClick('route')} className={`font-label-sm text-label-sm transition-colors ${isScrolled ? 'text-on-surface-variant hover:text-primary' : 'text-white/80 hover:text-white'}`}>Rute & Jadwal</button>
            <button onClick={() => handleNavClick('booking')} className={`font-label-sm text-label-sm transition-colors ${isScrolled ? 'text-on-surface-variant hover:text-primary' : 'text-white/80 hover:text-white'}`}>Booking</button>
            <button onClick={() => handleNavClick('faq')} className={`font-label-sm text-label-sm transition-colors ${isScrolled ? 'text-on-surface-variant hover:text-primary' : 'text-white/80 hover:text-white'}`}>FAQ</button>
          </div>
          <button onClick={() => handleNavClick('booking')} className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-sm text-label-sm hover:scale-[1.02] transition-transform flex items-center gap-2 shadow-md">
            <span className="material-symbols-outlined text-[20px]">chat</span> WhatsApp
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/assets/Cover Reytrans.png')" }}>
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <div className="max-w-container-max mx-auto px-margin-desktop w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full h-full pt-[88px]">
          <div className="lg:col-span-12 xl:col-span-7 space-y-8">
            <h1 className="font-display-lg text-display-lg-mobile lg:text-display-lg leading-tight text-white drop-shadow-md">
              Perjalanan Aman, Nyaman & Berkesan.
            </h1>
            <p className="text-white font-body-lg max-w-lg drop-shadow-md font-medium">
              Layanan travel reguler & charter privat Jabodetabek — Ciayumajakuning PP & Brebes dengan layanan door-to-door.
            </p>
            <div className="flex gap-4 pt-4">
              <button onClick={() => handleNavClick('booking')} className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg hover:shadow-xl">
                Booking Sekarang <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
          
          {/* Badges mapped to bottom right */}
          <div className="absolute bottom-8 right-8 hidden lg:flex flex-wrap gap-4 z-20 justify-end">
            <span className="bg-transparent px-5 py-3 rounded-full text-caption text-white border-2 border-white/70 flex items-center gap-2 drop-shadow-md backdrop-blur-sm"><span className="material-symbols-outlined text-[18px]">person</span> Include Sopir</span>
            <span className="bg-transparent px-5 py-3 rounded-full text-caption text-white border-2 border-white/70 flex items-center gap-2 drop-shadow-md backdrop-blur-sm"><span className="material-symbols-outlined text-[18px]">local_gas_station</span> BBM Include</span>
            <span className="bg-transparent px-5 py-3 rounded-full text-caption text-white border-2 border-white/70 flex items-center gap-2 drop-shadow-md backdrop-blur-sm"><span className="material-symbols-outlined text-[18px]">home</span> Door to Door</span>
          </div>
        </div>
      </section>

      {/* Trust Indicators (Infinite Marquee) */}
      <div className="bg-white py-5 border-y border-outline-variant/30 overflow-hidden flex whitespace-nowrap">
        {/* Double the content containers for perfect looping */}
        {[1, 2].map((group) => (
          <div key={group} className="flex min-w-max flex-shrink-0 animate-marquee items-center gap-16 px-8 opacity-70 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 font-bold"><span className="material-symbols-outlined text-primary">verified</span> 5 Tahun Beroperasi</div>
            <div className="flex items-center gap-2 font-bold">
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" aria-label="Google">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google Verified
            </div>
            <div className="flex items-center gap-2 font-bold"><span className="material-symbols-outlined text-primary">groups</span> 10.000+ Pelanggan</div>
            <div className="flex items-center gap-2 font-bold"><span className="material-symbols-outlined text-primary">star</span> Rating 4.9</div>
            <div className="flex items-center gap-2 font-bold"><span className="material-symbols-outlined text-primary">commute</span> Armada &lt; 3 Tahun</div>
          </div>
        ))}
      </div>

      {/* Guarantee Section */}
      <section className="py-section-gap bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <span className="text-primary font-bold tracking-widest text-caption uppercase">GARANSI REYTRANS</span>
            <h2 className="font-h2 text-h2 mt-4 leading-tight">Booking tanpa rasa khawatir.</h2>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-outline-variant/30 hover:shadow-xl transition-all group">
              <span className="material-symbols-outlined text-primary text-4xl mb-6 block">payments</span>
              <h4 className="font-h3 text-xl mb-2">Harga Transparan</h4>
              <p className="text-on-surface-variant">Tidak ada biaya tambahan tersembunyi yang ditagihkan kemudian hari.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-outline-variant/30 hover:shadow-xl transition-all">
              <span className="material-symbols-outlined text-primary text-4xl mb-6 block">event_busy</span>
              <h4 className="font-h3 text-xl mb-2">Cancel Gratis H-3</h4>
              <p className="text-on-surface-variant">Pembatalan gratis maksimal H-3 dari jadwal keberangkatan Anda.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-outline-variant/30 hover:shadow-xl transition-all">
              <span className="material-symbols-outlined text-primary text-4xl mb-6 block">badge</span>
              <h4 className="font-h3 text-xl mb-2">Sopir Berlisensi</h4>
              <p className="text-on-surface-variant">Sopir berpengalaman dan memiliki lisensi mengemudi resmi yang valid.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-outline-variant/30 hover:shadow-xl transition-all">
              <span className="material-symbols-outlined text-primary text-4xl mb-6 block">chat_bubble</span>
              <h4 className="font-h3 text-xl mb-2">Respon CS 5 Menit</h4>
              <p className="text-on-surface-variant">Fast respon via WhatsApp maksimal 5 menit selama jam operasional.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid (Mapped from packages) */}
      <section id="services" className="py-section-gap">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-primary font-bold tracking-widest text-caption uppercase">PILIHAN LAYANAN</span>
              <h2 className="font-h2 text-h2 mt-4">Pilihan armada dan paket wisata.</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, idx) => (
              <div key={pkg.id || idx} className="bg-white rounded-[32px] overflow-hidden border border-outline-variant/30 lift-on-hover flex flex-col">
                <div className="relative h-64 bg-surface-container-low p-6">
                  {idx === 0 && <span className="absolute top-4 left-4 bg-primary text-white text-caption font-bold px-3 py-1 rounded-full">TERPOPULER</span>}
                  <img className="w-full h-full object-contain" src={pkg.image_url || '/assets/hiace.png'} alt={pkg.title} />
                </div>
                
                <div className="p-8 space-y-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start">
                    <h3 className="font-h3 text-xl font-bold pr-4 leading-tight">{pkg.title}</h3>
                    <span className="text-on-surface-variant font-bold flex items-center gap-1 shrink-0">
                      <span className="material-symbols-outlined">group</span> {pkg.features?.[0]?.match(/\d+/)?.[0] || '14'}
                    </span>
                  </div>
                  
                  {/* Pills */}
                  <div className="flex flex-wrap gap-2 pt-1 border-t border-outline-variant/20 hidden">
                    <span className="bg-surface-container text-caption px-3 py-2 rounded-full">Sopir</span>
                    <span className="bg-surface-container text-caption px-3 py-2 rounded-full">BBM</span>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-on-surface-variant leading-relaxed min-h-[4.5rem]">
                    {pkg.description}
                  </p>

                  {/* Pricing Placeholder */}
                  <div className="space-y-1">
                     <div className="text-primary font-extrabold text-lg">{pkg.duration}</div>
                  </div>

                  {/* Features List */}
                  <div className="flex-grow space-y-2 mt-4 pb-6">
                    {pkg.features?.map((feat, fidx) => (
                      <div key={fidx} className="flex items-start gap-2 text-sm text-on-surface-variant">
                         <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">check</span>
                         <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action */}
                  <div className="mt-auto border-t border-outline-variant/20 pt-6">
                    <button onClick={() => { setForm({ ...form, packageId: pkg.id }); handleNavClick('booking'); }} className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[20px]">chat</span> Tanya Harga ke Admin
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-24 bg-primary">
        <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div className="space-y-2">
            <div className="text-display-lg-mobile text-white font-extrabold">10.000+</div>
            <div className="text-primary-fixed-dim font-bold uppercase tracking-widest text-caption">Pelanggan Puas</div>
          </div>
          <div className="space-y-2">
            <div className="text-display-lg-mobile text-white font-extrabold">4.9/5</div>
            <div className="text-primary-fixed-dim font-bold uppercase tracking-widest text-caption">Google Rating</div>
          </div>
          <div className="space-y-2">
            <div className="text-display-lg-mobile text-white font-extrabold">5 Tahun</div>
            <div className="text-primary-fixed-dim font-bold uppercase tracking-widest text-caption">Pengalaman</div>
          </div>
          <div className="space-y-2">
            <div className="text-display-lg-mobile text-white font-extrabold">100%</div>
            <div className="text-primary-fixed-dim font-bold uppercase tracking-widest text-caption">On Time Arrival</div>
          </div>
        </div>
      </section>

      {/* Pilihan Mobil & Rental Section - Stitch Design */}
      <section className="py-section-gap bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-caption font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[18px]">directions_car</span> Armada Kami
            </div>
            <h2 className="font-h2 text-h2 text-on-surface">Pilihan Mobil & Rental</h2>
            <p className="text-on-surface-variant font-body-lg max-w-2xl mx-auto">
              Pilih armada sesuai kebutuhan rombongan Anda. Hiace & Elf Long dilengkapi AC & Karaoke. Semua termasuk sopir, BBM, & tol.
            </p>
          </div>
          {/* First row: first 4 cars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {cars.slice(0, 4).map((car, idx) => {
              const isTerpopuler = car.name.toLowerCase().includes('hiace');
              const percentBooked = idx === 0 ? '75%' : idx === 1 ? '68%' : idx === 2 ? '78%' : '74%';
              const badgeText = idx === 0 ? 'Armada terbatas hari ini' : idx === 1 ? 'Tersedia — pesan sekarang' : idx === 2 ? 'Favorit keluarga — sering penuh' : 'Terlaris — favorit rombongan';
              const lastBooked = idx === 0 ? 'baru saja' : idx === 1 ? 'baru saja' : idx === 2 ? '15 menit yang lalu' : 'baru saja';

              return (
                <div
                  key={car.id || idx}
                  className={`bg-white rounded-[24px] flex flex-col shadow-sm lift-on-hover overflow-hidden relative ${
                    isTerpopuler ? 'border-2 border-primary shadow-[0_12px_40px_rgba(37,99,235,0.12)]' : 'border border-outline-variant/30'
                  }`}
                >
                  {isTerpopuler && (
                    <span className="absolute top-0 left-0 right-0 bg-primary text-white text-[10px] font-extrabold uppercase tracking-widest text-center py-1 z-20 flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-[12px] fill-[1]">star</span> Terpopuler
                    </span>
                  )}
                  <div className={`relative bg-surface-container-low h-48 flex items-center justify-center p-4 ${isTerpopuler ? 'pt-8' : ''}`}>
                    {car.is_available && (
                      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-green-600 text-[11px] font-bold px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] fill-[1]">check_circle</span> Tersedia
                      </span>
                    )}
                    <img
                      alt={car.name}
                      className="w-full h-full object-contain"
                      src={car.image_url || '/assets/avanza.jpg'}
                    />
                  </div>
                  <div className="p-6 space-y-4 flex-grow">
                    <div>
                      <h3 className="font-bold text-lg text-on-surface">{car.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-on-surface-variant text-caption">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">commute</span> {car.type}</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">group</span> {car.capacity} Penumpang</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-bold text-error">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">local_fire_department</span> {badgeText}</span>
                      <span>{percentBooked} Terbooking</span>
                    </div>
                    <div className="bg-green-50 rounded-lg py-2 px-3 flex items-center gap-2 text-[11px] text-green-700 font-medium">
                      <span className="material-symbols-outlined text-[14px]">history</span> Booking terakhir: {lastBooked}
                    </div>
                    <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-caption text-outline line-through">Rp {Math.round(car.price_per_day * 1.25).toLocaleString('id-ID')}</span>
                          <span className="bg-error text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Hemat 20%</span>
                        </div>
                        <div className="text-primary font-extrabold text-lg">Rp {car.price_per_day.toLocaleString('id-ID')} <span className="text-caption text-outline font-normal">/ hari</span></div>
                      </div>
                      <button
                        onClick={() => {
                          setForm({ ...form, carId: car.id });
                          handleNavClick('booking');
                        }}
                        className="bg-primary text-white p-2.5 rounded-xl flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                      >
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Second row: remaining cars */}
          {cars.length > 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mt-8">
              {cars.slice(4).map((car, idx) => {
                const realIdx = idx + 4;
                const percentBooked = '86%';
                const badgeText = 'Kapasitas besar — tersedia terbatas';
                const lastBooked = '30 menit yang lalu';

                return (
                  <div
                    key={car.id || realIdx}
                    className="bg-white rounded-[24px] border border-outline-variant/30 flex flex-col shadow-sm lift-on-hover overflow-hidden"
                  >
                    <div className="relative bg-surface-container-low h-48 flex items-center justify-center p-4">
                      {car.is_available && (
                        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-green-600 text-[11px] font-bold px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] fill-[1]">check_circle</span> Tersedia
                        </span>
                      )}
                      <img
                        alt={car.name}
                        className="w-full h-full object-contain"
                        src={car.image_url || '/assets/elf.png'}
                      />
                    </div>
                    <div className="p-6 space-y-4 flex-grow">
                      <div>
                        <h3 className="font-bold text-lg text-on-surface">{car.name}</h3>
                        <div className="flex items-center gap-4 mt-2 text-on-surface-variant text-caption">
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">commute</span> {car.type}</span>
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">group</span> {car.capacity} Penumpang</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-bold text-error">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">local_fire_department</span> {badgeText}</span>
                        <span>{percentBooked} Terbooking</span>
                      </div>
                      <div className="bg-green-50 rounded-lg py-2 px-3 flex items-center gap-2 text-[11px] text-green-700 font-medium">
                        <span className="material-symbols-outlined text-[14px]">history</span> Booking terakhir: {lastBooked}
                      </div>
                      <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-caption text-outline line-through">Rp {Math.round(car.price_per_day * 1.25).toLocaleString('id-ID')}</span>
                            <span className="bg-error text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Hemat 20%</span>
                          </div>
                          <div className="text-primary font-extrabold text-lg">Rp {car.price_per_day.toLocaleString('id-ID')} <span className="text-caption text-outline font-normal">/ hari</span></div>
                        </div>
                        <button
                          onClick={() => {
                            setForm({ ...form, carId: car.id });
                            handleNavClick('booking');
                          }}
                          className="bg-primary text-white p-2.5 rounded-xl flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                        >
                          <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Routes & Map */}
      <section id="route" className="py-section-gap overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col gap-8">
              <div>
                <span className="text-primary font-bold tracking-widest text-caption uppercase">RUTE & JADWAL</span>
                <h2 className="font-h2 text-h2 mt-4 leading-tight">Daftar Tarif & Jadwal Reguler</h2>
              </div>
              
              {/* Tarif Table */}
              <div className="bg-white rounded-3xl border border-outline-variant/30 overflow-hidden shadow-sm">
                <div className="p-4 md:p-6 bg-surface-container border-b border-outline-variant/30 grid grid-cols-3 font-bold text-[10px] md:text-caption uppercase tracking-wider">
                  <span className="col-span-2">Rute Keberangkatan & Tujuan</span>
                  <span className="text-right">Tarif / Orang</span>
                </div>
                <div className="divide-y divide-outline-variant/20 text-sm md:text-base">
                  {[
                    { rute: 'Jakarta ↔ Cirebon', tarif: 'Rp 250.000' },
                    { rute: 'Jakarta ↔ Indramayu', tarif: 'Rp 250.000' },
                    { rute: 'Bogor ↔ Cirebon / Indramayu', tarif: 'Rp 250.000' },
                    { rute: 'Tangerang ↔ Cirebon / Indramayu', tarif: 'Rp 250.000' },
                    { rute: 'Bandara Soekarno-Hatta (Sutta) ↔ Cirebon / Indramayu', tarif: 'Rp 250.000' },
                    { rute: 'Depok / Bekasi ↔ Cirebon / Indramayu', tarif: 'Rp 250.000' },
                  ].map((item, i) => (
                    <div key={i} className="p-4 md:p-6 grid grid-cols-3 items-center hover:bg-surface transition-colors">
                      <span className="font-bold col-span-2 pr-4">{item.rute}</span>
                      <span className="text-right text-primary font-bold">{item.tarif}</span>
                    </div>
                  ))}
                  <div className="p-4 md:p-6 bg-surface text-caption text-outline-variant italic">
                    * Catatan: Harga di atas sewaktu-waktu dapat berubah sesuai hari raya/high season tanpa pemberitahuan terlebih dahulu.
                  </div>
                </div>
              </div>

              {/* Jadwal Table */}
              <div className="bg-white rounded-3xl border border-outline-variant/30 overflow-hidden shadow-sm">
                <div className="p-4 md:p-6 bg-surface-container border-b border-outline-variant/30 grid grid-cols-3 gap-2 font-bold text-[9px] md:text-caption uppercase tracking-wider">
                  <span>Keberangkatan Dari</span>
                  <span className="text-center">Jadwal Pagi/Siang</span>
                  <span className="text-right">Jadwal Malam</span>
                </div>
                <div className="divide-y divide-outline-variant/20 text-xs md:text-sm">
                  {[
                    { dari: 'Jakarta / Jabodetabek', pagi: '08:00 WIB', malam: '20:00 WIB' },
                    { dari: 'Cirebon / Kuningan', pagi: '08:00 & 12:30 WIB', malam: '20:00 WIB' },
                    { dari: 'Indramayu', pagi: '12:00 WIB (Siang)', malam: '23:00 WIB' },
                  ].map((item, i) => (
                    <div key={i} className="p-4 md:p-6 grid grid-cols-3 gap-2 items-center hover:bg-surface transition-colors">
                      <span className="font-bold pr-2">{item.dari}</span>
                      <span className="text-center text-primary font-bold">{item.pagi}</span>
                      <span className="text-right text-primary font-bold">{item.malam}</span>
                    </div>
                  ))}
                  <div className="p-4 md:p-6 bg-surface text-caption text-outline-variant italic">
                    * Penjemputan door-to-door langsung ke rumah Anda dimulai 1-2 jam sebelum jam keberangkatan di atas.
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative h-[400px] lg:h-auto lg:min-h-[100%] bg-surface-container rounded-3xl overflow-hidden border border-outline-variant/30">
              <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-multiply flex items-center justify-center">
                 <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuALz_oVvhfiCAcj3gWKrdKWIyqLPep8tWibKTggNAeV3NLP8RlIW9oQtEIXKe6cfVuG0u_5ocM9E_tSYWBXLhpFDwdaDJFiuV06q5og2T-8L4EwTZDffoo6fZn_su9W89f9cVzpxBWBcj8gMr3uu7Xfino2o9zz6EEuuHqjj0oNLEePsD-fq0ah4VBP0qnUYpNJskOBpe_vN1p65JztNXJ1fY_ahq1LCntCeImstd6_kMqIWUBjDyS_" alt="Map Background" className="object-cover w-full h-full" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
                <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-xl border border-white/50 space-y-2 max-w-xs text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 font-bold text-primary">
                    <span className="material-symbols-outlined">location_on</span> Hub Utama
                  </div>
                  <p className="text-sm text-on-surface-variant font-medium">Layanan kami menjangkau area Jabodetabek dan Ciayumajakuning setiap hari.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Steps (How It Works) */}
      <section className="py-section-gap bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-margin-desktop text-center mb-16">
          <span className="text-primary font-bold tracking-widest text-caption uppercase">CARA BOOKING</span>
          <h2 className="font-h2 text-h2 mt-4">Mudah dalam 3 Langkah.</h2>
        </div>
        <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { step: 1, icon: 'directions_bus', title: 'Pilih Armada', desc: 'Tentukan armada dan tipe layanan yang Anda inginkan sesuai kebutuhan.' },
            { step: 2, icon: 'assignment', title: 'Isi Booking', desc: 'Lengkapi data penjemputan, tujuan, dan jam keberangkatan dengan valid.' },
            { step: 3, icon: 'check_circle', title: 'Konfirmasi', desc: 'Selesaikan konfirmasi dengan CS via WhatsApp secara instan (5 Menit).' }
          ].map(s => (
            <div key={s.step} className="relative group">
              <div className="bg-white p-10 rounded-[40px] border border-outline-variant/30 shadow-sm lift-on-hover relative z-10 h-full">
                <div className="bg-primary-container text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-8">{s.step}</div>
                <span className="material-symbols-outlined text-primary text-5xl mb-6 block">{s.icon}</span>
                <h4 className="font-h3 text-xl mb-4">{s.title}</h4>
                <p className="text-on-surface-variant">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog/Artikel Section - Stitch Design */}
      <section className="py-section-gap">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-widest text-caption uppercase">BLOG & ARTIKEL</span>
            <h2 className="font-h2 text-h2 mt-4">Wawasan & Tips Perjalanan</h2>
            <p className="text-on-surface-variant font-body-lg mt-4 max-w-2xl mx-auto">Dapatkan informasi terbaru seputar destinasi wisata dan tips perjalanan nyaman.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.slice(0, 3).map((article, idx) => {
              const badgeStyles = [
                { bg: 'bg-primary', text: 'text-white', label: 'Destinasi' },
                { bg: 'bg-secondary-container', text: 'text-white', label: 'Tips' },
                { bg: 'bg-surface-container-highest', text: 'text-on-surface', label: 'Berita' },
              ];
              const badge = badgeStyles[idx % badgeStyles.length];
              const authorNames = ['Admin Reytrans', 'Travel Specialist', 'Update'];
              const author = authorNames[idx % authorNames.length];
              return (
                <div key={article.id} className="bg-white rounded-[32px] overflow-hidden border border-outline-variant/30 lift-on-hover flex flex-col h-full shadow-sm group">
                  <div className="relative h-56 overflow-hidden">
                    <img alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={article.thumbnail_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbzzGFK2R38N9r5hmvuF4tra_zrCF_2dyzN1PHDEVhgSCdG3VCxW9X-gz1niy3Tq3NIX2fvxDjr2RzVjfXDQBNK59ZCtmze5LADyKttUL4QxuW5eMNJsCcl0n75LUUbvosSnBTxpbHJin46DAOm6T2WUGnTx4WyfI-k7G2CoIzCK3W7llHCIPkPhkd_azBk2rn9--ICTZIpph3W0XbyWry0ykxiCsfI7bXMrs2KnOf4AMtxDzw7YZU'} />
                    <span className={`absolute top-4 left-4 ${badge.bg} ${badge.text} text-caption font-bold px-3 py-1 rounded-full`}>{badge.label}</span>
                  </div>
                  <div className="p-8 space-y-4 flex-grow flex flex-col">
                    <div className="flex items-center gap-4 text-caption text-outline">
                      <span>{article.created_at ? new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('id-ID')}</span>
                      <span>•</span>
                      <span>{author}</span>
                    </div>
                    <h3 className="font-h3 text-xl line-clamp-2">{article.title}</h3>
                    <p className="text-on-surface-variant text-sm line-clamp-3 flex-grow">{article.excerpt || 'Jelajahi keindahan alam Nusantara dengan layanan kami.'}</p>
                    <Link href={`/artikel/${article.slug}`} className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all pt-4">
                      Baca Selengkapnya <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center mt-12">
            <Link href="/artikel" className="bg-secondary hover:bg-secondary-dark text-white px-10 py-5 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-md">
              Lihat Semua Artikel <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Section - Stitch Design */}
      <section className="py-section-gap bg-surface-container-low/30">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-widest text-caption uppercase bg-primary/10 px-4 py-1.5 rounded-full inline-block">TESTIMONI</span>
            <h2 className="font-h2 text-h2 mt-4 leading-tight">Apa Kata Mereka?</h2>
            <p className="text-on-surface-variant font-body-lg mt-4 max-w-2xl mx-auto">Ribuan pelanggan telah merasakan kenyamanan perjalanan bersama Reytrans.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-[32px] border border-outline-variant/30 flex flex-col shadow-sm lift-on-hover transition-all duration-300">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-yellow-400" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
                ))}
              </div>
              <blockquote className="text-on-surface font-body-md mb-8 flex-grow">
                "Layanan travel terbaik yang pernah saya coba. Sopirnya sangat ramah and mobilnya sangat bersih. Jemputnya tepat waktu di depan rumah."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold">BP</div>
                <div>
                  <div className="font-bold">Budi Pratama</div>
                  <div className="text-caption text-outline">Jakarta Selatan</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-[32px] border border-outline-variant/30 flex flex-col shadow-sm lift-on-hover transition-all duration-300">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-yellow-400" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
                ))}
              </div>
              <blockquote className="text-on-surface font-body-md mb-8 flex-grow">
                "Sangat puas dengan layanan charter untuk keluarga. Elf Long-nya nyaman, AC dingin, and ada karaoke jadi perjalanan jauh tidak membosankan."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary font-bold">SR</div>
                <div>
                  <div className="font-bold">Siti Rahayu</div>
                  <div className="text-caption text-outline">Cirebon</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-[32px] border border-outline-variant/30 flex flex-col shadow-sm lift-on-hover transition-all duration-300">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-yellow-400" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
                ))}
              </div>
              <blockquote className="text-on-surface font-body-md mb-8 flex-grow">
                "Fast response admin WhatsApp-nya! Proses booking hanya 5 menit and langsung dapat jadwal keberangkatan. Sangat efisien untuk yang butuh cepat."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary font-bold">AN</div>
                <div>
                  <div className="font-bold">Andi Nugroho</div>
                  <div className="text-caption text-outline">Kuningan</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Pemesanan Section (BookingForm Re-styled) */}
      <section id="booking" className="py-section-gap">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div>
                <span className="text-primary font-bold tracking-widest text-caption uppercase">PESAN SEKARANG</span>
                <h2 className="font-h2 text-h2 mt-4 leading-tight">Booking Cepat & Mudah</h2>
                <p className="text-on-surface-variant font-body-lg mt-4">Isi detail perjalanan Anda dan tim kami akan menghubungi via WhatsApp.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-label-sm font-bold block ml-1">Nama Lengkap *</label>
                    <input className="w-full px-6 py-4 rounded-[14px] border border-outline-variant/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" placeholder="Contoh: Budi Santoso" required type="text" value={form.name} onChange={setF('name')} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-label-sm font-bold block ml-1">Nomor WhatsApp *</label>
                    <input className="w-full px-6 py-4 rounded-[14px] border border-outline-variant/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" placeholder="08xxxxxxxxxx" required type="tel" value={form.phone} onChange={setF('phone')} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-label-sm font-bold block ml-1">Titik Penjemputan *</label>
                    <input className="w-full px-6 py-4 rounded-[14px] border border-outline-variant/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" placeholder="Stasiun Cirebon / Hotel XYZ" required type="text" value={form.pickup} onChange={setF('pickup')} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-label-sm font-bold block ml-1">Tujuan *</label>
                    <input className="w-full px-6 py-4 rounded-[14px] border border-outline-variant/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" placeholder="Bandara Soetta / Jakarta" required type="text" value={form.destination} onChange={setF('destination')} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-label-sm font-bold block ml-1">Tanggal Perjalanan *</label>
                    <input className="w-full px-6 py-4 rounded-[14px] border border-outline-variant/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" required type="date" value={form.date} onChange={setF('date')} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-label-sm font-bold block ml-1">Jumlah Penumpang</label>
                    <input className="w-full px-6 py-4 rounded-[14px] border border-outline-variant/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" min="1" placeholder="4" type="number" value={form.passengers} onChange={setF('passengers')} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-label-sm font-bold block ml-1">Tipe Layanan *</label>
                    <select className="w-full px-6 py-4 rounded-[14px] border border-outline-variant/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" value={form.serviceType} onChange={setF('serviceType')}>
                      <option value="Travel Reguler">Travel Reguler (Per Kursi)</option>
                      <option value="Charter Privat">Charter Privat</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-label-sm font-bold block ml-1">Pilih Paket Armada (Opsional)</label>
                    <select className="w-full px-6 py-4 rounded-[14px] border border-outline-variant/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" value={form.packageId} onChange={setF('packageId')}>
                      <option value="">-- Pilih Armada --</option>
                      {packages.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                      {cars.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-label-sm font-bold block ml-1">Catatan Tambahan (Opsional)</label>
                  <textarea rows={3} className="w-full px-6 py-4 rounded-[14px] border border-outline-variant/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" placeholder="Barang bawaan besar, dll" value={form.message} onChange={setF('message')} />
                </div>

                <button disabled={submitting} className="w-full bg-primary text-white py-5 rounded-[14px] font-bold text-lg hover:shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2" type="submit">
                  <span className="material-symbols-outlined">{submitting ? 'sync' : 'send'}</span> {submitting ? 'Memproses...' : 'Kirim Permintaan Booking'}
                </button>
              </form>
            </div>
            {/* Sidebar Security */}
            <div className="lg:sticky lg:top-32 space-y-8">
              <div className="bg-surface-container-low p-10 rounded-[40px] border border-outline-variant/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <span className="material-symbols-outlined text-[120px]">security</span>
                </div>
                <h3 className="font-h3 text-2xl mb-6">Keamanan Data Terjamin</h3>
                <p className="text-on-surface-variant font-body-md mb-8">Data pribadi dan detail perjalanan Anda dijaga kerahasiaannya untuk keperluan penjemputan saja.</p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 font-bold text-on-surface"><span className="material-symbols-outlined text-green-600">verified_user</span> Transaksi Aman</li>
                  <li className="flex items-center gap-3 font-bold text-on-surface"><span className="material-symbols-outlined text-green-600">verified_user</span> Tidak Ada Spam</li>
                  <li className="flex items-center gap-3 font-bold text-on-surface"><span className="material-symbols-outlined text-green-600">verified_user</span> Bayar di Tempat</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section (Stitch design + Interactive Accordion) */}
      <section id="faq" className="py-24 bg-surface/50 border-t border-outline-variant/30">
        <div className="max-w-4xl mx-auto px-margin-desktop">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="bg-primary/10 text-primary font-bold text-caption tracking-widest px-4 py-1.5 rounded-full uppercase inline-flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">help</span> FAQ
            </span>
            <h2 className="font-h2 text-h2 leading-tight">Pertanyaan yang Sering Ditanyakan</h2>
            <p className="text-on-surface-variant font-body-lg">
              Temukan jawaban cepat seputar layanan sewa mobil, paket travel, dan kebijakan kami.
            </p>
          </div>

          {/* Categories Filter */}
          {faqCategories.length > 1 && (
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {faqCategories.map(cat => {
                const isActive = faqFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => { setFaqFilter(cat); setFaqActive(null); }}
                    className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all border ${
                      isActive
                        ? 'bg-primary border-primary text-white shadow-md'
                        : 'bg-white border-outline-variant/50 text-outline hover:border-primary hover:text-primary cursor-pointer'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}

          {/* Accordion list */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, i) => {
              const isOpen = faqActive === i;
              return (
                <div
                  key={faq.id}
                  className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen ? 'border-primary ring-3 ring-primary/5 shadow-md' : 'border-outline-variant/30 hover:border-primary/50'
                  }`}
                >
                  <button
                    className="w-full flex items-center justify-between p-6 text-left font-bold text-[17px] text-on-surface hover:text-primary transition-colors gap-4 cursor-pointer"
                    onClick={() => setFaqActive(isOpen ? null : i)}
                  >
                    <span>{faq.question}</span>
                    <span className={`material-symbols-outlined text-outline transform transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}>
                      expand_more
                    </span>
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-[300px] border-t border-outline-variant/10' : 'max-h-0'
                    }`}
                  >
                    <div className="p-6 text-on-surface-variant font-body-md leading-relaxed bg-surface/30">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="pb-section-gap px-margin-mobile">
        <div className="max-w-container-max mx-auto bg-primary rounded-[48px] p-12 lg:p-24 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-l from-white/20 to-transparent flex"></div>
          </div>
          <div className="z-10 flex-1 space-y-8 text-center lg:text-left">
            <h2 className="text-white font-display-lg text-display-lg-mobile lg:text-h2 leading-tight">Siap Berangkat Hari Ini?</h2>
            <p className="text-primary-fixed-dim text-body-lg max-w-md mx-auto lg:mx-0">Booking sekarang dan nikmati perjalanan yang nyaman, aman, dan pastinya tepat waktu.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={() => window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6285702710400'}?text=Halo%20Reytrans,%20saya%20ingin%20booking%20perjalanan.`, '_blank')} className="bg-white text-primary px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform cursor-pointer">
                <span className="material-symbols-outlined">chat</span> Booking WhatsApp
              </button>
              <button onClick={() => handleNavClick('route')} className="bg-primary outline outline-2 outline-white/30 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors cursor-pointer">
                Lihat Jadwal
              </button>
            </div>
          </div>
          <div className="flex-1 w-full lg:w-auto relative">
            <img alt="Collage of travel vans" className="w-full object-contain transform lg:scale-125 z-10 drop-shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLLUU1P20buihB8mE_DhoxvgA6f-iUMRq5ZdAh0M7TbZJLoiN_A4L_HKf5C-FrB1dCTiGsy9YCJZkOzfX9r0EGM6ynGJpQIaEF1R9Nylr0S5XzLabq_7XAD1ra9F9tyUNh5-8hnwEgWcoOWXydr6xps535_4GtQge4BjAPx1DY0patwYcv-D1wR8xVfUBBNClP1RiA28drqTu3HlMwGxRldJAYpBvOMwnGYpREM-W3HRxE-Urch3TU"/>
          </div>
        </div>
      </section>

      <Footer onNavClick={handleNavClick} />
      <AIChat packages={packages} cars={cars} faqs={faqs} isOpenExternally={aiChatOpen} onCloseExternal={() => setAiChatOpen(false)} />
      <SocialProofToast />
      <ExitIntentPopup onBook={() => handleNavClick('booking')} />
    </div>
  );
}

function Footer({ onNavClick }: { onNavClick: (id: string) => void }) {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/20 pt-section-gap pb-12">
      <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter">
        <div className="md:col-span-2 space-y-6">
          <span className="font-h3 text-h3 font-bold text-on-surface">Reytrans</span>
          <p className="text-on-surface-variant font-body-md max-w-sm">
            Penyedia layanan transportasi terpercaya untuk rute Jabodetabek, Cirebon, Kuningan, Majalengka, dan sekitarnya.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-on-surface mb-6">Menu</h4>
          <ul className="space-y-4">
            <li><button onClick={() => onNavClick('services')} className="text-on-surface-variant hover:text-primary">Layanan</button></li>
            <li><button onClick={() => onNavClick('faq')} className="text-on-surface-variant hover:text-primary">FAQ</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-on-surface mb-6">Kontak</h4>
          <ul className="space-y-4 text-on-surface-variant">
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">phone</span> 0812-3456-7890</li>
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">location_on</span> Cirebon, Indonesia</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
