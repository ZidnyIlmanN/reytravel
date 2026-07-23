'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createArticle(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const title    = formData.get('title') as string;
  const slug     = formData.get('slug') as string;
  const content  = formData.get('content') as string;
  const excerpt  = formData.get('excerpt') as string;
  const thumbnail_url = formData.get('thumbnail_url') as string;
  const status   = formData.get('status') as 'draft' | 'published';

  const { error } = await supabase.from('articles').insert({
    title, slug, content, excerpt: excerpt || null,
    thumbnail_url: thumbnail_url || null,
    status, author_id: user.id,
  });

  if (error) throw new Error(error.message);
  revalidatePath('/articles');
  redirect('/articles');
}

export async function updateArticle(formData: FormData) {
  const supabase = await createClient();
  const id       = formData.get('id') as string;
  const title    = formData.get('title') as string;
  const slug     = formData.get('slug') as string;
  const content  = formData.get('content') as string;
  const excerpt  = formData.get('excerpt') as string;
  const thumbnail_url = formData.get('thumbnail_url') as string;
  const status   = formData.get('status') as 'draft' | 'published';

  // 1. Fetch old thumbnail_url to see if it changed
  const { data: oldArticle } = await supabase
    .from('articles')
    .select('thumbnail_url')
    .eq('id', id)
    .single();

  // 2. Update the article in database
  const { error } = await supabase.from('articles').update({
    title, slug, content, excerpt: excerpt || null,
    thumbnail_url: thumbnail_url || null,
    status, updated_at: new Date().toISOString(),
  }).eq('id', id);

  if (error) throw new Error(error.message);

  // 3. Clean up old storage thumbnail if it is different and was stored in Supabase Storage
  if (oldArticle?.thumbnail_url && oldArticle.thumbnail_url !== thumbnail_url) {
    const storageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/thumbnails/`;
    if (oldArticle.thumbnail_url.startsWith(storageUrl)) {
      const filePath = oldArticle.thumbnail_url.replace(storageUrl, '');
      await supabase.storage.from('thumbnails').remove([filePath]);
    }
  }

  revalidatePath('/articles');
  redirect('/articles');
}

export async function deleteArticle(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get('id') as string;

  // 1. Fetch thumbnail_url before deleting article
  const { data: article } = await supabase
    .from('articles')
    .select('thumbnail_url')
    .eq('id', id)
    .single();

  // 2. Delete article from database
  const { error } = await supabase.from('articles').delete().eq('id', id);
  if (error) throw new Error(error.message);

  // 3. If article has a thumbnail_url from our Supabase storage, delete it from storage
  if (article?.thumbnail_url) {
    const storageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/thumbnails/`;
    if (article.thumbnail_url.startsWith(storageUrl)) {
      const filePath = article.thumbnail_url.replace(storageUrl, '');
      await supabase.storage.from('thumbnails').remove([filePath]);
    }
  }

  revalidatePath('/articles');
}
