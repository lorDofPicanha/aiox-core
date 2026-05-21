# Conclave — Como melhorar o buscador e como ele funciona na prática

**Data:** 2026-05-20 · **Engine:** HYDRA real (`self-consultation.js`) · **Projeto:** buscador-licitacoes
**Painel:** Marçal Justen Filho (núcleo prático), Pablo Hoffman (ingestão), Werner Vogels (escala), Competitor Watcher (Lance Fácil)
**Conclave ID:** a6e5421c-af75-4d8d-8807-0a5ce1d426b6

> Cada posição abaixo é ancorada na DNA real do clone (princípios extraídos de fontes primárias). A condução do debate é do orquestrador (aios-master).

---

## Posições

### 🏛️ Marçal Justen Filho — o que a prática da Lei 14.133 muda no design
Ancorado em 5 princípios reais dele (vinculação ao edital, isonomia × vantajosidade, habilitação é teto, repressão ao formalismo vazio, proporcionalidade):

1. **Vinculação ao edital = o edital é a "lei interna" do certame.** ⇒ O dossiê de habilitação (Stage 4) tem de ser gerado **por edital, a partir do texto dele** — não de um checklist genérico. Cada edital define seus próprios requisitos; o sistema extrai e confere contra o que aquele edital exige.
2. **"Habilitação é teto, não piso".** ⇒ Quando um edital exige requisito **acima** do que a lei autoriza, há fundamento de **impugnação**. Isso é uma *feature nova*: um radar que detecta exigência ilegal/excessiva = oportunidade de impugnar (e de afastar concorrentes ou abrir o certame).
3. **Repressão ao formalismo vazio + saneamento (art. 64).** ⇒ Defeito meramente formal costuma ser **sanável** via diligência. O sistema **não deve mandar desistir** num erro formal — deve sinalizar "provavelmente sanável, peça diligência".
4. **Recurso é janela com preclusão (Stage 6).** ⇒ A **intenção de recurso** no pregão precisa ser registrada **na própria sessão, motivada**, sob pena de preclusão. Isso **redefine a dor #1**: não é "posso perder o lance" — é "perco o **direito de recorrer** se não registrar a intenção em minutos".
5. **Dispensa eletrônica (art. 75) é outro animal.** ⇒ Domina o volume (1.675/semana em GO), mas tem prazo curto, habilitação simplificada e menos formalidade. Merece um **fluxo fast-lane** distinto do pregão.
   - Bônus: **ME/EPP têm empate ficto** (LC 123, art. 44-45 — cobrir proposta dentro de 5% no pregão). Sinal de "licitação ganhável" que ninguém desenhou.

### 🕷️ Pablo Hoffman — ingestão e a armadilha de manutenção
Ancorado na DNA real (ética no uso não no código; boilerplate×extração; vertical×horizontal; AutoThrottle; breakage-is-default):

- **Prefira a API oficial.** PNCP tem API REST — **não faça scraping do que a API entrega**. Scrape só o gap (D+0/D+1 e campos específicos de plataforma).
- **O problema não é volume (horizontal), é manutenção (vertical).** 444 municípios × 5 plataformas = muitos *adapters* para manter e **monitorar quebra**, não muita página. Para um operador solo, **4-5 scrapers de sessão autenticada é uma bomba-relógio de manutenção**.
- **Breakage é o estado default.** Portais gov mudam sem aviso ⇒ detecção de quebra + alerta + **fallback humano** obrigatórios. AutoThrottle/politeness com gov.
- **Adapters como middlewares + schema canônico.** Cada fonte vira um adapter fino; o miolo é estável.

### ☁️ Werner Vogels — escala e custo
- **"Tudo falha o tempo todo".** Ingestão idempotente; desacoplar ingestão de análise; event-driven.
- **450-600 contratações/dia é volume trivial** para infra moderna — **não é problema de escala.** O custo real é **LLM parsing por edital**.
- ⇒ **Filtrar ANTES de parsear.** CNAE + palavra-chave + raio gateiam o parsing caro. Parsear só os matches filtrados.

### 🔍 Competitor Watcher — Lance Fácil
- Lance Fácil **já** faz lance automático + monitoramento de chat em BLL/BNC. **Não** faz: workflow de 6 estágios, dossiê de habilitação, estratégia de recurso, inteligência regional/raio, análise histórica.
- ⇒ **O moat NÃO é o robô de lance** (commoditizado). É o **workflow ponta-a-ponta + inteligência prática de licitação** (a camada Justen). Não competir no robô — **integrar ou pular**.

---

## CONSENSO
- **PNCP API é a espinha de descoberta**; scraping só no gap. (Pablo + Werner)
- **O moat é o workflow + inteligência jurídica prática**, não o robô de lance. (Justen + Competitor + implícito Cagan)
- **Filtrar antes de parsear** para controlar custo de LLM. (Werner + Pablo)
- **Dossiê de habilitação por-edital**, não genérico. (Justen + Pablo: adapter por fonte)

## DISSENSO
- **Stage 5 (monitoramento de sessão em tempo real):** Pablo puxa para **não construir** (armadilha de manutenção) → integrar/Lance Fácil. Justen **reenquadra**: o crítico em tempo real não é o lance — é a **janela de intenção de recurso (preclusão)**. ⇒ Possível MVP **mais leve** (poller de mudança de status + alerta de fase recursal) em vez de scraper de sessão completo. **Decisão D3 fica mais nuançada.**
- **Foco estratégico: dispensa (volume) vs pregão (valor + moat).** Justen: dispensa é volume e baixa formalidade; o moat (habilitação + recurso) brilha no **pregão**. Otimizar para qual primeiro?

## PONTOS CEGOS (o que o time não tinha visto)
1. **Preclusão recursal** redefine a dor #1: SLA de notificação é **legalmente crítico (minutos)**, atado à intenção de recurso — não "bom saber".
2. **Radar de impugnação** ("habilitação é teto"): detectar exigência ilegal vira **feature de valor** — ninguém tinha proposto.
3. **Saneamento de falhas (art. 64):** defeito formal ≠ derrota; sistema deve sinalizar "sanável".
4. **Empate ficto ME/EPP:** sinal de "ganhável" não desenhado.
5. **Custo de manutenção dos adapters** (Pablo) está subestimado para operador solo.

## VEREDITO — melhorias acionáveis (priorizadas)
1. **Reescopar Stage 5 em torno da preclusão recursal**, não de "movimentação" genérica. MVP: poller de mudança de status + alerta de fase de lance/recurso nas plataformas que a cliente mais usa (depende de D2). Scraper de sessão completo só onde valer.
2. **Dossiê de habilitação por-edital** (vinculação ao edital) — extrair requisitos do texto, conferir contra documentos da cliente. (Stage 4)
3. **🆕 Radar de impugnação/recurso:** detectar (a) exigência de habilitação acima da lei e (b) defeito formal provavelmente sanável → transformar a doutrina do Justen em features. **Moat forte.**
4. **Fast-lane de dispensa** separado do fluxo completo de pregão (volume vs formalidade).
5. **Arquitetura filtrar-antes-de-parsear** (Werner): filtro CNAE/keyword/raio gateia o LLM.
6. **Não construir o robô de lance** — integrar Lance Fácil ou pular; competir no workflow. (Competitor + Pablo)
7. **Adapters como middlewares + alerta de quebra + fallback humano** (Pablo); orçar tempo de operação para manutenção.
8. **🆕 Detector de empate ficto ME/EPP** como sinal de "ganhável".

---

*Conclave conduzido por aios-master. Clones ancorados em fontes primárias reais (ver `marcal-justen-filho.md` §sources e `pablo-hoffman.md` §sources).*
