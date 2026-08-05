import { SectionHead } from './SectionHead';

/**
 * §4 COMO FUNCIONA — três passos
 *
 * Com portfólio vazio, *como você trabalha* vende mais que *o que você construiu*.
 * Escopo e prazo visíveis atacam o medo real do empresário: o projeto eterno que não entrega.
 * Upfront disclosure — sem revelar preço (decisão do founder: preço só na conversa).
 */
const PASSOS = [
  {
    n: '01',
    titulo: 'A gente olha a sua operação',
    itens: [
      'o que se repete toda semana',
      'quanto tempo isso consome de gente',
      'o que dá pra tirar da mão de alguém',
    ],
  },
  {
    n: '02',
    titulo: 'Eu construo a máquina',
    itens: [
      'escopo fechado antes de começar',
      'prazo definido, não “quando ficar pronto”',
      'você vê funcionando antes de aprovar',
    ],
  },
  {
    n: '03',
    titulo: 'Roda sozinho e eu cuido',
    itens: [
      'manutenção mensal, sem susto',
      'ajuste quando a operação mudar',
      'você recebe o que ela fez, não o que ela é',
    ],
  },
];

export function ComoFunciona() {
  return (
    <section id="como">
      <div className="wrap">
        <SectionHead
          label="como funciona"
          title={<>Três passos. Sem mistério.</>}
          lead="Você sabe o escopo e o prazo antes de qualquer coisa começar. O que você não vai ter é aquele projeto que nunca termina."
        />

        <div className="grid-3">
          {PASSOS.map((p) => (
            <article key={p.n} className="trilha-passo">
              {/* A trilha preenche conforme o scroll (GSAP ScrollTrigger em ScrollFX.tsx).
                  Os três passos são uma sequência no tempo — a linha faz isso ser sentido,
                  não só lido. É o caso em que a animação carrega a informação. */}
              <div className="trilha">
                <div className="trilha-fill" />
              </div>

              <span
                style={{
                  fontFamily: 'var(--font-m)',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  color: 'var(--bronze)',
                }}
              >
                {p.n}
              </span>

              <h3 className="t-title" style={{ margin: 'var(--s-3) 0 var(--s-4)' }}>
                {p.titulo}
              </h3>

              <ul style={{ listStyle: 'none', display: 'grid', gap: 'var(--s-3)' }}>
                {p.itens.map((i) => (
                  <li
                    key={i}
                    className="t-body"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '14px 1fr',
                      gap: 'var(--s-3)',
                      fontSize: 15,
                    }}
                  >
                    <span aria-hidden="true" style={{ color: 'var(--muted)' }}>·</span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
