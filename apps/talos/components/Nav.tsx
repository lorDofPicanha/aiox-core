import Link from 'next/link';

export function Nav() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(13,10,6,0.84)',
        backdropFilter: 'saturate(180%) blur(12px)',
        borderBottom: '1px solid var(--rule)',
      }}
    >
      <div
        className="wrap"
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--s-6)',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            color: 'var(--text)',
          }}
        >
          <TalosMark />
          <span
            style={{
              fontFamily: 'var(--font-d)',
              fontWeight: 700,
              fontSize: 19,
              letterSpacing: '-0.02em',
            }}
          >
            talos
          </span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-6)' }}>
          <a href="#problema" className="nav-link">o problema</a>
          <a href="#como" className="nav-link">como funciona</a>
          <a href="#comeco" className="nav-link">por onde começa</a>
          {/* ghost, não primary: no A/B a CTA do nav competia com a do hero */}
          <a href="#contato" className="btn btn-ghost" style={{ height: 38, padding: '0 16px', fontSize: 14 }}>
            falar comigo
          </a>
        </nav>
      </div>
    </header>
  );
}

/* Marca: anel de bronze com o ponto de varredura — o autômato que faz a ronda. */
function TalosMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="9" stroke="var(--bronze)" strokeWidth="1.5" opacity="0.45" />
      <circle cx="11" cy="11" r="4.5" stroke="var(--bronze)" strokeWidth="1.5" />
      <circle cx="11" cy="2" r="2" fill="var(--bronze)" />
    </svg>
  );
}
