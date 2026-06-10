"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Painel" },
  { href: "/obrigacoes", label: "Obrigações (Kanban)" },
  { href: "/clientes", label: "Carteira de clientes" },
];

export function Nav() {
  const path = usePathname();
  return (
    <nav className="nav">
      {ITEMS.map((it) => {
        const active = it.href === "/" ? path === "/" : path.startsWith(it.href);
        return (
          <Link key={it.href} href={it.href} className={active ? "active" : ""}>
            <span className="nav-dot" />
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
