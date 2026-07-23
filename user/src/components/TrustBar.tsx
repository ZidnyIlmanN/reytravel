import React from 'react';
import styles from './TrustBar.module.css';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface TrustItem {
  icon: React.ReactNode;
  label: string;
}

const TRUST_ITEMS: TrustItem[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"/>
        <path d="M12 2a5 5 0 0 0-5 5v3c0 2.2 1.8 4 4 4h2c2.2 0 4-1.8 4-4V7a5 5 0 0 0-5-5z"/>
      </svg>
    ),
    label: '5 Tahun Beroperasi'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 11 11 13 15 9"/>
      </svg>
    ),
    label: 'Terverifikasi Google'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    label: '10.000+ Pelanggan Puas'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    label: 'Rating 4.9/5 (1.200+ ulasan)'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 00.7 12.3C.3 12.5 0 13 0 13.5V16c0 .6.4 1 1 1h2"/>
        <circle cx="7" cy="17" r="3"/>
        <circle cx="15" cy="17" r="3"/>
      </svg>
    ),
    label: 'Armada < 3 Tahun'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
    label: 'Booking 24 Jam'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7.5" cy="15.5" r="5.5"/>
        <path d="M21 2l-6 6M17 6l3 3M19 4l3 3"/>
      </svg>
    ),
    label: 'Non Lepas Kunci'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: 'Jemput di Mana Saja'
  },
];

export default function TrustBar() {
  // Duplicate for seamless marquee loop
  const items = [...TRUST_ITEMS, ...TRUST_ITEMS];
  const ref = useScrollReveal<HTMLDivElement>({ visibleClass: 'is-visible', rootMargin: '0px' });

  return (
    <div ref={ref} className={`${styles.wrapper} reveal-fade`} aria-label="Keunggulan kami">
      <div className={styles.track}>
        {items.map((item, i) => (
          <div key={i} className={styles.item}>
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
