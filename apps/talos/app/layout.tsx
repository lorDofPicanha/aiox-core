import type { Metadata } from 'next';
import { Inter, Inter_Tight, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Motion } from '@/components/Motion';

const inter = Inter({ subsets: ['latin'], variable: '--f-inter', display: 'swap' });
const interTight = Inter_Tight({ subsets: ['latin'], variable: '--f-inter-tight', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--f-geist-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'Talos — o trabalho repetitivo da sua empresa não precisa de gente',
  description:
    'Construo as máquinas que fazem o trabalho repetitivo da sua empresa sozinhas. Começando pelo seu site.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${interTight.variable} ${geistMono.variable}`}>
      <body>
        <Motion>{children}</Motion>
      </body>
    </html>
  );
}
