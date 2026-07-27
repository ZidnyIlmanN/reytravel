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
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>person</span>
      </div>
      <div className={styles.body}>
        <p className={styles.name}>
          <strong>{b.name}</strong>
          <span className={styles.city}> dari {b.city}</span>
        </p>
        <p className={styles.action}>
          baru booking <strong>{b.pkg}</strong>
        </p>
        <p className={styles.ago}>
          <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>schedule</span>
          {b.ago}
        </p>
      </div>
      <button className={styles.close} onClick={() => { setLeaving(true); setTimeout(() => setVisible(false), 400); }} aria-label="Tutup">
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
      </button>
    </div>
  );
}
