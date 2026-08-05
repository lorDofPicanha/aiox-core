import { MessagesSquare, Workflow, Boxes } from 'lucide-react';
import { SectionHead } from './SectionHead';
import { RevealStagger } from './Reveal';

/**
 * §6 O QUE MAIS DÁ PRA AUTOMATIZAR — a escada
 *
 * NN/g: cobertura estreita afasta cliente (a empresa de mudança que parecia só fazer
 * corporativo espantou o residencial). Por isso a amplitude existe — mas AQUI, depois do
 * reconhecimento (§2) e da prova (§3). Nunca no hero, onde viraria lista de freelancer.
 */
const DEGRAUS = [
  {
    Icone: MessagesSquare,
    titulo: 'Atendimento',
    corpo:
      'Responde na hora, entende o que a pessoa quer, pega os dados que faltam e registra. O que não for para máquina chega em você já qualificado.',
  },
  {
    Icone: Workflow,
    titulo: 'Processos internos',
    corpo:
      'O que sai de um sistema e entra em outro pela mão de alguém. Pedido, nota, estoque, cobrança — o caminho inteiro sem digitação.',
  },
  {
    Icone: Boxes,
    titulo: 'Sistema sob medida',
    corpo:
      'Quando não existe ferramenta de prateleira que sirva, e adaptar a empresa ao software sai mais caro que construir o software certo.',
  },
];

export function Escada() {
  return (
    <section id="escada">
      <div className="wrap">
        <SectionHead
          label="a escada"
          title={<>Depois que o site está no ar, o resto aparece.</>}
          lead="O site é a porta porque é onde o cliente entra. Mas o trabalho repetitivo não mora só ali — e quando o primeiro pedaço para de consumir gente, fica óbvio qual é o próximo."
        />

        <RevealStagger className="grid-3">
          {DEGRAUS.map(({ Icone, titulo, corpo }) => (
            <article key={titulo} className="card card-hover" style={{ height: '100%' }}>
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--r-lg)',
                  background: '#e9a23b12',
                  border: '1px solid var(--bronze-dim)',
                  marginBottom: 'var(--s-6)',
                }}
              >
                <Icone size={19} strokeWidth={1.8} color="var(--bronze)" />
              </span>

              <h3 className="t-title" style={{ marginBottom: 'var(--s-3)' }}>
                {titulo}
              </h3>

              <p className="t-body">{corpo}</p>
            </article>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
