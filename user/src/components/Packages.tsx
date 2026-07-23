import Image from 'next/image';
import { TravelPackage } from '@/lib/supabase';
import styles from './Packages.module.css';
import { useScrollReveal, useScrollRevealChildren } from '@/hooks/useScrollReveal';

interface Props {
  packages: TravelPackage[];
  onBook: (id: string) => void;
}

const POPULAR_ID = 'charter-elf-long'; // ID layanan terpopuler

// Simulated remaining slots per package (would come from DB in production)
const SLOTS: Record<string, number> = {
  'charter-hiace': 3,
  'charter-elf-long': 2,
  'charter-privat': 5,
};

// Simulated current viewers (static to avoid hydration issues)
const VIEWERS: Record<string, number> = {
  'charter-hiace': 18,
  'charter-elf-long': 25,
  'charter-privat': 11,
};

// Simulated last booking times
const LAST_BOOKINGS: Record<string, string> = {
  'charter-hiace': '28 menit yang lalu',
  'charter-elf-long': '1 jam yang lalu',
  'charter-privat': '3 jam yang lalu',
};

const formatPrice = (price: number) => {
  if (price >= 1000000) {
    return `${(price / 1000000).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}jt`;
  }
  return `${(price / 1000).toLocaleString('id-ID')}k`;
};
const formatOriginal = (price: number) => {
  const original = Math.round(price * 1.25);
  if (original >= 1000000) {
    return `${(original / 1000000).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}jt`;
  }
  return `${original / 1000}k`;
};

export default function Packages({ packages, onBook }: Props) {
  const gridRef   = useScrollRevealChildren<HTMLDivElement>({ staggerMs: 90 });
  const headerRef = useScrollReveal<HTMLDivElement>();

  return (
    <section id="packages" className="section section-alt glow-section">
      <div className="container">
        <div className="section-header reveal-up" ref={headerRef}>
          <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11l1.5-4.5A2 2 0 016.4 5h11.2a2 2 0 011.9 1.5L21 11"/>
              <rect x="2" y="11" width="20" height="6" rx="2"/>
              <circle cx="7" cy="19" r="2"/>
              <circle cx="17" cy="19" r="2"/>
              <path d="M2 14h20"/>
            </svg>
            LAYANAN KAMI
          </span>
          <h2 className="section-title">Pilihan Layanan & Armada</h2>
          <div className="section-bar" />
          <p className="section-desc">
            Tersedia armada reguler maupun charter privat. Semua sudah termasuk
            sopir berpengalaman, BBM, dan tol — non lepas kunci.
          </p>
        </div>

        <div className={styles.grid} ref={gridRef}>
          {packages.map(pkg => {
            const isPopular = pkg.id === POPULAR_ID;
            const slots = SLOTS[pkg.id] ?? 4;
            const slotsLow = slots <= 3;
            return (
              <article
                key={pkg.id}
                className={`${styles.card} ${isPopular ? styles.cardPopular : ''} reveal-up`}
              >
                {/* Popular ribbon */}
                {isPopular && (
                  <div className={styles.ribbon} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    Terpopuler
                  </div>
                )}

                {/* Image */}
                <div className={styles.imgWrap}>
                  <Image
                    src={pkg.image_url}
                    alt={pkg.title}
                    fill
                    className={styles.img}
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  />
                  <div className={styles.imgOverlay} />
                  <span className={`badge badge-warning ${styles.durationBadge}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <svg viewBox="0 0 24 24" fill="none" width="12" height="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {pkg.duration}
                  </span>
                </div>

                {/* Body */}
                <div className={styles.body}>
                  <h3 className={styles.title}>{pkg.title}</h3>

                  <div className={styles.priceRow}>
                    {pkg.price === 0 ? (
                      <div className={styles.priceStack}>
                        <div className={styles.priceMain}>
                          <span className={styles.price} style={{ fontSize: 'var(--fs-lg)', color: 'var(--clr-primary)' }}>
                            Harga Sesuai Rute
                          </span>
                        </div>
                        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-muted)', marginTop: '2px', display: 'block' }}>
                          Hubungi admin untuk info harga terbaik
                        </span>
                      </div>
                    ) : (
                      <div className={styles.priceStack}>
                        <div className={styles.priceOriginalRow}>
                          <span className={styles.priceOriginal}>Rp {formatOriginal(pkg.price)}</span>
                          <span className={styles.discountBadge}>Hemat 20%</span>
                        </div>
                        <div className={styles.priceMain}>
                          <span className={styles.priceFrom}>Mulai dari</span>
                          <span className={styles.price}>
                            Rp {formatPrice(pkg.price)}
                          </span>
                          <span className={styles.pricePer}>/orang</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Slot scarcity badge & progress bar */}
                  {slotsLow ? (
                    <div className={styles.progressContainer}>
                      <div className={styles.progressLabelRow}>
                        <span className={styles.progressLabelText}>
                          <svg viewBox="0 0 24 24" fill="none" width="11" height="11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                          </svg>
                          Hampir Habis! Tersisa {slots} slot
                        </span>
                        <span>{((10 - slots) / 10) * 100}% Terisi</span>
                      </div>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${((10 - slots) / 10) * 100}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div className={styles.slotBadge}>
                      <svg viewBox="0 0 24 24" fill="none" width="10" height="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                      </svg>
                      {slots} slot tersedia
                    </div>
                  )}

                  {/* Current viewers badge */}
                  <div className={styles.viewersBadge}>
                    <svg viewBox="0 0 24 24" fill="none" width="10" height="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    {VIEWERS[pkg.id] ?? 7} orang melihat hari ini
                  </div>

                  {/* Last booking badge */}
                  <div className={styles.lastBookingBadge}>
                    <svg viewBox="0 0 24 24" fill="none" width="10" height="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Booking terakhir: {LAST_BOOKINGS[pkg.id] ?? 'baru saja'}
                  </div>

                  <p className={styles.desc}>{pkg.description}</p>

                  <ul className={styles.features}>
                    {pkg.features.map((f, i) => (
                      <li key={i} className={styles.feature}>
                        <span className={styles.check}>
                          <svg viewBox="0 0 24 24" fill="none" width="10" height="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {pkg.price === 0 ? (
                    <a
                      href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890'}?text=${encodeURIComponent(`Halo Reytrans, saya mau tanya harga untuk layanan *${pkg.title}*. Boleh info harga dan rutenya?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`btn btn-primary ${styles.bookBtn}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Tanya Harga ke Admin
                    </a>
                  ) : (
                    <button
                      className={`btn ${isPopular ? 'btn-primary' : 'btn-ghost'} ${styles.bookBtn}`}
                      onClick={() => onBook(pkg.id)}
                    >
                      {isPopular ? 'Pesan Sekarang →' : 'Lihat Detail & Pesan'}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className={styles.bottomCta}>
          <p className={styles.bottomCtaText}>
            Tidak menemukan paket yang cocok?
          </p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890'}?text=Halo%20Reytrans,%20saya%20mau%20custom%20paket%20wisata`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Custom Paket via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
