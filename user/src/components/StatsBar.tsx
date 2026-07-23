import { useEffect, useRef, useState } from 'react';
import styles from './StatsBar.module.css';
import { useScrollRevealChildren } from '@/hooks/useScrollReveal';

const STATS = [
  {
    value: 10000, suffix: '+', label: 'Pelanggan Puas', decimal: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    value: 4.9, suffix: '', label: 'Rating Google', decimal: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    value: 5, suffix: '+', label: 'Tahun Pengalaman', decimal: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
  },
  {
    value: 100, suffix: '%', label: 'Armada Bermotor', decimal: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l1.5-4.5A2 2 0 016.4 5h11.2a2 2 0 011.9 1.5L21 11"/>
        <rect x="2" y="11" width="20" height="6" rx="2"/>
        <circle cx="7" cy="19" r="2"/>
        <circle cx="17" cy="19" r="2"/>
        <path d="M2 14h20"/>
      </svg>
    ),
  },
];

function Counter({ value, decimal, suffix, active }: { value: number; decimal: boolean; suffix: string; active: boolean }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!active) {
      setDisplay(0);
      return;
    }
    const duration = 1600;
    const fps = 60;
    const steps = Math.round(duration / (1000 / fps));
    const inc = value / steps;
    let cur = 0;
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      cur = Math.min(cur + inc, value);
      setDisplay(cur);
      if (frame >= steps) clearInterval(id);
    }, 1000 / fps);
    return () => clearInterval(id);
  }, [active, value]);

  const formatted = decimal
    ? display.toFixed(1)
    : Math.floor(display).toLocaleString('id-ID');

  return <>{formatted}{suffix}</>;
}

export default function StatsBar() {
  const ref = useScrollRevealChildren<HTMLDivElement>({ staggerMs: 80 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setActive(true);
        } else {
          setActive(false);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);

  return (
    <div className={styles.bar}>
      <div ref={ref} className={`container ${styles.inner}`}>
        {STATS.map(s => (
          <div key={s.label} className={`${styles.item} reveal-up`}>
            <span className={styles.icon}>{s.icon}</span>
            <div className={styles.number}>
              <Counter value={s.value} decimal={s.decimal} suffix={s.suffix} active={active} />
            </div>
            <div className={styles.label}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
