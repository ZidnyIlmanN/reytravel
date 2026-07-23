import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { marked } from 'marked';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './detail.module.css';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
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
    content: `# Panduan Rute Perjalanan Premium Reytrans\n\nReytrans menyediakan layanan perjalanan eksekutif dengan rute-rute utama menghubungkan wilayah Ciayumajakuning ke Jabodetabek (Jakarta, Bogor, Depok, Tangerang, Bekasi).\n\n## Rute Utama Kami:\n- **Cirebon - Jakarta (PP)** melalui Tol Cipali.\n- **Kuningan - Bekasi - Jakarta (PP)**.\n- **Majalengka - Jakarta (PP)** melalui Tol Cisumdawu / Cipali.\n- **Indramayu - Tangerang (PP)**.\n\n## Keunggulan Rute Tol Trans Jawa\nSeluruh perjalanan kami memaksimalkan penggunaan jalan tol untuk meminimalkan waktu tempuh dan memaksimalkan keselamatan berkendara.`,
    status: 'published',
    created_at: '2026-07-19T00:00:00Z',
  },
  {
    id: 'art2',
    title: 'Apa itu charter',
    slug: 'apa-itu-charter',
    excerpt: 'Ketahui perbedaan layanan charter privat dibanding travel reguler untuk perjalanan dinas, wisata, keluarga kelompok secara fleksibel.',
    thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHipLi_z06G9k6j6_M_fU6XSHHWRxH8LwM0F4dwCTMOhNBSqlCyoIBWidZR4ZW2macE7AeremeNb6xH_upq5NhU0MlDV9kufYd-KEulkdt_764dWdYwSqAf1AO5YUe0VIMshISWytz6IbNWDbt3CDFiNXQg7wZRnj-bQSPz8R-YsuugbeqkM2D3Xy5dCnvCfoOVGBDMhNvEfBlQoB0af6puge0i865QasHGgMXD2I5qYFsfEU9eBsk',
    content: `# Mengenal Layanan Charter Privat Reytrans\n\nLayanan Charter Privat adalah solusi terbaik bagi Anda yang menginginkan perjalanan eksklusif tanpa dicampur dengan penumpang lain. Anda dapat menyewa satu armada penuh beserta pengemudi profesional kami.\n\n## Keuntungan Memilih Charter Privat:\n1. **Waktu Fleksibel**: Anda yang menentukan jam keberangkatan dan penjemputan.\n2. **Kapasitas Penuh**: Cocok untuk rombongan keluarga, ziarah, wisuda, atau kunjungan kerja.\n3. **Door to Door Bebas**: Rute penjemputan dan tujuan bisa disesuaikan sesuai kebutuhan rombongan.\n\nPilihan armada kami mencakup Toyota Avanza, Innova, Hiace Commuter, hingga Elf Long 20 kursi.`,
    status: 'published',
    created_at: '2026-07-19T00:00:00Z',
  },
  {
    id: 'art3',
    title: 'Apa itu door to door',
    slug: 'apa-itu-door-to-door',
    excerpt: 'Layanan antar jemput langsung di depan pintu rumah Anda menuju alamat tujuan dengan aman, nyaman, dan tepat waktu tanpa repot.',
    thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-mCvi7abTPNPQTZ6Qlbj59n71KVtgYE_CXD0aR6BJXoNiivtto6TH8yXPBWNZKDqcjWcGyza02Sm7qteuMGEJkk8pBp-WvejkWjUmibCVtgkWoKJc68zSjwtyJUyzkyiPlcgblXplGoHYHlEVKcJDWm9Cu7bXx5KyhK182V2RdYRa7NcTxbF30PcamtZranXrMS08z07MGb9m8VhMvXo6LmryStJeoMc4KXTomWXXB0G5nd6D2NeY',
    content: `# Apa itu Layanan Door to Door (Jemput Antar Alamat)?\n\nLayanan Door to Door adalah layanan utama dari Reytrans di mana penumpang akan dijemput langsung di depan pintu rumah/alamat asal dan diantarkan langsung ke titik tujuan akhir.\n\n## Mengapa Layanan Ini Sangat Populer?\n- **Praktis**: Tidak perlu naik-turun kendaraan umum atau pergi ke terminal/stasiun terlebih dahulu.\n- **Hemat**: Menghilangkan biaya tambahan untuk taksi atau ojek online dari dan ke terminal.\n- **Nyaman**: Cukup tunggu di rumah, pengemudi kami akan menghubungi Anda saat sudah mendekati lokasi penjemputan.`,
    status: 'published',
    created_at: '2026-07-19T00:00:00Z',
  },
];

function findMockArticle(slug: string): Article | null {
  const decoded = decodeURIComponent(slug).toLowerCase().trim();
  const normalizedSlug = decoded.replace(/[-_]/g, ' ');
  return MOCK_ARTICLES.find(article => {
    const artSlug = article.slug.toLowerCase().trim().replace(/[-_]/g, ' ');
    return artSlug === normalizedSlug || article.slug.toLowerCase().trim() === decoded;
  }) || null;
}

async function getArticle(slug: string): Promise<Article | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return findMockArticle(slug);

  try {
    const supabase = createClient(url, key);
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (data) return data as Article;
    
    return findMockArticle(slug);
  } catch (err) {
    return findMockArticle(slug);
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: 'Artikel Tidak Ditemukan – Reytrans' };

  return {
    title: `${article.title} – Reytrans`,
    description: article.excerpt || `Baca artikel ${article.title} di blog Reytrans.`,
    openGraph: {
      title: article.title,
      description: article.excerpt || '',
      images: article.thumbnail_url ? [{ url: article.thumbnail_url }] : [],
    },
  };
}

export const revalidate = 60;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default async function ArtikelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  // Configure marked for safe rendering
  marked.setOptions({ breaks: true, gfm: true } as any);
  const contentHtml = await marked.parse(article.content || '');

  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <div className={styles.breadcrumbInner}>
            <Link href="/" className={styles.breadcrumbLink}>Beranda</Link>
            <span className={styles.breadcrumbSep}>›</span>
            <Link href="/artikel" className={styles.breadcrumbLink}>Artikel</Link>
            <span className={styles.breadcrumbSep}>›</span>
            <span className={styles.breadcrumbCurrent}>{article.title}</span>
          </div>
        </div>

        <article className={styles.article}>
          {/* Thumbnail */}
          {article.thumbnail_url && (
            <div className={styles.thumbnail}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.thumbnail_url} alt={article.title} />
            </div>
          )}

          <div className={styles.articleInner}>
            {/* Meta */}
            <div className={styles.meta}>
              <time className={styles.date}>{formatDate(article.created_at)}</time>
              <span className={styles.readingTag}>Blog Reytrans</span>
            </div>

            <h1 className={styles.title}>{article.title}</h1>

            {article.excerpt && (
              <p className={styles.excerpt}>{article.excerpt}</p>
            )}

            <div className={styles.divider} />

            {/* Rendered Markdown Content */}
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {/* CTA */}
            <div className={styles.cta}>
              <p className={styles.ctaText}>
                Tertarik dengan layanan travel Reytrans? Hubungi kami sekarang!
              </p>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890'}?text=Halo, saya tertarik dengan layanan Reytrans`}
                className={styles.ctaBtn}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat WhatsApp Sekarang
              </a>
            </div>

            {/* Back link */}
            <Link href="/artikel" className={styles.backLink}>
              ← Kembali ke Semua Artikel
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
