'use client';
import Link from 'next/link';
import { Article } from '@/lib/supabase';
import styles from './ArticlesPreview.module.css';


interface Props {
  articles: Article[];
}

export default function ArticlesPreview({ articles }: Props) {
  // Hide section entirely if there are fewer than 3 articles to maintain a clean 3-column grid
  if (!articles || articles.length < 3) {
    return null;
  }

  // Display only the 3 latest articles
  const latestArticles = articles.slice(0, 3);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <section id="articles" className="section glow-section">
      <div className="container">
        <div className={`section-header ${styles.sectionHeader}`}>

          <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            BLOG & ARTIKEL
          </span>
          <h2 className="section-title">Tips & Informasi Travel</h2>
          <div className="section-bar" />
          <p className="section-desc">
            Baca tips perjalanan terbaru, panduan wisata menarik, dan berita terupdate dari Reytrans.
          </p>
        </div>

        <div className={styles.grid}>
          {latestArticles.map((article, index) => (
            <Link href={`/artikel/${article.slug}`} key={article.id} className={styles.card} style={{ '--card-i': index } as React.CSSProperties}>
              <div className={styles.cardImg}>
                {article.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={article.thumbnail_url} alt={article.title} loading="lazy" />
                ) : (
                  <div className={styles.cardImgPlaceholder}>
                    <svg viewBox="0 0 24 24" fill="none" width="32" height="32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className={styles.cardBody}>
                <time className={styles.cardDate}>{formatDate(article.created_at)}</time>
                <h3 className={styles.cardTitle}>{article.title}</h3>
                {article.excerpt && (
                  <p className={styles.cardExcerpt}>{article.excerpt}</p>
                )}
                <span className={styles.cardReadMore}>
                  Baca Selengkapnya
                  <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.viewAllWrapper}>
          <Link href="/artikel" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Lihat Semua Artikel
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
