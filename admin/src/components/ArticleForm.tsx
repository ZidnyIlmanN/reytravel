'use client';
import { useState, useEffect, useRef } from 'react';
import { Article } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import styles from './ArticleForm.module.css';

interface Props {
  action: (formData: FormData) => Promise<void>;
  initialData?: Article;
}

// Lazy-load marked + DOMPurify only on client side
async function renderMarkdown(md: string): Promise<string> {
  const { marked } = await import('marked');
  const DOMPurify = (await import('dompurify')).default;
  marked.setOptions({ breaks: true, gfm: true } as any);
  const raw = await marked.parse(md);
  return DOMPurify.sanitize(raw);
}

export default function ArticleForm({ action, initialData }: Props) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnail_url || '');
  const [status, setStatus] = useState<'draft' | 'published'>(initialData?.status || 'draft');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Editor mode
  const [editorMode, setEditorMode] = useState<'markdown' | 'preview'>('markdown');
  const [previewHtml, setPreviewHtml] = useState('');

  // AI panel state
  const [aiOpen, setAiOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiInstructions, setAiInstructions] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  // Image upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.thumbnail_url || '');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Auto-generate slug from title
  useEffect(() => {
    if (!initialData) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  }, [title, initialData]);

  // Render markdown preview when switching to preview mode
  useEffect(() => {
    if (editorMode === 'preview' && content) {
      renderMarkdown(content).then(setPreviewHtml);
    }
  }, [editorMode, content]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // ── AI Generate ──────────────────────────────────────────────
  const handleAiGenerate = async () => {
    if (!aiTopic.trim()) {
      setAiError('Masukkan topik artikel terlebih dahulu.');
      return;
    }
    setAiLoading(true);
    setAiError('');
    try {
      const res = await fetch('/api/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiTopic, instructions: aiInstructions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal generate artikel.');

      setContent(data.markdown);
      if (data.title && !title) setTitle(data.title);
      setAiOpen(false);
      setAiTopic('');
      setAiInstructions('');
    } catch (err: any) {
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  // ── Image Handlers ───────────────────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran file maksimal adalah 2MB.');
      return;
    }
    setSelectedFile(file);
    if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setThumbnailUrl('');
  };

  const handleManualUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setThumbnailUrl(val);
    setSelectedFile(null);
    if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(val);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    setThumbnailUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    let finalThumbnailUrl = thumbnailUrl;

    if (selectedFile) {
      setUploading(true);
      try {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `articles/${fileName}`;
        const { error: uploadError } = await supabase.storage
          .from('thumbnails')
          .upload(filePath, selectedFile, { cacheControl: '3600', upsert: false });
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('thumbnails').getPublicUrl(filePath);
        finalThumbnailUrl = publicUrl;
      } catch (err: any) {
        setError(err.message || 'Gagal mengunggah gambar ke storage.');
        setUploading(false);
        setSubmitting(false);
        return;
      }
      setUploading(false);
    }

    const formData = new FormData();
    if (initialData?.id) formData.append('id', initialData.id);
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('content', content);
    formData.append('excerpt', excerpt);
    formData.append('thumbnail_url', finalThumbnailUrl);
    formData.append('status', status);

    try {
      await action(formData);
    } catch (err: any) {
      if (err.message === 'NEXT_REDIRECT' || err.digest?.startsWith('NEXT_REDIRECT')) {
        throw err;
      }
      setError(err.message || 'Terjadi kesalahan saat menyimpan artikel.');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.mainGrid}>
        {/* ── Left column: Content ── */}
        <div className={styles.leftCol}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label" htmlFor="title">Judul Artikel</label>
              <input
                id="title" type="text" className="input"
                placeholder="Masukkan judul artikel..."
                value={title} onChange={e => setTitle(e.target.value)} required
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="slug">Slug URL (Otomatis)</label>
              <input
                id="slug" type="text" className="input"
                placeholder="contoh-slug-artikel"
                value={slug} onChange={e => setSlug(e.target.value)} required
              />
            </div>

            {/* ── Editor Area ── */}
            <div className="input-group">
              {/* Toolbar: mode tabs + AI button */}
              <div className={styles.editorToolbar}>
                <div className={styles.editorTabs}>
                  <button
                    type="button"
                    className={`${styles.tabBtn} ${editorMode === 'markdown' ? styles.tabBtnActive : ''}`}
                    onClick={() => setEditorMode('markdown')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/>
                      <line x1="12" y1="4" x2="12" y2="20"/>
                    </svg>
                    Markdown
                  </button>
                  <button
                    type="button"
                    className={`${styles.tabBtn} ${editorMode === 'preview' ? styles.tabBtnActive : ''}`}
                    onClick={() => setEditorMode('preview')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                    Preview
                  </button>
                </div>

                <button
                  type="button"
                  className={`btn btn-ai btn-sm ${styles.aiBtn}`}
                  onClick={() => setAiOpen(v => !v)}
                >
                  <svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  Generate AI
                </button>
              </div>

              {/* AI Panel */}
              {aiOpen && (
                <div className={styles.aiPanel}>
                  <div className={styles.aiPanelHeader}>
                    <span className={styles.aiPanelTitle}>
                      <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      AI Article Generator
                    </span>
                    <button type="button" className="btn-icon" onClick={() => setAiOpen(false)}>
                      <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                  <div className={styles.aiPanelBody}>
                    <div className="input-group">
                      <label className="input-label">Topik Artikel *</label>
                      <input
                        type="text" className="input"
                        placeholder="cth: Tips perjalanan Cirebon-Jakarta, Kenapa sewa Hiace lebih hemat..."
                        value={aiTopic}
                        onChange={e => setAiTopic(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAiGenerate()}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Instruksi Tambahan (opsional)</label>
                      <textarea
                        className="input" rows={2}
                        placeholder="cth: Fokus ke keluarga dengan anak, gunakan tone yang santai..."
                        value={aiInstructions}
                        onChange={e => setAiInstructions(e.target.value)}
                      />
                    </div>
                    {aiError && <p className={styles.aiError}>{aiError}</p>}
                    <button
                      type="button"
                      className={`btn btn-ai ${styles.aiGenerateBtn}`}
                      onClick={handleAiGenerate}
                      disabled={aiLoading}
                    >
                      {aiLoading ? (
                        <>
                          <svg className={styles.spinner} viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.3"/>
                            <path d="M21 12a9 9 0 00-9-9"/>
                          </svg>
                          Membuat artikel...
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }}>
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                          Buat Artikel Sekarang
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Editor / Preview */}
              {editorMode === 'markdown' ? (
                <textarea
                  id="content"
                  className={`input ${styles.markdownEditor}`}
                  rows={20}
                  placeholder="Tulis konten artikel dalam format Markdown...&#10;&#10;# Judul Artikel&#10;&#10;## Sub-judul&#10;&#10;**Bold**, *italic*, - list item..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                />
              ) : (
                <div
                  className={styles.markdownPreview}
                  dangerouslySetInnerHTML={{ __html: previewHtml || '<p style="color:var(--text-muted)">Preview akan muncul di sini...</p>' }}
                />
              )}
              <p className={styles.editorHint}>
                Mode Markdown: Tulis konten dengan format <code># H1</code>, <code>**bold**</code>, <code>- list</code>. Mode Preview: Lihat hasil render.
              </p>
            </div>
          </div>
        </div>

        {/* ── Right column: Metadata & Actions ── */}
        <div className={styles.rightCol}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 className={styles.sectionTitle}>Publishing</h3>

            <div className="input-group">
              <label className="input-label" htmlFor="status">Status</label>
              <select id="status" className="input" value={status} onChange={e => setStatus(e.target.value as 'draft' | 'published')}>
                <option value="draft">Draft (Belum Tampil)</option>
                <option value="published">Published (Tampil Publik)</option>
              </select>
            </div>

            <div className="divider" style={{ margin: '4px 0' }} />
            <h3 className={styles.sectionTitle}>Metadata</h3>

            <div className="input-group">
              <label className="input-label" htmlFor="thumbnail">Gambar Cover</label>
              <div className={styles.uploadContainer}>
                <input
                  type="file" ref={fileInputRef} onChange={handleFileSelect}
                  accept="image/*" className={styles.fileInputHidden}
                />
                <button
                  type="button" className="btn btn-ghost"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={submitting}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {selectedFile ? (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {selectedFile.name.substring(0, 18)}...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      Pilih File Gambar
                    </>
                  )}
                </button>
              </div>
              <div className={styles.orText}>atau masukkan URL manual</div>
              <input
                id="thumbnail" type="url" className="input"
                placeholder="https://images.unsplash.com/..."
                value={thumbnailUrl} onChange={handleManualUrlChange}
              />
              {previewUrl && (
                <div className={styles.thumbnailPreview}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Thumbnail preview" />
                  <button type="button" className={styles.removeThumbnailBtn} onClick={handleRemoveImage} title="Hapus gambar">
                    <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="excerpt">Kutipan Singkat (Excerpt)</label>
              <textarea
                id="excerpt" className="input" rows={3}
                placeholder="Tulis rangkuman singkat artikel..."
                value={excerpt} onChange={e => setExcerpt(e.target.value)}
              />
            </div>

            {error && (
              <div className={styles.error}>
                <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit" className="btn btn-primary"
              style={{ justifyContent: 'center', marginTop: '4px' }}
              disabled={submitting || uploading}
            >
              {submitting || uploading ? (
                <>
                  <svg className={styles.spinner} viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.3"/>
                    <path d="M21 12a9 9 0 00-9-9"/>
                  </svg>
                  {uploading ? 'Mengunggah...' : 'Menyimpan...'}
                </>
              ) : 'Simpan Artikel'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
