import { Check, ArrowUpRight } from 'lucide-react';
import { SectionHead } from './SectionHead';
import { Reveal, RevealStagger } from './Reveal';

/**
 * §5 POR ONDE COMEÇA — a porta
 *
 * Resolve a pergunta que o modelo de negócio cria: se o negócio é automação, por que a
 * primeira oferta é um site? Porque o site É o primeiro workflow — é por onde o lead entra.
 * Não é produto de entrada arbitrário; é o primeiro elo real da corrente.
 *
 * 🔴 REGRA DURA: nenhum valor nesta seção. Decisão do founder — preço só na conversa.
 * A coluna da direita existe para plantar a escada sem empurrar.
 */
const INCLUSO = [
  'site completo, escrito e montado do zero',
  'funciona no celular — que é onde o seu cliente está',
  'SEO técnico: o Google consegue ler e indexar',
  'formulário que chega em você de verdade, não some',
  'manutenção mensal — o site não envelhece sozinho',
];

const DEPOIS = [
  'agente que atende e qualifica quem chega',
  'integração com WhatsApp e com o seu CRM',
  'automação dos processos internos',
  'sistema sob medida, quando nada de prateleira serve',
];

export function PorOndeComeca() {
  return (
    <section id="comeco">
      <div className="wrap">
        <SectionHead
          label="por onde começa"
          title={<>Começa pelo seu site.</>}
          lead="Porque é onde o cliente entra — e o primeiro trabalho repetitivo de qualquer empresa é atender quem chega. Resolvido esse, o resto da operação fica visível."
        />

        <RevealStagger className="grid-2" passo={0.12}>
          <div className="card" style={{ height: '100%' }}>
            <p className="t-micro" style={{ color: 'var(--bronze)', marginBottom: 'var(--s-6)' }}>
              o que está incluso
            </p>
            <ul style={{ listStyle: 'none', display: 'grid', gap: 'var(--s-4)' }}>
              {INCLUSO.map((i) => (
                <li
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '18px 1fr',
                    gap: 'var(--s-3)',
                    alignItems: 'start',
                  }}
                >
                  <Check size={16} strokeWidth={2.4} color="var(--bronze)" style={{ marginTop: 4 }} />
                  <span style={{ color: 'var(--text)', fontSize: 15 }}>{i}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card" style={{ background: 'transparent', borderStyle: 'dashed', height: '100%' }}>
            <p className="t-micro" style={{ marginBottom: 'var(--s-6)' }}>o que vem depois</p>
            <ul style={{ listStyle: 'none', display: 'grid', gap: 'var(--s-4)' }}>
              {DEPOIS.map((i) => (
                <li
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '18px 1fr',
                    gap: 'var(--s-3)',
                    alignItems: 'start',
                  }}
                >
                  <ArrowUpRight size={16} strokeWidth={2} color="var(--muted)" style={{ marginTop: 4 }} />
                  <span className="t-body" style={{ fontSize: 15 }}>{i}</span>
                </li>
              ))}
            </ul>
            <p className="t-body" style={{ fontSize: 13, marginTop: 'var(--s-6)' }}>
              Nada disso é obrigatório e nada disso entra sem você pedir. Está aqui só para
              você saber que existe.
            </p>
          </div>
        </RevealStagger>

        <Reveal delay={0.1}>
          <a href="#contato" className="btn btn-primary" style={{ marginTop: 'var(--s-8)' }}>
            quero começar por aqui
          </a>
        </Reveal>
      </div>
    </section>
  );
}
