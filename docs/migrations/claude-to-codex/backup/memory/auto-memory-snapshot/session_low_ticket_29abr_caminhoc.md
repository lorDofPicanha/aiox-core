---
name: Sessão Low Ticket 29/Abr — Caminho C + 6 PNGs Anti-AI
description: Log da sessão 29/Abr noite onde user escolheu Caminho C, eu mandei 6 prompts ChatGPT image gen com diretivas anti-AI rigorosas (Kodak Portra 400, Brazilian phenotype, NO text overlay, etc), user validou os 6 PNGs como excelentes, eu pausei campanha velha + editei .env. Pre-restart concluído.
type: project
originSessionId: 168016ff-f374-4ca0-b39e-9fe6e2ae658a
---
# Sessão Low Ticket 10k — 29/Abr noite

## Contexto inicial
- User pediu status do projeto Low Ticket
- Eu li reminder do 27/Abr noite — Vorza nunca rodou, 2 ad accounts diferentes, escolha B vs C pendente
- User: "vamos de caminho c, eu tenho acesso ao char gpt imagens 2"

## Fluxo da conversa (decisões importantes)

### 1. Primeira tentativa de prompts → REJEITADA
Mandei 4 prompts iniciais com:
- Tipografia overlay ("R$37" desenhado na imagem)
- Composições "designed" (split-screen, hourglass+coins)
- Golden hour clichê
- Stock pose (lawyer at city skyline)

**User pushback:** "não quero que tenha a aparencia de craitivo barato gerado por ia"

→ **Lição salva como feedback rule** (`feedback_ai_image_anti_tells.md`)

### 2. Segunda rodada — prompts anti-AI rigorosos
Reescrevi os 4 prompts com diretivas:
- Kodak Portra 400 / Cinestill 800T / Kodak Gold 200 / Fujifilm Pro 400H
- Real Brazilian phenotype com poros, rugas, cabelo grisalho natural
- NO text overlay (texto vai TODO no Meta copy field)
- Asymmetric framing
- Single natural light source
- Real lived-in environments (Vade Mecum, copo americano, Folha SP, Galinha Pintadinha)
- Candid moment, NOT posed
- "ABSOLUTELY NO" list explícita (studio lighting, ring light, beauty filter, etc)

### 3. User pediu variantes 4B (sem família) e variante PAI brincando
- 4B sem família: ofereci 3 cenas (violão balcão, café com livro, corrida orla, churrasco amigos)
- User: "acho a cafe com livro melhor"
- Mandei prompt detalhado café de bairro Vila Madalena/Pinheiros + livro literário + Folha SP + pão de queijo
- User também adicionou variante PAI brincando além da MÃE → cobertura visual mãe + pai + solo café

### 4. Distribuição final dos 6 PNGs
**Adset C1 INT Advocacia + OAB (R$37/d):**
- Ad #1 — DOR DO TEMPO
- Ad #2 — FOMO Concorrência

**Adset C3 BROAD Superior 25-55 (R$37/d):**
- Ad #3 — R$37 still-life
- Ad #4 — Mãe brincando feliz
- Ad #5 — Pai brincando feliz (mesmo cenário, A/B controle ideal)
- Ad #6 — Solo café com livro

Lógica: Meta Advantage+ otimiza dinamicamente — mãe pra mulheres, pai pra homens, café pra perfis sem sinais família. Mesmo cenário visual nos dois (mãe/pai) = controle perfeito pra Meta isolar variável gênero.

### 5. User entregou os 6 PNGs em `D:/AIOS/docs/projects/low-ticket-10k/`

Validei visualmente — TODOS PASS:
- C1-A Dor do Tempo: advogado 23h escritório real, mesa cluttered, rim light janela com bokeh cidade
- C1-B FOMO: 2 advogados corredor, contraste cansado/relaxado, pasta amarela, planta canto
- C3-A R$37 still-life: Casio MQ-24, copo americano com ring stain, Vade Mecum p.1147-1148, Post-it rabiscado à mão
- C3-B Mãe: riso real, Galinha Pintadinha azul, blocos coloridos, cesto roupa, TV Bita ao fundo
- C3-B Pai: MESMO cenário (controle visual perfeito), só varia protagonista
- C3-B Café: Folha de S.Paulo visível, pão de queijo, café cremoso, outro leitor blurred

### 6. Bloqueio descoberto: MCP "vorza" alias = ad account ERRADA
`meta_ads_list_accounts` mostrou:
- `vorza` → `act_793656664671388` (a errada — fora BM Vorza, sem pixel)

Pra rodar Caminho C precisava da ad account correta `act_1444169067353681` (dentro BM Vorza, pixel attached).

### 7. Pre-restart actions feitas
1. Pause campanha velha `120242728863470621` em act_793656664671388 (cosmético)
2. Edit `.env` em `D:/jarvis/mcp-ads-bridge/.env`:
   - `META_ADS_ACCOUNT_VORZA_ID=act_793656664671388` → `act_1444169067353681`
   - Comentário inline com data + razão da troca
3. Pedi user pra reiniciar Claude Code

### 8. ESTADO ATUAL: aguardando restart

## Aprendizados técnicos da sessão

### MCP bridge .env — pattern de troca de account ID
- Trocar `META_ADS_ACCOUNT_<NAME>_ID` requer restart (env vars só recarregam no startup)
- Token e App ID/Secret podem permanecer iguais se mesma BM (Vorza tem App próprio: 2007697866847741)
- Pausar campanha velha ANTES de trocar alias = boa prática (limpa estado em ID que vai sumir do MCP)

### ChatGPT image gen — qualidade real vs AI cafona
Diretivas que FUNCIONARAM 6/6:
- Especificar película (Kodak Portra 400, Cinestill 800T, Kodak Gold 200)
- "Real Brazilian phenotype" + descrever marcas reais (gray temples, laugh lines, slight stubble)
- Listar OBJETOS BRASILEIROS específicos (copo americano, Vade Mecum, Galinha Pintadinha, Folha SP, Casio MQ-24, pão de queijo)
- Single natural light source + real shadows
- Asymmetric framing
- "ABSOLUTELY NO" list explícita
- "Must look like real candid moment from Brazilian Sunday newspaper photo essay"

Diretivas que FALHARAM (primeira tentativa):
- Tipografia overlay
- Composição centrada/simétrica
- Split-screen designed
- Golden hour
- Stock pose ("lawyer looking at city")
- Hourglass + coins (genérico AI)

### Distribuição estratégica de variantes humanas
Quando o ad é sobre "tempo livre / valor do tempo" e o público é amplo:
- Variantes mãe + pai com MESMO cenário = controle visual perfeito
- Variante solo (café/violão) = cobre perfis sem children-related signals
- Meta Advantage+ otimiza dinamicamente por sinais comportamentais

## Arquivos criados/editados
- `D:/jarvis/mcp-ads-bridge/.env` — VORZA_ID trocado
- `D:/AIOS/docs/projects/low-ticket-10k/*.png` — 6 PNGs novos (gerados pelo user)
- `reminder_low_ticket_live_24abr.md` — atualizado pra refletir Caminho C in progress
- `feedback_ai_image_anti_tells.md` — novo (lição anti-AI)
- `session_low_ticket_29abr_caminhoc.md` — este arquivo

## Quando user voltar pós-restart
Trigger: "voltei" ou similar
Continuar do passo 4 do plano (validar pixel + acesso) → upload 6 PNGs → criar campanha+adsets+ads PAUSED.
TaskList desta sessão tem tasks #3 (in_progress), #4, #5, #6 pendentes.
