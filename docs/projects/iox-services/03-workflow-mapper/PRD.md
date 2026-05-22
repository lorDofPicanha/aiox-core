# #03 — Workflow Mapper from Audio/Video

**Tier:** S
**Status:** ⚪ pending
**Case validador:** Lígia (TJ) gravou tela + áudio falando o que faz → squad nasceu daí. Alan mencionou explicitamente como tool de mapeamento de Hormozi videos.

---

## DSPC

**D — Dor cara:**
Empresário/profissional tem **workflow tácito** (na cabeça, no costume) que ele faz há anos. Quer terceirizar OU automatizar, mas não consegue documentar — leva 1 dia escrevendo SOP e fica pela metade. Sem SOP claro, não dá pra automatizar nem treinar funcionário novo. Custo escondido: 1-2 dias úteis de profissional sênior tentando documentar processo + falha em capturar 30% das decisões implícitas.

**Custo semanal visível:** empresa com 5-10 processos não-documentados perdendo 1 funcionário sênior 8h/sem em onboarding/training repetitivo. Hora sênior R$200-400 = R$1.600-3.200/sem.

**S — Squad:**
- `agent-transcriber` — Whisper local (zero token-cost), suporta áudio + vídeo
- `agent-screen-analyzer` — quando há vídeo de tela: extrai cliques, navegação, padrões
- `agent-pop-extractor` — converte transcrição em SOP estruturado (steps, decisions, exceptions)
- `agent-workflow-mapper` — gera diagrama de fluxo (Mermaid/draw.io)
- `agent-llm-router` — decide onde IA é necessária vs onde script determinístico basta
- `agent-squad-generator` — cria especificação do squad final (qual agent faz cada step)
- `agent-cost-estimator` — projeta custo de tokens e ROI

**P — Pitch:**
> "Eu ajudo empresários e profissionais especialistas a transformar workflows tácitos em squads autônomos usando engenharia reversa de áudio/vídeo para alcançar processos documentados E automatizados em uma semana, em vez de meses tentando escrever SOPs"

**C — Contrato:**
- Setup: R$8k-20k por workflow mapeado + squad gerado
- Pacote: R$40k-80k por "mapeamento + 5 squads de áreas críticas"
- Manutenção: R$2-5k/mês (manutenção dos squads, novas versões conforme processo evolui)

---

## Vertical inicial sugerido

**Recomendado: Profissionais especialistas premium** (médicos, advogados, consultores) que querem escalar sem perder qualidade.

Sub-verticais quentes:
- Consultor estratégico que faz mesma análise 50 vezes/ano
- Médico high-ticket que tem protocolo padronizado mas faz tudo na mão
- Advogado especialista (tipo Lígia) que automatiza próprio processo

**Alternativas:**
- Empresários de PME com processo administrativo repetitivo
- Times de operação SaaS (atendimento, billing, churn ops)

---

## Reuse de assets AIOS

| Asset | Função |
|---|---|
| `sop-extractor` (já temos!) | Core do squad — agent extrai SOPs de conteúdo/interviews |
| `pedro-valerio` | Process audit — garante zero wrong paths, veto conditions, checkpoint coverage |
| `agent-architect` | Design da arquitetura do squad gerado |
| `agent-data-engineer` | Schema de processos extraídos |
| Whisper local (script já temos rodando — acabou de transcrever 4h29min em 74min) | Transcrição zero-cost |
| HYDRA pipeline | Pra mapeamento profundo de workflows similares no mercado |
| 162 mind clones | Validação cruzada: "Pedro Valerio + Martin Fowler concordam que esse fluxo está completo?" |

---

## Stack técnico proposto

- **Transcrição:** faster-whisper medium CUDA (script `transcribe-audios.py` existente, validado em 4h29min de áudio)
- **Análise de vídeo:** OCR de tela + extração de cliques via FFmpeg + Gemini Vision (multimodal)
- **AI:** Codex pra SOP extraction; Cloud Opus pra refinamento crítico do squad spec
- **Output:** Markdown SOP + Mermaid diagram + YAML squad spec compatível com AIOS
- **Hospedagem:** rodando no AIOS local do cliente OU dashboard nosso (acessado read-only)

---

## Roadmap de execução

| Fase | Duração | Entregável |
|---|---|---|
| **Brainstorm DSPC** | 2h | Vertical confirmado, ICP, ROI estimado |
| **Discovery** | 1-2 dias | Identificar profissional piloto (rede dos clientes Tocks/Bretda?) |
| **PRD detalhado** | 4-6h | Spec dos 7 agents + fluxo end-to-end |
| **MVP — só áudio** | 3-4 dias | Pipeline áudio → SOP estruturado + squad spec gerado |
| **MVP — vídeo** | 1 semana | Adiciona análise de tela/cliques (mais complexo) |
| **Smoke test** | 1 semana | Cliente piloto manda 3-5 áudios → squads gerados → cliente valida |
| **Refinamento** | 1 semana | Ajustes pós-feedback |

**Tempo total até primeiro contrato:** ~4-5 semanas.

---

## Hipóteses críticas

1. ✅ Whisper local pipeline rodando (acabou de transcrever 4h29min de áudio na nossa máquina)
2. ✅ AIOS já tem `sop-extractor` + `pedro-valerio` (process absolutist)
3. ❓ Qualidade da extração de SOP de áudio "natural" (vs roteirado) — precisa spike
4. ❓ Análise de vídeo de tela é cara em tokens — vale o custo?
5. ❓ Quem é o primeiro cliente?

---

## Riscos

- **Risk-1:** Workflow tácito tem decisões implícitas que áudio não captura → mitigar: agent de "perguntas de gap" que faz follow-up com cliente após primeira passada
- **Risk-2:** Cliente não quer revelar workflow secret-sauce → mitigar: rodar squad NO AMBIENTE DELE, nada sai do servidor dele
- **Risk-3:** SOP gerado fica genérico demais → mitigar: gate Pedro Valerio (veto se não houver checkpoint, error path, recovery)

---

## Diferencial vs concorrência

- **vs SOP humano:** 10x mais rápido, 0% esquecimento de detalhe
- **vs Process AI startups (Glean, etc.):** entrega squad RODANDO, não só documentação
- **vs serviço consultoria tradicional:** 1/20 do preço

---

## Próximas ações

- [ ] Brainstorm DSPC formal
- [ ] Spike: rodar pipeline em 1 áudio piloto de processo conhecido (ex: gravar 20min explicando como Tocks processa pedido de cliente)
- [ ] Tech research: análise de vídeo de tela (OCR + Vision multimodal — quanto custa por hora de vídeo?)
- [ ] Identificar piloto: alguém da network Bretda/Tocks com processo claro a documentar

Trigger: `kickoff workflow-mapper`
