"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarClock, PieChart, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Início", icon: Home },
  { href: "/vencimentos", label: "Vencimentos", icon: CalendarClock },
  { href: "/relatorios", label: "Relatórios", icon: PieChart },
  { href: "/mais", label: "Mais", icon: Menu },
] as const;

/** Barra de navegação inferior (padrão app mobile). */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-stretch">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium",
                active ? "text-accent" : "text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
