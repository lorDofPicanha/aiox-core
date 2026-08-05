'use client';

import { useEffect, useState } from 'react';
import { motion, animate, useMotionValue, useReducedMotion } from 'motion/react';
import { ArrowRight, Cpu } from 'lucide-react';
import { SectionHead } from './SectionHead';
import { mapear, EXEMPLO, ROTULO_VEREDITO, type Mapa, type Veredito } from '@/lib/mapear';

/**
 * §3 DEMO AO VIVO — a seção mais importante do site.
 *
 * O founder não tem case com número, e a regra do projeto proíbe inventar um.
 * A saída é a da pesquisa da NN/g sobre sites de serviço: o usuário quer ver o
 * trabalhador trabalhando, em TODOS os estágios — não só o resultado. Um chatbot que
 * responde mostra só o resultado. O painel da direita, expondo o critério e o tempo de
 * cada operação, é o trabalhador trabalhando. É isso que substitui o case que não existe.
 *
 * Sobre os tempos exibidos: são medidos, não encenados. Costumam dar menos de 1 ms, e
 * isso é mostrado como está. A régua de motion do projeto proíbe animação que simule
 * processamento — um spinner falso de dois segundos aqui destruiria justamente a única
 * coisa que esta seção existe para provar.
 */

/** Vírgula decimal — o site inteiro fala pt-BR, inclusive os números técnicos. */
const ms = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

const SELO: Record<Veredito, string> = {
  automatizavel: 'selo selo-auto',
  parcial: 'selo selo-parcial',
  humana: 'selo selo-humana',
};

/**
 * Contador do total de horas.
 *
 * Aqui a animação tem função e não conflita com a regra de "nada de teatro": o cálculo
 * já terminou — o que sobe na tela é a leitura de um número pronto, não um progresso
 * fingido. Um resultado de 6,9 h que aparece de estalo é lido como texto; o mesmo número
 * subindo é lido como quantidade, que é o ponto.
 */
function Contador({ valor }: { valor: number }) {
  const semMovimento = useReducedMotion();
  const mv = useMotionValue(0);
  const [texto, setTexto] = useState(() =>
    valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 }),
  );

  useEffect(() => {
    if (semMovimento) {
      setTexto(valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 }));
      return;
    }
    mv.set(0);
    const parar = mv.on('change', (v) =>
      setTexto(v.toLocaleString('pt-BR', { maximumFractionDigits: 1 })),
    );
    const controle = animate(mv, valor, { duration: 0.9, ease: [0, 0, 0.2, 1] });
    return () => {
      controle.stop();
      parar();
    };
  }, [valor, mv, semMovimento]);

  return <>{texto}</>;
}

export function Demo() {
  const [texto, setTexto] = useState('');
  const [vezes, setVezes] = useState(5);
  const [mapa, setMapa] = useState<Mapa | null>(null);

  const rodar = (t: string, v: number) => {
    if (t.trim().length < 12) return;
    setMapa(mapear(t, v));
  };

  return (
    <section id="demo">
      <div className="wrap">
        <SectionHead
          label="a prova"
          title={<>Não vou te contar. Olha acontecendo.</>}
          lead={
            <>
              {/* "do lado direito" quebra no celular, onde as colunas colapsam e o painel
                  vira o de baixo. Linguagem neutra de posição serve aos dois layouts. */}
              Descreve aí, com as suas palavras, um processo que se repete na sua empresa.
              O que aparece em seguida é o mesmo diagnóstico que eu faço no primeiro dia de
              um projeto — só que agora, e de graça.
            </>
          }
        />

        <div className="grid-demo">
          {/* ── ENTRADA ─────────────────────────────────────────────── */}
          <div className="card">
            <p className="t-micro" style={{ marginBottom: 'var(--s-4)' }}>você escreve</p>

            <textarea
              className="field"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder={'Ex.: chega um pedido no WhatsApp, alguém copia pra planilha,\ndepois avisa o financeiro...'}
              aria-label="Descreva o processo que se repete na sua empresa"
            />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--s-3)',
                marginTop: 'var(--s-4)',
                flexWrap: 'wrap',
              }}
            >
              <label className="t-body" style={{ fontSize: 14 }} htmlFor="vezes">
                acontece
              </label>
              <input
                id="vezes"
                type="number"
                min={1}
                max={200}
                value={vezes}
                onChange={(e) => setVezes(Math.min(200, Math.max(1, Number(e.target.value) || 1)))}
                className="field"
                style={{ width: 80, textAlign: 'center', padding: '9px var(--s-2)' }}
              />
              <span className="t-body" style={{ fontSize: 14 }}>vezes por semana</span>
            </div>

            <div style={{ display: 'flex', gap: 'var(--s-3)', marginTop: 'var(--s-6)', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={() => rodar(texto, vezes)}
                disabled={texto.trim().length < 12}
                style={{ opacity: texto.trim().length < 12 ? 0.45 : 1 }}
              >
                mapear <ArrowRight size={17} strokeWidth={2.2} />
              </button>

              <button
                className="btn btn-ghost"
                onClick={() => {
                  setTexto(EXEMPLO);
                  rodar(EXEMPLO, vezes);
                }}
              >
                usar um exemplo
              </button>
            </div>
          </div>

          {/* ── A MÁQUINA POR DENTRO ────────────────────────────────── */}
          <div className="card" style={{ minHeight: 280 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 'var(--s-4)',
                flexWrap: 'wrap',
                marginBottom: 'var(--s-4)',
              }}
            >
              <p className="t-micro">a máquina por dentro</p>
              {mapa && (
                <span className="t-micro" style={{ color: 'var(--bronze)' }}>
                  {ms(mapa.totalMs)} ms
                </span>
              )}
            </div>

            <div aria-live="polite">
              {!mapa ? (
                <div style={{ paddingTop: 'var(--s-6)' }}>
                  <Cpu size={22} strokeWidth={1.6} color="var(--muted)" />
                  <p className="t-body" style={{ marginTop: 'var(--s-4)', fontSize: 15 }}>
                    Aqui vai aparecer cada operação que rodar, com o tempo que levou. Sem
                    barrinha de carregamento inventada — se demorar 1 milissegundo, vai
                    dizer 1 milissegundo.
                  </p>
                </div>
              ) : (
                <ul style={{ listStyle: 'none', display: 'grid', gap: 'var(--s-1)' }}>
                  {mapa.trace.map((p, i) => (
                    <motion.li
                      key={p.op}
                      /* A operação já rodou — o que escalona aqui é a LEITURA da lista,
                         não o trabalho. 60ms por linha; o tempo exibido é o medido. */
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.06, ease: [0, 0, 0.2, 1] }}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        gap: 'var(--s-4)',
                        alignItems: 'baseline',
                        padding: 'var(--s-3) 0',
                        borderBottom: '1px solid #241b12',
                      }}
                    >
                      <span>
                        <span
                          style={{
                            fontFamily: 'var(--font-m)',
                            fontSize: 12,
                            color: 'var(--bronze)',
                            marginRight: 8,
                          }}
                        >
                          ✓
                        </span>
                        <span style={{ fontSize: 14, color: 'var(--text)' }}>{p.op}</span>
                        <span className="t-body" style={{ fontSize: 13, display: 'block', marginLeft: 20 }}>
                          {p.detalhe}
                        </span>
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-m)',
                          fontSize: 11,
                          color: 'var(--muted)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {ms(p.ms)} ms
                      </span>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {mapa && <Resultado mapa={mapa} />}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   O mapa. Fica em largura cheia abaixo do grid: espremido na coluna da direita
   ele perdia a leitura de tabela, que é o que faz o resultado parecer diagnóstico
   e não resposta de chat.
   ──────────────────────────────────────────────────────────────────────────── */
function Resultado({ mapa }: { mapa: Mapa }) {
  const naoLidas = mapa.etapas.filter((e) => e.categoria === 'indefinida').length;
  const temConta = mapa.horasMes > 0;

  return (
    <div className="tx-card rise" style={{ marginTop: 'var(--s-8)', padding: 'var(--s-8)' }}>
      {/* Resumo */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--s-12)',
          flexWrap: 'wrap',
          paddingBottom: 'var(--s-6)',
          borderBottom: '1px solid var(--rule)',
        }}
      >
        <Numero
          valor={`${mapa.automatizaveis} de ${mapa.etapas.length}`}
          rotulo="etapas que saem da mão de alguém"
        />
        {temConta && (
          <Numero
            valor={
              <>
                ≈ <Contador valor={mapa.horasMes} /> h
              </>
            }
            rotulo="por mês, de volta pra equipe"
            destaque
          />
        )}
      </div>

      {/* Etapas */}
      <ul style={{ listStyle: 'none', marginTop: 'var(--s-6)' }}>
        {mapa.etapas.map((e, i) => {
          return (
            <motion.li
              key={e.n}
              className="linha-etapa linha-topo"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.12 + i * 0.07, ease: [0, 0, 0.2, 1] }}
            >
              <span className="t-micro num" style={{ paddingTop: 2 }}>
                {String(e.n).padStart(2, '0')}
              </span>

              <span>
                <span style={{ color: 'var(--text)', fontSize: 15 }}>{e.texto}</span>
                <span className="t-body" style={{ display: 'block', fontSize: 13, marginTop: 2 }}>
                  {e.motivo}
                  {e.minutos > 0 && ` · ~${e.minutos} min por vez`}
                </span>
              </span>

              <span className={SELO[e.veredito]}>
                {e.categoria === 'indefinida' ? 'não li' : ROTULO_VEREDITO[e.veredito]}
              </span>
            </motion.li>
          );
        })}
      </ul>

      {/* A premissa fica visível junto do número. Número sem premissa é chute com fonte bonita. */}
      <p className="t-body" style={{ marginTop: 'var(--s-6)', fontSize: 13, maxWidth: '70ch' }}>
        {temConta ? (
          <>
            Conta: soma dos minutos das etapas automatizáveis (as parciais entram pela metade,
            porque alguém ainda confere), × {mapa.vezesPorSemana} vezes por semana × 4,33 semanas.
            Os minutos por etapa são estimativa minha, e estão escritos aí em cima um por um —
            se algum estiver errado para o seu caso, o número muda.
          </>
        ) : (
          <>
            Não dá para estimar horas com o que você escreveu ainda — e eu prefiro não te dar um
            número inventado. Descreve as etapas na ordem em que acontecem que o mapa fica melhor.
          </>
        )}
        {naoLidas > 0 && (
          <>
            {' '}
            {naoLidas === 1 ? 'Uma etapa eu não consegui ler' : `${naoLidas} etapas eu não consegui ler`} —
            elas ficam de fora da conta, não entram como chute.
          </>
        )}
      </p>

      <p
        className="t-body"
        style={{ marginTop: 'var(--s-4)', fontSize: 14, color: 'var(--text)' }}
      >
        Isso rodou agora, no seu navegador, em {ms(mapa.totalMs)}{' '}
        {ms(mapa.totalMs) === '1' ? 'milissegundo' : 'milissegundos'}.{' '}
        <span style={{ color: 'var(--text-2)' }}>
          Não é vídeo nem gravação — e é a versão pequena do diagnóstico. A versão grande olha
          os seus sistemas de verdade.
        </span>
      </p>

      <a href="#contato" className="btn btn-primary" style={{ marginTop: 'var(--s-6)' }}>
        quero a versão grande <ArrowRight size={17} strokeWidth={2.2} />
      </a>
    </div>
  );
}

function Numero({
  valor,
  rotulo,
  destaque,
}: {
  valor: React.ReactNode;
  rotulo: string;
  destaque?: boolean;
}) {
  return (
    <div>
      <p
        className="t-display-m"
        style={{ color: destaque ? 'var(--bronze)' : 'var(--text)' }}
      >
        {valor}
      </p>
      <p className="t-body" style={{ fontSize: 14, marginTop: 2 }}>
        {rotulo}
      </p>
    </div>
  );
}
