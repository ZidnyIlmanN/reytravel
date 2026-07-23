'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Header.module.css';
import SearchModal from './SearchModal';

interface HeaderProps {
  onNavClick?: (id: string) => void;
}

const NAV_ITEMS = [
  { label: 'Beranda',      id: 'hero' },
  { label: 'Layanan',      id: 'packages' },
  { label: 'Pilihan Mobil',id: 'cars' },
  { label: 'Rute & Info',  id: 'routes' },
  { label: 'FAQ',          id: 'faq' },
];

export default function Header({ onNavClick = () => {} }: HeaderProps) {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState('hero');
  const [searchOpen, setSearchOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => {
      if (pathname === '/') {
        setScrolled(window.scrollY > 20); // More sensitive: 20px scroll threshold
      } else {
        setScrolled(true); // Always solid on subpages
      }

      // Highlight active nav based on scroll position on homepage
      if (pathname === '/') {
        const ids = NAV_ITEMS.map(n => n.id);
        for (let i = ids.length - 1; i >= 0; i--) {
          const el = document.getElementById(ids[i]);
          if (el && window.scrollY >= el.offsetTop - 120) {
            setActiveId(ids[i]);
            break;
          }
        }
      }
    };

    // Initial state setup
    if (pathname === '/') {
      setScrolled(window.scrollY > 20);
    } else {
      setScrolled(true);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  // Close drawer on outside click
  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        open &&
        drawerRef.current &&
        !drawerRef.current.contains(target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [open]);

  const handleNav = (id: string) => {
    setOpen(false);
    if (pathname === '/') {
      onNavClick(id);
    } else {
      router.push(`/#${id}`);
    }
  };

  const handleWA = () => {
    const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';
    window.open(`https://wa.me/${num}?text=Halo%20Reytrans,%20saya%20mau%20tanya%20paket%20wisata`, '_blank');
  };

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <nav className={`container ${styles.nav}`}>
          {/* Logo */}
          <button className={styles.logo} onClick={() => handleNav('hero')} aria-label="Kembali ke atas">
            <img src="/assets/logo.png" alt="Reytrans" className={styles.logoImg} />
            <span className={styles.logoText}>
              Rey<span className={styles.logoAccent}>trans</span>
            </span>
          </button>

          {/* Desktop links */}
          <ul className={styles.links} role="list">
            {NAV_ITEMS.map(item => (
              <li key={item.id}>
                <button
                  className={`${styles.link} ${activeId === item.id ? styles.linkActive : ''}`}
                  onClick={() => handleNav(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
            <li>
              <Link href="/artikel" className={styles.link}>
                Artikel
              </Link>
            </li>
          </ul>

          {/* Desktop CTA */}
          <div className={styles.ctaGroup} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              className={styles.searchBtn}
              onClick={() => setSearchOpen(true)}
              aria-label="Cari..."
            >
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
            <button 
              className={`btn btn-primary ${styles.cta}`} 
              onClick={handleWA} 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                backgroundColor: '#25D366', 
                borderColor: '#25D366', 
                color: '#fff' 
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397 0 11.948 0c3.179.001 6.167 1.24 8.416 3.49s3.486 5.241 3.487 8.417c-.004 6.557-5.342 11.906-11.895 11.906-2.003-.001-3.972-.511-5.727-1.488L0 24zm6.59-4.846c1.6.95 3.167 1.455 4.792 1.455 5.532 0 10.033-4.502 10.035-10.037.002-2.68-1.041-5.2-2.935-7.094S14.076 3.01 11.398 3.01C5.867 3.01 1.365 7.51 1.362 13.048c-.001 1.8.48 3.55 1.39 5.08L1.756 22l4.89-1.286zM17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
              </svg>
              Hubungi WA
            </button>
          </div>

          {/* Mobile Search Button */}
          <button
            className={styles.mobileSearchBtn}
            onClick={() => setSearchOpen(true)}
            aria-label="Cari..."
          >
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>

          {/* Hamburger */}
          <button
            ref={hamburgerRef}
            className={`${styles.hamburger} ${open ? styles.hamburgerOpen : ''}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </button>
        </nav>


      {/* Mobile drawer */}
      <div
        ref={drawerRef}
        className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}
        aria-hidden={!open}
      >
        <div className={styles.drawerInner}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`${styles.drawerLink} ${activeId === item.id ? styles.drawerLinkActive : ''}`}
              onClick={() => handleNav(item.id)}
            >
              {item.label}
            </button>
          ))}
          <Link
            href="/artikel"
            className={`${styles.drawerLink} ${pathname.startsWith('/artikel') ? styles.drawerLinkActive : ''}`}
            onClick={() => setOpen(false)}
          >
            Artikel
          </Link>
          <div className={styles.drawerDivider} />
          <button 
            className={`btn btn-primary ${styles.drawerCta}`} 
            onClick={handleWA} 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              justifyContent: 'center',
              backgroundColor: '#25D366', 
              borderColor: '#25D366', 
              color: '#fff'
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397 0 11.948 0c3.179.001 6.167 1.24 8.416 3.49s3.486 5.241 3.487 8.417c-.004 6.557-5.342 11.906-11.895 11.906-2.003-.001-3.972-.511-5.727-1.488L0 24zm6.59-4.846c1.6.95 3.167 1.455 4.792 1.455 5.532 0 10.033-4.502 10.035-10.037.002-2.68-1.041-5.2-2.935-7.094S14.076 3.01 11.398 3.01C5.867 3.01 1.365 7.51 1.362 13.048c-.001 1.8.48 3.55 1.39 5.08L1.756 22l4.89-1.286zM17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
            </svg>
            Chat WhatsApp
          </button>
        </div>
      </div>
    </header>
    {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
  </>
);
}

