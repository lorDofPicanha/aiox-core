import Link from "next/link";
import { Upload, Landmark, ChevronRight, LogOut, Layers, TrendingUp, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

const LINKS = [
  {
    href: "/assistente" as const,
    icon: Sparkles,
    title: "Assistente",
    desc: "Pergunte sobre suas finanças em linguagem natural",
  },
  {
    href: "/consolidado" as const,
    icon: Layers,
    title: "Consolidado do grupo",
    desc: "Saldo somado das empresas + por empresa",
  },
  {
    href: "/previsao" as const,
    icon: TrendingUp,
    title: "Previsão de caixa",
    desc: "Projeção do saldo pelos próximos 90 dias",
  },
  {
    href: "/importar" as const,
    icon: Upload,
    title: "Importar extrato",
    desc: "Subir OFX/CSV e lançar em lote",
  },
  {
    href: "/conexoes" as const,
    icon: Landmark,
    title: "Conexões bancárias",
    desc: "Open Finance — puxar lançamentos automaticamente",
  },
];

export default function MaisPage() {
  return (
    <main className="px-4 pb-28 pt-4">
      <header className="mb-4">
        <h1 className="text-lg font-bold">Mais</h1>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        {LINKS.map(({ href, icon: Icon, title, desc }, i) => (
          <Link
            key={href}
            href={href}
            className={cnRow(i !== LINKS.length - 1)}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{title}</span>
              <span className="block truncate text-xs text-muted-foreground">{desc}</span>
            </span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        ))}
      </div>

      <form action="/api/auth/logout" method="post" className="mt-5">
        <button
          type="submit"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface text-sm font-semibold text-expense hover:bg-muted"
        >
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </form>
    </main>
  );
}

function cnRow(border: boolean): string {
  return `flex items-center gap-3 px-4 py-3.5 active:bg-muted${border ? " border-b border-border" : ""}`;
}
