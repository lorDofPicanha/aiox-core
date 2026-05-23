import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { IBM_Plex_Mono, Inter } from 'next/font/google';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ENIAC · Noyce',
  description: 'Mesa operacional de licitações da ENIAC para o Noyce.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const fontClassName = inter.variable + ' ' + ibmPlexMono.variable;

  return (
    <html lang='pt-BR'>
      <body className={fontClassName}>{children}</body>
    </html>
  );
}
