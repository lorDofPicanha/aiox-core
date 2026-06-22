import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Contador · Apuração defensável",
  description:
    "Plataforma de apuração defensável da Reforma para escritórios contábeis. A prova é a interface: indícios, evidência verificável e revisão humana com CRC.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="app">
          <aside className="sidebar">
            <div className="brand">
              <div className="brand-mark">L</div>
              <div>
                <div className="brand-name">Lastro</div>
                <div className="brand-sub">Apuração defensável</div>
              </div>
            </div>
            <Nav />
            <div className="sidebar-foot">
              Codinome de trabalho. Carimbo de tempo formal e base oficial chegam
              nas próximas fases — aqui tudo roda com dados sintéticos.
            </div>
          </aside>
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
