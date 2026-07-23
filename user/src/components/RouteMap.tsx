import styles from './RouteMap.module.css';
import { useScrollReveal, useScrollRevealChildren } from '@/hooks/useScrollReveal';

export default function RouteMap() {
  const routes = [
    { from: 'Ciayumajakuning', to: 'Jabodetabek', desc: 'Cirebon, Majalengka, Kuningan, Indramayu ↔ Jakarta, Bogor, Depok, Tangerang, Bekasi' },
    { from: 'Subang', to: 'Jabodetabek', desc: 'Subang & sekitarnya ↔ seluruh area Jabodetabek PP' },
    { from: 'Jabodetabek', to: 'Brebes', desc: 'Jakarta & Jabodetabek ↔ Brebes dan kota sekitarnya' },
  ];

  const steps = [
    { title: 'Pesan via WhatsApp', desc: 'Hubungi CS kami, tentukan tanggal & jumlah penumpang. Konfirmasi dalam 5 menit.' },
    { title: 'Penjemputan Rumah', desc: 'Sopir kami datang langsung ke depan rumah Anda sesuai jadwal yang disepakati.' },
    { title: 'Penjemputan Bergantian', desc: 'Penumpang lain dijemput secara bergantian sesuai urutan rute yang efisien.' },
    { title: 'Perjalanan Nyaman', desc: 'Nikmati perjalanan dengan armada AC (+ Karaoke untuk Hiace & Elf Long).' },
    { title: 'Sampai Tujuan', desc: 'Tiba di tujuan dengan selamat. Biaya sudah all-in: sopir, BBM, & tol.' },
  ];

  const headerRef = useScrollReveal<HTMLDivElement>();
  const leftColRef = useScrollReveal<HTMLDivElement>({ visibleClass: 'is-visible' });
  const rightColRef = useScrollReveal<HTMLDivElement>({ visibleClass: 'is-visible' });
  const stepsRef = useScrollRevealChildren<HTMLDivElement>({ staggerMs: 60 });

  return (
    <section id="routes" className={`section section-alt`}>
      <div className="container">
        <div className="section-header reveal-up" ref={headerRef}>
          <span className="section-label">RUTE & LAYANAN</span>
          <h2 className="section-title">Rute Perjalanan &amp; Alur Jemput</h2>
          <div className="section-bar" />
          <p className="section-desc">
            Melayani rute reguler Ciayumajakuning ↔ Jabodetabek PP, Subang ↔ Jabodetabek, dan Jabodetabek ↔ Brebes.
          </p>
        </div>

        {/* Route cards */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '40px' }}>
          {routes.map((r, i) => (
            <div key={i} style={{
              flex: '1 1 260px',
              background: 'var(--clr-card)',
              border: '1.5px solid var(--clr-border)',
              borderRadius: 'var(--r-xl)',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '15px', color: 'var(--clr-text)' }}>
                <span style={{ color: 'var(--clr-primary)', fontWeight: 800 }}>{r.from}</span>
                <span style={{ color: 'var(--clr-text-muted)', fontSize: '18px' }}>↔</span>
                <span style={{ color: 'var(--clr-primary)', fontWeight: 800 }}>{r.to}</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--clr-text-secondary)', lineHeight: 1.5 }}>{r.desc}</p>
            </div>
          ))}
        </div>

        <div className={styles.layout}>
          {/* Timeline */}
          <div className={`${styles.timeline} reveal-left`} ref={leftColRef}>
            <h3 className={styles.subTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Alur Perjalanan Door-to-Door
            </h3>
            <div className={styles.steps} ref={stepsRef}>
              {steps.map((step, i) => (
                <div key={i} className={`${styles.step} reveal-up`}>
                  <div className={styles.stepIndicator}>
                    <div className={styles.node}>{i + 1}</div>
                    {i < steps.length - 1 && <div className={styles.line} />}
                  </div>
                  <div className={styles.stepContent}>
                    <strong className={styles.stepTitle}>{step.title}</strong>
                    <p className={styles.stepDesc}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className={`${styles.mapCol} reveal-right`} ref={rightColRef}>
            <h3 className={styles.subTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                <line x1="9" y1="3" x2="9" y2="18"/>
                <line x1="15" y1="6" x2="15" y2="21"/>
              </svg>
              Lokasi Kantor Kami
            </h3>
            <div className={styles.mapFrame}>
              <iframe
                title="Peta Reytrans Cirebon"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.1200876277157!2d108.43736770000001!3d-6.7552071!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f1f8d18922419%3A0xd38c5f13e05c4445!2sBlok%20Desa%2C%20Cikeduk%2C%20Kec.%20Depok%2C%20Kabupaten%20Cirebon%2C%20Jawa%20Barat%2045155!5e0!3m2!1sid!2sid!4v1784378206415!5m2!1sid!2sid"
                width="100%"
                height="340"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className={styles.mapInfo}>
              <span className={styles.mapInfoIcon}>
                <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </span>
              <div>
                <strong>Kantor Reytrans — Kab. Cirebon</strong>
                <p>Jl. Nursefi Rt007 Rw002 Blok. Warung Lepet Ds. Cikeduk Kec. Depok Kab. Cirebon. Sopir kami konfirmasi H-1 keberangkatan via WhatsApp.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule & Fare Grid */}
        <div className={styles.tableGrid}>
          {/* Fares Table */}
          <div className={styles.tableContainer}>
            <h3 className={styles.tableTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--clr-primary)' }}>
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              Daftar Tarif Travel Reguler (Door to Door)
            </h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Rute Keberangkatan &amp; Tujuan</th>
                  <th>Tarif Per Orang</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Jakarta ↔ Cirebon</td>
                  <td className={styles.highlightText}>Rp 250.000</td>
                </tr>
                <tr>
                  <td>Jakarta ↔ Indramayu</td>
                  <td className={styles.highlightText}>Rp 250.000</td>
                </tr>
                <tr>
                  <td>Bogor ↔ Cirebon / Indramayu</td>
                  <td className={styles.highlightText}>Rp 250.000</td>
                </tr>
                <tr>
                  <td>Tangerang ↔ Cirebon / Indramayu</td>
                  <td className={styles.highlightText}>Rp 250.000</td>
                </tr>
                <tr>
                  <td>Bandara Soekarno-Hatta (Sutta) ↔ Cirebon / Indramayu</td>
                  <td className={styles.highlightText}>Rp 250.000</td>
                </tr>
                <tr>
                  <td>Depok / Bekasi ↔ Cirebon / Indramayu</td>
                  <td className={styles.highlightText}>Rp 250.000</td>
                </tr>
              </tbody>
            </table>
            <p style={{ fontSize: '11px', color: 'var(--clr-text-secondary)', marginTop: '12px', fontStyle: 'italic' }}>
              * Catatan: Harga di atas sewaktu-waktu dapat berubah sesuai hari raya/high season tanpa pemberitahuan terlebih dahulu.
            </p>
          </div>

          {/* Schedule Table */}
          <div className={styles.tableContainer}>
            <h3 className={styles.tableTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--clr-primary)' }}>
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Jadwal Pemberangkatan Harian
            </h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Keberangkatan Dari</th>
                  <th>Jadwal Pagi / Siang</th>
                  <th>Jadwal Malam</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Jakarta / Jabodetabek</strong></td>
                  <td>08:00 WIB</td>
                  <td>20:00 WIB</td>
                </tr>
                <tr>
                  <td><strong>Cirebon / Kuningan</strong></td>
                  <td>08:00 WIB & 12:30 WIB</td>
                  <td>20:00 WIB</td>
                </tr>
                <tr>
                  <td><strong>Indramayu</strong></td>
                  <td>12:00 WIB (Siang)</td>
                  <td>23:00 WIB</td>
                </tr>
              </tbody>
            </table>
            <p style={{ fontSize: '11px', color: 'var(--clr-text-secondary)', marginTop: '12px', fontStyle: 'italic' }}>
              * Penjemputan door-to-door langsung ke rumah Anda dimulai 1-2 jam sebelum jam keberangkatan di atas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

