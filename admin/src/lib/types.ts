export type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  thumbnail_url: string | null;
  status: 'draft' | 'published';
  author_id: string;
  created_at: string;
  updated_at: string;
};

export type ArticleInput = Omit<Article, 'id' | 'author_id' | 'created_at' | 'updated_at'>;
