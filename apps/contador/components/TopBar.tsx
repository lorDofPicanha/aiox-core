export function TopBar({ title, sub }: { title: string; sub?: string }) {
  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
        {sub ? <div className="topbar-sub">{sub}</div> : null}
      </div>
      <span className="badge badge-neutral">
        <span className="badge-glyph" aria-hidden="true">
          ◇
        </span>
        Base sintética · Fase 1
      </span>
    </header>
  );
}
