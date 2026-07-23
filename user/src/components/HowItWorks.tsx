'use client';
import { useEffect, useRef } from 'react';
import styles from './HowItWorks.module.css';

export default function HowItWorks() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const headerRef   = useRef<HTMLDivElement>(null);

  // Scroll reveal: header fades up, each row slides in from its side
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const targets: Element[] = [];
    if (headerRef.current)   targets.push(headerRef.current);
    if (timelineRef.current) {
      timelineRef.current.querySelectorAll('[data-reveal]').forEach(el => targets.push(el));
    }

    if (prefersReduced) {
      targets.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
    );

    targets.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      num: '01',
      title: 'Pilih Layanan & Armada',
      desc: 'Tentukan layanan travel reguler atau pilih armada sewa (Calya, Avanza, Innova, Hiace, Elf Long) sesuai kebutuhan Anda.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
          <line x1="9" y1="3" x2="9" y2="18"/>
          <line x1="15" y1="6" x2="15" y2="21"/>
        </svg>
      )
    },
    {
      num: '02',
      title: 'Isi Data Booking',
      desc: 'Masukkan tanggal keberangkatan, titik jemput, dan tujuan Anda melalui formulir pemesanan online cepat kurang dari 1 menit.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      )
    },
    {
      num: '03',
      title: 'Konfirmasi WhatsApp',
      desc: 'CS kami akan segera menghubungi via WhatsApp dalam 5 menit untuk validasi detail dan mengirim detail pesanan Anda.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      )
    }
  ];

  return (
    <section className="section glow-section" style={{ background: 'var(--clr-bg-alt)', borderBottom: '1px solid var(--clr-border)' }}>
      <div className="container">

        {/* Section header — fades up */}
        <div className="section-header reveal-up" ref={headerRef} data-reveal>
          <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            ALUR MUDAH
          </span>
          <h2 className="section-title">Cara Booking Sangat Instan</h2>
          <div className="section-bar" />
          <p className="section-desc">
            Sistem pemesanan tanpa ribet. Tidak perlu register akun, cukup ikuti 3 langkah cepat di bawah ini.
          </p>
        </div>

        {/* Zigzag Timeline */}
        <div className={styles.timeline} ref={timelineRef}>
          {/* Vertical center spine */}
          <div className={styles.centerLine} />

          {steps.map((s, idx) => {
            const isLeft = idx % 2 === 0;
            // Card slides up uniformly for robust responsive alignment
            const cardReveal = 'reveal-up';
            // Dot fades in after card (slightly delayed via --stagger-i)
            return (
              <div
                key={idx}
                className={`${styles.timelineRow} ${isLeft ? styles.rowLeft : styles.rowRight}`}
                data-reveal
                style={{ '--stagger-i': idx } as React.CSSProperties}
              >
                {/* Card side — slides in from its edge */}
                <div className={styles.cardWrap}>
                  <div
                    className={`${styles.stepCard} ${cardReveal}`}
                    data-reveal
                    style={{ '--stagger-i': idx } as React.CSSProperties}
                  >
                    <div className={styles.cardGlow} />
                    <div className={styles.headerRow}>
                      <div className={styles.iconCircle}>{s.icon}</div>
                      <span className={styles.number}>{s.num}</span>
                    </div>
                    <h3 className={styles.stepTitle}>{s.title}</h3>
                    <p className={styles.stepDesc}>{s.desc}</p>
                  </div>
                </div>

                {/* Center dot — fades in */}
                <div className={styles.midPoint}>
                  <div
                    className={`${styles.timelineDot} reveal-fade`}
                    data-reveal
                    style={{ '--stagger-i': idx + 0.5 } as React.CSSProperties}
                  />
                </div>

                {/* Empty opposite side */}
                <div className={styles.emptyWrap} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
