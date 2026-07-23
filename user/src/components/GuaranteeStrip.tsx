import styles from './GuaranteeStrip.module.css';
import { useScrollRevealChildren } from '@/hooks/useScrollReveal';

const GUARANTEES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
    title: 'Harga Transparan',
    desc: 'Tidak ada biaya tersembunyi. Harga yang tertera adalah harga final.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
      </svg>
    ),
    title: 'Cancel H-3 Gratis',
    desc: 'Batalkan pemesanan minimal 3 hari sebelum keberangkatan tanpa dikenakan biaya apapun.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
    title: 'Sopir Berlisensi',
    desc: 'Seluruh sopir berpengalaman, ramah, dan mengantongi SIM resmi.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.67 19.79 19.79 0 01.46 2.1 2 2 0 012.42 0h3.08a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
      </svg>
    ),
    title: 'Respon 5 Menit',
    desc: 'CS kami siap membalas konfirmasi Anda dalam waktu 5 menit selama jam operasional.',
  },
];

export default function GuaranteeStrip() {
  const gridRef = useScrollRevealChildren<HTMLDivElement>({ staggerMs: 60 });

  return (
    <section className={styles.strip}>
      <div className="container">
        <div className={styles.grid} ref={gridRef}>
          {GUARANTEES.map((g, i) => (
            <div key={i} className={`${styles.item} reveal-up`}>
              <div className={styles.iconWrap}>{g.icon}</div>
              <div className={styles.text}>
                <strong className={styles.title}>{g.title}</strong>
                <p className={styles.desc}>{g.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
