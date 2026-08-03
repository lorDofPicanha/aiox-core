# SÍNTESE — rodada de squad + conclave adversarial

**Data:** 2026-07-28 · **Papel deste documento:** resolver as contradições entre os pareceres.
Não é resumo. Onde dois agentes discordam, aqui tem veredito e motivo.

**Quem produziu o quê**

| agente | artefato |
|---|---|
| `design-chief` | `DIRECAO-ARTE.md` — 1.305 linhas, 51 pares de contraste |
| `aios-ux` | `ARQUITETURA-SECOES.md` — 12 seções, mapa leanware→Talos |
| `dieter-rams` | `adversarial/dieter-rams.md` — honestidade funcional |
| `marty-neumeier` | `adversarial/marty-neumeier.md` — marca e posicionamento |
| `erik-spiekermann` | `adversarial/erik-spiekermann.md` — tipografia, medida com fontTools |
| `don-norman` | `adversarial/don-norman.md` — usabilidade, com `mapear.ts` **executado** |

---

## 1. O achado que reordena tudo

**O único ativo de prova do site está quebrado, e o defeito é estrutural.**

O `mapear.ts` classifica por `indexOf` de radical, sem fronteira de palavra, com o dicionário
inteiro escrito em **3ª pessoa**. O dono de PME descreve o próprio processo em **1ª pessoa**.
Verificado por execução, não por leitura:

| entrada | resultado | casou com |
|---|---|---|
| `ele confere o preço` | consulta · 4 min ✅ | `confer` |
| `eu confiro o preço` | **não li · 0 min** 🔴 | — |
| `ele manda pro financeiro` | notificação · 3 min ✅ | `manda pro` |
| `eu mando pro financeiro` | **não li · 0 min** 🔴 | — |
| `ele fecha o mês` | cálculo · 12 min ✅ | `fecha o mes` |
| `eu fecho o mês` | **não li · 0 min** 🔴 | — |
| `eu busco no sistema` / `eu salvo no drive` | **não li · 0 min** 🔴 | — |
| `monta a proposta no Word` | **presencial · humana · 0 min** 🔴 | `monta` |
| `Ordem de produção montada à mão` | **presencial · 0 min** 🔴 | `monta` |
| `geralmente faço isso` | cálculo · **12 min** 🔴 | `gera` |
| `sobra material no fim` | presencial 🔴 | `obra` |
| `a balança pesa a carga` | transcrição 🔴 | `lanca` |
| `preciso da informação certa` | notificação 🔴 | `inform` |

Causa: verbo português de 1ª pessoa termina em **-o** (`confiro`, `mando`, `fecho`, `busco`,
`salvo`); o dicionário guarda a forma em **-a**. Não é lista incompleta — é a pessoa gramatical
errada, e nenhum verbo novo conserta enquanto a busca for por substring sem fronteira.

**E o pior resultado não é "não li".** O `ARQUITETURA-SECOES` §2.2 afirma que "não reconheci o
verbo" é *o único resultado ruim que o demo pode produzir*. Medido: falso. O pior é o **acerto
aparente** — texto de 4 etapas sem pontuação vira 1 etapa, 0,7 h/mês, sem aviso, e o trace exibe
`✓ separação · 1 etapa identificada`. Signifier de sucesso sobre falha.

> **Consequência para o projeto inteiro.** A decisão fundadora do `CONTEXT.md` §3 é *processo é
> prova*: sem case, a demonstração ao vivo substitui a credencial. Se a demonstração erra na
> frente do visitante, ela não é prova neutra — é **prova contra**. Isso reordena a prioridade:
> nenhuma decisão de cor, escala ou foto importa antes disto.

---

## 2. Contradições entre os pareceres — veredito

### 2.1 Fotografia — **Rams vence nos números, mas não integralmente**

`design-chief` pôs 2,1 MB em `03-assets/` e declarou F3 ✅. Rams mediu: o payload de imagem da
referência **inteira** é 83 KB, e as 3 ilustrações do slot equivalente somam **11,3 KB**. A
proposta põe 578–741 KB no mesmo slot — 51× a 65×. Detalhes que decidem:

- `textura-metal-1920.webp` = **878 KB aplicados a `opacity .06`**
- `fabrica` (270 KB) **não tem destino em nenhuma seção**
- `placa-metal` precisa de **146° de rotação de matiz** para pertencer ao sistema

**Veredito:** o gate F3 foi satisfeito **comprando peso**, não resolvendo função. Mas Rams
concede — e a concessão procede — que fotografia pode fazer **reconhecimento de público**
(dono de metalúrgica se vê). Então:

1. Manter **no máximo 2** fotos, cada uma com trabalho declarado numa seção específica
2. Cortar `textura-metal`, `fabrica`, e tudo que precise de rotação de matiz para pertencer
3. **Reescrever o gate F3**: piso de peso é métrica de vaidade. O gate passa a ser *"cada asset
   tem função nomeada numa seção"* — o número em MB não mede nada.

### 2.2 Ponto pulsante / `FLORIANÓPOLIS · GMT-3` — **proibido**

`DIRECAO-ARTE` importa o slot do rodapé do leanware (`EST. 2020 · BOGOTÁ · GMT-5`, com ponto
pulsante) como `FLORIANÓPOLIS · GMT-3`, mesmo pulso. `ARQUITETURA-SECOES` §4.1 **proíbe
explicitamente** sinal desse tipo. Os dois documentos do squad se contradizem.

**Veredito: prevalece a proibição.** Ponto pulsante é signifier de sistema vivo. Não há sistema
vivo por trás dele. É a mesma categoria do spinner falso que as regras do projeto já vetam, e da
mesma família do painel do leanware que se autodeclara `data-lw-placeholder="hero-chat"`.

### 2.3 Escala tipográfica vs "site igual ao leanware" — **separar física de gosto**

Spiekermann mediu com fontTools e a escala corrigida **afasta** o site da referência. Duas coisas
diferentes foram embaladas juntas:

**Física (não é opinião, não é negociável):**
- `AUTOMAÇÃO` ocupa **12,86px numa caixa de 13,2px**. Caixa alta portuguesa é **29% mais alta**
  que a inglesa (`Ã` a 0,954em, `Ç` a −0,216em). `line-height: 1.2` → **1.45**
- JetBrains Mono tem **GPOS vazia** e já é espacejada por construção → `.16em` → **`.12em`**
- `font-optical-sizing: auto` é **premissa**: sem ela o browser serve o desenho de opsz 14
  ampliado 4,4×. E `font-variation-settings` para peso **zera o opsz de volta a 14**
- O "61 usos" que justificava corpo a 15px é **artefato de substring** — confirmado
  independentemente: 61 pelo método errado, **10** isolando `text-body`. Corpo real: 14px

**Gosto (é do founder):** teto de 62px vs banda 59–72px; corpo 16 vs 17px.

**Veredito:** a física entra sem discussão — copiar um número calibrado para o alfabeto inglês
não é fidelidade, é erro de transporte. O gosto vai para o founder junto com a pergunta do
Spiekermann.

### 2.4 Bronze vs verde — **despriorizado, e a pergunta era outra**

Neumeier desmontou o placar: 4 dos 6 critérios são circulares (o mesmo `ui-ux-pro-max` devolve
`#D4AF37` como default de *Dark Premium*, então "verde é o default da categoria" vale idêntico
para o bronze). Placar honesto: **2×1**, não 6×1. E o próprio `DIRECAO-ARTE` §3.7 admite que a
reversão custa **4 tokens**.

**Veredito: decisão reversível em 4 tokens é configuração, não posicionamento.** Fica bronze por
inércia produtiva. A sessão gastou desproporcional aqui — meu erro de roteamento.

**A pergunta que era:** `DIRECAO-ARTE` §3.7 lista **9 gestos herdados do leanware** e conclui "o
Talos herda os nove". Trocar o acento e manter os nove é zigar em outro tom. O founder rejeitou
3 builds com a palavra *genérico* — genérico não é cor errada, é ausência de gesto próprio.

### 2.5 `CasosDeUso` alimentando o textarea — **a arquitetura piora o demo**

`ARQUITETURA-SECOES` propõe subir `CasosDeUso` para antes do demo, argumentando que os 16
processos estão no mesmo registro de verbo que o motor reconhece. Norman mediu o oposto:
**16/16 colapsam em 1 etapa · 5/16 voltam "não li" com 0 h · 4/16 voltam "mundo físico"**.

**Veredito: a intuição da arquitetura está certa, a premissa está errada.** Priming é bom;
priming com texto que o motor lê pior é autossabotagem. Ordem correta: **consertar o motor
(§3), depois primar**. Enquanto o motor não for consertado, não subir a seção.

---

## 3. Ordem de execução

### P0 — o motor (bloqueia a tese do site)
1. Fronteira de palavra no matching. `indexOf` de radical solto produz `gera`←`geralmente`,
   `obra`←`sobra`, `lanca`←`balança`, `inform`←`informação`
2. Dicionário em **1ª e 3ª pessoa**. Hoje só 3ª. `monta` precisa sair de `presencial` ou ganhar
   qualificador — `monta a proposta` não é mundo físico
3. Detectar **acerto aparente**: N etapas sem pontuação virando 1 precisa avisar, não celebrar
4. Truncamento em 12 etapas hoje é silencioso — o trace anuncia 12 quando recebeu 15
5. Separar o selo de `não li` do selo de `parcial` — hoje são o mesmo
6. Campo de frequência: `min={1}` semanal torna processo mensal inexprimível e infla 4,33×.
   É o único ponto onde a **interface obriga o visitante a inventar número** — viola a regra
   fundadora do projeto
7. Persistir o mapa até o formulário. Hoje `Contato.tsx` pede *"cola o resultado na mensagem"*:
   o site comete, na frente do visitante, exatamente o erro que cobra da empresa dele

### P0 — honestidade
8. Cortar ponto pulsante e `GMT-3` (§2.2)
9. Alinhar "2 ms" da dobra com o valor real do painel (hoje 0,15 ms) — número congelado ao lado
   de contador ao vivo
10. §10 não é prova, é promessa auto-emitida. Não promover a prova

### P1 — tipografia (física, §2.3)
11. `line-height` dos rótulos 1.2 → 1.45 · tracking `.16em` → `.12em` · eliminar o degrau de 10px
12. Corpo 15px → 16–17px · `font-optical-sizing: auto` explícito · nunca definir peso por
    `font-variation-settings`

### P1 — matéria-prima
13. Triagem de `03-assets/` conforme §2.1 · reescrever o gate F3 por função

### P2
14. Bronze fica · gestos próprios (§2.4) é trabalho de marca, não de build

---

## 4. Só o founder responde

| # | pergunta | de quem | o que trava |
|---|---|---|---|
| 1 | Quantas etapas o cliente dá sozinho na primeira conversa, e quando ele para de descrever e começa a reclamar? | Norman | O desenho da §5. Se for "ela me dá uma frase e eu puxo o resto", o certo não é um campo — é **uma pergunta de cada vez**. Você é a única pessoa do projeto que já observou dezenas de donos fazendo essa tarefa; é dado primário, de graça, e não foi usado |
| 2 | Quando você disser **R$750** para alguém que acabou de ver este site, o que passa pela cabeça dele? | Neumeier | O site sinaliza premium; o `PRICING` §5 trava a porta em R$750. Nenhum documento registra essa distância |
| 3 | Quem abre este site e decide: o dono, ou alguém que ele manda olhar? | Spiekermann | Corpo 16 vs 17px, leading, densidade. Se for o dono (45+, celular), o site **deliberadamente não fica idêntico ao leanware** |
| 4 | Você revisa seção por seção até o último detalhe, ou publica quando estiver "bom o suficiente"? | Rams | Bifurca 22 cortes propostos |
| 5 | **INPI classes 42 e 35** — busca de anterioridade de `TALOS` | Neumeier | 3 minutos, grátis. `RETOMAR-AQUI` dizia que troca de nome "não invalida token nem seção" — **é falso**: pendura evidência do bronze, `TalosCore.tsx`, `Nav.tsx`, brief de logo e a foto de forja |

---

## 5. Limites honestos desta rodada

- **Ninguém falou com um dono de PME.** 51 pares de contraste medidos, `mapear.ts` executado
  contra 70 entradas sintéticas, zero contato humano. Neumeier chama de etapa *Validate* pulada,
  e a amostra é grátis (D2: o founder já falou com eles). É o maior furo do conjunto.
- **Spiekermann não abriu navegador** — mediu contorno e caixa de linha, não rasterização.
- **Norman escreveu as ~70 entradas ele mesmo** — são no registro do público, mas não são de
  usuário real.
- **Enriquecimento HYDRA vazio** nos 4 clones (`knowledge-feed/<clone>` não existe). A base veio
  completa do `.codex/agents/*.md`; feed ao vivo, não.
- **`self-consultation.js conclave` erra a seleção de expert** — para uma pergunta de cor e
  tipografia devolveu precificação contábil, dossiê do Demis Hassabis e LGPD em saúde.
  Usar `batch --experts` com nomes explícitos.
- **F4 continua 🔴.** Não existe mockup. Nenhum `.tsx` pode ser tocado.
