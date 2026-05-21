# Spike Técnico — Stage 5 (Acompanhar/Lances + Preclusão Recursal)

**Data:** 2026-05-20 · **Status:** SPIKE (de-risking, não-comprometedor)
**Origem:** veredito do `99-synthesis/conclave-stage56-20mai.md` (Justen + Niebuhr + Pablo)
**Objetivo:** de-riscar a parte mais cara e incerta do produto — o monitoramento de sessão de pregão em tempo real e o alerta de preclusão recursal (DOR #1).

---

## 1. A pergunta de de-risking

> *Conseguimos detectar, em tempo real e por plataforma (PNCP/Compras.gov.br, BLL, BNC, PCP, SISLOG), o estado da sessão de pregão a ponto de disparar o alerta de "manifeste a intenção de recurso AGORA" antes da preclusão — e a que custo de construção/manutenção?*

## 2. Achados (reality-check real, 20/Mai)

**A) Não há API pública de estado de sessão ao vivo.**
- O **PNCP** é registro/agregador (editais, atas), **não** onde a sessão ao vivo roda.
- **Compras.gov.br/ComprasNet** mostra acompanhamento em tempo real (fases, propostas, chat, lances) mas **via UI** — sem API documentada de estado de sessão para licitante.
- **BLL/BNC/PCP/SISLOG**: sessão ao vivo roda atrás de login, sem API de sessão ao bidder.
- ⇒ Detecção ao vivo = **sessão autenticada monitorada** (headless/polling) OU **integração com robô existente**.

**B) 🔑 O monitoramento de sessão + alerta JÁ É COMMODITY.**
- **Lance Fácil** integra **BNC, BLL, BEC-SP, LicitaNet, Licitações-E, ComprasNet, ComprasNet.Ba, Portal de Compras Públicas**; *"monitora todos os portais e pregões que participou, e você não perde nenhuma mensagem — alertas por email ou celular"*; tem **API** para estratégias de lance. Concorrentes: **WaveCode** (robô de lances) e **LanceBot** (open-source, GitHub).
- ⇒ A parte "detectar movimentação e avisar" está resolvida no mercado **para 4 das 5 fontes**.

**C) A lacuna real é o SISLOG (Goiás estadual).** Não aparece na cobertura do Lance Fácil. É justamente a fonte estadual que a cliente usa.

**D) O que os robôs NÃO fazem (= o moat).** Eles avisam *"há movimentação"*. Nenhum traduz isso em **inteligência jurídica**: *"manifeste a intenção AGORA ou preclui"*, intenção≠razões, classificar defeito do vencedor (substantivo vs sanável), enquadrar recurso à autoridade superior. **Essa camada é nossa.**

## 3. Decisão arquitetural central

```
Detecção de estado da sessão  =  COMMODITY (comprar/integrar onde existe; thin adapter onde não)
Inteligência jurídica em cima  =  MOAT (construir — é o que o conclave Justen+Niebuhr define)
```

Isso **alinha com Pablo Hoffman** ("não scrape o que já existe; 4-5 scrapers de sessão é bomba-relógio de manutenção") e **competitor-watcher** ("o moat é o workflow, não o robô").

## 4. Arquitetura proposta

### 4.1 Máquina de estados da sessão (canônica, por pregão)
```
PROPOSTAS → DISPUTA(lances) → ENCERRAMENTO → CLASSIFICACAO_PROVISORIA
  → HABILITACAO_1o → RESULTADO(habilitado|inabilitado)
  → JANELA_INTENCAO_RECURSO  ← 🔴 evento crítico (preclusão)
  → PRAZO_RAZOES → CONTRARRAZOES → DECISAO
```

### 4.2 Source Adapter (interface por plataforma — padrão middleware, Pablo)
Cada fonte implementa o mesmo contrato e emite **eventos canônicos**; o miolo (state machine + alertas) é estável e agnóstico de fonte.
```ts
interface SessionAdapter {
  platform: 'pncp-compras' | 'bll' | 'bnc' | 'pcp' | 'sislog';
  // origem do estado: 'robot-api' (Lance Fácil-like) | 'authenticated-poll' (headless) | 'manual'
  mode: 'robot-api' | 'authenticated-poll' | 'manual';
  watch(processo: ProcessoRef): AsyncIterable<SessionEvent>;
  health(): AdapterHealth;            // breakage detection (Pablo)
}
type SessionEvent = {
  processo: ProcessoRef; ts: string;
  state: SessionState;                // enum da §4.1
  signals: {
    minhaPosicao?: number;            // ranking nos lances
    melhorLance?: number; meuLance?: number;
    empateFicto?: boolean;            // ME/EPP dentro de 5% (Niebuhr)
    janelaIntencaoAberta?: boolean;   // 🔴 gatilho do Alerta A
    prazoRazoesAteh?: string;         // gatilho do Alerta B
    vencedorDocsDisponiveis?: boolean;// gatilho Stage 6
  };
};
```

### 4.3 Pipeline de alertas (rule engine → push)
- **🔴 Alerta A — Preclusão (na sessão, segundos):** disparado por `janelaIntencaoAberta=true`. Texto orientado por Niebuhr: *"Janela de intenção de recurso ABERTA. Manifeste AGORA (ato, não as razões)."* Canal: WhatsApp + in-app, prioridade máxima, com **latência de detecção alvo < 30s** durante a janela.
- **Alerta B — Razões (deadline):** `prazoRazoesAteh` → countdown (3 dias úteis típ.) + apoio à redação. Minuta endereçada à **autoridade superior** (não reconsideração).
- **Alerta empate ficto:** `empateFicto=true` durante DISPUTA → *"preferência ME/EPP, você pode cobrir."*
- **Alerta vencedor-provisório:** `CLASSIFICACAO_PROVISORIA` + você é 1º → abre dossiê de habilitação por-edital (inversão de fases — só agora importa).
- **Gatilho perdedor (Stage 6):** `vencedorDocsDisponiveis` → varre doc do vencedor → **classifica substantivo vs sanável** antes de recomendar recurso.

### 4.4 Estratégia por fonte (matriz)
| Fonte | Modo recomendado | Por quê |
|---|---|---|
| BLL, BNC, PCP | `robot-api` (integrar Lance Fácil-like) | já cobrem monitoramento+alerta; não reinventar |
| Compras.gov.br/ComprasNet | `robot-api` ou `authenticated-poll` | coberto por robôs; UI estável |
| **SISLOG (GO)** | **`authenticated-poll` (thin adapter próprio)** | **lacuna do mercado — onde construímos** |
| qualquer (fallback) | `manual` (usuário marca "estou nesse pregão") | breakage / cobertura parcial |

## 5. PoC (escopo mínimo de validação)

**Hipótese a validar:** conseguimos disparar o Alerta A de preclusão de forma confiável em **UMA** plataforma, com latência < 30s, sem ser bloqueado.

**Escopo PoC (1-2 semanas):**
1. State machine + event bus + pipeline de alerta (agnóstico) — **construir** (é o moat, reaproveitável).
2. **1 adapter real:** preferir **SISLOG** (a lacuna que justifica existir) OU a plataforma #1 da cliente (depende de **D2**). Modo `authenticated-poll` com Playwright headless, sessão da cliente, polling adaptativo (denso durante DISPUTA/JANELA, esparso fora).
3. **Spike paralelo de integração:** avaliar a **API do Lance Fácil** (termos, o que expõe, custo de parceria) como fonte `robot-api` para BLL/BNC/PCP.
4. Alerta A real via WhatsApp Cloud API em 1 pregão de teste.

**Critério de sucesso:** Alerta A correto em ≥ 90% das janelas observadas, latência < 30s, zero bloqueio de conta na janela de teste.

**Kill/pivot criteria:**
- Se `authenticated-poll` no SISLOG quebrar > 1×/semana ou gerar risco de ban → pivotar SISLOG para `manual` + focar robot-api nas demais.
- Se a API do Lance Fácil cobrir bem BLL/BNC/PCP a custo aceitável → **comprar tudo o que ela cobre**, construir só SISLOG + a camada jurídica.

## 6. Riscos

| Risco | Severidade | Mitigação |
|---|---|---|
| **ToS das plataformas** proíbem automação de sessão (ban de conta) | 🔴 Alta | Revisar ToS (consultar @marcal-justen-filho/@bruce-schneier); preferir robot-api oficial; `manual` como fallback |
| **Credenciais da cliente** (logins dos portais) — segurança/LGPD | 🔴 Alta | Vault cifrado, escopo mínimo, consentimento; revisar com @ann-cavoukian |
| **Anti-bot / CAPTCHA / timeout de sessão** | 🟡 Média | Sessão real autenticada, AutoThrottle/politeness (Pablo), re-login resiliente |
| **Latência da janela de intenção** (segundos importam) | 🔴 Alta | Polling denso só durante DISPUTA/JANELA; alerta otimizado para latência |
| **Manutenção dos adapters** (Pablo: bomba-relógio) | 🟡 Média | Minimizar nº de adapters próprios (só SISLOG); health()+alerta de quebra+fallback humano |

## 7. Dependências e perguntas abertas
- **D2** (qual plataforma a cliente mais usa) define o adapter do PoC. **Bloqueante do PoC.**
- **D3** (build-vs-buy) → este spike recomenda **híbrido**: comprar/integrar onde é commodity (robot-api), construir SISLOG + a camada jurídica (moat).
- Termos/custo/cobertura reais da **API do Lance Fácil** (contato comercial).
- Tratamento das **credenciais** da cliente (decisão de segurança + LGPD).
- Revisão de **ToS** de cada plataforma quanto a automação (parecer jurídico do squad).

## 8. Recomendação
**Construir agora:** state machine + event bus + pipeline de alertas + **a camada de inteligência jurídica** (Alerta A preclusão, intenção≠razões, classificação substantivo/sanável, enquadramento do recurso) — é o moat e é reaproveitável em todas as fontes.
**Comprar/integrar:** detecção de sessão onde já é commodity (Lance Fácil-like) para BLL/BNC/PCP/ComprasNet.
**Construir mínimo:** 1 thin adapter `authenticated-poll` para **SISLOG** (a lacuna).
**Validar com PoC** de 1 plataforma antes de comprometer as 5.

---

**Sources (reality-check):**
- [ComprasNet — Acompanhamento de Licitações](https://comprasnet.gov.br/livre/Pregao/lista_pregao_filtro.asp?Opc=2) · [Compras.gov.br — Consulta Detalhada](https://www.gov.br/compras/pt-br/acesso-a-informacao/consulta-detalhada) · [PNCP editais](https://pncp.gov.br/app/editais)
- [Lance Fácil — site](https://www.lancefacil.com/) · [Lance Fácil — robô de lances](https://blog.lancefacil.com/robo-de-lances-automaticos/) · [WaveCode — robô de lances](https://www.wavecode.com.br/solucao/robo-de-lances/) · [LanceBot (OSS)](https://github.com/RodrigoRMarinho/LanceBot)

*Spike conduzido por aios-master, ancorado no squad (Justen + Niebuhr + Pablo Hoffman) e em reality-check web real.*
