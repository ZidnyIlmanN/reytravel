'use client';
import { useEffect, useState, useRef } from 'react';
import styles from './Hero.module.css';

interface HeroProps {
  onCtaClick: (id: string) => void;
}

const BG_IMAGES = [
  '/assets/calya.webp',
  '/assets/avanza.jpg',
  '/assets/innova.jpg',
  '/assets/hiace.png',
  '/assets/elf.png',
];

const CYCLING_TEXTS = ['Jabodetabek', 'Cirebon', 'Brebes', 'Subang', 'Majalengka', 'Kuningan', 'Indramayu'];

export default function Hero({ onCtaClick }: HeroProps) {
  const [bgIndex, setBgIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [promoExpiry, setPromoExpiry] = useState('Berakhir malam ini');

  // Format dynamic expiry date on mount
  useEffect(() => {
    try {
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
      const todayStr = new Intl.DateTimeFormat('id-ID', options).format(new Date());
      setPromoExpiry('Diskon 20% · Hari Ini Saja!');
    } catch (e) {
      // fallback
    }
  }, []);

  // Background cross-fade interval (6 seconds)
  useEffect(() => {
    const bgInterval = setInterval(() => {
      setBgIndex(prev => (prev + 1) % BG_IMAGES.length);
    }, 6000);
    return () => clearInterval(bgInterval);
  }, []);

  // Text cycling interval (3 seconds)
  useEffect(() => {
    const textInterval = setInterval(() => {
      setTextIndex(prev => (prev + 1) % CYCLING_TEXTS.length);
    }, 3000);
    return () => clearInterval(textInterval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 20; // max 20px
    const y = (clientY / window.innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  return (
    <section id="hero" className={styles.hero} onMouseMove={handleMouseMove}>
      {/* Background Slideshow wrapper — overflow:hidden lives here, not on .hero */}
      <div className={styles.bgWrapper}>
        {BG_IMAGES.map((img, idx) => (
          <div
            key={img}
            className={`${styles.bg} ${idx === bgIndex ? styles.bgActive : ''}`}
            style={{ 
              backgroundImage: `url(${img})`,
              transform: idx === bgIndex ? `translate(${mousePos.x}px, ${mousePos.y}px) scale(1.05)` : 'scale(1.1)'
            }}
          />
        ))}

        {/* Dark gradient overlay */}
        <div className={styles.overlay} />
      </div>

      <div className={`container ${styles.content}`}>

        {/* FOMO Promo Badge */}
        <div className={`${styles.promoBadge} anim-fade-in-up`}>
          <span className={styles.promoDot} />
          <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Promo Khusus Hari Ini — {promoExpiry}
        </div>

        {/* Headline with dynamic cycling text */}
        <h1 className={`${styles.title} anim-fade-in-up`}>
          Perjalanan Aman, Nyaman &amp; Berkesan ke{' '}
          <span className={styles.textSwitcher}>
            <span key={textIndex} className={styles.slideWord}>
              {CYCLING_TEXTS[textIndex]}
            </span>
          </span>
        </h1>

        {/* Subheadline */}
        <p className={`${styles.subtitle} anim-fade-in-up anim-delay-2`}>
          Layanan travel reguler &amp; charter privat Jabodetabek - Ciayumajakuning PP &amp; Brebes.
          Penjemputan gratis langsung di depan rumah Anda (door-to-door).
        </p>

        {/* CTAs */}
        <div className={`${styles.ctaRow} anim-fade-in-up anim-delay-3`}>
          <button
            className={`btn btn-primary btn-lg ${styles.btnMain}`}
            onClick={() => onCtaClick('booking')}
          >
            Pesan Sekarang →
          </button>
          <button
            className={`btn btn-outline btn-lg`}
            onClick={() => onCtaClick('packages')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
              <line x1="9" y1="3" x2="9" y2="18"/>
              <line x1="15" y1="6" x2="15" y2="21"/>
            </svg>
            Lihat Pilihan Layanan
          </button>
        </div>

        <div className={`${styles.liveAvailability} anim-fade-in-up anim-delay-3`}>
          <span className={styles.greenPulse} />
          Semua unit armada siap jalan hari ini &amp; besok (Konfirmasi Instan)
        </div>

        {/* Google Rating Badge */}
        <div className={`${styles.ratingBadge} anim-fade-in-up anim-delay-3`}>
          <div className={styles.avatarGroup}>
            <img src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=80&h=80&q=80" alt="User 1" className={styles.miniAvatar} />
            <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=80&h=80&q=80" alt="User 2" className={styles.miniAvatar} />
            <img src="https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=80&h=80&q=80" alt="User 3" className={styles.miniAvatar} />
            <img src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=80&h=80&q=80" alt="User 4" className={styles.miniAvatar} />
          </div>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map(i => (
              <svg key={i} viewBox="0 0 24 24" fill="#fbbf24" width="13" height="13">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
          </div>
          <span className={styles.ratingText}>
            <strong>4.9/5</strong> (500+ ulasan Google) · <strong>99%</strong> rekomendasi pelanggan
          </span>
        </div>

        {/* Trust chips */}
        <div className={`${styles.trustRow} anim-fade-in-up anim-delay-4`}>
          {['Include Sopir, BBM & Toll', 'Jemput Sampai Rumah', 'Tersedia AC & Karaoke', 'Respon CS 5 Menit'].map(t => (
            <span key={t} className={styles.trustChip} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" width="12" height="12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', flexShrink: 0 }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {t}
            </span>
          ))}
        </div>
      </div>

    </section>
  );
}
