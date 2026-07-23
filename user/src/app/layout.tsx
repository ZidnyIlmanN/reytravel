import type { Metadata } from 'next';
import { Albert_Sans, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const albertSans = Albert_Sans({
  subsets: ['latin'],
  variable: '--font-albert-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Reytrans – Sewa Mobil & Paket Wisata Bromo Murah',
  description:
    'Sewa mobil premium & paket wisata Bromo Sunrise murah di Malang, Batu, Surabaya. Lengkap dengan sopir + BBM. Hubungi CS WhatsApp sekarang!',
  keywords:
    'travel bromo, sewa mobil malang, rental mobil surabaya, sewa hiace malang, tour bromo sunrise, reytrans',
  openGraph: {
    type: 'website',
    title: 'Reytrans – Sewa Mobil & Paket Wisata Bromo Murah',
    description: 'Sewa mobil premium & paket wisata Bromo Sunrise murah di Malang, Batu, Surabaya.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reytrans – Sewa Mobil & Paket Wisata Bromo Murah',
    description: 'Sewa mobil premium & paket wisata Bromo Sunrise murah di Malang, Batu, Surabaya.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${albertSans.variable} ${plusJakartaSans.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
