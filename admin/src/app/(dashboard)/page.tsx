import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import styles from './page.module.css';

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch article stats
  const { count: totalArticles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true });

  const { count: publishedArticles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  const { count: draftArticles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'draft');

  // Fetch recent 5 articles
  const { data: recentArticles } = await supabase
    .from('articles')
    .select('id, title, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = [
    { label: 'Total Artikel', value: totalArticles ?? 0, color: 'primary' },
    { label: 'Published',     value: publishedArticles ?? 0, color: 'success' },
    { label: 'Draft',         value: draftArticles ?? 0,     color: 'warning' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageDesc}>Selamat datang di panel admin Reytrans</p>
        </div>
        <Link href="/articles/new" className="btn btn-primary">
          <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Artikel Baru
        </Link>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        {stats.map(s => (
          <div key={s.label} className={`${styles.statCard} ${styles[`statCard_${s.color}`]}`}>
            <p className={styles.statValue}>{s.value}</p>
            <p className={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent articles */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Artikel Terbaru</h2>
          <Link href="/articles" className="btn btn-ghost btn-sm">Lihat Semua →</Link>
        </div>

        {recentArticles && recentArticles.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Judul</th>
                <th>Status</th>
                <th>Tanggal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentArticles.map(a => (
                <tr key={a.id}>
                  <td className={styles.tdTitle}>{a.title}</td>
                  <td>
                    <span className={`badge ${a.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                      {a.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className={styles.tdDate}>
                    {new Date(a.created_at).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}
                  </td>
                  <td>
                    <Link href={`/articles/${a.id}/edit`} className="btn btn-ghost btn-sm">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.empty}>
            <p>Belum ada artikel. <Link href="/articles/new" style={{ color: 'var(--primary)' }}>Buat artikel pertama →</Link></p>
          </div>
        )}
      </div>
    </div>
  );
}
