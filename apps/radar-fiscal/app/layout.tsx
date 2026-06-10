import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Nav } from "@/components/Nav";
import { ESCRITORIO } from "@/lib/data";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Radar Fiscal · Operação do Escritório",
  description:
    "Central de obrigações, prazos e pendências do escritório contábil. Visibilidade e controle — sem cálculo fiscal.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={inter.variable}>
        <div className="app">
          <aside className="sidebar">
            <div className="brand">
              <div className="brand-mark">R</div>
              <div>
                <div className="brand-name">Radar Fiscal</div>
                <div className="brand-sub">{ESCRITORIO.nome}</div>
              </div>
            </div>
            <Nav />
          </aside>
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
