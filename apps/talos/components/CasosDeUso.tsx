'use client';

import { useState } from 'react';
import { Factory, Store, Stethoscope, HardHat } from 'lucide-react';
import { SectionHead } from './SectionHead';
import { Reveal } from './Reveal';

/**
 * § CASOS DE USO — seção nova, vinda da rodada 2 de referências.
 *
 * O n8n dedica seções inteiras a "casos de uso comuns" e a uma biblioteca de templates;
 * o Iventions tem página por serviço. Era a lacuna mais concreta do Talos: a §6 (a escada)
 * diz as CATEGORIAS do que dá para automatizar, mas ninguém se reconhece numa categoria.
 * O dono de metalúrgica se reconhece em "a ordem de produção que alguém redigita do
 * e-mail para o ERP".
 *
 * 🔴 Nada aqui é case. São processos que existem em qualquer empresa desse porte, escritos
 * na língua de quem os vive — não "o cliente X economizou Y%". A regra de zero número
 * inventado continua valendo (CONTEXT.md §3).
 */

const SEGMENTOS = [
  {
    id: 'industria',
    Icone: Factory,
    nome: 'Indústria',
    linha: 'metalúrgica, moveleira, alimentos, plástico',
    processos: [
      'Pedido chega por e-mail ou WhatsApp e alguém redigita no ERP',
      'Ordem de produção montada à mão a partir da carteira',
      'Follow-up de entrega que depende de alguém lembrar',
      'Relatório de produção compilado na planilha toda segunda',
    ],
  },
  {
    id: 'comercio',
    Icone: Store,
    nome: 'Comércio',
    linha: 'loja física, distribuidora, e-commerce',
    processos: [
      'Orçamento pedido no WhatsApp fora do horário e respondido no dia seguinte',
      'Estoque conferido em dois sistemas que não conversam',
      'Cliente que comprou uma vez e nunca mais foi contatado',
      'Nota emitida manualmente a cada venda',
    ],
  },
  {
    id: 'servicos',
    Icone: Stethoscope,
    nome: 'Serviços',
    linha: 'clínica, escritório, consultoria',
    processos: [
      'Agendamento por telefone que ocupa a recepção o dia inteiro',
      'Confirmação de consulta feita uma a uma na véspera',
      'Documento montado a partir de um modelo e preenchido na mão',
      'Cobrança que depende de alguém olhar a planilha de vencimentos',
    ],
  },
  {
    id: 'obra',
    Icone: HardHat,
    nome: 'Projeto e obra',
    linha: 'construtora, arquitetura, instalação',
    processos: [
      'Medição de campo que vira planilha, que vira relatório, que vira e-mail',
      'Fornecedor cotado por três canais diferentes sem histórico',
      'Cronograma atualizado à mão quando algo atrasa',
      'Foto de obra que alguém precisa baixar, renomear e arquivar',
    ],
  },
];

export function CasosDeUso() {
  const [ativo, setAtivo] = useState(SEGMENTOS[0].id);
  const atual = SEGMENTOS.find((s) => s.id === ativo) ?? SEGMENTOS[0];

  return (
    <section id="casos">
      <div className="wrap">
        <SectionHead
          label="casos de uso"
          title={<>Escolhe o seu ramo. Vê se reconhece.</>}
          lead="Nenhum destes é case de cliente — são processos que existem em quase toda empresa desse porte. Se você leu algum e pensou 'é exatamente isso aqui', é por aí que a gente começa."
        />

        <Reveal>
          <div
            role="tablist"
            aria-label="Segmentos"
            style={{ display: 'flex', gap: 'var(--s-2)', flexWrap: 'wrap', marginBottom: 'var(--s-8)' }}
          >
            {SEGMENTOS.map((s) => {
              const on = s.id === ativo;
              return (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setAtivo(s.id)}
                  className={`btn ${on ? 'btn-bronze' : 'btn-ghost'}`}
                  style={{ height: 42, padding: '0 18px', fontSize: 14 }}
                >
                  <s.Icone size={16} strokeWidth={1.9} />
                  {s.nome}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="card" style={{ padding: 'var(--s-8)' }}>
          <p className="t-micro" style={{ marginBottom: 'var(--s-6)' }}>
            {atual.nome} · {atual.linha}
          </p>

          <ul style={{ listStyle: 'none', display: 'grid', gap: 0 }}>
            {atual.processos.map((p, i) => (
              <li
                /* key é o próprio texto: ao trocar de aba o React remonta as linhas em vez
                   de reaproveitá-las, e a animação de entrada roda de novo a cada troca. */
                key={p}
                className="caso-linha"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="t-micro num">{String(i + 1).padStart(2, '0')}</span>
                <span style={{ color: 'var(--text)', fontSize: 16 }}>{p}</span>
                <span className="selo selo-auto">dá pra tirar da mão</span>
              </li>
            ))}
          </ul>

          <p className="t-body" style={{ marginTop: 'var(--s-6)', fontSize: 14, maxWidth: '64ch' }}>
            Não achou o seu? O mapa da seção anterior lê qualquer processo em texto livre —
            inclusive um que não esteja nesta lista.
          </p>
        </div>
      </div>
    </section>
  );
}
