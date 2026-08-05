/**
 * Cabeçalho de seção — título + régua com brilho no meio.
 * Existe para que o ritmo vertical seja idêntico em todas as seções: no A/B contra
 * o trigger.dev, o que separava as duas páginas não era cor, era regularidade de espaço.
 */
import { Reveal } from './Reveal';

export function SectionHead({
  label,
  title,
  lead,
}: {
  label?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
}) {
  return (
    <header style={{ marginBottom: 'var(--s-12)' }}>
      {label && (
        <Reveal>
          <p className="t-label" style={{ marginBottom: 'var(--s-4)' }}>{label}</p>
        </Reveal>
      )}

      {/* reveal-clip em vez de Reveal: o título sobe por dentro de uma máscara em vez de
          aparecer inteiro com fade. É a técnica-assinatura do Minh Pham (clip-path 44×) e
          a diferença é que a letra parece emergir de trás da linha, não surgir do nada. */}
      <h2 className="t-display-m reveal-clip" style={{ maxWidth: '22ch' }}>
        {title}
      </h2>

      {lead && (
        <Reveal delay={0.13}>
          <p className="t-body-l" style={{ marginTop: 'var(--s-4)', maxWidth: '62ch' }}>
            {lead}
          </p>
        </Reveal>
      )}

      <hr className="tx-rule" style={{ marginTop: 'var(--s-6)' }} />
    </header>
  );
}
