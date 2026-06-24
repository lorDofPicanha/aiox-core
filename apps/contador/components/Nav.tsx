"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Carteira", icon: "▦" },
  { href: "/captura", label: "Captura", icon: "⤓" },
  { href: "/reconhecimento", label: "Reconhecimento", icon: "◎" },
  { href: "/fila", label: "Fila do dia", icon: "≣" },
  { href: "/aprovacao", label: "Aprovação", icon: "✓" },
  { href: "/trilha", label: "Trilha", icon: "⧉" },
  { href: "/laudos", label: "Laudos", icon: "▤" },
  { href: "/recuperacao", label: "Recuperação", icon: "↩" },
  { href: "/ecac", label: "e-CAC", icon: "⊞" },
  { href: "/parcelamentos", label: "Parcelamentos", icon: "₪" },
  { href: "/emissor", label: "Emissor", icon: "✎" },
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
