import Image from 'next/image';
import { AvailableCar } from '@/lib/supabase';
import styles from './CarsTable.module.css';
import { useScrollReveal, useScrollRevealChildren } from '@/hooks/useScrollReveal';

interface Props {
  cars: AvailableCar[];
  onBook: (id: string) => void;
}

const formatPrice = (price: number) => {
  if (price >= 1000000) {
    return `${(price / 1000000).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}jt`;
  }
  return `${(price / 1000).toLocaleString('id-ID')}k`;
};
const formatOriginal = (price: number) => {
  const original = Math.round(price * 1.25);
  if (original >= 1000000) {
    return `Rp ${(original / 1000000).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}jt`;
  }
  return `Rp ${original / 1000}k`;
};

const CAR_SCARCITY: Record<string, { icon: 'zap' | 'fire', text: string }> = {
  'calya':    { icon: 'zap',  text: 'Armada terbatas hari ini' },
  'avanza':   { icon: 'zap',  text: 'Tersedia — pesan sekarang' },
  'innova':   { icon: 'fire', text: 'Favorit keluarga — sering penuh' },
  'hiace':    { icon: 'fire', text: 'Terlaris — favorit rombongan' },
  'elf-long': { icon: 'fire', text: 'Kapasitas besar — tersedia terbatas' },
};

const SCARCITY_DEFAULT = { icon: 'zap' as const, text: 'Slot terbatas hari ini' };

// Simulated last booking times
const LAST_BOOKINGS: Record<string, string> = {
  'calya':    'baru saja',
  'avanza':   'baru saja',
  'innova':   '15 menit yang lalu',
  'hiace':    'baru saja',
  'elf-long': '30 menit yang lalu',
};

const ZapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="10" height="10" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const FireIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="10" height="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/>
  </svg>
);

export default function CarsTable({ cars, onBook }: Props) {
  const gridRef   = useScrollRevealChildren<HTMLDivElement>({ staggerMs: 90 });
  const headerRef = useScrollReveal<HTMLDivElement>();

  return (
    <section id="cars" className="section glow-section">
      <div className="container">
        <div className="section-header reveal-up" ref={headerRef}>
          <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 00.7 12.3C.3 12.5 0 13 0 13.5V16c0 .6.4 1 1 1h2"/>
              <circle cx="7" cy="17" r="3"/>
              <circle cx="15" cy="17" r="3"/>
            </svg>
            ARMADA KAMI
          </span>
          <h2 className="section-title">Pilihan Mobil &amp; Rental</h2>
          <div className="section-bar" />
          <p className="section-desc">
            Pilih armada sesuai kebutuhan rombongan Anda. Hiace &amp; Elf Long
            dilengkapi AC &amp; Karaoke. Semua termasuk sopir, BBM, &amp; tol.
          </p>
        </div>

        <div className={styles.grid} ref={gridRef}>
          {cars.map(car => {
            const isPopular = car.id === 'hiace';
            return (
              <article key={car.id} className={`${styles.card} ${isPopular ? styles.cardPopular : ''} reveal-up`}>
                {/* Popular ribbon */}
                {isPopular && (
                  <div className={styles.ribbon} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    Terpopuler
                  </div>
                )}
                {/* Status badge */}
                <span className={`badge ${car.is_available ? 'badge-success' : 'badge-error'} ${styles.statusBadge}`}>
                {car.is_available ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <svg viewBox="0 0 24 24" fill="none" width="10" height="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Tersedia
                  </span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <svg viewBox="0 0 24 24" fill="none" width="10" height="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Penuh
                  </span>
                )}
              </span>

              {/* Image */}
              <div className={styles.imgWrap}>
                <Image
                  src={car.image_url}
                  alt={car.name}
                  fill
                  className={styles.img}
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                />
                <div className={styles.imgOverlay} />
              </div>

              {/* Body */}
              <div className={styles.body}>
                <h3 className={styles.name}>{car.name}</h3>

                <div className={styles.specs}>
                  <span className={styles.spec}>
                    <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 00.7 12.3C.3 12.5 0 13 0 13.5V16c0 .6.4 1 1 1h2"/>
                      <circle cx="7" cy="17" r="3"/>
                      <circle cx="15" cy="17" r="3"/>
                    </svg>
                    {car.type}
                  </span>
                  <span className={styles.spec}>
                    <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    {car.capacity} Penumpang
                  </span>
                </div>

                 {/* Car scarcity badge & progress bar */}
                 {(() => {
                   const s = CAR_SCARCITY[car.id] ?? SCARCITY_DEFAULT;
                   // Hitung persentase dinamis unik per armada agar tidak 60% semua
                   const charSum = car.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                   const pct = 68 + (charSum % 21); // Range: 68% - 88%
                   return (
                     <div className={styles.progressContainer}>
                       <div className={styles.progressLabelRow}>
                         <span className={styles.progressLabelText}>
                           {s.icon === 'zap' ? <ZapIcon /> : <FireIcon />}
                           {s.text}
                         </span>
                         <span>{pct}% Terbooking</span>
                       </div>
                       <div className={styles.progressBar}>
                         <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                       </div>
                     </div>
                   );
                 })()}

                 {/* Last booking badge */}
                 <div className={styles.lastBookingBadge}>
                   <svg viewBox="0 0 24 24" fill="none" width="10" height="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                     <polyline points="22 4 12 14.01 9 11.01"/>
                   </svg>
                   Booking terakhir: {LAST_BOOKINGS[car.id] ?? 'baru saja'}
                 </div>

                 <div className={styles.priceRow}>
                   <div>
                     <div className={styles.priceOriginalRow}>
                       <span className={styles.priceOriginal}>{formatOriginal(car.price_per_day)}</span>
                       <span className={styles.discountBadge}>Hemat 20%</span>
                     </div>
                     <div className={styles.priceMain}>
                       <span className={styles.priceLabel}>Mulai dari</span>
                       <span className={styles.price}>
                         Rp {formatPrice(car.price_per_day)}
                         <span style={{ fontSize: '11px', color: 'var(--clr-muted)', fontWeight: 'normal', marginLeft: '3px' }}>/ orang</span>
                       </span>
                     </div>
                   </div>
                  <button
                    className={`btn btn-primary btn-sm ${styles.bookBtn}`}
                    onClick={() => onBook(car.id)}
                    disabled={!car.is_available}
                  >
                    Sewa →
                  </button>
                </div>
              </div>
            </article>
            );
          })}
        </div>

        {/* Info strip */}
        <div className={styles.infoStrip}>
          {[
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ),
              text: 'Sopir berpengalaman 5+ tahun'
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 22V2h10v20H3zM18 5h3a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-3M6 6h4v4H6V6z"/>
                </svg>
              ),
              text: 'BBM included, non lepas kunci'
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              ),
              text: 'Armada terawat & bersih'
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              ),
              text: 'Jemput di mana saja'
            },
          ].map(item => (
            <div key={item.text} className={styles.infoItem}>
              <span className={styles.infoIcon}>{item.icon}</span>
              <span className={styles.infoText}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
