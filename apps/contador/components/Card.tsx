import type { ReactNode } from "react";

/** Card base (elevação contida: shadow.sm — DESIGN §7). */
export function Card({
  title,
  sub,
  children,
}: {
  title?: string;
  sub?: string;
  children: ReactNode;
}) {
  return (
    <section className="card">
      {title ? <h2 className="card-title">{title}</h2> : null}
      {sub ? <p className="card-sub">{sub}</p> : null}
      {children}
    </section>
  );
}
