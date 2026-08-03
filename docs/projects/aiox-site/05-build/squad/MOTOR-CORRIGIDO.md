# MOTOR CORRIGIDO — P0 do `lib/mapear.ts`

**Data:** 2026-07-28 · **Escopo travado:** `apps/talos/lib/mapear.ts` + suíte. **Zero `.tsx` tocado** (gate F4).
**Origem:** `adversarial/don-norman.md` (Veredito 1, correções B1–B5) e `SINTESE.md` §1 e §3 (P0 itens 1–5).

**Verificação:** `npx tsc --noEmit` em `apps/talos` → **No errors found**.
**Suíte:** `node lib/mapear.test.mts` → **66 passaram · 0 falharam**. Saída completa no final deste documento.

---

## 0. O que estava errado, em uma frase

O motor casava **substring de radical** contra um dicionário escrito **só em 3ª pessoa**, e não tinha
nenhum estado de erro. As três coisas juntas produziam o resultado que a `SINTESE` §1 classificou como
prova contra: número errado, com marca de confirmação do lado.

Agora o casamento é **morfológico e por token**, o dicionário é gerado a partir do **infinitivo** (cobre
1ª e 3ª pessoa, passado, gerúndio e particípio), e o motor **declara o que fez mal** em `Mapa.avisos`
e no `trace`.

---

## 1. O que mudou na arquitetura

| antes | depois |
|---|---|
| `plano.indexOf(termo)` com radical solto | tokenização + índice `Map<forma, regra>`; fronteira de palavra é consequência, não regex |
| termos escritos à mão em 3ª pessoa (`confer`, `manda pro`) | termos no **infinitivo**; `conjugar()` gera o paradigma (ar/er/ir + alternância e→i, o→u da 1ª pessoa em -ir) |
| 1 espécie de termo (string) | 3 espécies: `verbo` · `palavra` (substantivo, com plural) · `frase` (literal multi-palavra) |
| sem qualificador | `exige` / `veto` por objeto, dentro de uma **janela de 4 tokens** — é o que separa "monta a proposta" de "monta a estrutura" |
| desempate só por posição | peso (qualificado 3 > simples 1), depois posição, depois ordem da regra |
| separador: quebra de linha, ponto, marcador, 16 conectores | idem **+ vírgula e "e"**, mas só quando há **verbo dos dois lados** |
| `slice(0, 12)` silencioso | `etapasDetectadas` + aviso de truncamento no `trace` |
| nenhum estado de erro | `Mapa.avisos: Aviso[]` (`subsegmentacao` · `truncamento` · `nao_lidas`) |
| `indefinida` usava `veredito: 'parcial'` | `Etapa.vereditoReal: 'nao_lida'` + contador `Mapa.naoLidas` |

**Categorias novas** (duas), porque três dos cinco "não li" e dois dos quatro "mundo físico" eram a mesma
lacuna de vocabulário:

- `documento` — automatizável, **10 min** — *"documento montado a partir de dado que já existe — modelo mais dados"*
- `agendamento` — automatizável, **6 min** — *"marcação de horário — a agenda recebe sozinha e confirma sozinha"*

🔴 **Esses dois números são premissa minha e precisam do founder.** Ele já fez esse diagnóstico
dezenas de vezes ao vivo (é a pergunta 1 da `SINTESE` §4); os 10 e os 6 minutos são chute informado, e
a régua do projeto manda a premissa aparecer junto do número — ela aparece, mas quem a assina hoje sou eu.

**Custo:** `0,118 ms` antes → `0,119 ms` depois (média de 200 execuções do `EXEMPLO`, mesma máquina).
O índice em `Map` pagou o preço da morfologia. A regra 2 (sem teatro) continua de pé: o `trace` segue
carregando tempo medido.

---

## 2. Antes/depois medido, caso a caso

Medição por execução simultânea dos dois motores — a versão anterior foi reconstruída fiel em
`scratchpad/mapear-antes.mts` e as duas rodaram contra as mesmas entradas. Nada aqui é estimado.

### B1 · radical solto casando dentro de outra palavra

| entrada | ANTES | DEPOIS |
|---|---|---|
| geralmente faço isso | `calculo · 12 min` | `não li · 0 min` |
| sobra material no fim | `presencial · 0 min` | `não li · 0 min` |
| a balança pesa a carga | `transcricao · 6 min` | `não li · 0 min` |
| preciso da informação certa | `notificacao · 3 min` | `não li · 0 min` |

Contraprova (o radical certo continua casando): `o sistema gera o boleto` → cálculo ·
`visita a obra do cliente` → presencial · `lança a nota no sistema` → transcrição ·
`informa o financeiro` → notificação.

### B2 · 1ª vs 3ª pessoa — 16 pares mínimos

| par | ANTES (1ª / 3ª) | DEPOIS (1ª / 3ª) |
|---|---|---|
| eu confiro / ele confere a nota | **não li** / consulta 4 min | consulta 4 min / consulta 4 min |
| eu mando / ele manda pro contador | **não li** / notificação 3 min | notificação 3 / notificação 3 |
| eu fecho / ele fecha o mês | **não li** / cálculo 12 min | cálculo 12 / cálculo 12 |
| eu busco / ele busca no sistema | **não li** / consulta 4 min | consulta 4 / consulta 4 |
| eu salvo / ele salva no drive | **não li** / arquivamento 3 min | arquivamento 3 / arquivamento 3 |
| eu organizo / ele organiza as fotos | **não li** / arquivamento 3 min | arquivamento 3 / arquivamento 3 |
| eu apuro / ele apura o resultado | **não li** / cálculo 12 min | cálculo 12 / cálculo 12 |
| eu faço / ele faz a proposta | **não li** / resposta 8 min | resposta 8 / resposta 8 |
| eu emito / ele emite a nota | **não li** / **não li** | documento 10 / documento 10 |
| eu copio / ele copia pra planilha | transcrição 6 / transcrição 6 | idem |
| eu respondo / ele responde o cliente | resposta 8 / resposta 8 | idem |
| eu aviso / ele avisa o financeiro | notificação 3 / notificação 3 | idem |
| eu lanço / ele lança no sistema | transcrição 6 / transcrição 6 | idem |
| eu digito / ele digita no ERP | transcrição 6 / transcrição 6 | idem |
| eu aprovo / ele aprova o desconto | decisão 5 / decisão 5 | idem |
| eu insiro / ele insere no cadastro | transcrição 6 / transcrição 6 | idem |

**Antes: 9 de 16 pares quebravam na 1ª pessoa. Depois: 0 de 16.**
Os 7 que já funcionavam eram os verbos em `-ar` cuja 1ª pessoa o dicionário tinha por acaso
(`copio`, `lanco`) ou cujo radical era curto o bastante (`avis`, `respond`, `aprov`, `digit`, `insere`).

### B3 · `monta` / `entrega` / `produz`

| entrada | ANTES | DEPOIS |
|---|---|---|
| monta a proposta no Word | `presencial · 0 min` | `documento · 10 min` |
| Ordem de produção montada à mão | `presencial · 0 min` | `documento · 10 min` |
| montamos o orçamento à mão | `presencial · 0 min` | `documento · 10 min` |
| faço a entrega do relatório por e-mail | `presencial · 0 min` | `notificacao · 3 min` |
| produzimos o relatório mensal | `presencial · 0 min` | `calculo · 12 min` |
| monta a estrutura no galpão | `presencial · 0 min` | `presencial · 0 min` (mantido — é físico mesmo) |
| carrega o material no caminhão | `presencial · 0 min` | `presencial · 0 min` |
| carrega a planilha no sistema | `presencial · 0 min` | `transcricao · 6 min` |

`presencial` foi esvaziado para os inequívocos e ganhou qualificadores. `obra` como substantivo solto
saiu do dicionário — era o que fazia *"Foto de obra que alguém precisa baixar"* virar trabalho de campo.

### B4 · sub-segmentação silenciosa

| entrada | ANTES | DEPOIS |
|---|---|---|
| o texto de 4 etapas sem pontuação (25 palavras, medido pelo Norman) | 1 etapa · `0,7 h/mês` · **sem aviso** | 1 etapa · `3,6 h/mês` · **aviso disparado** |
| o placeholder do próprio `textarea` | 2 etapas · 1,8 h/mês | **3 etapas** · 4 h/mês |
| 4 etapas separadas só por vírgula | **1 etapa** · 0,7 h/mês | **4 etapas** · 5,4 h/mês |
| `confere o preço e a quantidade` (armadilha do corte agressivo) | 1 etapa | 1 etapa (não corta — não há verbo do outro lado) |

Texto do `trace` no caso de colapso, que é o que aparece na tela hoje:

```
ANTES  "1 etapa identificada"
DEPOIS "1 etapa identificada · 26 palavras por etapa — provavelmente li junto o que acontece separado"
```

### B5 · truncamento

```
ANTES  trace separação: "12 etapas identificadas"
DEPOIS trace separação: "12 etapas identificadas · li as 12 primeiras de 15 — o resto entra na conversa"
DEPOIS aviso: "Você escreveu 15 etapas e eu li as 12 primeiras. As outras ficam de fora da conta — traz na conversa."
```

### B6 · veredito próprio

`Etapa.vereditoReal === 'nao_lida'` · `Mapa.naoLidas` separado de `Mapa.parciais` ·
`ROTULO_VEREDITO_REAL.nao_lida === 'não li'`. Numa entrada com uma parcial de verdade **e** uma não lida,
os contadores agora dão `parciais: 1 · naoLidas: 1` (antes: `parciais: 2`).

### Os 16 processos de `CasosDeUso.tsx`

| processo | ANTES | DEPOIS |
|---|---|---|
| Pedido chega por e-mail ou WhatsApp e alguém redigita no ERP | 1 et · recebimento · 0,7 h | **2 et** · recebimento+transcrição · 2,9 h |
| Ordem de produção montada à mão a partir da carteira | 1 et · **presencial** · 0 h | 1 et · documento · 3,6 h |
| Follow-up de entrega que depende de alguém lembrar | 1 et · **presencial** · 0 h | 1 et · notificação · 1,1 h |
| Relatório de produção compilado na planilha toda segunda | 1 et · cálculo · 4,3 h | 1 et · cálculo · 4,3 h |
| Orçamento pedido no WhatsApp fora do horário e respondido no dia seguinte | 1 et · recebimento · 0,7 h | **2 et** · recebimento+resposta · 2,2 h |
| Estoque conferido em dois sistemas que não conversam | 1 et · consulta · 1,4 h | 1 et · consulta · 1,4 h |
| Cliente que comprou uma vez e nunca mais foi contatado | 1 et · **não li** · 0 h | 1 et · notificação · 1,1 h |
| Nota emitida manualmente a cada venda | 1 et · **não li** · 0 h | 1 et · documento · 3,6 h |
| Agendamento por telefone que ocupa a recepção o dia inteiro | 1 et · **não li** · 0 h | 1 et · agendamento · 2,2 h |
| Confirmação de consulta feita uma a uma na véspera | 1 et · consulta · 1,4 h | 1 et · notificação · 1,1 h |
| Documento montado a partir de um modelo e preenchido na mão | 1 et · **presencial** · 0 h | **2 et** · documento+transcrição · 5,8 h |
| Cobrança que depende de alguém olhar a planilha de vencimentos | 1 et · notificação · 1,1 h | 1 et · notificação · 1,1 h |
| Medição de campo que vira planilha, que vira relatório, que vira e-mail | 1 et · cálculo · 4,3 h | **3 et** · 3× transcrição · 6,5 h |
| Fornecedor cotado por três canais diferentes sem histórico | 1 et · **não li** · 0 h | 1 et · consulta · 1,4 h |
| Cronograma atualizado à mão quando algo atrasa | 1 et · **não li** · 0 h | 1 et · transcrição · 2,2 h |
| Foto de obra que alguém precisa baixar, renomear e arquivar | 1 et · **presencial** · 0 h | **3 et** · 3× arquivamento · 3,2 h |

**Placar:**

| | ANTES | DEPOIS |
|---|---|---|
| colapsam em 1 etapa | **16/16** | **11/16** |
| voltam "não li" com 0 h | **5/16** | **0/16** |
| voltam "acontece no mundo físico" | **4/16** | **0/16** |

Os 11 que continuam em 1 etapa **são frases-título de uma ação só** — "Estoque conferido em dois
sistemas", "Cronograma atualizado à mão". Para esses, 1 etapa é a leitura correta, e nenhum dispara
falso alarme de sub-segmentação. O problema que a `SINTESE` §2.5 aponta (o CTA *"usar este exemplo"*
ensinar o formato errado) **não é do motor**: continua sendo o texto dos exemplos que é curto demais
para virar um mapa interessante. Resolver isso é reescrever os 16 processos, no `.tsx`, atrás do gate.

### `EXEMPLO` (o botão "usar um exemplo")

| | ANTES | DEPOIS |
|---|---|---|
| etapas | 5 | **6** |
| categorias | recebimento + resposta + transcrição + consulta + **presencial** | recebimento + resposta + transcrição + consulta + **documento** + notificação |
| resultado | 6,9 h/mês | **10,5 h/mês** |

Mudou de 5 para 6 **de propósito e com o texto intacto**: *"Aí confere o preço na tabela e monta a
proposta no Word"* são duas ações, e o separador por verbo passou a enxergar isso. Verifiquei à mão
antes de mexer na expectativa do teste — o corte sai limpo, sem etapa terminando em `"...na tabela e"`.

⚠️ **O número subiu 52%.** Não porque a premissa por etapa mudou (nenhuma mudou), mas porque
*"monta a proposta no Word"* saiu de `0 min` para `10 min` e o texto rendeu uma etapa a mais. Vale o
registro porque a `DIRECAO-ARTE` põe esse número em 44px: **ler melhor produz número maior**, e a
credibilidade do número passa a depender mais das premissas por categoria do que do parser.

---

## 3. O que eu NÃO resolvi

**1 · B6 está metade feito, e a metade que falta é uma linha de `.tsx`.**
`Etapa.vereditoReal` já carrega `nao_lida`, mas o campo `Etapa.veredito` continua entregando `'parcial'`
para o componente — porque `Demo.tsx` declara `const SELO: Record<Veredito, string>` com exatamente três
chaves. Acrescentar `'nao_lida'` ao tipo `Veredito` **quebra a compilação** desse arquivo (`TS2739`), e
tipar `Etapa.veredito` como união mais larga quebra o `SELO[e.veredito]` (`TS7053`). Como o gate proíbe
tocar o `.tsx`, mantive os dois campos e documentei no código. **Na tela, hoje, "não li" continua com o
mesmo selo de "parcial"** — a falha C4 do Norman segue viva.

Quando o gate abrir, são 2 linhas em `Demo.tsx` e 1 classe no CSS:

```tsx
const SELO: Record<VereditoReal, string> = {
  automatizavel: 'selo selo-auto',
  parcial: 'selo selo-parcial',
  humana: 'selo selo-humana',
  nao_lida: 'selo selo-naolida',   // tracejado, sem preenchimento (DIRECAO-ARTE §5)
};
// e trocar SELO[e.veredito] por SELO[e.vereditoReal]; o campo `veredito` some do tipo
```

**2 · O `✓` do trace continua marcando a falha (C2).**
`Demo.tsx` renderiza um `✓` em bronze fixo por linha do trace. O motor agora escreve *"26 palavras por
etapa — provavelmente li junto o que acontece separado"* — mas com um check verde do lado. É menos
mentira que antes, e ainda não é a verdade. Precisa do `.tsx`.

**3 · Os avisos não têm superfície própria.** `Mapa.avisos` existe, é estruturado e está pronto; a única
via de exibição hoje é o texto do `trace`, porque é o único campo que a §3 já renderiza. Os chips de
reclassificação (C3, que o Norman chama de a correção mais importante da lista) **não foram feitos** —
são interface.

**4 · Frequência ainda é `vezes por semana` (A4 / P0 item 6).** É `Demo.tsx`. O motor recebe o número e
multiplica; ele não tem como saber que o visitante foi obrigado a inventar.

**5 · Categoria de texto colapsado é a mais específica, não a primeira.** No caso de 25 palavras em uma
etapa, o resultado passou de `recebimento` para `documento`, porque `monta a ordem` é um casamento
qualificado (peso 3) e ganha de `pedido` (peso 1) mesmo aparecendo depois. Para um texto que **deveria**
ter sido separado, qualquer categoria única é arbitrária — por isso o aviso importa mais que o rótulo.
Registro como comportamento conhecido, não como acerto.

**6 · Verbo físico fora da lista continua "não li".** `montar` só volta a ser presencial se houver objeto
físico conhecido por perto (`peça`, `estrutura`, `máquina`, `equipamento`, `móvel`, `andaime`, `estande`,
`painel`, `kit`). "monta o conjunto no piso" → não li. É a troca deliberada: prefiro admitir que não li
a chutar mundo físico e devolver 0 minuto.

**7 · A morfologia cobre o regular + 4 irregulares** (`fazer`, `ver`, `subir`, `pedir`). Verbos com
alteração ortográfica (`redigir`→redijo, `seguir`→sigo, `conseguir`→consigo) **não estão no dicionário**;
se alguém os acrescentar como `v('redigir')`, a 1ª pessoa vai sair errada e silenciosamente. Está
comentado no arquivo, mas é uma armadilha para o próximo que mexer.

**8 · Ninguém falou com um dono de PME.** As ~90 entradas da suíte fui eu que escrevi, no registro do
público-alvo. É o mesmo furo que o Norman declarou e que a `SINTESE` §5 registra: continua aberto. A
pergunta 1 da `SINTESE` §4 (quantas etapas o cliente dá sozinho) calibra `PALAVRAS_POR_ETAPA_SUSPEITO`,
o teto de 12 e as premissas de `documento` e `agendamento` — nenhum deles foi validado com gente.

**9 · Achados de ferramenta, não do motor.** Dois, registrados para não sumirem:
- `eslint.config.js` na raiz declara `sourceType: 'commonjs'` para `**/*.mjs` — qualquer `.mjs` do
  monorepo dá **parsing error** no lint. Por isso a suíte é `.mts` (que nenhum bloco do config casa) e
  não `.mjs`. Não corrigi: é config compartilhado, fora do escopo travado.
- `apps/talos` **já era vermelho no lint antes desta correção**: `no-undef` para `React`, `window` e
  `performance` em `layout.tsx`, `Contato.tsx`, `Demo.tsx`, `SectionHead.tsx`, `Reveal.tsx`. O app não
  tem `eslint.config` próprio e herda o config Node do framework. Os 7 `no-undef` de `performance` em
  `mapear.ts` são dessa mesma família e existiam antes (o arquivo original já usava `performance.now()`).

---

## 4. Como rodar

```bash
cd apps/talos
node lib/mapear.test.mts     # 66 asserções, sem dependência nova (Node ≥ 22.18)
npx tsc --noEmit             # No errors found
```

A suíte é `.mts` e fica invisível para o `tsc` (que inclui `**/*.ts`) e para o bundle do Next (ninguém a
importa). Os 16 processos dentro dela são **cópia literal** de `components/CasosDeUso.tsx` — se aquela
lista mudar, esta precisa mudar junto; o `.tsx` não pode ser importado (JSX/React) nem tocado (gate F4).

---

## 5. Saída real da suíte

```
B1 · radical solto casando dentro de outra palavra
──────────────────────────────────────────────────
  ok   "geralmente faço isso" não cai mais em calculo (casava com `gera`) — agora: indefinida · 0 min
  ok   "sobra material no fim" não cai mais em presencial (casava com `obra`) — agora: indefinida · 0 min
  ok   "a balança pesa a carga" não cai mais em transcricao (casava com `lanca`) — agora: indefinida · 0 min
  ok   "preciso da informação certa" não cai mais em notificacao (casava com `inform`) — agora: indefinida · 0 min
  ok   "o sistema gera o boleto" ainda casa calculo — veio: calculo
  ok   "visita a obra do cliente" ainda casa presencial — veio: presencial
  ok   "lança a nota no sistema" ainda casa transcricao — veio: transcricao
  ok   "informa o financeiro" ainda casa notificacao — veio: notificacao

B2 · pares mínimos de conjugação (o dono descreve o PRÓPRIO processo)
─────────────────────────────────────────────────────────────────────
  ok   "eu confiro a nota" ≡ "ele confere a nota" — 1ª: consulta/4min · 3ª: consulta/4min
  ok   "eu mando pro contador" ≡ "ele manda pro contador" — 1ª: notificacao/3min · 3ª: notificacao/3min
  ok   "eu fecho o mês" ≡ "ele fecha o mês" — 1ª: calculo/12min · 3ª: calculo/12min
  ok   "eu busco no sistema" ≡ "ele busca no sistema" — 1ª: consulta/4min · 3ª: consulta/4min
  ok   "eu salvo no drive" ≡ "ele salva no drive" — 1ª: arquivamento/3min · 3ª: arquivamento/3min
  ok   "eu copio pra planilha" ≡ "ele copia pra planilha" — 1ª: transcricao/6min · 3ª: transcricao/6min
  ok   "eu respondo o cliente" ≡ "ele responde o cliente" — 1ª: resposta/8min · 3ª: resposta/8min
  ok   "eu aviso o financeiro" ≡ "ele avisa o financeiro" — 1ª: notificacao/3min · 3ª: notificacao/3min
  ok   "eu emito a nota" ≡ "ele emite a nota" — 1ª: documento/10min · 3ª: documento/10min
  ok   "eu lanço no sistema" ≡ "ele lança no sistema" — 1ª: transcricao/6min · 3ª: transcricao/6min
  ok   "eu digito no ERP" ≡ "ele digita no ERP" — 1ª: transcricao/6min · 3ª: transcricao/6min
  ok   "eu organizo as fotos" ≡ "ele organiza as fotos" — 1ª: arquivamento/3min · 3ª: arquivamento/3min
  ok   "eu apuro o resultado" ≡ "ele apura o resultado" — 1ª: calculo/12min · 3ª: calculo/12min
  ok   "eu aprovo o desconto" ≡ "ele aprova o desconto" — 1ª: decisao/5min · 3ª: decisao/5min
  ok   "eu faço a proposta" ≡ "ele faz a proposta" — 1ª: resposta/8min · 3ª: resposta/8min
  ok   "eu insiro no cadastro" ≡ "ele insere no cadastro" — 1ª: transcricao/6min · 3ª: transcricao/6min

B3 · `monta` não é mundo físico quando o objeto é papel
───────────────────────────────────────────────────────
  ok   "monta a proposta no Word" sai de presencial — agora: documento · 10 min
  ok   "Ordem de produção montada à mão" sai de presencial — agora: documento · 10 min
  ok   "montamos o orçamento à mão" sai de presencial — agora: documento · 10 min
  ok   "Documento montado a partir de um modelo" sai de presencial — agora: documento · 10 min
  ok   "monta a estrutura no galpão" não vira documento — veio: presencial
  ok   "faço a entrega do relatório por e-mail" → notificação (3 min), não cálculo (12 min) — veio: notificacao · 3 min
  ok   "produzimos o relatório mensal" não é presencial (veto de objeto) — veio: calculo

B4 · sub-segmentação silenciosa — o pior resultado do sistema
─────────────────────────────────────────────────────────────
  ok   texto de 4 etapas sem pontuação dispara aviso de sub-segmentação — 1 etapa(s) [documento] · 3.6 h/mês
  ok   o aviso aparece no trace (é o único canal que a §3 já renderiza) — 1 etapa identificada · 26 palavras por etapa — provavelmente li junto o que acontece separado
  ok   o placeholder do próprio textarea agora lê 3 etapas — 3 etapa(s) [recebimento + transcricao + notificacao] · 4 h/mês
  ok   4 etapas separadas só por vírgula viram 4 — 4 etapa(s) [recebimento + transcricao + notificacao + consulta] · 5.4 h/mês
  ok   "e" sem verbo do outro lado NÃO corta (não inventa etapa ilegível) — 1 etapa(s) [consulta] · 1.4 h/mês
  ok   etapa legitimamente única não dispara falso alarme — 1 etapa(s) [agendamento] · 2.2 h/mês

B5 · o teto de 12 etapas precisa falar
──────────────────────────────────────
  ok   15 etapas escritas são detectadas — detectadas: 15
  ok   o mapa continua com o teto de 12
  ok   o corte é declarado no aviso — Você escreveu 15 etapas e eu li as 12 primeiras. As outras ficam de fora da conta — traz na conversa.
  ok   o corte é declarado no trace — 12 etapas identificadas · li as 12 primeiras de 15 — o resto entra na conversa

B6 · "não li" deixa de ser "parcial"
────────────────────────────────────
  ok   vereditoReal é nao_lida — veio: nao_lida
  ok   categoria continua indefinida
  ok   minutos = 0 (não inventa número)
  ok   contador naoLidas separado de parciais — naoLidas: 1 · parciais: 0
  ok   rótulo do veredito real existe
  ok   campo `veredito` segue compatível com o Record<Veredito,string> do Demo.tsx — veredito(compat): parcial
  ok   parcial de verdade e não-lida convivem sem se confundir — parciais: 1 · naoLidas: 1

Os 16 processos de CasosDeUso.tsx (antes: 16/16 em 1 etapa · 5/16 "não li")
───────────────────────────────────────────────────────────────────────────
  · Pedido chega por e-mail ou WhatsApp e alguém redigita no ERP
      → 2 etapa(s) [recebimento + transcricao] · 2.9 h/mês
  · Ordem de produção montada à mão a partir da carteira
      → 1 etapa(s) [documento] · 3.6 h/mês
  · Follow-up de entrega que depende de alguém lembrar
      → 1 etapa(s) [notificacao] · 1.1 h/mês
  · Relatório de produção compilado na planilha toda segunda
      → 1 etapa(s) [calculo] · 4.3 h/mês
  · Orçamento pedido no WhatsApp fora do horário e respondido no dia seguinte
      → 2 etapa(s) [recebimento + resposta] · 2.2 h/mês
  · Estoque conferido em dois sistemas que não conversam
      → 1 etapa(s) [consulta] · 1.4 h/mês
  · Cliente que comprou uma vez e nunca mais foi contatado
      → 1 etapa(s) [notificacao] · 1.1 h/mês
  · Nota emitida manualmente a cada venda
      → 1 etapa(s) [documento] · 3.6 h/mês
  · Agendamento por telefone que ocupa a recepção o dia inteiro
      → 1 etapa(s) [agendamento] · 2.2 h/mês
  · Confirmação de consulta feita uma a uma na véspera
      → 1 etapa(s) [notificacao] · 1.1 h/mês
  · Documento montado a partir de um modelo e preenchido na mão
      → 2 etapa(s) [documento + transcricao] · 5.8 h/mês
  · Cobrança que depende de alguém olhar a planilha de vencimentos
      → 1 etapa(s) [notificacao] · 1.1 h/mês
  · Medição de campo que vira planilha, que vira relatório, que vira e-mail
      → 3 etapa(s) [transcricao + transcricao + transcricao] · 6.5 h/mês
  · Fornecedor cotado por três canais diferentes sem histórico
      → 1 etapa(s) [consulta] · 1.4 h/mês
  · Cronograma atualizado à mão quando algo atrasa
      → 1 etapa(s) [transcricao] · 2.2 h/mês
  · Foto de obra que alguém precisa baixar, renomear e arquivar
      → 3 etapa(s) [arquivamento + arquivamento + arquivamento] · 3.2 h/mês
  ok   nenhum dos 16 volta "não li" — com não-lida: 0/16
  ok   nenhum dos 16 volta "acontece no mundo físico" — presencial: 0/16
  ok   os que têm 2+ ações são separados — ainda em 1 etapa: 11/16 (antes: 16/16)

Desempate — a parte mais frágil da correção, então tem guarda
─────────────────────────────────────────────────────────────
  ok   "manda a proposta pro cliente" → resposta — veio: resposta
  ok   "O cliente manda mensagem no WhatsApp pedindo orçamento" → recebimento — veio: recebimento
  ok   "manda pro contador a planilha fechada" → notificacao — veio: notificacao
  ok   "copia os dados pra planilha de leads" → transcricao — veio: transcricao
  ok   "carrega a planilha no sistema" → transcricao — veio: transcricao
  ok   "carrega o material no caminhão" → presencial — veio: presencial

Regressão · EXEMPLO (o único texto que o motor já lia bem)
──────────────────────────────────────────────────────────
  6 etapa(s) [recebimento + resposta + transcricao + consulta + documento + notificacao] · 10.5 h/mês
   01 recebimento    2 min  O cliente manda mensagem no WhatsApp pedindo orçamento
   02 resposta       8 min  Alguém lê e responde perguntando o que ele precisa
   03 transcricao    6 min  Depois copia os dados pra planilha de leads
   04 consulta       4 min  Aí confere o preço na tabela
   05 documento     10 min  monta a proposta no Word
   06 notificacao    3 min  Por fim avisa o vendedor que tem proposta nova
  ok   lê 6 etapas (era 5: "confere o preço" e "monta a proposta" agora se separam) — veio: 6
  ok   nenhuma etapa termina no separador ("...na tabela e")
  ok   nenhuma etapa não lida — naoLidas: 0
  ok   "monta a proposta no Word" não é mais presencial/0min
  ok   a conta continua de pé — 10.5 h/mês
  ok   sem falso alarme de sub-segmentação

Regras do projeto
─────────────────
  ok   o trace carrega tempo real medido (4 passos) — leitura 0.008ms · separação 0.152ms · classificação 0.091ms · estimativa 0.001ms
  ok   total abaixo de 5 ms (o número que a seção mostra na tela) — 0.254 ms
  ok   etapa não reconhecida vale 0 minuto

==============================================================
  66 passaram · 0 falharam
==============================================================
```

Saída do typecheck, no mesmo estado do repositório:

```
$ cd apps/talos && npx tsc --noEmit
TypeScript: No errors found
```

---

## 6. O que isto libera e o que continua travado

**Libera:** a `SINTESE` §2.5 dizia *"consertar o motor (§3), depois primar"* — o motor está consertado
o suficiente para que a ordem `CasosDeUso` → `Demo` deixe de ser autossabotagem. Os 16 processos não
produzem mais "não li" nem "mundo físico".

**Continua travado, e depende do founder:**

1. As premissas de `documento` (10 min) e `agendamento` (6 min) — números meus, precisam do julgamento
   de quem já fez o diagnóstico ao vivo.
2. A pergunta 1 da `SINTESE` §4. Se a resposta for *"ela me dá uma frase e eu puxo o resto"*, o desenho
   da §5 não é um campo de texto e boa parte do separador vira acessório.
3. O gate F4 (`.tsx`): sem ele, "não li" continua com selo de "parcial", o `✓` continua marcando falha,
   os chips de reclassificação não existem e a frequência continua obrigando o visitante a inventar
   número — que é a regra fundadora do projeto sendo violada pela interface, não pelo motor.
