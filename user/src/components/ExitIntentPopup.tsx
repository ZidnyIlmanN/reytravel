'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './ExitIntentPopup.module.css';

interface Props {
  onBook: () => void;
}

export default function ExitIntentPopup({ onBook }: Props) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const triggered = useRef(false);
  const [secondsLeft, setSecondsLeft] = useState(300);

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem('exitPopupDismissed')) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse moves toward top of page (toward browser tab/close)
      if (e.clientY <= 10 && !triggered.current && !dismissed) {
        triggered.current = true;
        setShow(true);
      }
    };

    // Also trigger on mobile: back button / visibility hidden
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden' && !triggered.current && !dismissed) {
        triggered.current = true;
        // Don't show popup when page is hidden (back button), just log
      }
    };

    // Wait 5s before enabling (don't trigger on first load)
    const enableTimer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('visibilitychange', handleVisibility);
    }, 5000);

    return () => {
      clearTimeout(enableTimer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [dismissed]);

  // Countdown timer effect
  useEffect(() => {
    if (!show) return;
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [show]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const dismiss = () => {
    setShow(false);
    setDismissed(true);
    sessionStorage.setItem('exitPopupDismissed', '1');
  };

  const handleBook = () => {
    dismiss();
    onBook();
  };

  if (!show) return null;

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && dismiss()}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="exit-title">
        <button className={styles.close} onClick={dismiss} aria-label="Tutup">
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className={styles.badge}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          PENAWARAN KHUSUS
        </div>

        <h2 id="exit-title" className={styles.title}>
          Tunggu! Jangan Pergi Dulu
        </h2>
        <p className={styles.subtitle}>
          Dapatkan <strong>diskon eksklusif 20%</strong> untuk pemesanan hari ini — khusus untuk Anda!
        </p>

        <div className={styles.offerBox}>
          <div className={styles.offerItem}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="var(--clr-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Hemat langsung <strong>20%</strong> untuk booking hari ini
          </div>
          <div className={styles.offerItem}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="var(--clr-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Gratis antar-jemput bandara
          </div>
          <div className={styles.offerItem}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="var(--clr-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Cancel H-3 tanpa biaya
          </div>
        </div>

        <div className={styles.urgency}>
          <svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>
            Penawaran hangus dalam <strong className={styles.timerStr}>{formatTime(secondsLeft)}</strong> — hubungi CS dan sebutkan kode <strong>REYTRANS10</strong>
          </span>
        </div>

        <div className={styles.actions}>
          <button className={styles.ctaBtn} onClick={handleBook}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            Ya, Saya Mau Pesan Sekarang!
          </button>
          <button className={styles.skipBtn} onClick={dismiss}>
            Tidak, saya lewatkan penawaran ini
          </button>
        </div>
      </div>
    </div>
  );
}
