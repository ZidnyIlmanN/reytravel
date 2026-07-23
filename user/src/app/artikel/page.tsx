import Link from 'next/link';
import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './artikel.module.css';

export const metadata: Metadata = {
  title: 'Artikel & Tips Travel – Reytrans',
  description: 'Baca tips perjalanan, panduan rute, dan informasi seputar layanan travel Reytrans dari Cirebon, Majalengka, Kuningan, Indramayu ke Jabodetabek.',
};

export const revalidate = 60;

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnail_url: string | null;
  status: string;
  created_at: string;
}

const MOCK_ARTICLES: Article[] = [
  {
    id: 'art1',
    title: 'Rute perjalanan',
    slug: 'rute-perjalanan',
    excerpt: 'Jelajahi berbagai rute perjalanan reguler dan charter yang kami sediakan untuk kenyamanan perjalanan Anda.',
    thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbzzGFK2R38N9r5hmvuF4tra_zrCF_2dyzN1PHDEVhgSCdG3VCxW9X-gz1niy3Tq3NIX2fvxDjr2RzVjfXDQBNK59ZCtmze5LADyKttUL4QxuW5eMNJsCcl0n75LUUbvosSnBTxpbHJin46DAOm6T2WUGnTx4WyfI-k7G2CoIzCK3W7llHCIPkPhkd_azBk2rn9--ICTZIpph3W0XbyWry0ykxiCsfI7bXMrs2KnOf4AMtxDzw7YZU',
    status: 'published',
    created_at: '2026-07-19T00:00:00Z',
  },
  {
    id: 'art2',
    title: 'Apa itu charter',
    slug: 'apa-itu-charter',
    excerpt: 'Ketahui perbedaan layanan charter privat dibanding travel reguler untuk perjalanan dinas, wisata, keluarga kelompok secara fleksibel.',
    thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHipLi_z06G9k6j6_M_fU6XSHHWRxH8LwM0F4dwCTMOhNBSqlCyoIBWidZR4ZW2macE7AeremeNb6xH_upq5NhU0MlDV9kufYd-KEulkdt_764dWdYwSqAf1AO5YUe0VIMshISWytz6IbNWDbt3CDFiNXQg7wZRnj-bQSPz8R-YsuugbeqkM2D3Xy5dCnvCfoOVGBDMhNvEfBlQoB0af6puge0i865QasHGgMXD2I5qYFsfEU9eBsk',
    status: 'published',
    created_at: '2026-07-19T00:00:00Z',
  },
  {
    id: 'art3',
    title: 'Apa itu door to door',
    slug: 'apa-itu-door-to-door',
    excerpt: 'Layanan antar jemput langsung di depan pintu rumah Anda menuju alamat tujuan dengan aman, nyaman, dan tepat waktu tanpa repot.',
    thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-mCvi7abTPNPQTZ6Qlbj59n71KVtgYE_CXD0aR6BJXoNiivtto6TH8yXPBWNZKDqcjWcGyza02Sm7qteuMGEJkk8pBp-WvejkWjUmibCVtgkWoKJc68zSjwtyJUyzkyiPlcgblXplGoHYHlEVKcJDWm9Cu7bXx5KyhK182V2RdYRa7NcTxbF30PcamtZranXrMS08z07MGb9m8VhMvXo6LmryStJeoMc4KXTomWXXB0G5nd6D2NeY',
    status: 'published',
    created_at: '2026-07-19T00:00:00Z',
  },
];

async function getArticles(): Promise<Article[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return MOCK_ARTICLES;

  try {
    const supabase = createClient(url, key);
    const { data } = await supabase
      .from('articles')
      .select('id, title, slug, excerpt, thumbnail_url, status, created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    return (data && data.length > 0) ? (data as Article[]) : MOCK_ARTICLES;
  } catch (err) {
    return MOCK_ARTICLES;
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default async function ArtikelPage() {
  const articles = await getArticles();

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <span className={styles.badge}>Blog & Tips</span>
            <h1 className={styles.heroTitle}>Artikel & Tips Travel</h1>
            <p className={styles.heroSub}>
              Panduan perjalanan, tips hemat, dan informasi terbaru seputar layanan Reytrans.
            </p>
          </div>
        </div>

        <div className={styles.container}>
          {articles.length === 0 ? (
            <div className={styles.empty}>
              <svg viewBox="0 0 24 24" fill="none" width="48" height="48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <p>Belum ada artikel yang dipublikasikan.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {articles.map(article => (
                <Link key={article.id} href={`/artikel/${article.slug}`} className={styles.card}>
                  <div className={styles.cardImg}>
                    {article.thumbnail_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={article.thumbnail_url} alt={article.title} />
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
                    <h2 className={styles.cardTitle}>{article.title}</h2>
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
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
