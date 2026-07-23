import Link from 'next/link';
import { createArticle } from '../actions';
import ArticleForm from '@/components/ArticleForm';
import styles from '../articles.module.css';

export default function NewArticlePage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Artikel Baru</h1>
          <p className={styles.pageDesc}>Buat dan publish artikel baru</p>
        </div>
        <Link href="/articles" className="btn btn-ghost">← Kembali</Link>
      </div>
      <ArticleForm action={createArticle} />
    </div>
  );
}
