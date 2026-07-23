import styles from './Testimonials.module.css';
import { useScrollReveal, useScrollRevealChildren } from '@/hooks/useScrollReveal';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Budi Santoso',
    role: 'Pengguna Reguler · Cirebon',
    photo: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    text: 'Pengalaman luar biasa! Sopirnya sangat profesional, ramah, dan hapal rute jalan tol. Penjemputan door-to-door sangat membantu. Pasti akan langganan terus di Reytrans.',
    destination: 'Travel Cirebon ↔ Jakarta',
    color: '#0064d2',
  },
  {
    id: 2,
    name: 'Dewi Rahayu',
    role: 'Pelanggan Charter · Kuningan',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    text: 'Booking charter Avanza untuk keluarga ke Jakarta sangat mudah. Mobil bersih, sopir sabar, dan harga tertera sudah all-in tol & BBM. Sangat direkomendasikan!',
    destination: 'Charter Avanza Privat',
    color: '#6366f1',
  },
  {
    id: 3,
    name: 'Rina Kusuma',
    role: 'Penyewa Rombongan · Indramayu',
    photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    text: 'Sewa Hiace Commuter untuk acara keluarga ke Tangerang. Kendaraan sangat nyaman, AC dingin, dan ada fasilitas karaoke di dalam mobil. Perjalanan 15 orang jadi tidak membosankan!',
    destination: 'Charter Hiace Commuter',
    color: '#f59e0b',
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className={styles.stars}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? styles.starFilled : styles.starEmpty}>★</span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useScrollRevealChildren<HTMLDivElement>({ staggerMs: 90 });

  return (
    <section className="section section-dark glow-section">
      <div className="container">
        <div className="section-header reveal-up" ref={headerRef}>
          <span className="section-label">ULASAN PELANGGAN</span>
          <h2 className={`section-title section-title--light`}>
            Mereka Sudah Mempercayai Kami
          </h2>
          <div className="section-bar" />
          <p className={`section-desc section-desc--light`}>
            Ribuan pelanggan puas berbagi pengalaman perjalanan bersama Reytrans.
          </p>
        </div>

        {/* Cards grid */}
        <div className={styles.grid} ref={gridRef}>
          {TESTIMONIALS.map((t) => (
            <article
              key={t.id}
              className={`${styles.card} reveal-up`}
              style={{ '--accent': t.color } as React.CSSProperties}
            >
              {/* Quote mark */}
              <span className={styles.quote}>&ldquo;</span>

              <StarRating count={t.rating} />

              <p className={styles.text}>{t.text}</p>

              <div className={styles.meta}>
                <div
                  className={styles.avatar}
                  style={{ borderColor: t.color }}
                >
                  <img
                    src={t.photo}
                    alt={t.name}
                    className={styles.avatarImg}
                  />
                </div>
                <div className={styles.nameGroup}>
                  <div className={styles.name}>{t.name}</div>
                  <div className={styles.role}>{t.role}</div>
                </div>
                <span className={`badge badge-primary ${styles.destination}`}>
                  {t.destination}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
