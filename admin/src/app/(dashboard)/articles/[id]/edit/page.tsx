import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { updateArticle } from '../../actions';
import ArticleForm from '@/components/ArticleForm';
import styles from '../../articles.module.css';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !article) {
    notFound();
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Edit Artikel</h1>
          <p className={styles.pageDesc}>Ubah isi konten artikel Anda</p>
        </div>
        <Link href="/articles" className="btn btn-ghost">← Kembali</Link>
      </div>
      <ArticleForm action={updateArticle} initialData={article} />
    </div>
  );
}
