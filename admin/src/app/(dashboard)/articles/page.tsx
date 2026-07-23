import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import DeleteArticleButton from './DeleteArticleButton';
import styles from './articles.module.css';

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('articles')
    .select('id, title, slug, status, created_at, updated_at');

  if (q) {
    query = query.ilike('title', `%${q}%`);
  }

  const { data: articles } = await query.order('created_at', { ascending: false });

  return (
    <div>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Artikel</h1>
          <p className={styles.pageDesc}>
            {q ? `Ditemukan ${articles?.length ?? 0} hasil pencarian` : `${articles?.length ?? 0} artikel tersimpan`}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <form action="/articles" method="GET" className={styles.searchForm}>
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              name="q"
              defaultValue={q ?? ''}
              placeholder="Cari judul artikel..."
              className={styles.searchInput}
            />
            {q && (
              <Link href="/articles" className={styles.clearBtn} title="Reset">
                &times;
              </Link>
            )}
          </form>
          <Link href="/articles/new" className="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Artikel Baru
          </Link>
        </div>
      </div>


      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {articles && articles.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Judul</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Dibuat</th>
                <th>Diupdate</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {articles.map(a => (
                <tr key={a.id}>
                  <td className={styles.tdTitle}>{a.title}</td>
                  <td><code className={styles.slug}>{a.slug}</code></td>
                  <td>
                    <span className={`badge ${a.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                      {a.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className={styles.tdMeta}>
                    {new Date(a.created_at).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}
                  </td>
                  <td className={styles.tdMeta}>
                    {new Date(a.updated_at).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/articles/${a.id}/edit`} className="btn btn-ghost btn-sm">Edit</Link>
                      <DeleteArticleButton articleId={a.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.empty}>
            <svg viewBox="0 0 24 24" fill="none" width="40" height="40" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)', marginBottom: 12 }}>
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <p>Belum ada artikel</p>
            <Link href="/articles/new" className="btn btn-primary" style={{ marginTop: 12 }}>Buat Artikel Pertama</Link>
          </div>
        )}
      </div>
    </div>
  );
}
