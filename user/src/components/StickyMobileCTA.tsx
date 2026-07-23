'use client';
import styles from './StickyMobileCTA.module.css';

interface Props {
  onBook: () => void;
  onAiChat: () => void;
}

export default function StickyMobileCTA({ onBook, onAiChat }: Props) {
  const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';
  const msg = encodeURIComponent('Halo Reytrans, saya mau tanya paket wisata / sewa mobil');

  return (
    <div className={styles.bar}>
      <button
        onClick={onAiChat}
        className={styles.subBtn}
        aria-label="Tanya AI"
      >
        <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="10" rx="2"/>
          <circle cx="12" cy="5" r="2"/>
          <path d="M12 7v4M8 16h.01M16 16h.01"/>
        </svg>
        <span>Tanya AI</span>
      </button>

      <a
        href={`https://wa.me/${num}?text=${msg}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.subBtn}
        aria-label="Tanya CS via WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.67 19.79 19.79 0 01.46 2.1 2 2 0 012.42 0h3.08a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
        </svg>
        <span>Tanya CS</span>
      </a>

      <button className={styles.bookBtn} onClick={onBook} aria-label="Pesan Sekarang">
        <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        <span>Pesan Sekarang</span>
      </button>
    </div>
  );
}
