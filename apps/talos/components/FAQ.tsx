import { SectionHead } from './SectionHead';
import { Reveal } from './Reveal';

/**
 * § FAQ — seção nova, vinda da rodada 2 de referências.
 *
 * O Iventions tem "Experts Answers" em TODA página de serviço. É o padrão em venda
 * consultiva: o cliente já está com as objeções na cabeça, e a página que não as responde
 * empurra a dúvida para a conversa — onde ela custa mais caro e às vezes nem chega.
 *
 * Construído com <details>/<summary> nativos, de propósito: acessível por teclado,
 * indexável pelo Google, e funciona com JavaScript desligado. Um acordeão em JS aqui
 * seria trabalho a mais para entregar menos.
 *
 * 🔴 A pergunta de preço existe e é respondida sem dar preço — decisão do founder
 * (CONTEXT.md T4). Fingir que ninguém pergunta seria pior que responder "depende".
 */
const PERGUNTAS = [
  {
    q: 'Quanto tempo leva?',
    a: 'O site fica pronto em semanas, não meses — e o prazo entra por escrito antes de começar. Automação de processo depende do tamanho: o diagnóstico sai em dias, a construção varia conforme quantos sistemas precisam conversar. Você sabe o número antes de aprovar, não depois.',
  },
  {
    q: 'Preciso trocar os sistemas que já uso?',
    a: 'Não. Na maioria das vezes o problema não é o sistema, é o vão entre um sistema e outro — e é esse vão que eu fecho. Se em algum ponto trocar for mesmo melhor, eu digo, com o motivo; mas trocar ERP não é o serviço.',
  },
  {
    q: 'E se eu não souber o que automatizar?',
    a: 'É o caso mais comum, e é para isso que serve o mapa aqui em cima. Você descreve o que consome tempo, com as suas palavras, e o diagnóstico aponta o que sai da mão de alguém. Não precisa chegar com o problema formulado em linguagem técnica.',
  },
  {
    q: 'Isso vai substituir a minha equipe?',
    a: 'A intenção é tirar da sua equipe o trabalho que ninguém queria fazer — digitar duas vezes, conferir planilha, avisar o setor ao lado. O que exige julgamento continua com gente, e o mapa marca essas etapas como "fica com você" justamente porque automatizar decisão seria terceirizar critério.',
  },
  {
    q: 'Quanto custa?',
    a: 'Depende do tamanho, e eu prefiro dizer isso a colocar um número na página que não vale para o seu caso. O que dá para adiantar: o escopo é fechado antes de começar, o preço não muda no meio, e a conversa de orçamento não custa nada.',
  },
  {
    q: 'E se parar de funcionar depois de pronto?',
    a: 'Manutenção mensal faz parte do combinado desde o começo, não é venda separada depois. Sistema que integra outros sistemas quebra quando um deles muda — isso não é acidente, é rotina, e está previsto.',
  },
  {
    q: 'Você trabalha com empresa do meu tamanho?',
    a: 'Meu público é justamente quem não tem time de TI: PME e indústria pequena e média. Empresa com departamento de tecnologia próprio normalmente não precisa de mim — precisa de gente que trabalhe dentro do time que já existe.',
  },
];

export function FAQ() {
  return (
    <section id="faq">
      <div className="wrap">
        <SectionHead
          label="perguntas"
          title={<>O que costumam me perguntar antes de fechar.</>}
          lead="Se a sua dúvida não estiver aqui, é só mandar — respondo eu."
        />

        <Reveal>
          <div style={{ maxWidth: 880 }}>
            {PERGUNTAS.map(({ q, a }) => (
              <details key={q} className="faq-item">
                <summary>
                  <span className="t-title" style={{ fontSize: 19 }}>{q}</span>
                  <span className="faq-sinal" aria-hidden="true" />
                </summary>
                <p className="t-body" style={{ paddingBottom: 'var(--s-6)', maxWidth: '72ch' }}>
                  {a}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
