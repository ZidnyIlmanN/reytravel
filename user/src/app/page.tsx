'use client';
import { useState, useEffect, useRef } from 'react';
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
import SocialProofToast from '@/components/SocialProofToast';
import SearchModal from '@/components/SearchModal';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import AIChat from '@/components/AIChat';
import CustomSelect from '@/components/CustomSelect';

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
  const [statsVisible, setStatsVisible] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const statsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setStatsVisible(true);
        observer.disconnect(); // only animate once
      }
    }, { threshold: 0.2 });

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    return () => observer.disconnect();
  }, []);

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
      } catch (err) { }
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
      } catch (err) { }
      try {
        const dbFaqs = await getFAQs();
        if (dbFaqs && dbFaqs.length > 0) setFaqs(dbFaqs);
      } catch (err) { }
      try {
        const dbArticles = await getPublishedArticles();
        if (dbArticles && dbArticles.length > 0) setArticles(dbArticles);
      } catch (err) { }
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
      <header className={`docked full-width top-0 fixed w-full h-[88px] z-[100] flex items-center transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'bg-surface/90 glass-nav border-b border-outline-variant/30 shadow-sm' : 'bg-transparent border-transparent'
        }`}>
        <nav className="flex justify-between items-center px-margin-desktop w-full max-w-container-max mx-auto">
          <div className="flex items-center gap-2">
            <span className={`font-h3 text-h3 font-extrabold transition-colors ${isScrolled ? 'text-on-surface' : 'text-white'}`}>Reytrans</span>
          </div>
          <div className="hidden lg:flex items-center gap-8">
            <a className={`text-base font-bold transition-colors ${isScrolled ? 'text-primary' : 'text-white'}`} href="#">Beranda</a>
            <button onClick={() => handleNavClick('services')} className={`text-base font-bold transition-colors ${isScrolled ? 'text-on-surface-variant hover:text-primary' : 'text-white/80 hover:text-white'}`}>Layanan</button>
            <button onClick={() => handleNavClick('route')} className={`text-base font-bold transition-colors ${isScrolled ? 'text-on-surface-variant hover:text-primary' : 'text-white/80 hover:text-white'}`}>Rute & Jadwal</button>
            <button onClick={() => handleNavClick('booking')} className={`text-base font-bold transition-colors ${isScrolled ? 'text-on-surface-variant hover:text-primary' : 'text-white/80 hover:text-white'}`}>Booking</button>
            <button onClick={() => handleNavClick('faq')} className={`text-base font-bold transition-colors ${isScrolled ? 'text-on-surface-variant hover:text-primary' : 'text-white/80 hover:text-white'}`}>FAQ</button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSearchOpen(true)} className={`p-2 rounded-full transition-colors flex items-center justify-center ${isScrolled || isMobileMenuOpen ? 'text-on-surface-variant hover:bg-surface-container' : 'text-white hover:bg-white/10'}`} aria-label="Search">
              <span className="material-symbols-outlined text-[24px]">search</span>
            </button>
            <button onClick={handleWA} className="hidden lg:flex bg-primary text-on-primary px-6 py-3 rounded-full font-label-sm text-label-sm hover:scale-[1.02] transition-transform items-center gap-2 shadow-md">
              <span className="material-symbols-outlined text-[20px]">chat</span> WhatsApp
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`lg:hidden p-2 rounded-full transition-colors flex items-center justify-center ${isScrolled || isMobileMenuOpen ? 'text-on-surface-variant' : 'text-white hover:bg-white/10'}`} aria-label="Menu">
              <span className="material-symbols-outlined text-[28px]">{isMobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[88px] z-[98] bg-white lg:hidden flex flex-col p-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-6 font-bold text-lg text-on-surface">
            <a href="#" onClick={() => setIsMobileMenuOpen(false)}>Beranda</a>
            <button className="text-left hover:text-primary transition-colors" onClick={() => { handleNavClick('services'); setIsMobileMenuOpen(false); }}>Layanan</button>
            <button className="text-left hover:text-primary transition-colors" onClick={() => { handleNavClick('route'); setIsMobileMenuOpen(false); }}>Rute & Jadwal</button>
            <button className="text-left hover:text-primary transition-colors" onClick={() => { handleNavClick('booking'); setIsMobileMenuOpen(false); }}>Booking</button>
            <button className="text-left hover:text-primary transition-colors" onClick={() => { handleNavClick('faq'); setIsMobileMenuOpen(false); }}>FAQ</button>
          </div>
          <div className="mt-8 flex justify-center">
            <button onClick={handleWA} className="w-full justify-center bg-primary text-on-primary px-6 py-4 rounded-full font-bold text-base hover:scale-[1.02] transition-transform flex items-center gap-2 shadow-md">
              <span className="material-symbols-outlined text-[24px]">chat</span> Pesan Sekarang (WhatsApp)
            </button>
          </div>
        </div>
      )}

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} cars={cars} articles={articles} />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/assets/Cover Reytrans.png')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-0"></div>
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
            <div className="relative p-8 rounded-3xl border border-outline-variant/30 hover:shadow-xl transition-all overflow-hidden group">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: "url('/assets/Garansi/info-1.png')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white from-30% via-white/90 to-transparent z-0"></div>
              <div className="relative z-10 text-black max-w-[85%]">
                <span className="material-symbols-outlined text-primary text-4xl mb-6 block drop-shadow-sm">payments</span>
                <h4 className="font-bold text-xl mb-2">Harga Transparan</h4>
                <p className="text-black/80 text-sm">Tidak ada biaya tambahan tersembunyi yang ditagihkan kemudian hari.</p>
              </div>
            </div>
            <div className="relative p-8 rounded-3xl border border-outline-variant/30 hover:shadow-xl transition-all overflow-hidden group">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: "url('/assets/Garansi/info-2.png')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white from-30% via-white/90 to-transparent z-0"></div>
              <div className="relative z-10 text-black max-w-[85%]">
                <span className="material-symbols-outlined text-primary text-4xl mb-6 block drop-shadow-sm">event_busy</span>
                <h4 className="font-bold text-xl mb-2">Cancel Gratis H-3</h4>
                <p className="text-black/80 text-sm">Pembatalan gratis maksimal H-3 dari jadwal keberangkatan Anda.</p>
              </div>
            </div>
            <div className="relative p-8 rounded-3xl border border-outline-variant/30 hover:shadow-xl transition-all overflow-hidden group">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: "url('/assets/Garansi/info-3.png')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white from-30% via-white/90 to-transparent z-0"></div>
              <div className="relative z-10 text-black max-w-[85%]">
                <span className="material-symbols-outlined text-primary text-4xl mb-6 block drop-shadow-sm">badge</span>
                <h4 className="font-bold text-xl mb-2">Sopir Berlisensi</h4>
                <p className="text-black/80 text-sm">Sopir berpengalaman dan memiliki lisensi mengemudi resmi yang valid.</p>
              </div>
            </div>
            <div className="relative p-8 rounded-3xl border border-outline-variant/30 hover:shadow-xl transition-all overflow-hidden group">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: "url('/assets/Garansi/info-4.png')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white from-30% via-white/90 to-transparent z-0"></div>
              <div className="relative z-10 text-black max-w-[85%]">
                <span className="material-symbols-outlined text-primary text-4xl mb-6 block drop-shadow-sm">chat_bubble</span>
                <h4 className="font-bold text-xl mb-2">Respon CS 5 Menit</h4>
                <p className="text-black/80 text-sm">Fast respon via WhatsApp maksimal 5 menit selama operasional.</p>
              </div>
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
      <section ref={statsRef} className="relative w-full mt-24 mb-16 lg:mt-16 lg:mb-24 flex items-end lg:items-stretch overflow-hidden lg:overflow-visible">
        {/* Blue Banner Strip: starts lower down so the image can bulge over the top. Matches bottom exactly. */}
        <div className={`absolute inset-x-0 bottom-0 top-20 lg:top-32 bg-primary z-0 transition-transform duration-1000 ease-out ${statsVisible ? 'translate-x-0' : '-translate-x-full'}`}></div>

        {/* Full-bleed Absolute Image for Desktop */}
        <div className={`absolute inset-y-0 left-0 z-10 hidden lg:flex flex-col justify-end pointer-events-none transition-all duration-1000 delay-300 ease-out ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <img src="/assets/Trust.png" alt="Trust Reytrans" className="h-[105%] xl:h-[112%] w-auto object-contain object-left-bottom transform -translate-x-[15%] lg:-translate-x-[20%] pointer-events-none" />
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-container-max mx-auto px-margin-desktop flex flex-col lg:flex-row w-full h-full lg:justify-end">

          <div className="w-full lg:hidden flex justify-start pointer-events-none mt-12 -mb-2 z-10">
            {/* Mobile / Tablet fallback image */}
            <img src="/assets/Trust.png" alt="Trust" className={`w-[125%] max-w-none transform -translate-x-[15%] transition-all duration-1000 delay-300 ease-out ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} />
          </div>

          {/* Stats container: shifted to right half */}
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-x-6 sm:gap-x-12 gap-y-10 lg:gap-y-16 py-12 lg:pt-48 lg:pb-24 lg:pl-12 xl:pl-24 text-left z-20">
            <div className={`space-y-1 sm:space-y-2 text-left transition-all duration-700 delay-500 ease-out ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl text-white font-black tracking-tight drop-shadow-sm">10.000+</div>
              <div className="text-white font-bold uppercase tracking-widest text-[10px] sm:text-xs">Pelanggan Puas</div>
            </div>
            <div className={`space-y-1 sm:space-y-2 text-left transition-all duration-700 delay-600 ease-out ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl text-white font-black tracking-tight drop-shadow-sm">4.9/5</div>
              <div className="text-white font-bold uppercase tracking-widest text-[10px] sm:text-xs">Google Rating</div>
            </div>
            <div className={`space-y-1 sm:space-y-2 text-left transition-all duration-700 delay-700 ease-out ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl text-white font-black tracking-tight drop-shadow-sm">5 Tahun</div>
              <div className="text-white font-bold uppercase tracking-widest text-[10px] sm:text-xs">Pengalaman</div>
            </div>
            <div className={`space-y-1 sm:space-y-2 text-left transition-all duration-700 delay-800 ease-out ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl text-white font-black tracking-tight drop-shadow-sm">100%</div>
              <div className="text-white font-bold uppercase tracking-widest text-[10px] sm:text-xs">On Time Arrival</div>
            </div>
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
          {/* Car list: scroll on mobile, grid on desktop */}
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide lg:grid lg:grid-cols-3 lg:overflow-visible lg:snap-none lg:pb-0">
            {cars.map((car, idx) => {
              const isTerpopuler = car.name.toLowerCase().includes('hiace');
              const transmission = car.name.toLowerCase().includes('hiace') || car.name.toLowerCase().includes('elf') ? 'Manual' : 'Automatic';
              const fuel = car.name.toLowerCase().includes('hiace') || car.name.toLowerCase().includes('elf') || car.name.toLowerCase().includes('innova') ? 'Diesel' : 'Bensin';

              return (
                <div
                  key={car.id || idx}
                  className={`bg-white rounded-[16px] flex flex-col shadow-sm border overflow-hidden relative w-[85vw] max-w-[280px] sm:max-w-[320px] sm:w-[320px] shrink-0 snap-center lg:w-auto lg:max-w-none lg:shrink lg:snap-align-none ${isTerpopuler ? 'border-primary shadow-[0_4px_20px_rgba(37,99,235,0.08)]' : 'border-outline-variant/30'
                    }`}
                >
                  {isTerpopuler && (
                    <span className="absolute top-0 left-0 right-0 bg-primary text-white text-[10px] font-extrabold uppercase tracking-widest text-center py-1 z-20 flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-[12px] fill-[1]">star</span> Terpopuler
                    </span>
                  )}
                  {/* Image container */}
                  <div className={`relative bg-surface-container-lowest h-48 flex items-center justify-center p-4 ${isTerpopuler ? 'pt-8' : ''}`}>
                    <img
                      alt={car.name}
                      className="w-full h-[90%] object-contain"
                      src={car.image_url || '/assets/avanza.jpg'}
                    />
                    {/* Rating Badge Overlay */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white rounded-lg border border-outline-variant/30 shadow-[0_2px_8px_rgba(0,0,0,0.05)] px-3 py-1 flex items-center gap-1 text-[11px] font-bold text-on-surface whitespace-nowrap">
                      <span className="text-green-500 material-symbols-outlined text-[14px] fill-[1]">star</span> 4.96 <span className="font-normal text-on-surface-variant">(672 reviews)</span>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-6 pt-8 space-y-4 flex-grow flex flex-col">
                    {/* Title & Location */}
                    <div className="mb-1">
                      <h3 className="font-bold text-lg text-on-surface tracking-tight leading-snug">{car.name}</h3>
                      <div className="flex items-center gap-1 text-on-surface-variant text-xs mt-1">
                        <span className="material-symbols-outlined text-[14px]">location_on</span> Cirebon, Indonesia
                      </div>
                    </div>

                    <div className="h-px w-full bg-outline-variant/20 my-4"></div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs font-medium text-on-surface-variant">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">commute</span>
                        <span className="truncate">{car.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">settings</span>
                        <span className="truncate">{transmission}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">local_gas_station</span>
                        <span className="truncate">{fuel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">person</span>
                        <span className="truncate">{car.capacity} Seats</span>
                      </div>
                    </div>

                    <div className="flex-grow"></div>

                    {/* Footer / Price & CTA */}
                    <div className="pt-4 flex items-end justify-between border-t border-outline-variant/20 mt-4 h-[60px]">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-outline line-through font-normal">Rp {Math.round(car.price_per_day * 1.25).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="text-on-surface text-sm flex items-baseline gap-1">
                          <span className="text-on-surface-variant text-xs">Mulai</span>
                          <span className="font-extrabold text-lg text-primary">Rp {car.price_per_day.toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setForm({ ...form, carId: car.id });
                          handleNavClick('booking');
                        }}
                        className="bg-surface-container-low text-on-surface font-semibold text-xs px-5 py-2.5 rounded-lg border border-outline-variant/30 hover:bg-surface-container transition-colors whitespace-nowrap"
                      >
                        Pesan Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Routes & Map */}
      <section id="route" className="py-section-gap overflow-hidden bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <div className="text-center md:text-left mb-8 md:mb-12">
            <span className="text-primary font-bold tracking-widest text-caption uppercase">RUTE & JADWAL</span>
            <h2 className="font-h2 text-h2 mt-4 leading-tight">Daftar Tarif & Jadwal Reguler</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Tarif Table */}
            <div className="bg-white rounded-3xl border border-outline-variant/30 overflow-hidden shadow-sm flex flex-col h-full">
              <div className="p-4 md:p-6 bg-surface-container border-b border-outline-variant/30 grid grid-cols-3 font-bold text-[10px] md:text-caption uppercase tracking-wider">
                <span className="col-span-2">Rute Keberangkatan & Tujuan</span>
                <span className="text-right">Tarif / Orang</span>
              </div>
              <div className="divide-y divide-outline-variant/20 text-sm md:text-base flex-grow">
                {[
                  { rute: 'Jakarta ↔ Cirebon', tarif: 'Rp 250.000' },
                  { rute: 'Jakarta ↔ Indramayu', tarif: 'Rp 250.000' },
                  { rute: 'Bogor ↔ Cirebon / Indramayu', tarif: 'Rp 250.000' },
                  { rute: 'Tangerang ↔ Cirebon / Indramayu', tarif: 'Rp 250.000' },
                  { rute: 'Bandara Soekarno-Hatta (Sutta) ↔ Cirebon / Indramayu', tarif: 'Rp 250.000' },
                  { rute: 'Depok / Bekasi ↔ Cirebon / Indramayu', tarif: 'Rp 250.000' },
                ].map((item, i) => (
                  <div key={i} className="p-4 md:p-5 grid grid-cols-3 items-center hover:bg-surface transition-colors">
                    <span className="font-bold col-span-2 pr-4 text-on-surface">{item.rute}</span>
                    <span className="text-right text-primary font-bold">{item.tarif}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 md:p-5 bg-surface text-caption text-outline-variant italic border-t border-outline-variant/20">
                * Catatan: Harga di atas sewaktu-waktu dapat berubah sesuai hari raya/high season tanpa pemberitahuan terlebih dahulu.
              </div>
            </div>

            {/* Jadwal Table */}
            <div className="bg-white rounded-3xl border border-outline-variant/30 overflow-hidden shadow-sm flex flex-col h-full">
              <div className="p-4 md:p-6 bg-surface-container border-b border-outline-variant/30 grid grid-cols-3 gap-2 font-bold text-[9px] md:text-caption uppercase tracking-wider">
                <span>Keberangkatan Dari</span>
                <span className="text-center">Jadwal Pagi/Siang</span>
                <span className="text-right">Jadwal Malam</span>
              </div>
              <div className="divide-y divide-outline-variant/20 text-xs md:text-sm flex-grow">
                {[
                  { dari: 'Jakarta / Jabodetabek', pagi: '08:00 WIB', malam: '20:00 WIB' },
                  { dari: 'Cirebon / Kuningan', pagi: '08:00 & 12:30 WIB', malam: '20:00 WIB' },
                  { dari: 'Indramayu', pagi: '12:00 WIB (Siang)', malam: '23:00 WIB' },
                ].map((item, i) => (
                  <div key={i} className="p-4 md:p-6 grid grid-cols-3 gap-2 items-center hover:bg-surface transition-colors py-8">
                    <span className="font-bold pr-2 text-on-surface">{item.dari}</span>
                    <span className="text-center text-primary font-bold">{item.pagi}</span>
                    <span className="text-right text-primary font-bold">{item.malam}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 md:p-6 bg-surface text-caption text-outline-variant italic border-t border-outline-variant/20">
                * Penjemputan door-to-door langsung ke rumah Anda dimulai 1-2 jam sebelum jam keberangkatan di atas.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alur Perjalanan & Lokasi */}
      <section className="py-section-gap bg-white border-t border-outline-variant/20">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Left: Alur Perjalanan */}
            <div className="bg-primary rounded-3xl p-6 md:p-8 shadow-sm h-full">
              <h3 className="text-2xl md:text-3xl font-h3 font-extrabold text-white mb-6 md:mb-8">Alur Perjalanan Door-to-Door</h3>

              <div className="space-y-4">
                {[
                  { step: 1, title: 'Pesan via WhatsApp', desc: 'Hubungi CS kami, tentukan tanggal & jumlah penumpang. Konfirmasi dalam 5 menit.' },
                  { step: 2, title: 'Penjemputan Rumah', desc: 'Sopir kami datang langsung ke depan rumah Anda sesuai jadwal yang disepakati.' },
                  { step: 3, title: 'Penjemputan Bergantian', desc: 'Penumpang lain dijemput secara bergantian sesuai urutan rute yang efisien.' },
                  { step: 4, title: 'Perjalanan Nyaman', desc: 'Nikmati perjalanan dengan armada AC (+ Karaoke untuk Hiace & Elf Long).' },
                  { step: 5, title: 'Sampai Tujuan', desc: 'Tiba di tujuan dengan selamat. Biaya sudah all-in: sopir, BBM, & tol.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 md:gap-5 group bg-white p-4 md:p-5 rounded-2xl shadow-sm transition-transform hover:-translate-y-1">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg md:text-xl shrink-0 transform transition-transform group-hover:scale-110">
                      {item.step}
                    </div>
                    <div className="pt-0.5">
                      <h4 className="font-bold text-base md:text-lg text-on-surface mb-1">{item.title}</h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed max-w-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Lokasi Kantor */}
            <div>
              <h3 className="text-2xl md:text-3xl font-h3 font-extrabold text-on-surface mb-6 md:mb-8 pt-2">Lokasi Kantor Kami</h3>

              <div className="bg-white rounded-[24px] p-2 md:p-3 pb-0 border border-outline-variant/30 mb-6 overflow-hidden">
                <div className="w-full h-[250px] md:h-[300px] rounded-[16px] overflow-hidden bg-surface-container relative">
                  {/* Google Maps embed or placeholder image matching the styling */}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1983.1360098520336!2d108.4357!3d-6.7027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f1f0a!2sCikeduk%2C%20Depok%2C%20Cirebon!5e0!3m2!1sen!2sid!4v1689230101010!5m2!1sen!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi Kantor Reytrans"
                    className="absolute inset-0 grayscale-[20%] contrast-[1.1]"
                  ></iframe>
                </div>
              </div>

              <div className="bg-primary rounded-[20px] p-5 md:p-6 border border-primary flex gap-4 items-start transition-shadow">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white">location_on</span>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2 text-sm md:text-base">Kantor Reytrans — Kab. Cirebon</h4>
                  <p className="text-sm text-white/90 leading-relaxed">
                    Jl. Nursefi Rt007 Rw002 Blok. Warung Lepet Ds. Cikeduk Kec. Depok Kab. Cirebon.<br className="hidden md:block" />
                    Sopir kami konfirmasi H-1 keberangkatan via WhatsApp.
                  </p>
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
        <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {[
            { step: 1, icon: 'directions_bus', title: 'Pilih Armada', desc: 'Tentukan armada dan tipe layanan yang Anda inginkan sesuai kebutuhan.' },
            { step: 2, icon: 'assignment', title: 'Isi Booking', desc: 'Lengkapi data penjemputan, tujuan, dan jam keberangkatan dengan valid.' },
            { step: 3, icon: 'check_circle', title: 'Konfirmasi', desc: 'Selesaikan konfirmasi dengan CS via WhatsApp secara instan (5 Menit).' }
          ].map(s => (
            <div key={s.step} className="flex flex-row items-start gap-4 lg:gap-6 group hover:-translate-y-1 transition-transform duration-300">
              <div className="text-6xl lg:text-[80px] font-extrabold italic text-primary/20 group-hover:text-primary transition-colors duration-300 select-none leading-none -mt-1 lg:-mt-3">
                0{s.step}
              </div>
              <div className="pt-1 lg:pt-0">
                <h4 className="font-h3 text-xl mb-2 text-on-surface">{s.title}</h4>
                <p className="text-on-surface-variant leading-relaxed text-sm">{s.desc}</p>
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
                  <span key={i} className="material-symbols-outlined text-yellow-400" style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
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
                  <span key={i} className="material-symbols-outlined text-yellow-400" style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
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
                  <span key={i} className="material-symbols-outlined text-yellow-400" style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
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
                    <label className="text-label-sm font-bold block ml-1">Nama Lengkap <span className="text-red-500">*</span></label>
                    <input className="w-full px-6 py-4 rounded-[14px] border border-outline-variant/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" placeholder="Contoh: Budi Santoso" required type="text" value={form.name} onChange={setF('name')} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-label-sm font-bold block ml-1">Nomor WhatsApp <span className="text-red-500">*</span></label>
                    <input className="w-full px-6 py-4 rounded-[14px] border border-outline-variant/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" placeholder="08xxxxxxxxxx" required type="tel" value={form.phone} onChange={setF('phone')} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-label-sm font-bold block ml-1">Titik Penjemputan <span className="text-red-500">*</span></label>
                    <input className="w-full px-6 py-4 rounded-[14px] border border-outline-variant/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" placeholder="Stasiun Cirebon / Hotel XYZ" required type="text" value={form.pickup} onChange={setF('pickup')} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-label-sm font-bold block ml-1">Tujuan <span className="text-red-500">*</span></label>
                    <input className="w-full px-6 py-4 rounded-[14px] border border-outline-variant/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" placeholder="Bandara Soetta / Jakarta" required type="text" value={form.destination} onChange={setF('destination')} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-label-sm font-bold block ml-1">Tanggal Perjalanan <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input className="w-full px-6 py-4 rounded-[14px] border border-outline-variant/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" required type="date" value={form.date} onChange={setF('date')} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-label-sm font-bold block ml-1">Jumlah Penumpang</label>
                    <input className="w-full px-6 py-4 rounded-[14px] border border-outline-variant/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" min="1" placeholder="4" type="number" value={form.passengers} onChange={setF('passengers')} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-label-sm font-bold block ml-1">Tipe Layanan <span className="text-red-500">*</span></label>
                    <CustomSelect
                      value={form.serviceType}
                      onChange={(val) => setForm((prev) => ({ ...prev, serviceType: val }))}
                      options={[
                        { value: 'Travel Reguler', label: 'Travel Reguler (Per Kursi)' },
                        { value: 'Charter Privat', label: 'Charter Privat' }
                      ]}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-label-sm font-bold block ml-1">Pilih Paket Armada (Opsional)</label>
                    <CustomSelect
                      value={form.packageId}
                      onChange={(val) => setForm((prev) => ({ ...prev, packageId: val }))}
                      placeholder="-- Pilih Armada --"
                      options={[
                        { value: "", label: "-- Pilih Armada (Scroll jika perlu) --" },
                        ...packages.map(p => ({ value: p.id, label: p.title })),
                        ...cars.map(c => ({ value: c.id, label: c.name }))
                      ]}
                    />
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
                    className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all border ${isActive
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
                  className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-primary ring-3 ring-primary/5 shadow-md' : 'border-outline-variant/30 hover:border-primary/50'
                    }`}
                >
                  <button
                    className="w-full flex items-center justify-between p-6 text-left font-bold text-[17px] text-on-surface hover:text-primary transition-colors gap-4 cursor-pointer"
                    onClick={() => setFaqActive(isOpen ? null : i)}
                  >
                    <span>{faq.question}</span>
                    <span className={`material-symbols-outlined text-outline transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''
                      }`}>
                      expand_more
                    </span>
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[300px] border-t border-outline-variant/10' : 'max-h-0'
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
            <img alt="Collage of travel vans" className="w-full object-contain rounded-3xl transform lg:scale-125 z-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLLUU1P20buihB8mE_DhoxvgA6f-iUMRq5ZdAh0M7TbZJLoiN_A4L_HKf5C-FrB1dCTiGsy9YCJZkOzfX9r0EGM6ynGJpQIaEF1R9Nylr0S5XzLabq_7XAD1ra9F9tyUNh5-8hnwEgWcoOWXydr6xps535_4GtQge4BjAPx1DY0patwYcv-D1wR8xVfUBBNClP1RiA28drqTu3HlMwGxRldJAYpBvOMwnGYpREM-W3HRxE-Urch3TU" />
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
          <div className="flex items-center gap-4 pt-4">
            <a href="#" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-primary hover:text-white transition-colors" aria-label="Instagram">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-primary hover:text-white transition-colors" aria-label="TikTok">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-primary hover:text-white transition-colors" aria-label="Facebook">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
            </a>
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6285702710400'}`} target="_blank" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-[#25D366] hover:text-white transition-colors" aria-label="WhatsApp">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-on-surface mb-6">Menu</h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Beranda</a></li>
            <li><button onClick={() => onNavClick('services')} className="text-on-surface-variant hover:text-primary transition-colors">Layanan</button></li>
            <li><button onClick={() => onNavClick('route')} className="text-on-surface-variant hover:text-primary transition-colors">Rute & Jadwal</button></li>
            <li><button onClick={() => onNavClick('booking')} className="text-on-surface-variant hover:text-primary transition-colors">Booking</button></li>
            <li><button onClick={() => onNavClick('faq')} className="text-on-surface-variant hover:text-primary transition-colors">FAQ</button></li>
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
