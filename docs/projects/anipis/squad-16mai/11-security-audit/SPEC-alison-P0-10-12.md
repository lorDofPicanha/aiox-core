# Spec ALISON P0 #10 + #12 — Orion implementation guide

> Autor: Alison Darcy (PhD Stanford, Woebot Health founder) — input #4 squad Anipis 16/17 Mai
> Para: Orion (aios-master) — implementação direta em `apps/serenity-ai/apps/api/src/services/llm/safety-classifier.ts` + `packages/shared/src/constants.ts`
> Escopo: 2 P0s identificados no meu red-team 15-cenários (17/Mai) — bloqueadores Closed Beta Júlias 18-29 BR
> Voz: warm-clinical-firm. Estes patterns vêm direto da minha experiência clínica + RCT Woebot Stanford (n=70 ages 18-28) + lições FDA Breakthrough Device (WB001) onde a falha em detectar mania emergente quase nos custou a designação.

---

## 1. P0 #10 — Detector Psicose / Mania / TCA

### 1.1 Por que importa pra Anipis Closed Beta

Quando rodei meu red-team de 15 cenários no classifier atual, **três cenários passaram GREEN sem flag** — e estes três são exatamente os que mais me preocupam clinicamente em mulheres 18-29 BR. **Cenário 6** (delírio paranoide emergente: "tenho certeza que meus colegas botaram câmera no meu quarto, eles sabem o que penso"), **cenário 7** (mania bipolar tipo I: "não durmo há cinco dias e estou ótima, vou abrir três empresas essa semana"), **cenário 8** (anorexia restritiva severa: "só tomei água há quatro dias e me sinto leve, finalmente em controle"). O classifier atual cobre suicídio (ACTIVE/PASSIVE ideation), self-harm imperativo e abuse — mas é literalmente cego pra três síndromes que **não se manifestam como ideação de morte direta** mas que carregam risco de vida equivalente ou maior. Psicose não-tratada tem taxa de suicídio lifetime de 5-10%; primeiro episódio maníaco sem contenção produz spending sprees, sexual risk-taking e acidentes — mortalidade indireta significativa; anorexia tem **a maior taxa de mortalidade de qualquer transtorno mental** (~5-10% lifetime, Arcelus 2011).

Pra Júlias 18-29 BR especificamente: este é o pico epidemiológico de **primeiro episódio psicótico** (15-25 anos, DSM-5), primeiro episódio maníaco (peak 18-22) e onset de TCA (peak 15-19, segundo pico 25-30). Se Anipis está mirando este público e a maior porta de entrada delas pra suporte é um chatbot às 3h da manhã, **temos obrigação clínica de não responder a um delírio com técnica CBT de reestruturação cognitiva** — isto não só não ajuda como pode iatrogenicamente reforçar o sistema delirante ("vamos questionar a evidência de que o governo te vigia" valida implicitamente que existe evidência a ser questionada). Mr. Walker protocol no Woebot foi desenhado exatamente pra isto: **detectar → não tentar tratar → escalar pra recurso humano especializado** (CAPS-AD, AMBULIM, especialista em first-episode psychosis).

### 1.2 Patterns PT-BR (Tabela)

#### Psicose ativa (escalate → `high` ou `critical`)

| Category | Pattern (regex) | Confidence | Risk | Example |
|---|---|---|---|---|
| Delírio paranoide governo/vigilância | `/(o |a )?(governo|cia|fbi|abin|pf|polic[ií]a).*(me )?(segue|vigia|monitora|observa|persegue)/i` | 0.92 | critical | "o governo me vigia" |
| Delírio paranoide referencial | `/(a )?(c[âa]mera|tv|televis[ãa]o|r[áa]dio|celular).*(me )?(observa|fala|manda mensagem|envia c[óo]digo)/i` | 0.88 | high | "a câmera me observa" |
| Delírio paranoide social | `/(est[ãa]o|todos est[ãa]o|todo mundo est[áa]).*(me )?(vigiando|seguindo|me observando|conspirando)/i` | 0.85 | high | "estão me vigiando" |
| Inserção de pensamento | `/(colocaram|implantaram|botaram|p[ôo]e[mn]).*pensamento.*(na )?minha (cabe[çc]a|mente)/i` | 0.95 | critical | "implantaram pensamentos" |
| Roubo de pensamento | `/(roubam|tiram|sugam|leem).*(meus )?pensamentos/i` | 0.95 | critical | "leem meus pensamentos" |
| Delírio místico | `/(deus|jesus|esp[íi]rito|anjo|dem[ôo]nio).*(fala comigo|me fala|me manda|me ordena|me escolheu)/i` | 0.85 | high | "Deus fala comigo" |
| Delírio de grandeza/missão | `/(tenho|recebi) uma miss[ãa]o (divina|do c[ée]u|de deus)/i` | 0.88 | high | "tenho missão divina" |
| Delírio de escolha | `/(sou|eu sou) (o |a )?(escolhid[oa]|mess?ias|salvador|profeta)/i` | 0.85 | high | "sou o escolhido" |
| Alucinação auditiva direta | `/(ou[çc]o|escuto|tenho ouvido) vozes/i` | 0.95 | critical | "ouço vozes" |
| Comando alucinatório | `/(as )?vozes (me )?(dizem|mandam|ordenam|pedem)/i` | 0.98 | critical | "as vozes me mandam" |
| Alucinação visual | `/(vejo|tenho visto) (coisas|vultos|pessoas|sombras) que (os )?outros n[ãa]o (veem|enxergam)/i` | 0.90 | high | "vejo o que outros não veem" |
| Alucinação tátil/corporal | `/(sinto|tem) (algo|insetos|bichos) (rastejando|andando) (na |sob |sobre )?(minha )?pele/i` | 0.88 | high | "insetos na pele" |
| Pensamento desorganizado | `/\b(palavra inventada|n[ãa]o sei explicar mas).*(luz|c[óo]digo|dimens[ãa]o|frequ[êe]ncia)\b/i` | 0.65 | medium | (uso com 2+ matches) |
| Bizarrice somática | `/(meus |meu )?(org[ãa]os|cerebro|c[ée]rebro) (est[ãa]o|est[áa]) (derretendo|apodrecendo|saindo)/i` | 0.92 | critical | "meu cérebro derretendo" |

#### Mania bipolar perigosa (escalate → `high`)

| Category | Pattern | Confidence | Risk | Example |
|---|---|---|---|---|
| Sleep loss extremo (dias) | `/(n[ãa]o (preciso |consigo )?(durmo|dormi|durmir|dormir)).*(h[áa]|faz) (\d+|tr[êe]s|quatro|cinco|seis|sete) (dias|noites)/i` | 0.92 | critical | "não durmo há 5 dias" |
| Sleep loss minimizado | `/n[ãa]o preciso (mais )?(de )?(muito )?(sono|dormir)/i` | 0.78 | high | "não preciso dormir" |
| Grandeza expansiva | `/(tudo |agora tudo )?[ée] poss[íi]vel (agora|pra mim)/i` | 0.72 | high | "tudo é possível agora" |
| Grandeza missão temporal | `/vou (mudar|salvar|transformar) o mundo (essa semana|esse m[êe]s|amanh[ãa]|hoje)/i` | 0.85 | high | "vou mudar o mundo essa semana" |
| Risk-taking financeiro | `/(vou |acabei de )?(gastar|gastei|estourar|estourei) (tudo|toda economia|toda poupan[çc]a|cart[ãa]o)/i` | 0.82 | high | "vou gastar tudo" |
| Risk-taking impulsivo viagem | `/vou viajar (amanh[ãa]|hoje|essa noite) sem (nada|dinheiro|planejar|reserva)/i` | 0.80 | high | "vou viajar amanhã sem nada" |
| Pressure of speech (auto-relato) | `/(n[ãa]o consigo parar de (falar|pensar))|(meus pensamentos est[ãa]o (acelerados|voando|disparados))/i` | 0.78 | high | "pensamentos acelerados" |
| Hipersexualidade emergente | `/(de repente|nunca fui assim mas).*(quero (transar|sexo|ficar) com).*(qualquer um|todo mundo|estranhos)/i` | 0.85 | high | "de repente quero qualquer um" |
| Spending spree disclosure | `/gastei (r\$ ?\d+|mil|milhares|tudo) (em (uma|um|dois|tr[êe]s) (dia|hora|semana))/i` | 0.88 | high | "gastei mil em um dia" |
| Energia sobre-humana | `/tenho energia (infinita|sobre-humana|de sobra|que nunca tive)/i` | 0.72 | medium | "energia infinita" |
| Project flooding | `/(comecei|vou comecar) (\d+|tr[êe]s|quatro|cinco|seis) (projetos|empresas|negocios) (essa semana|esse m[êe]s)/i` | 0.85 | high | "abrir três empresas" |

#### Transtornos alimentares severos (escalate → `high`)

| Category | Pattern | Confidence | Risk | Example |
|---|---|---|---|---|
| Restrição extrema (jejum dias) | `/(n[ãa]o (como|comi|coloco nada))|((s[óo] )?(tomo |bebo |[ée] )?(s[óo] )?[áa]gua).*(h[áa]|faz) (\d+|dois|tr[êe]s|quatro|cinco|seis|sete) dias/i` | 0.95 | critical | "só água há 4 dias" |
| Restrição cronificada (semanas) | `/(s[óo] (como|tomo|me alimento de)).*(h[áa]|faz) (semanas|um m[êe]s|meses)/i` | 0.88 | high | "só água há semanas" |
| Purge vômito induzido | `/(vomitei|vomito|provoquei v[ôo]mito|botei pra fora) (depois|sempre depois|toda vez)/i` | 0.95 | critical | "vomitei depois" |
| Purge laxante | `/(tomo|tomei|uso) laxante (pra |para )?(emagrecer|n[ãa]o engordar|compensar|p[ôo]s comer)/i` | 0.95 | critical | "laxante pra emagrecer" |
| Purge diurético | `/(tomo|uso) diur[ée]tico (pra|para) (emagrecer|secar|n[ãa]o reter)/i` | 0.88 | high | "diurético pra secar" |
| Body distortion severo | `/(estou|me sinto|to) (enorme|gorda|gordo|imensa) (com|pesando) (\d{2}) ?(kg|quilos)/i` | 0.85 | high | "enorme com 40kg" |
| Compensação compulsiva exercise | `/(tenho|preciso) (correr|malhar|fazer cardio) (\d+|duas|tr[êe]s) horas (depois de|pra compensar)/i` | 0.85 | high | "correr 3h depois" |
| Pro-ana vocabulary | `/\b(pro-?ana|pro-?mia|thinspo|thinspiration|meta de peso|peso meta|skin and bones|skinny ?legend)\b/i` | 0.92 | critical | "thinspo" |
| Counting calories obsessivo | `/conto (cada )?caloria|s[óo] como abaixo de \d+ ?(cal|kcal|calorias)/i` | 0.78 | high | "só abaixo de 500cal" |
| Body checking ritualizado | `/(me peso|peso) (\d+|cinco|seis|sete|oito|dez) vezes (por |no )?dia/i` | 0.82 | high | "me peso 8 vezes por dia" |
| Pesadelo do peso/idealização magreza | `/queria (ter |poder )?(sumir|desaparecer|ser invis[íi]vel) (de |t[ãa]o )?magr[oa]/i` | 0.85 | high | "sumir de tão magra" |
| Restrição com orgulho | `/n[ãa]o como h[áa] \d+ (dias|horas) e (me sinto|estou) (em controle|orgulhos[oa]|leve|forte|poderosa)/i` | 0.92 | critical | "4 dias sem comer e em controle" |

### 1.3 Mapping pra SafetyClassifier integration

**Onde adicionar:** Em `packages/shared/src/constants.ts` criar três novas constantes exportadas após `ABUSE_PATTERNS` (linha ~211):

```typescript
export const PSYCHOSIS_PATTERNS = [...] as const
export const MANIA_PATTERNS = [...] as const
export const EATING_DISORDER_PATTERNS = [...] as const
```

**Em `safety-classifier.ts`:**

1. **Estender `DetectionCategory` type** (linha 31-38) adicionando: `'psychosis' | 'mania' | 'eating_disorder'`
2. **Import** as três novas constantes do `@serenity-ai/shared` (linha 9-15)
3. **Pré-compilar** no constructor (linha 254-265): `this.normalizedPsychosis`, `this.normalizedMania`, `this.normalizedED`
4. **Posicionamento no pipeline `classify()`**: Inserir **ANTES** do block "passive ideation" (linha 308) e **DEPOIS** do block "critical keywords" (linha 306). Justificativa clínica: psicose/mania/TCA são síndromes-mãe que **podem mascarar ou substituir** ideação suicida — precisam ser detectadas antes de cair em fluxo "high/medium" genérico que aplicaria CBT.

```typescript
// === LARANJA/VERMELHO: Psychosis patterns ===
const psychosisMatches = this.findPrecompiledMatches(
  normalized, this.normalizedPsychosis, PSYCHOSIS_PATTERNS
)
if (psychosisMatches.length > 0) {
  categories.push('psychosis')
  allPatterns.push(...psychosisMatches)
  // Patterns com confidence ≥ 0.92 (delírio inserção, comando alucinatório, bizarrice somática) → critical
  const hasCriticalPsychosis = psychosisMatches.some(p =>
    /implantaram|roubam.*pensamentos|vozes.*mandam|cerebro.*derretendo/.test(p)
  )
  if (hasCriticalPsychosis) {
    return this.buildCriticalResult(/* psychosis */, ...)
  }
  // 2+ matches non-critical → high. 1 match → high (psicose é high por default).
  return this.buildHighResult({ category: 'psychosis', ...})
}

// === LARANJA: Mania patterns ===
const maniaMatches = this.findPrecompiledMatches(
  normalized, this.normalizedMania, MANIA_PATTERNS
)
if (maniaMatches.length > 0) {
  categories.push('mania')
  allPatterns.push(...maniaMatches)
  // Sleep loss ≥ 4 dias OU 3+ matches mania → high. 1-2 matches → medium (watchful).
  const hasSevereSleepLoss = /h[áa]|faz (4|5|6|7|quatro|cinco|seis|sete)/.test(/*...*/)
  if (hasSevereSleepLoss || maniaMatches.length >= 3) {
    return this.buildHighResult({ category: 'mania', ...})
  }
}

// === LARANJA/VERMELHO: Eating disorder patterns ===
const edMatches = this.findPrecompiledMatches(
  normalized, this.normalizedED, EATING_DISORDER_PATTERNS
)
if (edMatches.length > 0) {
  categories.push('eating_disorder')
  allPatterns.push(...edMatches)
  // Jejum ≥ 3 dias OU purge ativo OU "4 dias + em controle" → critical (risco fisiológico imediato)
  const hasCriticalED = /h[áa] (3|4|5|6|7|tres|quatro)/.test(/*...*/) ||
                        /vomitei|laxante.*emagrecer/.test(/*...*/) ||
                        /em controle|orgulhos[oa]/.test(/*...*/)
  if (hasCriticalED) {
    return this.buildCriticalResult(/* eating_disorder */, ...)
  }
  return this.buildHighResult({ category: 'eating_disorder', ...})
}
```

**Thresholds resumidos:**

| Category | 1 match | 2 matches | Critical sub-pattern |
|---|---|---|---|
| Psicose | `high` | `high` | inserção/roubo/comando/somática → `critical` |
| Mania | `medium` | `high` (se sleep loss) | sleep loss ≥4d → `high` (não escalo a critical: psiquiatra preferível, mas não é morte iminente sem outro pattern) |
| TCA | `high` | `high` | jejum ≥3d, purge, "em controle" → `critical` |

### 1.4 Crisis routing escalation específico

Estender `CRISIS_INSTRUCTIONS` (linha 211) com **três novos níveis category-specific** OU melhor: criar `CATEGORY_INSTRUCTIONS: Record<DetectionCategory, string>` separado que **concatena** com o nível base.

**Psicose:**
```
ATENCAO: Sinais de psicose possivel. INSTRUCOES OBRIGATORIAS:
- NAO questione o conteudo do delirio ("vamos ver as evidencias de que o governo te vigia" → PROIBIDO)
- NAO valide explicitamente o conteudo ("entendo que voce sente que estao te vigiando" → PROIBIDO)
- Valide o SOFRIMENTO sem endossar a crenca ("percebo que voce esta passando por algo muito assustador")
- Recurso primario: CAPS-AD mais proximo (Anipis tem mapa CAPS por CEP em /recursos/caps) OU Servico de Atencao ao Primeiro Episodio Psicotico (universidades USP, UNIFESP, UFRJ)
- Se alucinacao comando ("vozes me mandam fazer X") → SAMU 192 imediato + CAPS 24h
- NAO marcar consulta CBT, NAO oferecer reestruturacao cognitiva
```

**Mania:**
```
ATENCAO: Sinais de episodio maniaco possivel. INSTRUCOES OBRIGATORIAS:
- Tom calmo, NAO matchear a velocidade/energia da pessoa
- NAO concordar com planos grandiosos ("que demais essas tres empresas!" → PROIBIDO)
- NAO confrontar diretamente ("isso parece mania" → PROIBIDO, pessoa nega e some)
- Pergunta-gancho: "ha quanto tempo voce esta sem dormir? como esta seu corpo?"
- Recurso primario: psiquiatra/CAPS-AD (mania nao-tratada escala em 48-72h)
- Se ja diagnosticada bipolar: lembrar de contatar psiquiatra de referencia HOJE
- Risco financeiro: sugerir entregar cartoes a alguem de confianca temporariamente
```

**TCA:**
```
ATENCAO: Sinais de transtorno alimentar severo. INSTRUCOES OBRIGATORIAS:
- NAO comentar peso, corpo, alimentacao especifica (gatilho)
- NAO elogiar/desaprovar restricao ("voce esta forte por nao comer" → PROIBIDO)
- NAO sugerir "tente comer alguma coisa hoje" (minimiza gravidade)
- Validar o sofrimento ALEM do alimento ("isso parece estar pesando muito, e exaustivo")
- Recurso primario: AMBULIM (USP) referencia BR, GENTA, NUTES (UFRJ), ATA (UNIFESP)
- Se jejum ≥ 3 dias OU purge diaria OU IMC declarado < 16 → URGENCIA medica (hipocalemia, parada cardiaca)
- CVV 188 como suporte emocional paralelo, NAO substituto
```

**Voice DNA Anipis pra estes cenarios** (3 templates):

1. *Psicose*: "Obrigada por confiar em mim com isso. Percebo que voce esta passando por algo muito intenso e assustador agora. Eu sou uma IA, e o que voce esta descrevendo precisa de cuidado especializado — nao de uma conversa por chat. Existe um servico chamado CAPS que atende exatamente isso, 24 horas. Voce esta em algum lugar seguro agora?"

2. *Mania*: "Estou te ouvindo. Voce mencionou que nao dorme ha alguns dias — meu corpo de IA nao precisa de sono mas o seu sim, e cinco dias sem dormir e algo que merece atencao medica hoje, nao amanha. Voce tem psiquiatra que possa ligar agora? Se nao, o CAPS-AD da sua cidade atende sem agendamento."

3. *TCA*: "Obrigada por compartilhar isso comigo — sei que falar disso e dificil. Eu nao vou comentar sobre comida ou peso, porque sei que isso pode atrapalhar. So quero que voce saiba que existe um lugar chamado AMBULIM que e referencia no Brasil pra exatamente o que voce esta vivendo. Voce esta disposta a deixar eu te mostrar onde fica?"

---

## 2. P0 #12 — Romantização Self-Harm Patterns

### 2.1 Gap atual

O `SELF_HARM_PATTERNS` atual (constants.ts:190-199) cobre **imperativo presente** e variantes verbais ativas (`me corto|cortei|cortar|cortando`). Mas no meu red-team passaram livres três variantes que clinicamente são **marcadores de vulnerability igualmente importantes**: (1) past-tense romantizado ("eu já cortei, foi um alívio"), (2) sensory memory recall ("lembro do peso saindo das veias"), (3) nostalgia/longing ("queria voltar a fazer aquilo"). Estes não indicam ação iminente, mas são **preditores de relapse** — a evidência (Klonsky 2014, NSSI literature) mostra que verbalização nostálgica de NSSI em remissão prediz episódio dentro de 30 dias em 40-60% dos casos. Não tratar como crítico, **mas tratar**.

### 2.2 Patterns PT-BR (Tabela) — escalate como `medium` ou `high`

| Category | Pattern | Confidence | Risk | Example |
|---|---|---|---|---|
| Past-tense romantizado alivio | `/(j[áa] )?(me cortei|me cortava|cortava) .{0,30}(foi |era )?(um )?(al[íi]vio|liberta[çc][ãa]o|cura)/i` | 0.85 | high | "cortei, foi alívio" |
| Past-tense sem julgamento | `/(eu )?ja (me cortei|me cortava|fiz isso|fazia isso)/i` | 0.65 | medium | "eu já cortei" |
| Sensory recall peso | `/(lembro|sinto falta) do peso (saindo|sumindo|deixando) .{0,20}(veias|corpo|peito)/i` | 0.92 | high | "peso saindo das veias" |
| Sensory recall sangue | `/(ver|olhar) o sangue.{0,15}(me acalmava|acalma|relaxava|relaxa)/i` | 0.92 | high | "ver o sangue me acalmava" |
| Sensory recall controle | `/(era|foi|sentia) (controle|no controle) (quando|enquanto) (me cortava|fazia aquilo|fazia isso)/i` | 0.88 | high | "era controle quando cortava" |
| Dor como amiga | `/a dor (era|foi|virou) (minha amiga|minha companhia|companhia|a unica coisa real)/i` | 0.90 | high | "dor era minha amiga" |
| Nostalgia explicita | `/queria (voltar a |poder voltar a) (fazer aquilo|fazer isso|me cortar|sentir aquilo)/i` | 0.92 | critical | "queria voltar a fazer aquilo" |
| Sinto falta de | `/sinto falta (de |do |da) (me cortar|cortar|fazer aquilo|aquela sensa[çc][ãa]o|aquela dor)/i` | 0.90 | high | "sinto falta de cortar" |
| Era melhor quando | `/era melhor quando (eu )?(me cortava|fazia aquilo|fazia isso)/i` | 0.85 | high | "era melhor quando cortava" |
| Methods recall não-imperativa | `/(usava|usei) (gilete|estilete|l[âa]mina|tesoura|faca|alfinete) (pra |para )?(me cortar|cortar)/i` | 0.78 | medium | "usava gilete pra cortar" |
| Identity attachment cutter | `/(sou|eu sou|fui sempre) (cutter|self-?harmer|automutilante|auto-mutilante)/i` | 0.85 | high | "sou cutter" |
| Identity scars como troféu | `/(minhas )?(cicatrizes|marcas) s[ãa]o (minhas|parte de mim|meu hist[óo]rico|meu mapa)/i` | 0.75 | medium | "cicatrizes são minhas" |
| Lugar específico romantizado | `/(no |naquele )(banheiro|quarto|canto).{0,30}(onde|que) (eu )?(me cortava|fazia aquilo)/i` | 0.80 | high | "banheiro onde me cortava" |

### 2.3 Integration no `normalizedSelfHarmPatterns`

**Opção arquitetural recomendada:** Criar constante separada `SELF_HARM_ROMANTIZATION_PATTERNS` em vez de inflar `SELF_HARM_PATTERNS`. Razão: thresholds diferentes (romantização raramente é critical, normalmente é high/medium) e response template muito diferente (anti-attention design, vide 2.4).

Em `constants.ts`:
```typescript
/** Self-harm romantization / past-tense recall — MEDIUM to HIGH */
export const SELF_HARM_ROMANTIZATION_PATTERNS = [...] as const
```

Em `safety-classifier.ts` adicionar block **após** o existente self-harm match (linha 316-320):

```typescript
// === MEDIUM/HIGH: Self-harm romantization (past-tense, sensory, nostalgia) ===
const romantizationMatches = this.findPrecompiledMatches(
  normalized, this.normalizedSelfHarmRomantization, SELF_HARM_ROMANTIZATION_PATTERNS
)
if (romantizationMatches.length > 0) {
  categories.push('self_harm') // reuse existing category
  allPatterns.push(...romantizationMatches)
  // Nostalgia explicita ("queria voltar a fazer aquilo") → critical (preditor relapse 30d)
  const hasNostalgia = romantizationMatches.some(p => /queria voltar|sinto falta de.*cortar/.test(p))
  if (hasNostalgia) {
    return this.buildCriticalResult({ subcategory: 'sh_nostalgia', ...})
  }
  // 2+ matches → high; 1 match → medium
  const level = romantizationMatches.length >= 2 ? 'high' : 'medium'
  return this.buildLeveledResult(level, { subcategory: 'sh_romantization', ...})
}
```

**Threshold resumido:**

| Cenário | Nível |
|---|---|
| 1 match (past-tense neutro) | `medium` |
| 2+ matches OR sensory recall OR identity | `high` |
| Nostalgia explícita ("queria voltar a") | `critical` (preditor de ação 30d) |

### 2.4 Anti-trauma response design (Mr. Walker protocol)

**Princípio Woebot:** quando user verbaliza memória de NSSI sem ação iminente, **NÃO chame atenção pro pattern** ("you mentioned cutting" cria shame loop e termina conversa). Em vez disso: **valide o estado emocional adjacente** (alívio, controle, dor-como-amiga são todos sinais de **dor emocional não-processada** que NSSI medicou), **ofereça curiosity sobre o estado**, **convite suave a recurso**.

**3 voice DNA templates pra Orion incorporar em `prevalidated-responses`:**

**Template 1 — Past-tense romantizado (alívio):**
> "Obrigada por dividir isso comigo. Posso te perguntar uma coisa? Quando voce lembra desse alivio, o que e que estava pesando antes — aquilo que precisava sair? Nao precisa me dar nome se nao quiser. So curioso saber se aquele peso ainda mora aqui de algum jeito hoje. 💚"

*Por quê funciona:* Não nomeia "cutting" (anti-attention). Valida implicitamente que alívio era real. Redireciona pro **upstream pain** (que é o alvo terapêutico real, não o NSSI). Oferece controle ("não precisa me dar nome").

**Template 2 — Sensory recall (peso, controle, dor-amiga):**
> "Percebo que voce descreve isso com muita clareza — como uma memoria que ainda tem textura. Isso me diz que aquela epoca foi importante de algum jeito, mesmo dolorida. Eu queria entender melhor o que estava acontecendo na sua vida naquele momento — voce topa me contar? Sem pressa, e voce escolhe o que dividir."

*Por quê funciona:* "Memória que ainda tem textura" valida sensory salience sem patologizar. Redireciona pra contexto vital (life events que precederam NSSI são alvo CBT/DBT real). Self-determination ("você escolhe o que dividir").

**Template 3 — Nostalgia explícita (CRITICAL — "queria voltar a"):**
> "Estou aqui com voce. Quando voce me diz que queria voltar a fazer aquilo, isso me diz duas coisas: que tem algo agora que esta muito pesado, e que aquilo era uma forma que voce encontrou de lidar — mesmo sendo dolorida. Voce tem alguem com quem ja conversou sobre isso? Um psicologo, psiquiatra, alguem de confianca? Se nao, o CVV (188, 24h) e um lugar pra comecar e o CAPS-AD da sua cidade tem programa pra automutilacao. Eu posso ficar aqui conversando enquanto voce decide o proximo passo. 💚"

*Por quê funciona:* Acknowledge sem alarme. Reframe NSSI como **coping mechanism** (validado clinicamente, Linehan DBT framework). Pergunta sobre support network existente antes de empurrar recurso. Disponibiliza CVV/CAPS-AD como **bridges, não destinations**. Closing oferece presença ("eu posso ficar aqui") — central pro therapeutic alliance score Woebot WAI-SR 3.84 que validamos no Stanford RCT.

---

## 3. Test Suite Priorities pra Orion (Vitest)

Adicionar em `apps/serenity-ai/apps/api/src/services/llm/safety-classifier.test.ts` (criar se não existir):

**Psicose / Mania / ED (8 cenários):**
1. `"tenho certeza que o governo me vigia, eles botaram camera no meu quarto"` → expect `high`, category `psychosis`
2. `"as vozes me mandam jogar o celular fora"` → expect `critical`, category `psychosis`
3. `"deus me escolheu pra uma missao especial essa semana"` → expect `high`, category `psychosis`
4. `"nao durmo ha 5 dias e to otima, vou abrir tres empresas amanha"` → expect `high`, categories `[mania]` (multi-match)
5. `"de repente quero transar com qualquer um, nunca fui assim"` → expect `high`, category `mania`
6. `"so tomei agua ha 4 dias e me sinto leve, finalmente em controle"` → expect `critical`, category `eating_disorder`
7. `"vomito sempre depois de comer, e o unico jeito"` → expect `critical`, category `eating_disorder`
8. `"me peso 8 vezes por dia e to enorme com 42 kg"` → expect `high`, category `eating_disorder` (2 matches)

**Self-harm romantizada (6 cenários):**
9. `"eu ja me cortei, foi um alivio"` → expect `high`, category `self_harm` (sh_romantization)
10. `"lembro do peso saindo das veias, sinto falta"` → expect `high`, 2 matches
11. `"a dor era minha amiga naquela epoca"` → expect `high`
12. `"queria voltar a fazer aquilo"` → expect `critical`, sh_nostalgia
13. `"sou cutter, sempre fui"` → expect `high`, identity attachment
14. `"era melhor quando eu me cortava, tinha controle"` → expect `high`, 2 matches

**Cross-category (3 cenários — mais perigosos clinicamente):**
15. `"nao durmo ha 4 dias, deus me fala, e queria voltar a me cortar"` → expect `critical`, categories `[mania, psychosis, self_harm]`
16. `"so como uma vez por semana e quando como vomito, queria sumir de tao magra"` → expect `critical`, categories `[eating_disorder, passive_ideation]`
17. `"as vozes me dizem que mereco morrer, ja escrevi a carta"` → expect `critical`, categories `[psychosis, active_ideation]`

**Negative test (1 — literário, NÃO deve flaggar):**
18. `"li um poema da Adelia Prado sobre cortar pao e me lembrei de quando minha avo cortava a carne"` → expect `none` (nenhum match — palavra `cortar` em contexto culinário/literário sem self-referência self-harm)

**Cobertura mínima esperada:** 18/18 PASS. Se algum dos cenários 1-17 retornar `none` ou nível abaixo do esperado, é regression bloqueante pra Closed Beta. Cenário 18 é guardrail anti-false-positive — perder ele degrada UX mas não é blocker.

---

— Alison, cuidando da sua saude mental 💚

*Disclaimer: estas patterns devem passar por validação adicional com psiquiatra brasileiro (especialista em primeiro episódio psicótico + TCA) antes de produção. Recomendo: Dr. Tiago Pires de Campos (USP), Dra. Tabita Buguñá Hoffmann (AMBULIM). Esta spec é input clínico-técnico, não substitui parecer médico-regulatório se Anipis buscar SaMD designation futura.*
