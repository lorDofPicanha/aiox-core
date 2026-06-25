import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { formatBRL } from "@/lib/money";
import type { Alert } from "@/lib/alerts";
import { cn } from "@/lib/utils";

const STYLES = {
  danger: { box: "bg-expense-soft text-expense", Icon: AlertCircle },
  warning: { box: "bg-amber-50 text-amber-700", Icon: AlertTriangle },
  info: { box: "bg-muted text-muted-foreground", Icon: Info },
} as const;

/** Faixa de alertas determinísticos no topo da home. */
export function AlertsStrip({ alerts }: { alerts: Alert[] }) {
  if (alerts.length === 0) return null;

  return (
    <div className="mb-4 space-y-2">
      {alerts.map((a, i) => {
        const { box, Icon } = STYLES[a.level];
        return (
          <div key={i} className={cn("flex items-center gap-2.5 rounded-xl px-3.5 py-2.5", box)}>
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-sm font-medium">{a.title}</span>
            {a.amount !== undefined && (
              <span className="tnum text-sm font-semibold">{formatBRL(Math.abs(a.amount))}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
