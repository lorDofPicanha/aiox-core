import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { monthLabel, shiftMonth } from "@/lib/dates";

/** Navegação de mês (‹ junho de 2026 ›) via query params ?y=&m=. */
export function MonthNav({ year, month }: { year: number; month: number }) {
  const prev = shiftMonth(year, month, -1);
  const next = shiftMonth(year, month, 1);

  return (
    <div className="flex items-center justify-between px-1">
      <Link
        href={{ pathname: "/", query: { y: prev.year, m: prev.month } }}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Mês anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>
      <span className="text-sm font-semibold capitalize">{monthLabel(year, month)}</span>
      <Link
        href={{ pathname: "/", query: { y: next.year, m: next.month } }}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Próximo mês"
      >
        <ChevronRight className="h-5 w-5" />
      </Link>
    </div>
  );
}
