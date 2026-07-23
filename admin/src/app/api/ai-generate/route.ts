import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey.startsWith('gsk_your')) {
    return NextResponse.json(
      { error: 'GROQ_API_KEY belum dikonfigurasi di .env.local' },
      { status: 503 }
    );
  }

  const { topic, instructions } = await req.json();

  if (!topic?.trim()) {
    return NextResponse.json({ error: 'Topik artikel wajib diisi.' }, { status: 400 });
  }

  const systemPrompt = `Kamu adalah penulis konten blog profesional untuk "Reytrans", layanan travel dan rental armada premium rute Ciayumajakuning (Cirebon, Majalengka, Kuningan, Indramayu) ↔ Jabodetabek, serta layanan charter Hiace dan minibus.

Tugas kamu: Menulis artikel blog dalam Bahasa Indonesia yang menarik, informatif, dan SEO-friendly dalam format Markdown.

ATURAN FORMAT MARKDOWN:
- Mulai dengan judul H1 (# Judul Artikel)
- Gunakan H2 (##) untuk bagian utama
- Gunakan H3 (###) untuk sub-bagian jika perlu
- Gunakan **bold** untuk kata kunci penting
- Gunakan list (- atau 1.) untuk poin-poin
- Gunakan > untuk quote/tips penting
- Akhiri dengan section "## Kesimpulan" yang singkat
- Panjang artikel: 500-800 kata

PANDUAN KONTEN:
- Relevan dengan layanan travel/charter Reytrans
- Tonalitas profesional namun hangat dan personal
- Selalu sisipkan CTL/ajakan kecil untuk menghubungi Reytrans di akhir
- Jangan gunakan harga spesifik kecuali diminta
- Fokus pada manfaat, tips perjalanan, atau edukasi pembaca`;

  const userPrompt = `Buat artikel tentang: "${topic}"${
    instructions ? `\n\nInstruksi tambahan: ${instructions}` : ''
  }

Kembalikan HANYA konten Markdown lengkap, mulai dari # Judul. Jangan tambahkan penjelasan atau komentar di luar artikel.`;

  try {
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.75,
        max_tokens: 1500,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Groq API error: ${err}` }, { status: res.status });
    }

    const data = await res.json();
    const markdown = data.choices?.[0]?.message?.content || '';

    // Extract title from first H1 line
    const titleMatch = markdown.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : '';

    return NextResponse.json({ markdown, title });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Terjadi kesalahan.' }, { status: 500 });
  }
}
