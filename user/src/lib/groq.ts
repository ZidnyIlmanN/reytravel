import { TravelPackage, AvailableCar, FAQ } from './supabase';

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function askGroqAI(
  userQuery: string,
  history: ChatMessage[],
  packages: TravelPackage[],
  cars: AvailableCar[],
  faqs: FAQ[]
): Promise<string> {
  if (!GROQ_API_KEY) {
    return 'Asisten AI belum dikonfigurasi. Silakan hubungi admin via WhatsApp untuk bantuan.';
  }

  const packagesCtx = packages
    .map(p => `- ${p.title}: Rp ${p.price.toLocaleString('id-ID')} (${p.duration}). Fitur: ${p.features.join(', ')}`)
    .join('\n');
  const carsCtx = cars
    .map(c => `- ${c.name} (${c.type}): ${c.capacity} penumpang, Rp ${c.price_per_day.toLocaleString('id-ID')}, ${c.is_available ? 'Tersedia' : 'Penuh'}`)
    .join('\n');
  const faqsCtx = faqs
    .map(f => `T: ${f.question}\nJ: ${f.answer}`)
    .join('\n\n');

  const systemPrompt = `Anda adalah "Reytrans AI Assistant", asisten virtual untuk agen travel & rental mobil "Reytrans" yang ramah dan profesional.

DATA PAKET WISATA:
${packagesCtx}

DATA MOBIL:
${carsCtx}

FAQ:
${faqsCtx}

KEBIJAKAN:
- Penjemputan gratis langsung sampai depan rumah (door-to-door) untuk rute operasional.
- Rute utama: Ciayumajakuning (Cirebon, Majalengka, Kuningan, Indramayu) ↔ Jabodetabek PP, Subang ↔ Jabodetabek PP, dan Jabodetabek ↔ Brebes PP.
- Sudah termasuk Sopir + BBM + Tol (non lepas kunci).
- Pembatalan gratis minimal H-3 sebelum keberangkatan via WhatsApp.
- Respon CS cepat dalam 5 menit.

Jawab dalam Bahasa Indonesia yang ramah, ringkas, dan informatif. Jangan karang harga/fitur di luar data di atas.`;

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6),
    { role: 'user', content: userQuery },
  ];

  try {
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: DEFAULT_MODEL, messages, temperature: 0.7, max_tokens: 600 }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'Maaf, coba kembali beberapa saat.';
  } catch (err) {
    console.error('Groq error:', err);
    return 'Terjadi kendala teknis. Silakan hubungi admin melalui WhatsApp.';
  }
}
