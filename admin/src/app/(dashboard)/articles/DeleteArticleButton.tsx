'use client';

import { deleteArticle } from './actions';

interface Props {
  articleId: string;
}

export default function DeleteArticleButton({ articleId }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!confirm('Hapus artikel ini? Tindakan ini tidak dapat dibatalkan.')) {
      e.preventDefault();
    }
  };

  return (
    <form action={deleteArticle} onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={articleId} />
      <button type="submit" className="btn btn-danger btn-sm">
        <svg viewBox="0 0 24 24" fill="none" width="12" height="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
          <path d="M10 11v6M14 11v6"/>
          <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
        </svg>
        Hapus
      </button>
    </form>
  );
}
