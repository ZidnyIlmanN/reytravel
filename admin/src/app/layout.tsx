import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Reytrans Admin',
  description: 'Admin panel for managing Reytrans content',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
