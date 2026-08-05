import { SectionHead } from './SectionHead';
import { RevealStagger } from './Reveal';

/**
 * §8 PROVA — a seção que cresce
 *
 * É aqui que site de agência quebra: grade de portfólio com um item parece abandono.
 * Esta seção precisa parecer INTENCIONAL com zero cases e não exigir redesenho com dez.
 * Por isso o estado vazio não é uma grade vazia — é outra coisa, que responde a mesma
 * pergunta ("posso confiar?") com o que existe hoje: o método.
 *
 * 🔴 REGRA RÍGIDA (Baymard): 2 a 3 sinais, NUNCA mais. 1–3 tipos convertem +23% contra
 * nenhum; 7 ou mais convertem −8% contra 1–3. Empilhar selo destrói prova.
 * Se for adicionar um quarto item aqui, tire outro.
 */

interface Case {
  cliente: string;
  segmento: string;
  oQueFoiAutomatizado: string;
  imagem: string;
}

/** Vazio hoje. Quando tiver 3+, a seção troca de forma sozinha. */
const CASES: Case[] = [];

/* Os dois sinais do estado vazio são FATOS do processo (§4), não promessa nova.
   "Não gostou, não paga" estava no wireframe como terceira opção — ficou de fora
   porque cria obrigação comercial que só o founder pode assumir. */
const GARANTIAS = [
  {
    titulo: 'Escopo e prazo fechados',
    corpo:
      'Você sabe o que vai receber e quando, por escrito, antes de qualquer coisa começar. Sem "projeto em andamento" por seis meses.',
  },
  {
    titulo: 'Você vê antes de aprovar',
    corpo:
      'A máquina roda na sua frente enquanto está sendo construída. Você aprova o que já viu funcionando, não uma descrição.',
  },
];

export function Prova() {
  return (
    <section id="prova">
      <div className="wrap">
        <SectionHead
          label="prova"
          title={CASES.length > 0 ? <>O que já está rodando.</> : <>Sem case ainda. E eu não vou inventar um.</>}
          lead={
            CASES.length > 0
              ? 'Cada um destes é um processo que antes consumia alguém e hoje não consome mais.'
              : 'Estou começando esta operação agora, e prefiro dizer isso do que encher a página de logo de empresa que nunca me contratou. O que dá pra te oferecer hoje é o método — e você acabou de ver um pedaço dele funcionando aqui em cima.'
          }
        />

        {CASES.length > 0 ? (
          <RevealStagger className="grid-3">
            {CASES.map((c) => (
              <article key={c.cliente} className="card card-hover" style={{ padding: 0, overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.imagem}
                  alt={`Projeto para ${c.cliente}`}
                  style={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ padding: 'var(--s-6)' }}>
                  <p className="t-micro" style={{ marginBottom: 'var(--s-2)' }}>{c.segmento}</p>
                  <h3 className="t-title" style={{ marginBottom: 'var(--s-3)' }}>{c.cliente}</h3>
                  <p className="t-body" style={{ fontSize: 14 }}>{c.oQueFoiAutomatizado}</p>
                </div>
              </article>
            ))}
          </RevealStagger>
        ) : (
          <RevealStagger className="grid-2" passo={0.12}>
            {GARANTIAS.map((g) => (
              <article key={g.titulo} className="card" style={{ height: '100%' }}>
                <h3 className="t-title" style={{ marginBottom: 'var(--s-3)' }}>
                  {g.titulo}
                </h3>
                <p className="t-body">{g.corpo}</p>
              </article>
            ))}
          </RevealStagger>
        )}
      </div>
    </section>
  );
}
