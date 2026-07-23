'use client';
import { useState, useEffect } from 'react';
import styles from './SocialProofToast.module.css';

const BOOKINGS = [
  { name: 'Rizky A.', city: 'Cirebon', pkg: 'Travel Cirebon – Jakarta', ago: '2 menit lalu' },
  { name: 'Dewi R.', city: 'Indramayu', pkg: 'Travel Indramayu – Bekasi', ago: '7 menit lalu' },
  { name: 'Budi S.', city: 'Kuningan', pkg: 'Sewa Innova Reborn', ago: '12 menit lalu' },
  { name: 'Siti N.', city: 'Majalengka', pkg: 'Travel Majalengka – Jakarta', ago: '18 menit lalu' },
  { name: 'Andi P.', city: 'Subang', pkg: 'Sewa HiAce Commuter', ago: '25 menit lalu' },
  { name: 'Maya L.', city: 'Brebes', pkg: 'Travel Brebes – Bekasi', ago: '31 menit lalu' },
];

export default function SocialProofToast() {
  const [visible, setVisible] = useState(false);
  const [idx, setIdx] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // First toast after 4s
    const first = setTimeout(() => showToast(), 4000);
    return () => clearTimeout(first);
  }, []);

  const showToast = () => {
    setLeaving(false);
    setVisible(true);
    // Auto-hide after 5s
    setTimeout(() => {
      setLeaving(true);
      setTimeout(() => {
        setVisible(false);
        setIdx(prev => (prev + 1) % BOOKINGS.length);
        // Next toast after 12s
        setTimeout(showToast, 12000);
      }, 400);
    }, 5000);
  };

  if (!visible) return null;
  const b = BOOKINGS[idx];

  return (
    <div className={`${styles.toast} ${leaving ? styles.leaving : ''}`} role="status" aria-live="polite">
      <div className={styles.avatar}>
        {b.name[0]}
      </div>
      <div className={styles.body}>
        <p className={styles.name}>
          <strong>{b.name}</strong>
          <span className={styles.city}> dari {b.city}</span>
        </p>
        <p className={styles.action}>
          <svg viewBox="0 0 24 24" fill="none" width="11" height="11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          baru booking <strong>{b.pkg}</strong>
        </p>
        <p className={styles.ago}>
          <svg viewBox="0 0 24 24" fill="none" width="10" height="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          {b.ago}
        </p>
      </div>
      <button className={styles.close} onClick={() => { setLeaving(true); setTimeout(() => setVisible(false), 400); }} aria-label="Tutup">
        <svg viewBox="0 0 24 24" fill="none" width="12" height="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}
