import { useState } from 'react';
import { FAQ } from '@/lib/supabase';
import styles from './FAQSection.module.css';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface Props { faqs: FAQ[]; }

export default function FAQSection({ faqs }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const [filter, setFilter] = useState('Semua');

  const categories = ['Semua', ...Array.from(new Set(faqs.map(f => f.category).filter(Boolean)))];
  const filtered   = filter === 'Semua' ? faqs : faqs.filter(f => f.category === filter);

  const headerRef = useScrollReveal<HTMLDivElement>();
  const bottomRef = useScrollReveal<HTMLDivElement>();

  return (
    <section id="faq" className="section section-alt">
      <div className="container container--narrow">
        <div className="section-header reveal-up" ref={headerRef}>
          <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <svg viewBox="0 0 24 24" fill="none" width="12" height="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            FAQ
          </span>
          <h2 className="section-title">Pertanyaan yang Sering Ditanyakan</h2>
          <div className="section-bar" />
          <p className="section-desc">
            Temukan jawaban cepat seputar layanan sewa mobil, paket travel, dan kebijakan kami.
          </p>
        </div>

        {/* Category filter */}
        {categories.length > 1 && (
          <div className={styles.filterRow}>
            {categories.map(cat => {
              const isActive = filter === cat;
              return (
                <button
                  key={cat}
                  className={`${styles.filterBtn} ${isActive ? styles.filterBtnActive : ''}`}
                  style={isActive ? { color: '#fff', background: 'var(--clr-primary)', borderColor: 'var(--clr-primary)' } : undefined}
                  onClick={() => { setFilter(cat); setActive(null); }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Accordion list */}
        <div className={styles.list}>
          {filtered.map((faq, i) => {
            const isOpen = active === i;
            return (
              <div key={faq.id} className={`${styles.item} ${isOpen ? styles.itemOpen : ''} ${styles.itemAnimate}`} style={{ '--item-i': i } as React.CSSProperties}>
                <button
                  className={styles.trigger}
                  onClick={() => setActive(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.question}>{faq.question}</span>
                  <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>
                <div
                  className={styles.answerWrap}
                  style={{ maxHeight: isOpen ? '300px' : '0' }}
                >
                  <div className={styles.answer}>{faq.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className={`${styles.cta} reveal-up`} ref={bottomRef}>
          <p>Masih punya pertanyaan lain?</p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890'}?text=Halo%20Reytrans,%20saya%20mau%20tanya`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px',
              backgroundColor: '#25D366',
              borderColor: '#25D366',
              color: '#fff'
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397 0 11.948 0c3.179.001 6.167 1.24 8.416 3.49s3.486 5.241 3.487 8.417c-.004 6.557-5.342 11.906-11.895 11.906-2.003-.001-3.972-.511-5.727-1.488L0 24zm6.59-4.846c1.6.95 3.167 1.455 4.792 1.455 5.532 0 10.033-4.502 10.035-10.037.002-2.68-1.041-5.2-2.935-7.094S14.076 3.01 11.398 3.01C5.867 3.01 1.365 7.51 1.362 13.048c-.001 1.8.48 3.55 1.39 5.08L1.756 22l4.89-1.286zM17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
            </svg>
            Tanya via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
