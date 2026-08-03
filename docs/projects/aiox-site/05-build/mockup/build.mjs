/**
 * Gera 05-build/mockup/index.html.
 *
 * Existe por um motivo só: o bloco de resultado da §5 é renderizado a partir do
 * motor REAL (js/mapear.js, compilado de apps/talos/lib/mapear.ts). Nenhum número
 * do HTML é digitado à mão. Com JS desligado, o visitante vê um resultado que foi
 * de fato calculado — só que na hora do build, não na hora da visita.
 *
 * node build.mjs
 */
import { writeFileSync } from 'node:fs';
import { mapear } from './js/mapear.js';

/* ── copy dos 16 processos da §4 ───────────────────────────────────────────
   `p` = a linha que o visitante lê (de components/CasosDeUso.tsx, com as
   correções de língua do COPY-V2 §4)
   `d` = o texto que o botão "esse é o meu" joga no campo da §5.
   Escrito em 1ª pessoa porque é assim que o dono descreve o próprio processo,
   e porque o motor corrigido lê 1ª pessoa (MOTOR-CORRIGIDO §2/B2).
   `t` = etiqueta de categoria (COPY-V2 §4)                                   */
const RAMOS = [
  {
    id: 'comercio', nome: 'Comércio', linha: 'loja física, distribuidora, e-commerce', padrao: true,
    itens: [
      { p: 'Orçamento pedido no WhatsApp fora do horário e respondido no dia seguinte', t: 'atendimento',
        d: 'O cliente me chama no zap pedindo orçamento fora do horário. De manhã eu confiro o preço na tabela e respondo. Aí anoto o pedido na planilha.' },
      { p: 'Estoque conferido em dois sistemas que não conversam', t: 'processo interno',
        d: 'Eu confiro o estoque no sistema, depois abro a planilha pra ver se bate, e aviso o vendedor quando falta alguma coisa.' },
      { p: 'Cliente que comprou uma vez e nunca mais foi contatado', t: 'atendimento',
        d: 'Eu abro a planilha de vendas, confiro quem comprou e sumiu, e mando mensagem um por um chamando de volta.' },
      { p: 'Nota emitida manualmente a cada venda', t: 'processo interno',
        d: 'Depois que a venda fecha eu lanço a nota no sistema na mão, salvo o PDF na pasta e mando pro cliente.' },
    ],
  },
  {
    id: 'servicos', nome: 'Serviços', linha: 'clínica, escritório, consultoria',
    itens: [
      { p: 'Agendamento por telefone que ocupa a recepção o dia inteiro', t: 'atendimento',
        d: 'O cliente liga pra marcar horário, a recepção anota na agenda e depois confirma na véspera por telefone.' },
      { p: 'Confirmação de horário feita uma a uma na véspera', t: 'atendimento',
        d: 'Na véspera eu abro a agenda, confiro quem tem horário marcado e mando confirmação uma por uma no zap.' },
      { p: 'Documento montado a partir de um modelo e preenchido na mão', t: 'processo interno',
        d: 'Eu abro o modelo do contrato no Word, preencho os dados do cliente na mão e salvo na pasta dele.' },
      { p: 'Cobrança que depende de alguém olhar a planilha de vencimentos', t: 'processo interno',
        d: 'Todo dia eu olho a planilha de vencimentos, confiro quem não pagou e mando a cobrança.' },
    ],
  },
  {
    id: 'industria', nome: 'Indústria', linha: 'metalúrgica, moveleira, alimentos, plástico',
    itens: [
      { p: 'O pedido chega por WhatsApp e eu passo pro sistema na mão', t: 'processo interno',
        d: 'O pedido chega por WhatsApp e eu passo pro sistema na mão. Depois confiro se entrou certo e aviso a produção.' },
      { p: 'Ordem de produção montada à mão a partir da carteira', t: 'sistema sob medida',
        d: 'Eu olho a carteira de pedidos no sistema, monto a ordem de produção no Word e mando pro chão de fábrica.' },
      { p: 'Follow-up de entrega que depende de alguém lembrar', t: 'atendimento',
        d: 'Toda semana eu abro a planilha de entregas, confiro o que atrasou e cobro o cliente um por um.' },
      { p: 'A pessoa que sabe fazer isso é uma só — e quando ela falta, para', t: 'sistema sob medida',
        d: 'Toda segunda eu junto os apontamentos, calculo a produção do mês na planilha e mando o relatório pra diretoria.' },
    ],
  },
  {
    id: 'obra', nome: 'Projeto e obra', linha: 'construtora, arquitetura, instalação',
    itens: [
      { p: 'Medição de campo que vira planilha, que vira relatório, que vira e-mail', t: 'processo interno',
        d: 'A medição de campo chega pra mim, eu passo pra planilha, gero o relatório e mando por e-mail.' },
      { p: 'Fornecedor cotado por três canais diferentes sem histórico', t: 'sistema sob medida',
        d: 'Eu peço cotação pra três fornecedores por canais diferentes, anoto os preços na planilha e comparo.' },
      { p: 'Cronograma atualizado à mão quando algo atrasa', t: 'processo interno',
        d: 'Quando alguma etapa atrasa eu atualizo o cronograma na mão e aviso todo mundo envolvido.' },
      { p: 'Foto de obra que alguém precisa baixar, renomear e arquivar', t: 'processo interno',
        d: 'Eu baixo as fotos da obra do zap, renomeio uma por uma e arquivo na pasta do cliente.' },
    ],
  },
];

/* O exemplo do botão "usar um exemplo pronto".
   1ª pessoa (COPY-V2 §5: o placeholder ensina o formato).
   Mantém deliberadamente uma etapa que o motor NÃO lê — é o estado de honestidade
   funcionando à vista, e é o que separa este painel do chat falso da referência. */
const EXEMPLO_TALOS =
  'O cliente me chama no zap pedindo orçamento. Eu paro o que tô fazendo e respondo perguntando o que ele precisa. Depois anoto os dados na planilha. Aí confiro o preço na tabela e monto a proposta no Word. Por fim aviso o vendedor que tem proposta nova.';

const VEZES_PADRAO = 8;
const mapaSSR = mapear(EXEMPLO_TALOS, VEZES_PADRAO);

/* ── helpers ─────────────────────────────────────────────────────────────── */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/* Separador decimal brasileiro. O motor devolve Number; 17.3 lido por um dono
   de PME é "dezessete ponto três" — em pt-BR o número é 17,3. Formatação é
   camada de apresentação: o valor não muda. */
const nBR = (v) => Number(v).toLocaleString('pt-BR', { maximumFractionDigits: 3 });

/* ── glossário de saída do motor ──────────────────────────────────────────
   Os `motivo` de mapear.ts são COPY VISÍVEL e nunca passaram pelo veredito de
   vocabulário do COPY-V2 §7. Auditei os 12: três reprovam.
     · "redigitado"  → 🔴 §7.1, frequência 0 no corpus
     · "sozinho"×2   → 🔴 §7.4, no corpus significa ABANDONO, não autonomia
                        ("estou sozinho, vou embalar e enviar sozinho")
   Corrigido aqui, na camada de apresentação, porque `lib/mapear.ts` tem suíte
   de teste presa a ele e não é deste gate. Reportado em NOTAS.md §7.
   O terceiro termo achado — "automatizar isso seria terceirizar critério" —
   FICA: §7.2 permite no corpo depois de uma cena, e o COPY-V2 §11 elogia a frase. */
const MOTIVO_PTBR = {
  'mesmo dado sendo redigitado em outro lugar':
    'mesmo dado passando de um lugar pro outro na mão',
  'aviso de rotina — dispara sozinho quando o gatilho acontece':
    'aviso de rotina — dispara sem você quando o gatilho acontece',
  'marcação de horário — a agenda recebe sozinha e confirma sozinha':
    'marcação de horário — a agenda recebe e confirma sem você',
};
const motivo = (m) => MOTIVO_PTBR[m] || m;

const attr = (s) => esc(s).replace(/'/g, '&#39;');

/* Setas, checks e traços são SVG. Nunca U+2192/U+2713 como caractere:
   nem InterVariable.woff2 nem JetBrainsMono.woff2 contêm esses codepoints
   (verificado com fontTools) e o glifo cairia para a fonte do sistema. */
const SVG = {
  seta: `<svg class="ic ic-seta" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h9m0 0L8.5 4.5M12 8l-3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  setaCima: `<svg class="ic" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 13V4m0 0L4.5 7.5M8 4l3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  externo: `<svg class="ic" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 3h7v7M13 3L7 9M11 9.5V13H3V5h3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  sim: `<svg class="ic" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  nao: `<svg class="ic" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4.5 4.5l7 7m0-7l-7 7" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  meio: `<svg class="ic" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="5.25" stroke="currentColor" stroke-width="1.5"/><path d="M8 2.75A5.25 5.25 0 018 13.25z" fill="currentColor"/></svg>`,
  mais: `<svg class="ic ic-mais" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 3.5v9M3.5 8h9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
};

/* ── §5: bloco de resultado, gerado pelo motor real ──────────────────────── */
const SELO = {
  automatizavel: 'dá pra tirar da sua mão',
  parcial: 'sai pela metade',
  humana: 'fica com você',
  nao_lida: 'não li',
};

function etapaHTML(e) {
  const v = e.vereditoReal;
  const ic = v === 'automatizavel' ? SVG.sim : v === 'parcial' ? SVG.meio : v === 'humana' ? SVG.nao : SVG.nao;
  return `<li class="etapa etapa--${v}">
        <span class="etapa__marca" aria-hidden="true">${ic}</span>
        <span class="etapa__corpo">
          <span class="etapa__texto">${esc(e.texto)}</span>
          <span class="etapa__meta"><b class="lbl">${esc(SELO[v])}</b><span class="etapa__motivo">${esc(motivo(e.motivo))}</span></span>
        </span>
        <span class="etapa__min lbl">${v === 'nao_lida' ? '—' : e.minutos + ' min'}</span>
      </li>`;
}

function resultadoHTML(m, unidade = 'semana', vezes = VEZES_PADRAO) {
  const avisos = m.avisos.map((a) => `<p class="aviso"><span class="aviso__marca" aria-hidden="true">${SVG.nao}</span>${esc(a.texto)}</p>`).join('\n      ');
  const trace = m.trace.map((p) => `<li><span class="trace__op lbl">${esc(p.op)}</span><span class="trace__det">${esc(p.det ?? p.detalhe)}</span><span class="trace__ms num">${nBR(p.ms)} ms</span></li>`).join('\n        ');
  return `<ul class="etapas" id="etapas">
      ${m.etapas.map(etapaHTML).join('\n      ')}
      </ul>

      ${avisos}

      <div class="total">
        <div class="total__num">
          <span class="total__valor num" id="total-valor">${nBR(m.horasMes)}</span>
          <span class="total__suf">h por mês, de volta pra você</span>
        </div>
        <p class="total__premissa" id="total-premissa">${esc(premissaTexto(m, unidade, vezes))}</p>
        <p class="total__ponte">Quanto vale essa hora na sua empresa, você sabe melhor do que eu.</p>
      </div>

      <details class="maquina" id="maquina">
        <summary><span class="lbl">a máquina por dentro</span><span class="maquina__tempo num" id="maquina-tempo">${nBR(m.totalMs)} ms</span>${SVG.mais}</summary>
        <ul class="trace" id="trace">
        ${trace}
        </ul>
        <p class="maquina__nota">Isso rodou no seu navegador, agora. Sem rede, sem cadastro, sem chave de nada. O tempo acima é o que foi medido nesta execução — não é enfeite e não tem espera fingida.</p>
      </details>`;
}

function premissaTexto(m, unidade, vezes) {
  const somaMin = m.etapas.reduce((s, e) => s + (e.vereditoReal === 'automatizavel' ? e.minutos : e.vereditoReal === 'parcial' ? e.minutos / 2 : 0), 0);
  const fora = m.naoLidas > 0 ? ` ${m.naoLidas === 1 ? 'Uma etapa ficou' : m.naoLidas + ' etapas ficaram'} de fora da conta porque eu não li — não entro com chute.` : '';
  return `A conta: ${Math.round(somaMin)} min por vez, ${vezes}× por ${unidade}. Cada minuto é premissa minha, declarada por tipo de passo — passo pela metade conta metade.${fora} A frequência quem informou foi você.`;
}

/* ── seções ──────────────────────────────────────────────────────────────── */
const eyebrow = (t) => `<p class="eyebrow"><span class="eyebrow__risca" aria-hidden="true"></span>${esc(t)}</p>`;

const NAV = `
<header class="nav" id="topo">
  <div class="nav__in">
    <a class="marca" href="#topo" aria-label="Início">
      <span class="marca__glifo" aria-hidden="true">
        <svg viewBox="0 0 28 28" fill="none"><rect x="1" y="1" width="26" height="26" rx="7" stroke="currentColor" stroke-width="1.6"/><rect x="8.5" y="8.5" width="11" height="11" rx="2.5" stroke="currentColor" stroke-width="1.6" stroke-dasharray="3 3"/></svg>
      </span>
      <span class="marca__nome">nome provisório</span>
    </a>
    <nav class="nav__links" aria-label="Seções">
      <a href="#problema">o problema</a>
      <a href="#como">como funciona</a>
      <a href="#quem">quem faz</a>
      <a href="#comeco">por onde começa</a>
    </nav>
    <a class="btn btn--ghost nav__cta" href="#contato">falar comigo</a>
  </div>
</header>`;

const HERO = `
<section class="hero" aria-labelledby="h1">
  <div class="fx fx--glow" aria-hidden="true"></div>
  <div class="fx fx--dots fx--dots-24" aria-hidden="true"></div>
  <div class="hero__in">
    <div class="hero__txt">
      ${eyebrow('sites e máquinas que atendem quem chega')}
      <h1 class="display" id="h1">Quem responde o seu cliente<br>quando <span class="acento">você não pode?</span></h1>
      <p class="hero__sub lead">82% dos pequenos negócios vendem pelo WhatsApp <span class="fonte">(Sebrae Pulso, mar/2026, n=8.273)</span>. Eu construo a máquina que responde por você — e o lugar dela é o seu site.</p>
      <div class="hero__ctas">
        <a class="btn btn--primary" href="#prova">ver quanto tempo isso me custa ${SVG.seta}</a>
        <a class="btn btn--ghost" href="#comeco">o que está incluso</a>
      </div>
      <div class="honesto">
        <p class="honesto__frase">Sem case ainda. E eu não vou inventar um.</p>
        <p class="honesto__checks lbl"><span>roda no seu navegador</span><i aria-hidden="true"></i><span>sem cadastro</span><i aria-hidden="true"></i><span>resultado em milissegundos</span></p>
      </div>
    </div>

    <div class="hero__painel">
      <div class="painel">
        <p class="painel__cab lbl">exemplo · um processo de verdade</p>
        <ul class="painel__linhas">
          <li><span class="painel__n num">01</span><span>o cliente me chama no WhatsApp</span><b class="painel__selo lbl">dá pra tirar da sua mão</b></li>
          <li><span class="painel__n num">02</span><span>eu paro o que tô fazendo pra responder</span><b class="painel__selo lbl">dá pra tirar da sua mão</b></li>
          <li><span class="painel__n num">03</span><span>eu passo pro financeiro</span><b class="painel__selo lbl">dá pra tirar da sua mão</b></li>
        </ul>
        <p class="painel__conta"><span class="num">3 de 3</span> passos saem da sua mão</p>
        <p class="painel__pe">Mais abaixo você escreve o seu, do seu jeito, e recebe isso na hora.</p>
      </div>
    </div>
  </div>
</section>`;

const VERBOS = ['responde', 'registra', 'confere', 'calcula', 'avisa', 'lembra', 'organiza', 'cobra', 'agenda', 'emite'];
const FAIXA = `
<section class="faixa" aria-labelledby="faixa-t">
  <div class="wrap faixa__cab"><h2 class="faixa__t" id="faixa-t">o que a máquina faz</h2></div>
  <div class="marquee">
    <div class="marquee__fade marquee__fade--e" aria-hidden="true"></div>
    <div class="marquee__fade marquee__fade--d" aria-hidden="true"></div>
    <ul class="marquee__trilho">
      ${[0, 1].map((r) => VERBOS.map((v) => `<li class="marquee__item" ${r ? 'aria-hidden="true"' : ''}><span class="marquee__marca" aria-hidden="true"></span><span class="lbl">${v}</span></li>`).join('')).join('')}
    </ul>
  </div>
</section>`;

const PROBLEMA_CARDS = [
  { c: '22:14', t: 'Chega orçamento fora do horário', p: 'O cliente pede o preço à noite. Você vê às oito da manhã. Às vezes ele já fechou com outro.' },
  { c: 'de novo, hoje', t: 'A mesma pergunta, outra vez', p: 'Preço, prazo, se tem no estoque. Você já respondeu isso hoje — e vai responder de novo antes do almoço.' },
  { c: 'só você sabe', t: 'O sistema é você', p: 'A planilha está certa, o caderno está certo, o preço tá na sua cabeça. Funciona — enquanto você estiver lá.' },
];
const PROBLEMA = `
<section class="sec" id="problema" aria-labelledby="problema-t">
  <div class="wrap">
    ${eyebrow('o problema')}
    <h2 class="h-sec" id="problema-t">Você reconhece algum desses?</h2>
    <ul class="grid grid--3">
      ${PROBLEMA_CARDS.map((c) => `<li class="card card--estatico">
        <p class="carimbo lbl">${esc(c.c)}</p>
        <h3 class="card__t">${esc(c.t)}</h3>
        <p class="card__p">${esc(c.p)}</p>
      </li>`).join('\n      ')}
    </ul>
    <p class="ponte">Nenhum desses é problema de tecnologia. É trabalho que ainda depende da sua mão — e não precisa depender.</p>
  </div>
</section>`;

const CASOS = `
<section class="sec sec--surf" id="casos" aria-labelledby="casos-t">
  <div class="wrap">
    ${eyebrow('casos de uso')}
    <h2 class="h-sec" id="casos-t">Escolhe o seu ramo. Vê se reconhece.</h2>
    <p class="lead lead--sec">Nenhum destes é case de cliente — são processos que existem em quase toda empresa desse porte. Se você leu algum e pensou <i>“é exatamente isso aqui”</i>, é por aí que começa.</p>

    <div class="abas">
      ${RAMOS.map((r) => `<input type="radio" name="ramo" id="ramo-${r.id}" class="abas__radio"${r.padrao ? ' checked' : ''}>`).join('\n      ')}
      <div class="abas__barra" role="tablist" aria-label="Ramos">
        ${RAMOS.map((r) => `<label class="abas__aba" for="ramo-${r.id}"><span class="lbl">${esc(r.nome)}</span></label>`).join('\n        ')}
      </div>
      <div class="abas__paineis">
        ${RAMOS.map((r) => `<div class="abas__painel" id="painel-${r.id}">
          <p class="abas__linha lbl">${esc(r.linha)}</p>
          <ul class="grid grid--2">
            ${r.itens.map((it) => `<li class="card card--proc">
              <p class="tag lbl">${esc(it.t)}</p>
              <p class="card__p card__p--proc">${esc(it.p)}</p>
              <button class="cta-mini" type="button" data-demo="${attr(it.d)}">esse é o meu ${SVG.seta}</button>
            </li>`).join('\n            ')}
          </ul>
        </div>`).join('\n        ')}
      </div>
    </div>

    <p class="nota-sec">Não achou o seu? Escreve ele aqui embaixo com as suas palavras.</p>
  </div>
</section>`;

const DEMO = `
<section class="sec" id="prova" aria-labelledby="prova-t">
  <div class="fx fx--dots fx--dots-32" aria-hidden="true"></div>
  <div class="wrap">
    ${eyebrow('a prova')}
    <h2 class="h-sec" id="prova-t">Não vou te contar. Olha acontecendo.</h2>
    <p class="lead lead--sec">Descreve aí, com as suas palavras, um processo que se repete na sua empresa. O que aparece em seguida é o mesmo diagnóstico que eu faço no primeiro dia de um projeto — só que agora, e de graça.</p>

    <div class="demo">
      <form class="demo__form" id="demo-form" novalidate>
        <label class="demo__rot lbl" for="plano">você escreve</label>
        <textarea id="plano" name="plano" rows="5" placeholder="Ex.: o cliente me chama no zap pedindo orçamento, eu confiro o preço na tabela e mando pro vendedor...">${esc(EXEMPLO_TALOS)}</textarea>

        <div class="demo__freq">
          <label class="demo__rot lbl" for="vezes">isso acontece</label>
          <input type="number" id="vezes" name="vezes" value="${VEZES_PADRAO}" min="1" max="200" inputmode="numeric">
          <span class="demo__x lbl">vezes por</span>
          <select id="unidade" name="unidade" aria-label="unidade de frequência">
            <option value="semana" selected>semana</option>
            <option value="mes">mês</option>
          </select>
        </div>

        <div class="demo__acoes">
          <button class="btn btn--primary" type="submit">ver o meu ${SVG.seta}</button>
          <button class="btn btn--ghost" type="button" id="btn-exemplo">usar um exemplo pronto</button>
        </div>
      </form>

      <div class="demo__saida" id="demo-saida" aria-live="polite">
        ${resultadoHTML(mapaSSR)}
      </div>

      <div class="demo__pe">
        <a class="btn btn--primary" href="#contato" id="cta-mapa">quero isso rodando na minha empresa ${SVG.seta}</a>
        <p class="assinatura"><a href="#quem">quem escreveu essa máquina ${SVG.seta}</a></p>
      </div>
    </div>
  </div>
</section>`;

const PASSOS = [
  { n: '01', t: 'Eu olho a sua operação', p: 'Uma conversa e algumas perguntas. No fim dela você já sabe o que dá pra tirar da sua mão e o que não dá — mesmo que a gente não trabalhe junto.',
    art: ['o que você vai receber', 'quanto tempo leva', 'quanto custa — fechado'] , artT: 'sai daqui um documento' },
  { n: '02', t: 'Eu construo a máquina', p: 'Escopo e prazo por escrito antes de começar. Você vê funcionando antes de aprovar, e não depois.',
    art: ['você vê rodando', 'você aprova', 'só então entra no ar'], artT: 'sai daqui uma coisa funcionando' },
  { n: '03', t: 'Roda sem você e eu cuido', p: 'Manutenção mensal já está no combinado. Você recebe o que ela fez, não o que ela é.',
    art: ['o que ela fez essa semana', 'o que quebrou e foi consertado', 'o que muda no mês que vem'], artT: 'sai daqui um aviso, não um manual' },
];
const COMO = `
<section class="sec sec--surf" id="como" aria-labelledby="como-t">
  <div class="wrap">
    ${eyebrow('como funciona')}
    <h2 class="h-sec" id="como-t">Três passos. Sem mistério.</h2>
    <p class="lead lead--sec">O que você não vai ter é aquele projeto que nunca termina.</p>
    <ul class="grid grid--3">
      ${PASSOS.map((s) => `<li class="card">
        <div class="artefato" aria-hidden="true">
          <p class="artefato__cab lbl">${esc(s.artT)}</p>
          <ul class="artefato__linhas">${s.art.map((l) => `<li><span class="artefato__risca"></span>${esc(l)}</li>`).join('')}</ul>
        </div>
        <p class="passo-n num">${s.n}</p>
        <h3 class="card__t">${esc(s.t)}</h3>
        <p class="card__p">${esc(s.p)}</p>
      </li>`).join('\n      ')}
    </ul>
  </div>
</section>`;

const QUEM = `
<section class="sec" id="quem" aria-labelledby="quem-t">
  <div class="wrap quem">
    <div>
      ${eyebrow('quem faz')}
      <h2 class="h-sec" id="quem-t">Quem escreve essa máquina.</h2>
      <p class="vazio" role="note"><b>PREENCHER: nome e bio.</b> Este bloco está vazio de propósito e está à vista de propósito — <code>lib/perfil.ts</code> não foi preenchido. Chutar nome, tempo de estrada ou link seria a violação de confiança que este projeto proibiu na primeira página do contexto.</p>
      <div class="construi">
        <p class="construi__cab lbl">o que eu já construí</p>
        <ul class="construi__lista">
          <li>Um sistema que lê edital de licitação e diz se a empresa pode participar.</li>
          <li>Um livro-caixa que puxa extrato de banco e fecha o mês.</li>
        </ul>
        <p class="construi__nota">Sem nome de cliente, sem porcentagem economizada, sem “para o cliente X”. É o que o sistema faz, no presente.</p>
      </div>
      <p class="vazio vazio--sm" role="note"><b>PREENCHER: LinkedIn e GitHub.</b> Campo vazio não renderiza botão, de propósito: link para perfil vazio pontua pior que link nenhum.</p>
    </div>
    <div class="retrato" aria-hidden="true">
      <p class="lbl">PREENCHER: foto</p>
      <p class="retrato__nota">Sem foto, esta coluna não renderiza no build final e o texto ocupa a largura toda. Nunca silhueta cinza.</p>
    </div>
  </div>
</section>`;

const INCLUSO = [
  'site completo, escrito e montado do zero',
  'funciona no celular — que é onde o seu cliente está',
  'o Google acha ele',
  'formulário que chega em você de verdade, não some',
  'ligado no seu WhatsApp, que é onde a venda acontece',
  'manutenção mensal — o site não envelhece sozinho',
];
const DEPOIS = [
  'alguém que responde primeiro, 24 h por dia, e te passa só o que precisa de você',
  'fazer os seus sistemas conversarem entre si',
  'o caminho do pedido, do começo ao fim, sem passar pela sua mão',
  'sistema sob medida, quando nada de prateleira serve',
];
const COMECO = `
<section class="sec" id="comeco" aria-labelledby="comeco-t">
  <div class="wrap">
    ${eyebrow('por onde começa')}
    <h2 class="h-sec" id="comeco-t">Começa pelo seu site.</h2>
    <p class="lead lead--sec">Porque é onde o cliente entra — e a primeira coisa que consome o seu dia é atender quem chega. Resolvido isso, o resto da operação fica visível.</p>
    <div class="grid grid--2 grid--listas">
      <div class="card">
        <p class="tag lbl">o que está incluso</p>
        <ul class="lista">${INCLUSO.map((i) => `<li><span class="lista__ic" aria-hidden="true">${SVG.sim}</span>${esc(i)}</li>`).join('')}</ul>
      </div>
      <div class="card">
        <p class="tag lbl">o que vem depois</p>
        <ul class="lista lista--depois">${DEPOIS.map((i) => `<li><span class="lista__ic" aria-hidden="true">${SVG.mais}</span>${esc(i)}</li>`).join('')}</ul>
        <p class="card__nota">Nada disso é obrigatório e nada disso entra sem você pedir.</p>
      </div>
    </div>
    <div class="comeco__pe"><a class="btn btn--primary" href="#contato">quero começar por aqui ${SVG.seta}</a></div>
  </div>
</section>`;

const COLS = ['agência', 'freelancer', 'eu mesmo no Wix', 'deixar como está', 'comigo'];
const LINHAS = [
  ['quem conversou com você é quem constrói?', 'nao', 'sim', 'sim', '—', 'sim'],
  ['você sabe o que vai receber e quando, por escrito, antes de pagar?', 'meio', 'nao', '—', '—', 'sim'],
  ['já nasce ligado ao seu WhatsApp?', 'meio', 'nao', 'nao', 'nao', 'sim'],
  ['manutenção está no combinado ou é venda depois?', 'txt:venda depois', 'txt:venda depois', 'txt:é com você', '—', 'txt:no combinado'],
  ['dá pra ver funcionando antes de aprovar?', 'nao', 'meio', 'sim', '—', 'sim'],
  ['sai mais barato na entrada?', 'nao', 'sim', 'sim2', 'sim2', 'nao'],
  ['tem equipe pra tocar várias frentes ao mesmo tempo?', 'sim2', 'nao', '—', '—', 'nao'],
];
function celula(v, ultima) {
  const cls = `matriz__cel${ultima ? ' matriz__cel--eu' : ''}`;
  if (v === '—') return `<div class="${cls}"><span class="matriz__vazio lbl">não se aplica</span></div>`;
  if (v.startsWith('txt:')) return `<div class="${cls}"><span class="matriz__txt">${esc(v.slice(4))}</span></div>`;
  const map = { sim: [SVG.sim, 'sim', 'sim'], sim2: [SVG.sim, 'sim2', 'sim, bem mais'], meio: [SVG.meio, 'meio', 'às vezes'], nao: [SVG.nao, 'nao', 'não'] };
  const [ic, k, rot] = map[v];
  return `<div class="${cls}"><span class="marca-m marca-m--${k}" aria-hidden="true">${ic}</span><span class="matriz__rot lbl">${rot}</span></div>`;
}
const COMPARA = `
<section class="sec sec--surf" id="compara" aria-labelledby="compara-t">
  <div class="wrap">
    ${eyebrow('como se compara')}
    <h2 class="h-sec" id="compara-t">As suas quatro opções, escritas do jeito que elas são.</h2>
    <p class="lead lead--sec">Você não está escolhendo entre mim e ninguém. Está escolhendo entre quatro caminhos, e três deles são legítimos. Aqui está a diferença sem enfeite — inclusive onde eu perco.</p>
    <div class="matriz__rolo">
      <div class="matriz">
        <div class="matriz__cab matriz__cab--dim"><span class="lbl">a pergunta</span></div>
        ${COLS.map((c, i) => `<div class="matriz__cab${i === COLS.length - 1 ? ' matriz__cab--eu' : ''}"><span class="lbl">${esc(c)}</span></div>`).join('\n        ')}
        ${LINHAS.map((l) => `<div class="matriz__cel matriz__cel--dim">${esc(l[0])}</div>
        ${l.slice(1).map((v, i) => celula(v, i === 4)).join('\n        ')}`).join('\n        ')}
      </div>
    </div>
    <div class="compara__pe">
      <button class="btn btn--ghost" type="button" id="btn-socio">mandar isso pro meu sócio ${SVG.seta}</button>
      <p class="compara__nota">As duas últimas linhas eu perco de propósito. Coluna inteira marcada a favor é propaganda, e eu prefiro que você confie nas outras cinco.</p>
    </div>
  </div>
</section>`;

const COMPROMISSOS = [
  ['Escopo e prazo fechados.', 'Você sabe o que vai receber e quando, por escrito, antes de qualquer coisa começar. Sem “projeto em andamento” por seis meses.'],
  ['O preço não muda no meio.', 'O que a gente combinar no começo é o que você paga no fim. Se o escopo mudar, quem decide é você, antes.'],
  ['Manutenção mensal já está no combinado.', 'Não é venda separada depois. Sistema que conversa com outro sistema quebra quando um deles muda — isso é rotina, não acidente, e está previsto.'],
];
const COMBINADO = `
<section class="faixa-comp" id="combinado" aria-labelledby="comb-t">
  <div class="fx fx--glow fx--glow-topo" aria-hidden="true"></div>
  <div class="wrap">
    ${eyebrow('o que fica combinado')}
    <h2 class="h-sec" id="comb-t">Três coisas que entram por escrito antes de você pagar qualquer coisa.</h2>
    <ul class="celulas">
      ${COMPROMISSOS.map((c, i) => `<li class="celula${i === 0 ? ' celula--1' : ''}">
        <h3 class="celula__t">${esc(c[0])}</h3>
        <p class="celula__p">${esc(c[1])}</p>
      </li>`).join('\n      ')}
    </ul>
    <p class="celulas__nota">Isto é promessa minha, por escrito. Não é avaliação de terceiro e não estou pedindo que você acredite — estou dizendo o que vai estar no papel.</p>
  </div>
</section>`;

const PERGUNTAS = [
  ['Quanto tempo leva?', 'O primeiro olhar sai em dias. Um site fica pronto em semanas, não em meses. Tirar um processo da mão depende do tamanho dele — e você recebe o prazo por escrito antes de começar, não depois.'],
  ['Preciso trocar os sistemas que já uso?', 'Não. Quase nunca o problema é o sistema — é o vão entre um sistema e outro, que hoje você atravessa na mão. Se você já usa um ERP, ele fica. A máquina entra no vão.'],
  ['E se eu não souber por onde começar?', 'Não precisa chegar com o problema pronto. Me conta o que mais come o seu dia, que a primeira conversa serve exatamente pra separar o que dá pra resolver agora do que não vale a pena mexer.'],
  ['Isso vai substituir a minha equipe?', 'Não. O que sai da mão dela é responder a mesma pergunta pela vigésima vez, conferir se o pedido entrou, avisar o setor do lado. Automatizar decisão seria terceirizar critério — e critério é seu.'],
  ['Quanto custa?', 'Depende do tamanho, e eu prefiro dizer isso a colocar um número que não vale para o seu caso. O que eu garanto é o que está na seção acima: o preço é fechado antes de começar e não muda no meio.'],
  ['E se parar de funcionar depois de pronto?', 'Manutenção mensal já está no combinado, não é venda separada depois. Sistema que conversa com outro sistema quebra quando um deles muda — isso é rotina prevista, não acidente.'],
  ['Você trabalha com empresa do meu tamanho?', 'Trabalho com empresa que tem processo demais na cabeça de uma pessoa só. Isso acontece em empresa de dois e em empresa de quarenta. O tamanho muda o escopo, não o método.'],
  ['E se eu já tentei com outro e não deu certo?', 'É comum, e quase nunca a culpa é sua. As três coisas que mais quebram são: prometeram o que o produto não fazia, o preço mudou no caminho, ou sumiram na hora de instalar. É por isso que as três coisas que eu ponho por escrito antes de começar são exatamente essas.'],
];
const FAQ = `
<section class="sec sec--surf" id="faq" aria-labelledby="faq-t">
  <div class="wrap">
    ${eyebrow('perguntas')}
    <h2 class="h-sec" id="faq-t">O que costumam me perguntar antes de fechar.</h2>
    <p class="lead lead--sec">Se a sua dúvida não estiver aqui, é só mandar — respondo eu.</p>
    <div class="faq">
      ${PERGUNTAS.map((q) => `<details class="faq__item">
        <summary><span class="faq__q">${esc(q[0])}</span><span class="faq__ic" aria-hidden="true">${SVG.mais}</span></summary>
        <div class="faq__r"><p>${esc(q[1])}</p></div>
      </details>`).join('\n      ')}
    </div>
    <p class="faq__pe"><a href="#contato">minha dúvida não tá aqui ${SVG.seta}</a></p>
  </div>
</section>`;

const CONTATO = `
<section class="sec sec--cta" id="contato" aria-labelledby="contato-t">
  <div class="fx fx--glow fx--glow-centro" aria-hidden="true"></div>
  <div class="fx fx--dots fx--dots-24 fx--dots-centro" aria-hidden="true"></div>
  <div class="wrap wrap--centro">
    ${eyebrow('contato')}
    <h2 class="h-sec" id="contato-t">Me conta o que mais come o seu dia.</h2>
    <p class="lead lead--sec lead--centro">Não precisa saber o que quer construir. Descreve o que te consome tempo — o resto é comigo. Respondo eu, não um formulário.</p>

    <div class="mapa-junto" id="mapa-junto" hidden>
      <p class="mapa-junto__t">O seu mapa já vai junto.</p>
      <p class="mapa-junto__p" id="mapa-junto-resumo"></p>
      <button type="button" class="mapa-junto__editar lbl" id="mapa-editar">editar lá em cima</button>
    </div>

    <form class="form" id="form-contato" novalidate>
      <label class="demo__rot lbl" for="c-nome">seu nome</label>
      <input id="c-nome" name="nome" type="text" autocomplete="name">
      <label class="demo__rot lbl" for="c-zap">whatsapp</label>
      <input id="c-zap" name="zap" type="tel" inputmode="tel" autocomplete="tel">
      <label class="demo__rot lbl" for="c-dor">o que mais consome tempo hoje?</label>
      <textarea id="c-dor" name="dor" rows="3"></textarea>
      <button class="btn btn--primary btn--largo" type="submit">mandar pro seu WhatsApp ${SVG.seta}</button>
      <p class="form__aviso" id="form-aviso" role="status"></p>
    </form>
  </div>
</section>`;

const RODAPE = `
<footer class="rodape">
  <div class="fx fx--glow fx--glow-rodape" aria-hidden="true"></div>
  <div class="fx fx--dots fx--dots-24 fx--dots-rodape" aria-hidden="true"></div>
  <div class="wrap">
    <div class="rodape__topo">
      <span class="lbl">mockup de aprovação · não é o site</span>
      <a class="rodape__voltar lbl" href="#topo">voltar ao topo ${SVG.setaCima}</a>
    </div>
    <div class="rodape__corpo">
      <p class="rodape__frase">máquinas que atendem, registram e avisam — pra isso não depender de você.</p>
      <nav class="rodape__cols" aria-label="Rodapé">
        <div><p class="lbl">o site</p><a href="#problema">o problema</a><a href="#prova">ver rodando</a><a href="#comeco">por onde começa</a><a href="#quem">quem faz</a></div>
        <div><p class="lbl">falar</p><a href="#contato">mandar mensagem</a><span class="rodape__pend">PREENCHER: WhatsApp</span></div>
      </nav>
    </div>
    <p class="rodape__legal lbl">nome, marca e domínio provisórios · nenhum dado desta página é claim sobre o fornecedor</p>
  </div>
</footer>`;

/* ── CSS ─────────────────────────────────────────────────────────────────── */
const CSS = `
@font-face{font-family:"Inter Variable";font-style:normal;font-weight:100 900;font-display:swap;src:url(fonts/InterVariable.woff2) format("woff2")}
@font-face{font-family:"JetBrains Mono";font-style:normal;font-weight:400 800;font-display:swap;src:url(fonts/JetBrainsMono.woff2) format("woff2")}

:root{
  /* superfícies — degraus de luminosidade medidos no leanware (L 6/8/10/13/15/19),
     renderizados neutros. Convergem com ui-ux-pro-max › Dark Premium. */
  --bg:#0f0f0f; --surf:#141414; --card:#1a1a1a; --card-hover:#212121;
  --border:#262626; --border-forte:#303030;
  /* tinta — alfa resolvido por busca do mínimo que passa AA no pior fundo */
  --ink:#fafafa; --ink-2:#fafafaa8; --ink-3:#fafafa7d; --ink-4:#fafafa5c;
  /* bronze */
  --br:#E9A23B; --br-hover:#df9320; --br-2:#de9517; --on-br:#190f00;
  --br-wash:#E9A23B0d; --br-soft:#E9A23B1a; --br-ring:#E9A23B38; --br-glow:#E9A23B66;
  /* movimento — a curva que a referência usa 38 vezes, aqui como token único */
  --ease:cubic-bezier(.16,1,.3,1);
  --sans:"Inter Variable",Inter,system-ui,sans-serif;
  --mono:"JetBrains Mono","IBM Plex Mono",ui-monospace,monospace;
  --r-sm:6px; --r-btn:10px; --r-card:16px; --r-panel:20px;
  --w:1280px;
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
@media (scripting:none){html{scroll-behavior:smooth}}
body{
  background:var(--bg); color:var(--ink); font-family:var(--sans);
  /* premissa, não refinamento: sem isso o browser serve o desenho de opsz 14
     ampliado. Nunca definir peso por font-variation-settings — zera o opsz. */
  font-optical-sizing:auto;
  font-size:17px; line-height:1.65; font-weight:400;
  min-height:100dvh; overflow-x:hidden;
}
img,svg{display:block;max-width:100%}
a{color:inherit;text-decoration:none}
button,input,select,textarea{font:inherit;color:inherit;background:none;border:0}
::selection{background:var(--br);color:var(--on-br)}
:focus-visible{outline:2px solid var(--br);outline-offset:2px;border-radius:4px}
ul,ol{list-style:none}

/* tipografia — 7 níveis (escala de @erik-spiekermann, medida com fontTools) */
.display{font-size:40px;line-height:1.05;letter-spacing:-.035em;font-weight:800;text-wrap:balance}
.h-sec{font-size:32px;line-height:1.10;letter-spacing:-.025em;font-weight:800;text-wrap:balance}
.lead{font-size:18px;line-height:1.55;letter-spacing:-.01em;font-weight:500;color:var(--ink-2)}
.card__t{font-size:18px;line-height:1.30;letter-spacing:-.01em;font-weight:700;color:var(--ink)}
p,li,td{font-size:16px}
.lbl,.eyebrow,.tag,.carimbo{
  font-family:var(--mono);font-size:11px;line-height:1.45;letter-spacing:.12em;
  text-transform:uppercase;font-weight:700;
}
.num{font-family:var(--mono);font-feature-settings:"tnum" 1}
.card__p,.celula__p,.faq__r p{color:var(--ink-2);max-inline-size:62ch}
@media (min-width:641px){ p,li,td{font-size:17px} .display{font-size:48px} .h-sec{font-size:40px} }
@media (min-width:1101px){ .display{font-size:62px;line-height:1.08} .h-sec{font-size:44px} }

/* estrutura */
.wrap{max-width:var(--w);margin:0 auto;position:relative}
.wrap--estreito{max-width:880px}
.faq,.faq__pe{max-width:880px}
.wrap--centro{text-align:center;display:flex;flex-direction:column;align-items:center}
.sec{position:relative;border-top:1px solid var(--border);background:var(--bg);padding:112px 24px;scroll-margin-top:96px;overflow:hidden}
.sec--surf{background:var(--surf)}
@media (min-width:768px){.sec{padding:128px 64px}}
.eyebrow{display:inline-flex;align-items:center;gap:8px;color:var(--br);margin-bottom:24px}
.eyebrow__risca{width:14px;height:1px;background:var(--br);flex:none}
.lead--sec{margin-top:20px;max-width:62ch}
.lead--centro{max-width:52ch}
.grid{display:grid;gap:20px;margin-top:48px}
@media (min-width:768px){.grid--2{grid-template-columns:1fr 1fr}.grid--3{grid-template-columns:repeat(3,1fr)}}

/* camadas de fundo — 8 no total na página, como na referência */
.fx{position:absolute;inset:0;pointer-events:none}
.fx--dots{background-image:radial-gradient(circle,rgba(255,255,255,.04) 1px,transparent 1px)}
.fx--dots-24{background-size:24px 24px;-webkit-mask-image:linear-gradient(180deg,rgba(0,0,0,.6),transparent 80%);mask-image:linear-gradient(180deg,rgba(0,0,0,.6),transparent 80%)}
.fx--dots-32{background-size:32px 32px;background-image:radial-gradient(circle,rgba(255,255,255,.03) 1px,transparent 1px);-webkit-mask-image:radial-gradient(ellipse at 50% 30%,rgba(0,0,0,.8),transparent 75%);mask-image:radial-gradient(ellipse at 50% 30%,rgba(0,0,0,.8),transparent 75%)}
.fx--dots-centro{-webkit-mask-image:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,.7),transparent 60%);mask-image:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,.7),transparent 60%)}
.fx--dots-rodape{background-image:radial-gradient(circle,rgba(255,255,255,.035) 1px,transparent 1px);-webkit-mask-image:linear-gradient(180deg,rgba(0,0,0,.45),transparent 70%);mask-image:linear-gradient(180deg,rgba(0,0,0,.45),transparent 70%)}
.fx--glow{background-image:radial-gradient(ellipse 720px 460px at 92% -8%,rgba(233,162,59,.05),rgba(233,162,59,.02) 50%,transparent 78%)}
.fx--glow-topo{background-image:radial-gradient(circle at 50% 0%,var(--br-soft),transparent 45%);opacity:.7}
.fx--glow-centro{background-image:radial-gradient(ellipse 700px 400px at 50% 50%,var(--br-soft),transparent 65%)}
.fx--glow-rodape{background-image:radial-gradient(ellipse 1200px 360px at 50% 0%,var(--br-soft),transparent 70%);opacity:.55}

/* nav */
.nav{position:sticky;top:0;z-index:50;background:rgba(15,15,15,.72);border-bottom:1px solid var(--border);backdrop-filter:saturate(160%) blur(16px);-webkit-backdrop-filter:saturate(160%) blur(16px)}
.nav__in{max-width:var(--w);margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:12px 24px}
@media (min-width:768px){.nav__in{padding:16px 64px}}
.marca{display:inline-flex;align-items:center;gap:10px;color:var(--ink);transition:color .2s var(--ease)}
.marca:hover{color:var(--br)}
.marca__glifo{width:26px;height:26px;flex:none}
.marca__nome{font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;color:var(--ink-3)}
.nav__links{display:none;gap:28px}
.nav__links a{font-size:15px;color:var(--ink-2);transition:color .2s var(--ease)}
.nav__links a:hover{color:var(--ink)}
@media (min-width:1000px){.nav__links{display:flex}}

/* botões — geometria da referência: 48px, raio 10, padding 22 */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:48px;padding:0 22px;border-radius:var(--r-btn);font-size:15px;font-weight:700;cursor:pointer;transition:background .2s var(--ease),border-color .2s var(--ease),transform .15s var(--ease)}
.btn--primary{background:var(--br);color:var(--on-br);box-shadow:0 8px 24px -6px var(--br-glow)}
.btn--primary:hover{background:var(--br-hover)}
.btn:active{transform:scale(.98)}
.btn--ghost{border:1px solid var(--border-forte);color:var(--ink);font-weight:600}
.btn--ghost:hover{background:rgba(255,255,255,.06)}
.btn--largo{width:100%}
.ic{width:16px;height:16px;flex:none}
.btn:hover .ic-seta,.cta-mini:hover .ic-seta{transform:translateX(3px)}
.ic-seta{transition:transform .22s var(--ease)}

/* hero */
.hero{position:relative;background:var(--bg);padding:56px 20px 80px;overflow:hidden}
@media (min-width:641px){.hero{padding:80px 32px 96px}}
@media (min-width:1101px){.hero{padding:96px 64px 120px}}
.hero__in{position:relative;max-width:var(--w);margin:0 auto;display:grid;grid-template-columns:minmax(0,1fr);gap:48px;align-items:center}
@media (min-width:1101px){.hero__in{grid-template-columns:minmax(0,1fr) 560px;gap:56px}}
.hero__txt{min-width:0}
.acento{background:linear-gradient(180deg,var(--br),var(--br-2));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:var(--br)}
.hero__sub{margin-top:28px;max-width:560px}
.fonte{color:var(--ink-3);font-weight:400}
.hero__ctas{display:flex;gap:14px;margin-top:36px;flex-wrap:wrap}
@media (max-width:640px){.hero__ctas .btn{flex:1 1 auto;padding:0 16px;font-size:14px}}
.honesto{margin-top:36px;padding-left:14px;border-left:2px solid var(--br)}
.honesto__frase{font-size:15px;font-weight:600;color:var(--ink)}
.honesto__checks{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:8px;color:var(--ink-3);font-weight:600}
.honesto__checks i{width:3px;height:3px;border-radius:50%;background:var(--ink-4);display:inline-block}

/* painel do hero */
.painel{background:var(--card);border:1px solid var(--border);border-radius:var(--r-panel);padding:24px}
.painel__cab{color:var(--ink-3);font-weight:600;padding-bottom:16px;border-bottom:1px solid var(--border)}
.painel__linhas li{display:grid;grid-template-columns:auto 1fr;gap:4px 12px;align-items:baseline;padding:16px 0;border-bottom:1px solid var(--border);font-size:16px}
.painel__n{color:var(--ink-3);font-size:11px}
.painel__selo{grid-column:2;color:var(--br);font-weight:600;font-size:10px}
.painel__conta{margin-top:18px;font-size:15px;color:var(--ink-2)}
.painel__conta .num{color:var(--br);font-weight:700}
.painel__pe{margin-top:8px;font-size:14px;line-height:1.55;color:var(--ink-3)}

/* faixa de verbos */
.faixa{border-top:1px solid var(--border);background:var(--bg);padding:56px 24px 0}
@media (min-width:768px){.faixa{padding:64px 64px 0}}
.faixa__t{font-size:22px;font-weight:600;letter-spacing:-.01em;color:var(--ink-2);text-align:center}
.marquee{position:relative;margin-top:32px;overflow:hidden;border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--bg)}
.marquee__fade{position:absolute;top:0;bottom:0;width:120px;z-index:2;pointer-events:none}
.marquee__fade--e{left:0;background:linear-gradient(90deg,var(--bg),transparent)}
.marquee__fade--d{right:0;background:linear-gradient(270deg,var(--bg),transparent)}
.marquee__trilho{display:flex;align-items:center;width:max-content;animation:corre 42s linear infinite}
.marquee:hover .marquee__trilho{animation-play-state:paused}
@keyframes corre{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@media (prefers-reduced-motion:reduce){.marquee__trilho{animation:none}}
.marquee__item{display:inline-flex;align-items:center;gap:10px;padding:24px 0;margin-right:48px;color:var(--ink-3);white-space:nowrap}
.marquee__marca{width:6px;height:6px;border-radius:50%;background:var(--br);opacity:.65;flex:none}

/* cards */
.card{background:var(--card);border:1px solid var(--border);border-radius:var(--r-card);padding:24px;display:flex;flex-direction:column;gap:12px;transition:background .2s var(--ease),border-color .2s var(--ease)}
.card--proc:hover{background:var(--card-hover);border-color:var(--br-ring)}
.carimbo{color:var(--br);padding-bottom:10px;border-bottom:1px solid var(--border);align-self:flex-start}
.tag{color:var(--ink-3);font-weight:600}
.card__nota{margin-top:auto;padding-top:12px;font-size:14px;color:var(--ink-3);border-top:1px solid var(--border)}
.ponte{margin-top:48px;font-size:18px;line-height:1.55;font-weight:500;color:var(--ink);max-width:62ch}
.nota-sec{margin-top:32px;font-size:15px;color:var(--ink-3)}

/* abas (rádio + CSS: funciona sem JS) */
.abas{margin-top:48px}
.abas__radio{position:absolute;opacity:0;pointer-events:none}
.abas__barra{display:flex;gap:4px;flex-wrap:wrap;border-bottom:1px solid var(--border)}
.abas__aba{cursor:pointer;padding:12px 16px;color:var(--ink-3);border-bottom:2px solid transparent;margin-bottom:-1px;transition:color .2s var(--ease),border-color .2s var(--ease)}
.abas__aba:hover{color:var(--ink-2)}
.abas__painel{display:none;padding-top:28px}
.abas__linha{color:var(--ink-3);font-weight:600;margin-bottom:20px}
${RAMOS.map((r, i) => `#ramo-${r.id}:checked ~ .abas__barra .abas__aba:nth-of-type(${i + 1}){color:var(--ink);border-bottom-color:var(--br)}
#ramo-${r.id}:checked ~ .abas__paineis #painel-${r.id}{display:block}`).join('\n')}
.abas__radio:focus-visible ~ .abas__barra .abas__aba{outline:none}
${RAMOS.map((r, i) => `#ramo-${r.id}:focus-visible ~ .abas__barra .abas__aba:nth-of-type(${i + 1}){outline:2px solid var(--br);outline-offset:2px}`).join('\n')}
.card--proc .grid{margin-top:0}
.card__p--proc{color:var(--ink);font-size:16px}
.cta-mini{display:inline-flex;align-items:center;gap:6px;margin-top:auto;padding-top:6px;font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;color:var(--br);cursor:pointer;align-self:flex-start;line-height:1.45}

/* demo */
.demo{margin-top:48px;border:1px solid var(--border);border-radius:var(--r-panel);background:var(--surf);padding:24px}
@media (min-width:768px){.demo{padding:32px}}
.demo__rot{display:block;color:var(--ink-3);font-weight:600;margin-bottom:8px}
#plano,.form textarea,.form input{width:100%;background:var(--card);border:1px solid var(--border);border-radius:var(--r-btn);padding:14px 16px;font-size:16px;line-height:1.6;color:var(--ink);resize:vertical}
#plano::placeholder,.form ::placeholder{color:var(--ink-3)}
.demo__freq{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:20px}
.demo__freq .demo__rot{margin:0}
#vezes{width:76px;background:var(--card);border:1px solid var(--border);border-radius:var(--r-btn);padding:10px 12px;text-align:center;font-family:var(--mono);font-feature-settings:"tnum" 1}
#unidade{background:var(--card);border:1px solid var(--border);border-radius:var(--r-btn);padding:10px 12px;color:var(--ink);cursor:pointer}
.demo__x{color:var(--ink-3);font-weight:600}
.demo__acoes{display:flex;gap:12px;margin-top:24px;flex-wrap:wrap}
.demo__saida{margin-top:32px;padding-top:32px;border-top:1px solid var(--border)}
.etapas{display:flex;flex-direction:column;gap:2px}
.etapa{display:grid;grid-template-columns:28px 1fr auto;gap:14px;align-items:start;padding:16px;background:var(--card);border-left:2px solid var(--border);border-radius:0 var(--r-sm) var(--r-sm) 0}
.etapa--automatizavel{border-left-color:var(--br);background:linear-gradient(90deg,var(--br-wash),var(--card) 320px)}
.etapa--parcial{border-left-color:var(--border-forte)}
.etapa--humana{border-left-color:var(--border)}
.etapa--nao_lida{border-left:2px dashed var(--border-forte);background:transparent}
.etapa__marca{width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;border:1px solid var(--border);flex:none}
.etapa--automatizavel .etapa__marca{background:var(--br-soft);border-color:var(--br-ring);color:var(--br)}
.etapa--parcial .etapa__marca{color:var(--ink-2)}
.etapa--humana .etapa__marca{color:var(--ink-3)}
.etapa--nao_lida .etapa__marca{color:var(--ink-3);border-style:dashed}
.etapa__corpo{display:flex;flex-direction:column;gap:6px;min-width:0}
.etapa__texto{font-size:16px;color:var(--ink)}
.etapa__meta{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px}
.etapa__meta .lbl{font-size:10px;font-weight:600}
.etapa--automatizavel .etapa__meta .lbl{color:var(--br)}
.etapa--parcial .etapa__meta .lbl,.etapa--humana .etapa__meta .lbl,.etapa--nao_lida .etapa__meta .lbl{color:var(--ink-3)}
.etapa__motivo{font-size:14px;color:var(--ink-3);line-height:1.5}
.etapa__min{color:var(--ink-2);font-family:var(--mono);font-feature-settings:"tnum" 1;font-size:12px;letter-spacing:.04em;text-transform:none;white-space:nowrap}
.aviso{display:flex;gap:10px;align-items:flex-start;margin-top:16px;padding:14px 16px;border:1px dashed var(--border-forte);border-radius:var(--r-sm);font-size:15px;color:var(--ink-2)}
.aviso__marca{color:var(--ink-3);flex:none;margin-top:2px}
.total{margin-top:32px;padding-top:24px;border-top:1px solid var(--border)}
.total__num{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
.total__valor{font-family:var(--sans);font-feature-settings:"tnum" 1;font-size:44px;font-weight:800;letter-spacing:-.03em;line-height:1;color:var(--br)}
.total__suf{font-size:20px;font-weight:500;color:var(--ink-3)}
.total__premissa{margin-top:14px;font-size:14px;line-height:1.6;color:var(--ink-3);max-width:70ch}
.total__ponte{margin-top:14px;font-size:18px;font-weight:500;color:var(--ink);max-width:52ch}
.maquina{margin-top:24px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--bg)}
.maquina summary{cursor:pointer;list-style:none;display:flex;align-items:center;gap:12px;padding:14px 16px;color:var(--ink-3)}
.maquina summary::-webkit-details-marker{display:none}
.maquina__tempo{margin-left:auto;color:var(--br);font-size:12px;letter-spacing:.04em}
.maquina .ic-mais{color:var(--ink-3);transition:transform .2s var(--ease)}
.maquina[open] .ic-mais{transform:rotate(45deg)}
.trace{padding:0 16px 8px}
.trace li{display:grid;grid-template-columns:110px 1fr auto;gap:12px;padding:8px 0;border-top:1px solid var(--border);align-items:baseline}
.trace__op{color:var(--ink-3);font-weight:600;font-size:10px}
.trace__det{font-size:14px;color:var(--ink-2)}
.trace__ms{color:var(--ink-3);font-size:12px;letter-spacing:.04em}
.maquina__nota{padding:8px 16px 16px;font-size:14px;line-height:1.55;color:var(--ink-3);max-width:70ch}
.demo__pe{margin-top:32px;display:flex;flex-direction:column;gap:14px;align-items:flex-start}
.assinatura a{font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;color:var(--ink-3);display:inline-flex;align-items:center;gap:6px;line-height:1.45}
.assinatura a:hover{color:var(--br)}

/* como funciona — artefato no lugar de fotografia */
.artefato{border:1px solid var(--border);border-radius:var(--r-card);background:var(--bg);padding:18px;aspect-ratio:3/2;display:flex;flex-direction:column;gap:12px;justify-content:center}
.artefato__cab{color:var(--ink-3);font-weight:600;font-size:10px}
.artefato__linhas li{display:flex;align-items:center;gap:10px;font-size:14px;color:var(--ink-2);padding:5px 0}
.artefato__risca{width:22px;height:2px;background:var(--br);opacity:.55;flex:none;border-radius:1px}
.passo-n{color:var(--br);font-size:11px;letter-spacing:.12em;font-weight:700;margin-top:4px}

/* quem faz */
.quem{display:grid;grid-template-columns:minmax(0,1fr);gap:40px}
@media (min-width:900px){.quem{grid-template-columns:minmax(0,1fr) 380px;gap:56px}}
.vazio{border:1px dashed var(--br-ring);border-radius:var(--r-sm);background:var(--br-wash);padding:16px 18px;margin-top:24px;font-size:15px;line-height:1.6;color:var(--ink-2);max-width:62ch}
.vazio b{color:var(--br);font-family:var(--mono);font-size:12px;letter-spacing:.06em}
.vazio code{font-family:var(--mono);font-size:13px;color:var(--ink-3)}
.vazio--sm{font-size:14px}
.construi{margin-top:32px;border-left:1px solid var(--border);padding-left:18px}
.construi__cab{color:var(--ink-3);font-weight:600;margin-bottom:12px}
.construi__lista li{font-size:15px;color:var(--ink-2);padding:6px 0}
.construi__nota{margin-top:10px;font-size:14px;color:var(--ink-3)}
.retrato{border:1px dashed var(--border-forte);border-radius:var(--r-card);aspect-ratio:4/5;display:flex;flex-direction:column;justify-content:center;gap:10px;padding:24px;text-align:center;color:var(--ink-3)}
.retrato__nota{font-size:14px;line-height:1.5}

/* por onde começa */
.grid--listas{align-items:start}
.lista li{display:flex;gap:12px;align-items:flex-start;padding:10px 0;font-size:16px;color:var(--ink-2);border-top:1px solid var(--border)}
.lista li:first-child{border-top:0}
.lista__ic{color:var(--br);flex:none;margin-top:3px}
.lista--depois .lista__ic{color:var(--ink-3)}
.comeco__pe{margin-top:32px}

/* matriz */
.matriz__rolo{margin-top:48px;overflow-x:auto;border:1px solid var(--border);border-radius:var(--r-panel);background:var(--surf);scrollbar-width:thin}
.matriz{display:grid;grid-template-columns:minmax(230px,1.6fr) repeat(5,minmax(140px,1fr));min-width:900px}
.matriz__cab{padding:18px 14px;background:var(--card);border-bottom:1px solid var(--border);border-left:1px solid var(--border);color:var(--ink-2)}
.matriz__cab--dim{border-left:0;position:sticky;left:0;z-index:1;color:var(--ink-3);font-weight:600}
.matriz__cab--eu{color:var(--br)}
.matriz__cel{padding:16px 14px;border-top:1px solid var(--border);border-left:1px solid var(--border);display:flex;flex-direction:column;gap:6px;justify-content:center;font-size:15px;color:var(--ink-2)}
.matriz__cel--dim{border-left:0;position:sticky;left:0;z-index:1;background:var(--surf);color:var(--ink);font-weight:500}
.matriz__cel--eu{background:var(--br-wash);border-left:2px solid var(--br-ring)}
.marca-m{width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;border:1px solid var(--border)}
.marca-m--sim,.marca-m--sim2{background:var(--br-soft);border-color:var(--br-ring);color:var(--br)}
.marca-m--meio{color:var(--ink-2)}
.marca-m--nao{background:var(--border);color:var(--ink-3)}
.matriz__rot{color:var(--ink-3);font-weight:600;font-size:10px}
.matriz__txt{font-size:15px}
.matriz__vazio{color:var(--ink-3);font-weight:600;font-size:10px}
.compara__pe{margin-top:24px;display:flex;flex-direction:column;gap:12px;align-items:flex-start}
.compara__nota{font-size:14px;color:var(--ink-3);max-width:62ch}

/* compromissos */
.faixa-comp{position:relative;border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--bg);padding:96px 24px;overflow:hidden;scroll-margin-top:96px}
@media (min-width:768px){.faixa-comp{padding:96px 64px}}
.celulas{margin-top:48px;display:grid;grid-template-columns:minmax(0,1fr);border:1px solid var(--border);border-radius:var(--r-panel);background:var(--surf);overflow:hidden}
@media (min-width:900px){.celulas{grid-template-columns:repeat(3,1fr)}}
.celula{padding:28px;border-top:1px solid var(--border);position:relative}
@media (min-width:900px){.celula{border-top:0;border-left:1px solid var(--border)}.celula--1{border-left:0}}
.celula--1::before{content:"";position:absolute;left:0;top:24px;bottom:24px;width:2px;background:var(--br)}
.celula__t{font-size:18px;font-weight:700;letter-spacing:-.01em;line-height:1.3;margin-bottom:10px}
.celulas__nota{margin-top:20px;font-size:14px;color:var(--ink-3);max-width:62ch}

/* faq */
.faq{margin-top:48px;display:flex;flex-direction:column;gap:10px}
.faq__item{border:1px solid var(--border);background:var(--card);border-radius:14px;transition:border-color .2s var(--ease),background .2s var(--ease)}
.faq__item:hover{border-color:var(--border-forte);background:var(--card-hover)}
.faq__item[open]{border-color:var(--br-ring)}
.faq__item summary{list-style:none;cursor:pointer;display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:22px 24px}
.faq__item summary::-webkit-details-marker{display:none}
.faq__q{font-size:17px;font-weight:600;line-height:1.45;color:var(--ink)}
.faq__ic{width:22px;height:22px;flex:none;display:inline-flex;align-items:center;justify-content:center;border-radius:var(--r-sm);border:1px solid var(--border);color:var(--ink-2);transition:transform .2s var(--ease),color .2s var(--ease)}
.faq__item[open] .faq__ic{transform:rotate(45deg);color:var(--br);border-color:var(--br-ring)}
.faq__r{padding:0 24px 24px}
.faq__pe{margin-top:24px}
.faq__pe a{font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;color:var(--br);display:inline-flex;align-items:center;gap:6px;line-height:1.45}

/* contato */
.sec--cta{padding-bottom:140px}
.form{margin-top:36px;width:100%;max-width:560px;text-align:left;display:flex;flex-direction:column;gap:6px}
.form .demo__rot{margin-top:14px}
.form__aviso{margin-top:12px;font-size:14px;color:var(--ink-2);border-left:2px solid var(--border-forte);padding-left:12px;min-height:1px}
.mapa-junto{margin-top:28px;width:100%;max-width:560px;text-align:left;border:1px solid var(--border);border-left:2px solid var(--br);border-radius:var(--r-sm);background:var(--surf);padding:16px 18px}
.mapa-junto__t{font-size:16px;font-weight:700}
.mapa-junto__p{margin-top:6px;font-size:14px;color:var(--ink-2);font-family:var(--mono);line-height:1.6}
.mapa-junto__editar{margin-top:10px;color:var(--ink-3);cursor:pointer;text-decoration:underline;text-underline-offset:3px}

/* rodapé */
.rodape{position:relative;border-top:1px solid var(--border);background:var(--bg);padding:0 24px 28px;overflow:hidden;isolation:isolate}
@media (min-width:768px){.rodape{padding:0 64px 28px}}
.rodape__topo{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 0;color:var(--ink-3)}
.rodape__voltar{display:inline-flex;align-items:center;gap:6px;color:var(--ink-3);transition:color .2s var(--ease)}
.rodape__voltar:hover{color:var(--br)}
.rodape__corpo{display:grid;grid-template-columns:minmax(0,1fr);gap:40px;padding:48px 0 36px;border-top:1px solid var(--border)}
@media (min-width:900px){.rodape__corpo{grid-template-columns:minmax(0,1.05fr) minmax(0,1fr)}}
.rodape__frase{font-size:18px;font-weight:500;line-height:1.5;max-width:34ch}
.rodape__cols{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.rodape__cols .lbl{color:var(--ink-3);font-weight:600;margin-bottom:12px}
.rodape__cols a,.rodape__pend{display:block;font-size:15px;color:var(--ink-2);padding:5px 0;transition:color .2s var(--ease)}
.rodape__cols a:hover{color:var(--ink)}
.rodape__pend{color:var(--br);font-family:var(--mono);font-size:12px;letter-spacing:.06em}
.rodape__legal{padding-top:20px;border-top:1px solid var(--border);color:var(--ink-3);font-weight:600}
`;

/* ── JS de página ────────────────────────────────────────────────────────── */
const JS = `
import { mapear } from './js/mapear.js';

const $ = (s, r = document) => r.querySelector(s);
const SELO = ${JSON.stringify(SELO)};
const IC = ${JSON.stringify({ sim: SVG.sim, meio: SVG.meio, nao: SVG.nao })};
const esc = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const nBR = (v) => Number(v).toLocaleString('pt-BR', { maximumFractionDigits: 3 });
// mesmo glossário do build — ver comentário em MOTIVO_PTBR acima
const MOTIVO_PTBR = ${JSON.stringify(MOTIVO_PTBR)};
const motivo = (m) => MOTIVO_PTBR[m] || m;

let ultimoMapa = null;

function pintar(m, unidade, vezes) {
  const ic = (v) => v === 'automatizavel' ? IC.sim : v === 'parcial' ? IC.meio : IC.nao;
  const etapas = m.etapas.map((e) => \`<li class="etapa etapa--\${e.vereditoReal}">
    <span class="etapa__marca" aria-hidden="true">\${ic(e.vereditoReal)}</span>
    <span class="etapa__corpo"><span class="etapa__texto">\${esc(e.texto)}</span>
    <span class="etapa__meta"><b class="lbl">\${SELO[e.vereditoReal]}</b><span class="etapa__motivo">\${esc(motivo(e.motivo))}</span></span></span>
    <span class="etapa__min lbl">\${e.vereditoReal === 'nao_lida' ? '—' : e.minutos + ' min'}</span></li>\`).join('');

  const avisos = m.avisos.map((a) => \`<p class="aviso"><span class="aviso__marca" aria-hidden="true">\${IC.nao}</span>\${esc(a.texto)}</p>\`).join('');

  const somaMin = m.etapas.reduce((s, e) => s + (e.vereditoReal === 'automatizavel' ? e.minutos : e.vereditoReal === 'parcial' ? e.minutos / 2 : 0), 0);
  const fora = m.naoLidas > 0 ? \` \${m.naoLidas === 1 ? 'Uma etapa ficou' : m.naoLidas + ' etapas ficaram'} de fora da conta porque eu não li — não entro com chute.\` : '';
  const premissa = \`A conta: \${Math.round(somaMin)} min por vez, \${vezes}× por \${unidade}. Cada minuto é premissa minha, declarada por tipo de passo — passo pela metade conta metade.\${fora} A frequência quem informou foi você.\`;

  // o trace do motor imprime "×/semana"; quando o visitante escolhe mês,
  // reetiquetamos SÓ o rótulo — o número por trás é vezes/4,33 e é exato.
  const trace = m.trace.map((p) => {
    const det = unidade === 'mês' ? String(p.detalhe).replace(/[\\d.,]+×\\/semana/, vezes + '×/mês') : p.detalhe;
    return \`<li><span class="trace__op lbl">\${esc(p.op)}</span><span class="trace__det">\${esc(det)}</span><span class="trace__ms num">\${nBR(p.ms)} ms</span></li>\`;
  }).join('');

  $('#demo-saida').innerHTML = \`<ul class="etapas">\${etapas}</ul>\${avisos}
    <div class="total"><div class="total__num"><span class="total__valor num">\${nBR(m.horasMes)}</span>
    <span class="total__suf">h por mês, de volta pra você</span></div>
    <p class="total__premissa">\${esc(premissa)}</p>
    <p class="total__ponte">Quanto vale essa hora na sua empresa, você sabe melhor do que eu.</p></div>
    <details class="maquina" open><summary><span class="lbl">a máquina por dentro</span>
    <span class="maquina__tempo num">\${nBR(m.totalMs)} ms</span>
    <svg class="ic ic-mais" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 3.5v9M3.5 8h9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></summary>
    <ul class="trace">\${trace}</ul>
    <p class="maquina__nota">Isso rodou no seu navegador, agora. Sem rede, sem cadastro, sem chave de nada. O tempo acima é o que foi medido nesta execução — não é enfeite e não tem espera fingida.</p></details>\`;
}

function rodar() {
  const texto = $('#plano').value.trim();
  if (!texto) return;
  const n = Math.max(1, Number($('#vezes').value) || 1);
  const mes = $('#unidade').value === 'mes';
  const porSemana = mes ? n / 4.33 : n;
  const m = mapear(texto, porSemana);
  ultimoMapa = { m, texto, n, unidade: mes ? 'mês' : 'semana' };
  pintar(m, mes ? 'mês' : 'semana', n);
  sincronizarContato();
}

function sincronizarContato() {
  const box = $('#mapa-junto');
  if (!ultimoMapa) { box.hidden = true; return; }
  const { m, n, unidade } = ultimoMapa;
  box.hidden = false;
  $('#mapa-junto-resumo').textContent =
    m.etapas.length + ' passos · ' + m.automatizaveis + ' saem da sua mão · ' +
    nBR(m.horasMes) + ' h por mês · ' + n + '× por ' + unidade +
    (m.naoLidas ? ' · ' + m.naoLidas + ' que eu não li' : '');
  const dor = $('#c-dor');
  if (dor && !dor.dataset.tocado) {
    dor.value = ultimoMapa.texto;
  }
}

$('#demo-form').addEventListener('submit', (e) => { e.preventDefault(); rodar(); });
$('#vezes').addEventListener('change', rodar);
$('#unidade').addEventListener('change', rodar);
$('#btn-exemplo').addEventListener('click', () => {
  $('#plano').value = ${JSON.stringify(EXEMPLO_TALOS)};
  rodar();
  $('#plano').scrollIntoView({ block: 'center', behavior: 'smooth' });
});
$('#c-dor').addEventListener('input', (e) => { e.target.dataset.tocado = '1'; });
$('#mapa-editar').addEventListener('click', () => {
  $('#plano').scrollIntoView({ block: 'center', behavior: 'smooth' });
  $('#plano').focus();
});

// "esse é o meu" — 16 rampas de entrada para a única prova do site
for (const b of document.querySelectorAll('[data-demo]')) {
  b.addEventListener('click', () => {
    $('#plano').value = b.dataset.demo;
    rodar();
    $('#prova').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

$('#btn-socio').addEventListener('click', async () => {
  const url = location.href.split('#')[0] + '#compara';
  try { await navigator.clipboard.writeText(url); $('#btn-socio').firstChild.textContent = 'link copiado '; }
  catch { location.hash = '#compara'; }
});

// O formulário AVISA em vez de fingir que enviou. Botão que engole lead em
// silêncio é pior que botão que não existe.
$('#form-contato').addEventListener('submit', (e) => {
  e.preventDefault();
  $('#form-aviso').textContent =
    'Este é um mockup de aprovação: não há WhatsApp configurado (lib/perfil.ts está vazio), então nada foi enviado. Prefiro avisar a fingir que mandei.';
});

// Reroda ao carregar para que o tempo exibido seja o desta máquina,
// e não o congelado no build.
rodar();
`;

/* ── documento ───────────────────────────────────────────────────────────── */
const HTML = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mockup de aprovação — site de serviços (nome provisório)</title>
<meta name="robots" content="noindex, nofollow">
<meta name="description" content="Mockup estático para aprovação seção a seção. Não é o site publicado.">
<link rel="preload" href="fonts/InterVariable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/JetBrainsMono.woff2" as="font" type="font/woff2" crossorigin>
<style>${CSS}</style>
</head>
<body>
${NAV}
<main>
${HERO}
${FAIXA}
${PROBLEMA}
${CASOS}
${DEMO}
${COMO}
${QUEM}
${COMECO}
${COMPARA}
${COMBINADO}
${FAQ}
${CONTATO}
</main>
${RODAPE}
<script type="module">${JS}</script>
</body>
</html>
`;

writeFileSync(new URL('./index.html', import.meta.url), HTML, 'utf8');

console.log('index.html escrito · ' + (HTML.length / 1024).toFixed(1) + ' KB');
console.log('§5 SSR pelo motor real: ' + mapaSSR.etapas.length + ' etapas · ' +
  mapaSSR.horasMes + ' h/mês · ' + mapaSSR.naoLidas + ' não lida(s) · ' +
  mapaSSR.totalMs + ' ms medidos no build');
