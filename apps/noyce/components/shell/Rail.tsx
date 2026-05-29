import Image from "next/image";
import { TABS, type TabId } from "@/components/shell/tabs";

export interface RailBadge {
  count?: number;
  urgent?: boolean;
}

// Animated gear — echoes the ENIAC logo motif; "dá vida ao elemento visual" (pedido do cliente, 29/Mai).
function Gear({ size, reverse = false }: { size: number; reverse?: boolean }) {
  const teeth = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={`gear ${reverse ? "gear-rev" : ""}`}
      aria-hidden="true"
    >
      <g fill="currentColor">
        {teeth.map((i) => (
          <rect key={i} x="17.5" y="1.5" width="5" height="8" rx="1.2" transform={`rotate(${i * 45} 20 20)`} />
        ))}
        <circle cx="20" cy="20" r="13.5" />
      </g>
      <circle cx="20" cy="20" r="5" fill="#163022" />
    </svg>
  );
}

export function Rail({
  active,
  onSelect,
  badges,
  vaultPending,
}: {
  active: TabId;
  onSelect: (id: TabId) => void;
  badges: Partial<Record<TabId, RailBadge>>;
  vaultPending: number;
}) {
  const groups: Array<{ key: "operacao" | "config"; label: string }> = [
    { key: "operacao", label: "Operação" },
    { key: "config", label: "Config" },
  ];

  return (
    <aside className="rail" aria-label="Noyce navigation">
      <div className="brand brand-logo">
        <Image src="/eniac-logo.jpg" width={172} height={172} alt="ENIAC Construtora" className="eniac-logo" priority />
        <div className="brand-product">
          <span className="brand-gears" aria-hidden="true">
            <Gear size={22} />
            <Gear size={16} reverse />
          </span>
          <span>Buscador · Noyce</span>
        </div>
      </div>

      {groups.map((group) => (
        <nav className="nav" aria-label={group.label} key={group.key}>
          <p className="nav-group">{group.label}</p>
          {TABS.filter((tab) => tab.group === group.key).map((tab) => {
            const badge = badges[tab.id];
            return (
              <button
                className={`nav-item ${active === tab.id ? "active" : ""}`}
                key={tab.id}
                onClick={() => onSelect(tab.id)}
                title={tab.responsibility}
                type="button"
              >
                <span className="nav-label">{tab.label}</span>
                {badge && badge.count ? (
                  <span className={`nav-badge ${badge.urgent ? "urgent" : ""}`}>
                    {badge.count}
                    {badge.urgent ? "⚡" : ""}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      ))}

      <section className="access-panel" aria-labelledby="access-title">
        <p id="access-title">Acessos</p>
        <strong>{vaultPending} portais aguardam vault</strong>
        <span>PNCP público ativo. Demais fontes em dry-run até login seguro.</span>
      </section>
    </aside>
  );
}
