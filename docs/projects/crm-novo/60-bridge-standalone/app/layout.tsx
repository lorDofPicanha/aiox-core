import type { ReactNode } from 'react';

export const metadata = {
  title: 'CRM Bridge Standalone',
  description: 'Meta CAPI + Google Ads offline conversion bridge',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: 32, lineHeight: 1.5 }}>
        {children}
      </body>
    </html>
  );
}
