'use client';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Footer.module.css';

interface FooterProps {
  onNavClick?: (id: string) => void;
}

const NAV_LINKS = [
  { label: 'Beranda',       id: 'hero' },
  { label: 'Paket Wisata',  id: 'packages' },
  { label: 'Pilihan Mobil', id: 'cars' },
  { label: 'Rute & Peta',   id: 'routes' },
  { label: 'FAQ',           id: 'faq' },
  { label: 'Booking',       id: 'booking' },
];

const SERVICES = [
  'Travel Reguler Jabodetabek',
  'Charter Privat Hiace',
  'Charter Privat Elf Long',
  'Antar Jemput Ciayumajakuning',
  'Layanan Rute Brebes & Subang',
  'Charter Avanza / Calya / Innova',
];

export default function Footer({ onNavClick = () => {} }: FooterProps) {
  const year = new Date().getFullYear();
  const waNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6285702710400';
  const pathname = usePathname();
  const router = useRouter();

  const handleNav = (id: string) => {
    if (pathname === '/') {
      onNavClick(id);
    } else {
      router.push(`/#${id}`);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={`container ${styles.grid}`}>
          {/* Brand */}
          <div className={styles.colBrand}>
          <div className={styles.logo}>
              <img src="/assets/logo.png" alt="Reytrans" className={styles.logoImg} />
              <span className={styles.logoText}>
                Rey<span className={styles.logoAccent}>trans</span>
              </span>
            </div>
            <p className={styles.brandDesc}>
              Penyedia jasa sewa armada travel reguler &amp; charter privat terpercaya dengan rute utama Ciayumajakuning - Jabodetabek PP. Berpengalaman melayani pelanggan selama 5+ tahun.
            </p>
            <div className={styles.socials}>
              {/* Instagram */}
              <a href="https://www.instagram.com/gomad963?utm_source=qr&igsh=ZHZ4aGx4YWlzYTEz" target="_blank" rel="noopener noreferrer" className={`${styles.socialBtn} ${styles.socialIg}`} aria-label="Instagram" title="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              {/* TikTok */}
              <a href="https://www.tiktok.com/@masgomad963" target="_blank" rel="noopener noreferrer" className={`${styles.socialBtn} ${styles.socialTt}`} aria-label="TikTok" title="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.79a8.18 8.18 0 004.78 1.52V6.85a4.85 4.85 0 01-1.01-.16z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href="https://www.facebook.com/share/18xkD4W5rx/" target="_blank" rel="noopener noreferrer" className={`${styles.socialBtn} ${styles.socialFb}`} aria-label="Facebook" title="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a href={`https://wa.me/${waNum}`} target="_blank" rel="noopener noreferrer" className={`${styles.socialBtn} ${styles.socialWa}`} aria-label="WhatsApp" title="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Nav links */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Navigasi</h3>
            <ul className={styles.linkList}>
              {NAV_LINKS.map(l => (
                <li key={l.id}>
                  <button onClick={() => handleNav(l.id)} className={styles.link}>
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Layanan Kami</h3>
            <ul className={styles.linkList}>
              {SERVICES.map(s => (
                <li key={s} className={styles.serviceItem}>
                  <svg className={styles.serviceDot} viewBox="0 0 24 24" fill="none" width="10" height="10" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Hubungi Kami</h3>
            <ul className={styles.contactList}>
              {[
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  ),
                  text: 'Jl. Nursefi Rt007 Rw002 Blok. Warung Lepet Ds. Cikeduk Kec. Depok Kab. Cirebon'
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  ),
                  text: '+62 857-0271-0400'
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  ),
                  text: 'masgomadahmad@gmail.com'
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  ),
                  text: 'Layanan 24 Jam / 7 Hari'
                },
              ].map((c, i) => (
                <li key={i} className={styles.contactItem}>
                  <span className={styles.contactIcon}>{c.icon}</span>
                  <span className={styles.contactText}>{c.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className={`container ${styles.bottomInner}`}>
          <p className={styles.copyright}>
            © {year} Reytrans. All Rights Reserved.
          </p>
          <p className={styles.seo}>
            Travel Cirebon Jakarta · Sewa Hiace Cirebon · Travel Jabodetabek Majalengka Kuningan · Charter Elf Long Cirebon
          </p>
        </div>
      </div>
    </footer>
  );
}
