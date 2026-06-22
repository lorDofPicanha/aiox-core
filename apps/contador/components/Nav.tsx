"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Carteira", icon: "▦" },
  { href: "/fila", label: "Fila do dia", icon: "≣" },
  { href: "/laudos", label: "Laudos", icon: "▤" },
  { href: "/trilha", label: "Trilha", icon: "⧉" },
  { href: "/aprovacao", label: "Aprovação", icon: "✓" },
  { href: "/configuracoes", label: "Configurações", icon: "⚙" },
];

export function Nav() {
  const path = usePathname();
  return (
    <nav className="nav">
      {ITEMS.map((it) => {
        const active = it.href === "/" ? path === "/" : path.startsWith(it.href);
        return (
          <Link key={it.href} href={it.href} className={active ? "active" : ""}>
            <span className="nav-icon" aria-hidden="true">
              {it.icon}
            </span>
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
