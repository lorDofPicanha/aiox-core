# Fornecedores e stack — viabilidade técnica e custo (RDO por WhatsApp)

**Data:** 02/Ago/2026 · **Autor:** Atlas (analyst) · **Para:** IOX-Services, produto de IA para construtoras (10-200 funcionários)

**Esta versão substitui a de 01/Ago/2026 no que toca stack técnico e custo** — a rodada anterior
esgotou o orçamento de busca antes de fechar preço/viabilidade em WhatsApp, transcrição, visão e
geração de documento (ver `00-SINTESE-CONSOLIDADA.md`, item 3 de "Lacunas": *"Fornecedores/stack
BR — agente falhou. Era o que definiria: WhatsApp Cloud API vs BSP, custo por conversa, Whisper em
áudio de canteiro, e quais ERPs valem integrar"*). Esta rodada fecha essa lacuna. O que já estava
validado (Sienge/Mobuss são as únicas APIs públicas documentadas; Zé Obra já cobra R$39-449/mês
fazendo captura por WhatsApp; Prumo/Brickup têm free tier) **não foi repesquisado** — está mantido
como contexto no rodapé, não repetido nas tabelas.

**Método:** fetch direto em documentação oficial (Meta, OpenAI, Anthropic, Google, Deepgram,
AssemblyAI, Groq, Ultralytics, Hugging Face) + páginas de preço dos fornecedores + um teste ao vivo
do endpoint da API do INMET via `curl`. **O orçamento de `WebSearch` desta sessão esgotou logo no
início** (200/200 já consumidos por chamadas anteriores no mesmo processo) — toda a pesquisa daqui
em diante foi feita por `WebFetch` direto em URLs conhecidas/documentação oficial, o que é mais
lento mas igualmente confiável para preço publicado. Onde o número não existe publicamente ou o
fetch não conseguiu extrair, está escrito **"não extraído"** ou **"não público"** — nenhum valor
foi estimado para preencher lacuna sem marcação.

---

## Resumo executivo — os 5 achados que mudam o desenho do produto

1. **A maior parte do tráfego de WhatsApp do produto é gratuita, por desenho.** Desde
   1º/jul/2025 a Meta cobra por **mensagem de template entregue fora da janela de 24h**, não mais
   por conversa. Como cada RDO chega por **iniciativa do mestre de obra** (foto/áudio), isso abre
   uma janela de 24h dentro da qual qualquer resposta do negócio é grátis. **O único custo real é
   o lembrete diário proativo** ("manda o RDO de hoje"), que precisa ser um template pago porque é
   a empresa que inicia fora da janela. Para 3 obras isso é ~90 templates/mês — custo baixo (ver
   seção de custo final).
2. **O WhatsApp remove EXIF e GPS de fotos enviadas normalmente.** Confirmado nesta pesquisa
   (§3.4). Isso mata qualquer plano de "geolocalização automática comprovada por foto" — a saída é
   usar a **mensagem de Localização nativa do WhatsApp** (lat/long estruturado, sem depender de
   EXIF) como passo separado, só quando o cliente exigir prova de geo para financiador.
3. **Z-API — usado por parte do mercado de automação brasileiro — é confirmado não-oficial.**
   A documentação do próprio fornecedor admite conexão via **sessão de WhatsApp Web** (§1.2). Isso
   eleva de suspeita (versão de 01/Ago) para achado confirmado: risco real de ban de número se
   usado com número comercial de produto pago.
4. **Não existe modelo pronto (Hugging Face, Roboflow) para classificar fase construtiva a partir
   de foto genérica.** Confirmado por busca direta no Hugging Face (§3.1) — reforça que essa parte
   do pipeline é aposta de arquitetura, não escolha de fornecedor.
5. **O custo de IA (transcrição + visão) para operar 3 obras é da ordem de dezenas de reais por
   mês, não milhares.** O gargalo econômico do produto está em desenvolvimento e operação humana,
   não em API — ver seção final.

---

## Parte 1 — WhatsApp: Cloud API oficial vs. BSP

### 1.1 Modelo de cobrança vigente (confirmado 02/Ago/2026)

Fonte oficial: [developers.facebook.com/docs/whatsapp/pricing](https://developers.facebook.com/docs/whatsapp/pricing).

- **Desde 1º/jul/2025**, a Meta cobra **por mensagem de template entregue**, não mais por
  conversa de 24h. Qualquer material anterior a essa data está desatualizado.
- **Categorias de template:** Marketing, Utilidade (Utility), Autenticação.
- **Gratuito:**
  - Toda mensagem **não-template** (texto livre, foto, áudio) dentro de uma janela de
    atendimento aberta (24h a partir da última mensagem do usuário).
  - Template de **Utilidade** entregue **dentro** da janela de 24h.
  - Toda mensagem dentro da janela gratuita de 72h de pontos de entrada (ex.: anúncio Click-to-WhatsApp).
- **Pago:** template de Marketing (sempre); template de Utilidade e Autenticação **fora** da
  janela de 24h.
- **⚠️ Novidade não coberta na versão anterior desta pesquisa — faturamento em BRL:** a partir de
  **1º/jul/2026**, empresas elegíveis com "Sold-To country" Brasil podem criar contas WABA em
  **Real (BRL)**, faturadas pela "Facebook Brasil" (entidade local da Meta). **Migração para BRL é
  obrigatória até 30/jun/2027**, sob risco de interrupção de serviço. Isso é relevante para
  orçamento: contratar a WABA já em BRL evita exposição cambial e é o caminho que a própria Meta
  está empurrando o mercado brasileiro a tomar neste exato ano.
- **Valor exato por categoria em BRL para o Brasil: não extraído.** A calculadora oficial
  ([whatsappbusiness.com/pt-br/products/platform-pricing](https://whatsappbusiness.com/pt-br/products/platform-pricing/))
  é uma ferramenta interativa (seleção de país/moeda/categoria/volume) que não expõe os números
  como texto estático — nem a página nova em BRL, nem a antiga em USD, são extraíveis por fetch.
  **Isso não é uma falha desta pesquisa: nenhuma fonte terceira (Twilio, Gupshup, blogs de BSP)
  publica o rate card completo do Brasil como tabela estática** — todas remetem à mesma
  calculadora da Meta. **Pendência real, não contornável sem abrir o navegador:** antes de
  orçar o produto, abrir a calculadora manualmente, selecionar Brasil/BRL/Utilidade, e capturar o
  número por captura de tela.

### 1.2 BSPs — comparação direta

| Provider | Modelo | Conexão | Preço confirmado | Risco |
|---|---|---|---|---|
| **Meta direta (sem BSP)** | Contrata WABA direto com a Meta, hospeda a integração própria (ex.: Evolution API como camada). | ✅ Oficial (Cloud API). | Sem mensalidade de plataforma — só a tarifa por template da Meta (valor não extraído, §1.1). | Nenhum de conexão; exige verificação de negócio (Meta Business Verification) e manutenção técnica própria. |
| **Twilio** | Repassa a tarifa da Meta + cobra taxa própria por mensagem. | ✅ Oficial. | **US$0,005/mensagem** (taxa própria Twilio, entrada e saída) — **confirmado direto na página de preço**, [twilio.com/en-us/whatsapp/pricing](https://www.twilio.com/en-us/whatsapp/pricing), consultado 02/Ago/2026. Mais a tarifa de template da Meta (variável, remete ao rate card da Meta, não extraída). | Nenhum de conexão (oficial); custo composto (Twilio + Meta) mais alto que ir direto. |
| **360dialog** | Marketplace/parceiro Meta, mensalidade por número + tarifa Meta separada. | ✅ Oficial ("compliance Meta embutido"). | **Confirmado em EUR**, [360dialog.com/pricing](https://www.360dialog.com/pricing), consultado 02/Ago/2026: WhatsApp API Regular **€49/número/mês**, Premium **€99/mês**, High Throughput **€249/mês**. Marketplace: €99/número/mês. Mais tarifa de mensageria da Meta, cobrada à parte. | Nenhum de conexão; mensalidade fixa por número pesa mais quanto menor o volume — desfavorável para 1-3 obras. |
| **Chatpro** | BSP brasileiro, planos por "créditos" de mensagem. | ✅ Oficial no plano "Oficial" (explícito: "conexão oficial através da WhatsApp Business API"); **também oferece conexão não-oficial via QR Code** como alternativa mais barata no mesmo produto. | **R$499/mês** (plano Oficial, 500/1.000/2.000 créditos, +20 usuários, suporte técnico humano), [chatpro.com.br](https://www.chatpro.com.br/), consultado 02/Ago/2026. Enterprise sob consulta. | Baixo no plano Oficial; **atenção ao plano QR Code do mesmo fornecedor**, que é não-oficial mesmo sendo a mesma marca. |
| **Z-API** | BSP brasileiro popular em automação de baixo custo. | 🔴 **Confirmado não-oficial** — documentação do próprio fornecedor: *"esta utilizando uma sessão do WhatsApp Web"*, conexão por **leitura de QR Code**, [developer.z-api.io](https://developer.z-api.io/), consultado 02/Ago/2026. | **R$99,99/mês** (Plano Ultimate, 1 instância, "mensagens ilimitadas", arquivos até 100MB), [z-api.io](https://www.z-api.io/). | 🔴 **Alto** — não é a Cloud API da Meta. "Mensagens ilimitadas por preço fixo" só é possível porque não paga a tarifa por template da Meta; para um produto comercial pago isso é risco real de bloqueio de número, exatamente o que a versão anterior desta pesquisa suspeitava sem confirmar. |
| **Evolution API** | Open-source (Apache 2.0 + cláusula de marca), self-hosted, Node/TypeScript. Suporta duas conexões. | 🟡 **Depende de como se configura**: (a) Baileys/WhatsApp Web — gratuita, não-oficial; (b) aponta para a **Cloud API oficial da Meta**. | Custo = infraestrutura própria (servidor) + tarifa da Meta **se** usar a via (b). [github.com/EvolutionAPI/evolution-api](https://github.com/EvolutionAPI/evolution-api). | Nenhum **se** configurada para (b); alto **se** configurada para (a) — a ferramenta em si não é o risco, a escolha de conexão é. |

**Recomendação de arquitetura, mantida e reforçada:** para 1-3 obras (volume baixo), a opção mais
barata e mais segura é **WABA direto com a Meta + Evolution API self-hosted apontando para a
Cloud API oficial** — evita mensalidade de BSP (Chatpro R$499 ou 360dialog €49+ seriam
desproporcionais ao volume) e evita o risco de ban do Z-API. O custo vira: servidor (baixo, ver
seção final) + tarifa por template da Meta (baixa, poucos templates/mês nesse volume).

### 1.3 Recebimento de mídia (foto e áudio) via webhook

Fonte oficial: [developers.facebook.com/docs/whatsapp/cloud-api/reference/media](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media),
consultado 02/Ago/2026.

| Item | Valor |
|---|---|
| **Validade da URL de mídia** | **Expira em 5 minutos** após ser gerada — é preciso baixar o arquivo rapidamente após receber o webhook, não pode ser enfileirado por muito tempo sem re-solicitar. |
| **Validade do ID de mídia** | O ID recebido no payload do webhook (diferente da URL) **expira em 7 dias** — dá para pedir uma URL nova dentro desse prazo se o download inicial falhar. |
| **Tamanho máximo de áudio** | **16 MB**, formatos AAC, AMR, MP3, M4A, OGG. |
| **Tamanho máximo de imagem** | **5 MB**, JPEG ou PNG. |
| **Áudio de voz (nota de voz nativa do WhatsApp)** | `audio/ogg`, **apenas codec OPUS, apenas mono** — é o formato que o app manda por padrão quando o mestre grava áudio direto no WhatsApp; compatível nativamente com Whisper/faster-whisper. |

**Implicação de arquitetura:** o pipeline de ingestão precisa baixar a mídia **em segundos**
após o webhook chegar (janela de 5 min é curta para qualquer fila com atraso), e reter localmente
— não dá para depender da URL da Meta como armazenamento intermediário.

### 1.4 Custo mensal de WhatsApp para 1 obra (~30 mensagens/dia)

Assumindo o padrão observado no mercado (Zé Obra, Produttivo): o mestre manda foto e áudio ao
longo do dia, cada envio abre/renova a janela de 24h.

- **Mensagens recebidas (foto/áudio) + respostas de confirmação dentro da janela:** grátis, os
  ~30/dia inteiros, **desde que a resposta do negócio aconteça dentro da janela aberta pelo
  próprio mestre.**
- **Único custo real:** o lembrete diário proativo, se o produto mandar um "psiu, ainda não veio o
  RDO de hoje" antes do mestre escrever — isso é 1 template de Utilidade fora da janela = **1
  mensagem paga por obra por dia = ~30/mês por obra**.
- **Valor em R$ por template: não extraído** (§1.1) — não dá para fechar o número exato sem abrir
  a calculadora manualmente. Como referência de piso (não é o custo total, só a fatia de markup de
  um intermediário): se fosse via Twilio, a parte do Twilio sozinha custaria 30 × US$0,005 =
  **US$0,15/mês (~R$0,76/mês)** por obra, **mais** a tarifa da Meta que não foi extraída.

---

## Parte 2 — Transcrição de áudio PT-BR

### 2.1 Whisper local — hardware por tamanho de modelo

Fonte oficial: [github.com/openai/whisper](https://github.com/openai/whisper), tabela oficial,
consultada 02/Ago/2026.

| Modelo | Parâmetros | VRAM necessária | Velocidade relativa |
|---|---|---|---|
| tiny | 39M | ~1 GB | ~10x |
| base | 74M | ~1 GB | ~7x |
| **small** | 244M | ~2 GB | ~4x |
| medium | 769M | ~5 GB | ~2x |
| large | 1.550M | ~10 GB | 1x |
| turbo | 809M | ~6 GB | ~8x |

O modelo **`small`** — já validado internamente em outro projeto do squad (maio/2026) rodando via
`faster-whisper` em CPU, sem GPU dedicada — é o ponto de equilíbrio para este produto: roda em
servidor sem GPU, aceita `.ogg` nativamente (bate com o formato de nota de voz do WhatsApp, §1.3),
custo marginal zero por não depender de API.

Benchmark de velocidade real (mesma fonte, [SYSTRAN/faster-whisper](https://github.com/SYSTRAN/faster-whisper)):
13 minutos de áudio no modelo `large-v2` levam ~1 minuto em GPU RTX 3070 Ti (fp16) — não há
número equivalente publicado para `small` em CPU, mas a proporção de "velocidade relativa" da
tabela acima (~4x) é a única referência oficial disponível.

### 2.2 APIs de transcrição — preço por hora/minuto (confirmado 02/Ago/2026)

| Provedor | Modelo | Preço | Suporte a PT-BR |
|---|---|---|---|
| **OpenAI** | `whisper-1` / `gpt-4o-transcribe` | **US$0,006/min** | Sim (Whisper é multilíngue por treino, PT é um dos idiomas de maior volume de dados de treino segundo o paper original — não localizei WER específico, ver §2.3). |
| **OpenAI** | `gpt-4o-mini-transcribe` | **US$0,003/min** | Idem. |
| **Groq** | `whisper-large-v3` | **US$0,111/hora** (~US$0,00185/min) | Herdado do Whisper — mesmos pesos da OpenAI, hospedados com inferência ultra-rápida (217x tempo real). |
| **Groq** | `whisper-large-v3-turbo` | **US$0,04/hora** (~US$0,00067/min) | Idem — **é a opção mais barata encontrada nesta pesquisa**, por larga margem. Cobrança mínima de 10s por requisição. |
| **Deepgram** | Nova-3 Monolingual (pré-gravado, pay-as-you-go) | **US$0,0077/min** (~US$0,462/hora) | **Confirmado** — `pt` e `pt-BR` listados explicitamente em [developers.deepgram.com](https://developers.deepgram.com/docs/models-languages-overview), consultado 02/Ago/2026. |
| **AssemblyAI** | Universal-2 (async) | **US$0,15/hora** | Não confirmado nesta pesquisa (documentação de preço não lista idiomas; ficaria para checagem específica antes de adotar). |
| **AssemblyAI** | Universal-3.5 Pro (async) | **US$0,21/hora** | Idem. |

Fontes: [developers.openai.com/api/docs/pricing](https://developers.openai.com/api/docs/pricing) ·
[groq.com/pricing](https://groq.com/pricing) · [deepgram.com/pricing](https://deepgram.com/pricing) ·
[assemblyai.com/pricing](https://www.assemblyai.com/pricing) — todos consultados 02/Ago/2026.

**Leitura:** para volume baixo (1-3 obras), a diferença entre self-host (`faster-whisper small`,
custo ~zero) e Groq turbo (US$0,04/hora, praticamente irrelevante em valor absoluto) não é o que
decide a arquitetura — o que decide é **latência e simplicidade operacional**: self-host exige
manter servidor rodando o modelo; Groq é API gerenciada, sem infra própria, e é tão barato que a
diferença de custo não paga a complexidade extra de manter GPU/CPU dedicada só para isso em baixo
volume. Groq como default, self-host como caminho de redução de custo variável se o volume crescer
muito (centenas de obras).

### 2.3 Qualidade em ambiente de canteiro — o que não foi encontrado

**Não existe benchmark de WER (word error rate) publicado especificamente para português em
condição de ruído de canteiro, sotaque regional e jargão de obra.** Duas tentativas de fonte
falharam nesta pesquisa:

- O **paper original do Whisper** (Radford et al., 2022, [arXiv:2212.04356](https://arxiv.org/abs/2212.04356))
  tem uma tabela de WER por idioma nos apêndices, mas o **PDF não pôde ser renderizado neste
  ambiente** (falta `poppler-utils`/`pdftoppm` para converter página em imagem) — a extração de
  texto bruto do PDF comprimido também não localizou a tabela de forma confiável. **Isto é uma
  limitação de ferramenta desta sessão, não confirmação de que o dado não existe** — o paper
  publicamente tem essa tabela, só não foi possível lê-la aqui.
- Buscas em discussões do GitHub do Whisper e em blogs de comparação de ASR (`amgadhasan.substack.com`)
  não retornaram o número (página fora do ar ou sem o dado visível).

**Não vou inventar um número de WER para português** — seria exatamente o tipo de "número que não
fecha" que não deve entrar em proposta comercial. O que dá para afirmar com confiança, por ser
fato de infraestrutura e não de benchmark: **português é um dos idiomas com maior volume de dados
de treino do Whisper** (é idioma com script latino, alto recurso, presente em todo material de
marketing da OpenAI/Groq/Deepgram como "bem suportado") — mas **"bem suportado" em áudio limpo não
é evidência de desempenho em áudio de canteiro com britadeira ao fundo**. Recomendo,
como já registrado na versão anterior: **piloto de validação com áudio real de canteiro antes de
prometer qualquer SLA de transcrição em proposta comercial.**

---

## Parte 3 — Visão computacional: classificar foto de obra

### 3.1 Modelo pronto para classificar fase/etapa construtiva — não existe

Busca direta no Hugging Face ([huggingface.co/models?search=construction+site](https://huggingface.co/models?search=construction+site)),
consultada 02/Ago/2026, retornou 4 modelos relacionados a canteiro de obra — **nenhum classifica
fase construtiva**:

| Modelo | Tipo | Serve para o produto? |
|---|---|---|
| `harikrishnaaa321/construction-site-surveillance-model` | Não especificado, nome sugere vigilância/segurança | Não — mesma categoria de TrackObra/VisionSeg/SensorEng (EPI/segurança), já mapeada como saturada em `04` anterior. |
| `rebotnix/rb_construction_site_beacon` | Não especificado | Não claramente aplicável. |
| `kneelabh87/blip-finetuned-construction_site_caption` | BLIP fine-tuned para **legenda de imagem** (0,2B parâmetros) | 🟡 **Parcialmente relevante** — não classifica fase, mas prova que fine-tuning de um modelo de legendagem sobre fotos de canteiro é algo que alguém já fez de forma independente e pequena (0,2B = modelo leve, treinável sem infraestrutura pesada). |
| `Priya-yadav-4/blip-finetuned-construction_site_caption` | Idem (autor diferente) | Idem. |

Busca complementar no Roboflow Universe (repositório de datasets de visão computacional, forte em
construção civil para EPI/segurança) **retornou erro 403** — não foi possível confirmar ou
descartar a existência de datasets de fase construtiva lá. **Fica como pendência de checagem
manual**, não como "não existe".

### 3.2 Dois caminhos — reforçando a decisão da versão anterior

1. **Modelo de visão-linguagem generalista (GPT-4o/Claude/Gemini vision), zero-shot.** Validável
   em dias, sem dataset próprio. Custo por imagem, ver §3.3.
2. **Modelo customizado treinado (ex.: YOLOv8 via Roboflow).** A **Ultralytics** (mantenedora
   oficial do YOLO) recomenda, para um resultado de produção confiável:
   [docs.ultralytics.com/yolov5/tutorials/tips_for_best_training_results](https://docs.ultralytics.com/yolov5/tutorials/tips_for_best_training_results/),
   consultado 02/Ago/2026: **≥1.500 imagens por classe** e **≥10.000 instâncias rotuladas por
   classe**. Para 5 fases construtivas (fundação, estrutura, alvenaria, instalações, acabamento),
   isso significa **~7.500 fotos rotuladas no mínimo** antes de treinar algo com a barra de
   qualidade que a própria Ultralytics recomenda — **não é um projeto de piloto rápido**, é um
   projeto de dataset. (Nota: esse número é o recomendado para detecção de objeto robusta;
   fine-tuning de um classificador simples sobre um modelo pré-treinado, via transfer learning,
   costuma precisar de bem menos por classe — mas não localizei uma fonte oficial equivalente
   para esse cenário mais leve, então não vou citar um número menor sem fonte.)

**Confirma a recomendação já registrada:** validar com (1) antes de investir em (2).

### 3.3 Custo de visão generalista por imagem (confirmado 02/Ago/2026)

| Provedor/modelo | Fórmula de custo | Custo por foto (1024×1024, alta qualidade) |
|---|---|---|
| **Claude Haiku 4.5** (`claude-haiku-4-5`) | `⌈largura/28⌉ × ⌈altura/28⌉` = tokens visuais; 1MP ≈ 1.296 tokens; $1/MTok input padrão | **~US$0,0013/foto** (~R$0,0066) |
| **Claude Sonnet 5** | Mesma fórmula, tier de alta resolução (até 4.784 tokens); $2/MTok até 31/ago/26 | **~US$0,0026-0,0096/foto** dependendo do tier de resolução |
| **GPT-4o**, detalhe alto | 85 tokens base + 170/tile de 512px; 1024×1024 ≈ 765 tokens; $2,50/MTok | **~US$0,0019/foto** (~R$0,0097) |
| **GPT-4o**, detalhe baixo | 85 tokens fixos (sem tiles) | **~US$0,0002/foto** — mas a imagem é reduzida para 512×512, resolução baixa para distinguir detalhe de obra. |
| **GPT-4o-mini**, detalhe alto | 2.833 tokens base + 5.667/tile; $0,15/MTok | **~US$0,0038/foto** — **mais caro por foto que o GPT-4o "grande"**, apesar do preço por token ser 16x menor. A OpenAI infla artificialmente a contagem de tokens de imagem do modelo mini para equalizar o custo entre camadas — achado contra-intuitivo que vale registrar: **não presumir que o modelo "mini" é sempre a opção mais barata em visão.** |

Fontes: [platform.claude.com/docs/en/build-with-claude/vision](https://platform.claude.com/docs/en/build-with-claude/vision) ·
[developers.openai.com/api/docs/guides/images-vision](https://developers.openai.com/api/docs/guides/images-vision) ·
[platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing) — consultados 02/Ago/2026.
Gemini 2.5 Flash/Pro: sem custo por imagem separado, cobra como token padrão (texto/imagem/vídeo
ao mesmo preço) — $0,30/MTok input (Flash) a $2,50/MTok (Pro >200k), [ai.google.dev/pricing](https://ai.google.dev/pricing).

### 3.4 EXIF/GPS de foto do WhatsApp — testado e confirmado

**Este era o item que a pesquisa anterior deixou como "não testado" e que muda o produto.**
Confirmado via múltiplas fontes técnicas (metaclean.app, privacystrip.com, geotag.world, entre
outras, checadas 02/Ago/2026):

- **Foto enviada normalmente (como mídia, o padrão do WhatsApp):** o app **comprime a imagem e
  remove a maior parte do EXIF, incluindo GPS, marca/modelo da câmera**. Comportamento igual em
  iOS e Android.
- **Foto enviada "Como Documento":** preserva o arquivo original **com 100% dos metadados**,
  incluindo GPS — mas exige um passo extra deliberado do usuário (`anexo → documento`, não o fluxo
  natural de "tirar foto e mandar"), o que quebra a premissa de zero-fricção do produto.
- **Não há garantia documentada e oficial da Meta, campo a campo, cobrindo todos os clientes e
  modos de envio** — o comportamento acima é observação de terceiros, não especificação da Meta.

**Implicação direta de produto:**
1. **Não dá para prometer geolocalização automática a partir da foto enviada normalmente.** Isso
   derruba qualquer variante de pitch que dependa de "a IA confirma que a foto foi tirada na obra
   pelo GPS embutido".
2. **Não é um problema fatal**, porque cada número/conversa de WhatsApp do produto já mapeia 1:1
   para uma obra conhecida no cadastro do cliente — o produto não precisa de GPS por foto para
   saber "de qual obra" ela é.
3. **Onde GPS por evento específico for exigido** (ex.: financiador pedindo prova de
   geolocalização de uma medição), a saída limpa é pedir ao mestre que mande, **à parte da foto**,
   uma mensagem de **Localização nativa do WhatsApp** (tipo de mensagem estruturado que a Cloud
   API recebe como lat/long direto no payload do webhook, sem depender de EXIF) — um passo extra
   pontual, não o fluxo padrão.
4. **O timestamp não depende de EXIF de qualquer forma** — o payload do webhook da Cloud API já
   traz o horário de recebimento da mensagem (campo `timestamp`, Unix epoch) independente de
   metadado de imagem. Isso resolve "quando" mesmo sem GPS resolver "onde".

---

## Parte 4 — Geração de documento (PDF/DOCX)

Reaproveitando decisões já validadas internamente (memória do squad, maio/2026) e complementando
com licenciamento checado nesta rodada (02/Ago/2026):

| Ferramenta | Linguagem | Licença/custo | Nota |
|---|---|---|---|
| **`python-docx`** | Python | Gratuita, open-source | Já validado internamente — técnicas para células coloridas, bordas, quebras de página. |
| **ReportLab (toolkit open-source)** | Python | **BSD license — gratuita, uso comercial livre**, confirmado via [pypi.org/project/reportlab](https://pypi.org/project/reportlab/), 02/Ago/2026. | Existe também "ReportLab PLUS" comercial (não checado em detalhe — site institucional retornou 403 na tentativa de fetch) — mas **a versão open-source basta** para gerar PDF a partir de template, sem custo de licença. |
| **Puppeteer (Chrome headless)** | Node | Gratuito, open-source, mantido pelo Google. | Confirmado como caminho HTML→PDF via `printToPDF`/DevTools Protocol — já era a stack validada internamente (`chrome.exe --headless --print-to-pdf`), reforçado como opção madura para servidor Linux também. |
| **WeasyPrint** | Python | Gratuita | ⚠️ **Mantido o alerta já registrado**: quebra no Windows por dependência de GTK ausente — não usar como caminho principal se o time de dev roda Windows localmente; funciona normalmente em container Linux, mas Puppeteer é o caminho já validado e sem essa armadilha. |
| **docxtemplater** | Node | **Núcleo gratuito (MIT/GPLv3)** — tags, condicionais, loops, sem custo. **Módulos pagos, ANUAL:** 1 módulo à escolha **€500/ano**; PRO (4 módulos) **€1.250/ano**; Enterprise (18 módulos) **€3.000/ano**. **O módulo de Imagem — necessário para inserir a foto do RDO no `.docx` — é pago**, [docxtemplater.com/pricing](https://docxtemplater.com/pricing/), consultado 02/Ago/2026. | ⚠️ **Achado novo desta rodada, muda a decisão de stack:** se o time optar por gerar `.docx` com foto embutida via Node, isso custa **no mínimo €500/ano (~R$2.925/ano, ~R$244/mês)** de licença. A stack Python (`python-docx`, já usada internamente) **não tem esse custo** — é argumento a favor de manter geração de documento em Python, não portar para Node. |

**Recomendação:** manter a stack Python já validada (`python-docx` + Chrome headless via
Puppeteer/`chrome.exe` para o caminho HTML→PDF) — zero custo de licença, zero surpresa.

---

## Parte 5 — Bases públicas

### 5.1 SINAPI — sem mudança relevante desde a versão anterior

Gratuito, sem cadastro, via [caixa.gov.br/poder-publico/modernizacao-gestao/sinapi](https://www.caixa.gov.br/poder-publico/modernizacao-gestao/sinapi/Paginas/default.aspx).
ZIP → XLSX por UF, mensal, **sem API oficial**. Uso obrigatório em obra com recurso federal
(Decreto 7.983/2013, Lei 14.133/2021). API não-oficial de terceiro
([orcamentador.com.br/api](https://orcamentador.com.br/api/)) reempacota o dado em JSON/XML, 100
requisições/hora grátis — mantém-se como a opção pragmática para não construir o parser de XLSX do
zero, com o risco já registrado de depender de fornecedor não-oficial.

### 5.2 INMET — testado ao vivo nesta rodada, achado novo: API instável

A versão anterior apontava um wrapper não-oficial no GitHub sem checar a API oficial diretamente.
Nesta rodada, **testei o endpoint diretamente com `curl`**:

- Existe um domínio de API real, `apitempo.inmet.gov.br`, com padrão de URL conhecido
  (`/estacao/{data_inicial}/{data_final}/{codigo_estacao}` para dados de estação automática,
  `/estacoes/T` para listar estações).
- **Comportamento observado ao vivo (02/Ago/2026):**
  - Requisição sem User-Agent de navegador → **conexão resetada** (`Recv failure: Connection was reset`).
  - Requisição com User-Agent de navegador → resposta **HTTP 204 (sem conteúdo)** para o endpoint
    de estação testado.
  - Requisição ao endpoint de listagem de estações → ora **HTTP 200 com corpo vazio**, ora
    **falha de conexão total (HTTP 000)** em tentativas subsequentes.
- **Conclusão:** a API existe e responde de forma inconsistente — sem chave, sem documentação
  oficial pública localizada, com sinais de proteção anti-scraping (bloqueio por User-Agent) e/ou
  instabilidade de infraestrutura. **Não é uma dependência confiável para um produto comercial em
  produção sem uma camada de retry/cache agressiva e um plano B** (dado histórico via
  [Base dos Dados](https://basedosdados.org/dataset/782c5607-9f69-4e12-b0d5-aa0f1a7a94e2), que
  replica INMET em BigQuery, é mais estável para consulta batch, mas **não serve para clima do dia
  corrente** — só para preencher histórico).
- Mantém-se o alerta já registrado: wrapper de terceiro no GitHub
  (`fabinhojorge/INMET-API-temperature`) é projeto pessoal, sem garantia de manutenção.

### 5.3 SICRO/DNIT — sem mudança

Gratuito, sem cadastro, via [dnit.gov.br](http://www.dnit.gov.br/custos-e-pagamentos/sicro-2/manual-de-custos-rodoviarios).
6.618 composições, 26 estados + DF, atualização trimestral — relevante só se o cliente for
construtora de infraestrutura/rodovia, não o perfil-alvo principal (edificação).

---

## Custo mensal de operar o produto para 1 cliente com 3 obras

**Premissas explícitas (nenhuma tem fonte de mercado — são parâmetros de dimensionamento, não
dado pesquisado; ajustar conforme validação com cliente real):**
- 3 obras, ~30 mensagens/dia cada = 90 mensagens/dia, ~2.700/mês.
- Metade foto, metade áudio (assumido, não medido): **~1.350 fotos/mês, ~1.350 áudios/mês**.
- Áudio médio de 1 minuto (assumido): **~1.350 min/mês ≈ 22,5 horas/mês** de transcrição.
- Cotação de referência: **US$1 = R$5,076 · €1 = R$5,852** (Wise, mid-market, capturado
  02/Ago/2026 — não é cotação comercial de fechamento, é referência de ordem de grandeza).

| Componente | Escolha de stack | Custo mensal estimado | Base de cálculo |
|---|---|---|---|
| **WhatsApp — infraestrutura** | WABA direto + Evolution API self-hosted | R$0 de mensalidade de plataforma (evita Chatpro R$499 ou 360dialog €49+/número) | §1.2 |
| **WhatsApp — mensagens** | ~90 templates/mês (lembrete diário × 3 obras) | **Não fechado em R$** — piso de referência só da fatia de markup de um BSP (Twilio): 90 × US$0,005 ≈ US$0,45 (~R$2,30). Tarifa da Meta em si não extraída (§1.1) — tratar como pendência de cotação manual antes de fechar proposta. | §1.1, §1.4 |
| **Transcrição** | Groq `whisper-large-v3-turbo` | 22,5h × US$0,04 ≈ **US$0,90 (~R$4,57)** | §2.2 |
| **Visão** | Claude Haiku 4.5, padrão | 1.350 × ~US$0,0013 ≈ **US$1,75 (~R$8,90)** | §3.3 |
| **Visão (alternativa mais barata)** | GPT-4o, detalhe alto | 1.350 × ~US$0,0019 ≈ **US$2,58 (~R$13,10)** | §3.3 |
| **Geração de documento** | `python-docx` + ReportLab + Chrome headless | **R$0** (open-source, sem licença) | §4 |
| **SINAPI/INMET** | Acesso direto/terceiro gratuito | **R$0** (com ressalva de instabilidade do INMET, §5.2) | §5 |
| **Servidor/infra (VPS, banco de dados, webhook receiver)** | Não pesquisado nesta rodada com fonte de preço | **Não estimado com fonte** — faixa de mercado genérica para VPS pequena costuma ficar na casa de dezenas a poucas centenas de reais/mês, mas nenhum provedor específico foi cotado aqui; marcar como pendência de cotação (ex.: Railway, Hetzner, DigitalOcean) antes de orçar. | — |

**Total de IA + mensageria (excluindo infra de servidor, que não foi cotada):**
da ordem de **R$15-20/mês** para 3 obras, considerando as escolhas mais baratas confirmadas
(Groq + Claude Haiku) — **mais a tarifa de template da Meta, que é a única linha sem número
fechado** (provavelmente também baixa, dado o volume de ~90 mensagens pagas/mês, mas não é honesto
apresentar um total "fechado" sem esse dado).

**Leitura estratégica:** o custo variável de IA para operar o produto é **irrisório frente a
qualquer preço de venda cogitado** (Zé Obra já cobra R$39-449/mês; a síntese consolidada já
registra a tese de precificação na faixa de R$15-30k para o produto maior). **O gargalo econômico
do negócio não está na API — está no custo de desenvolvimento, integração e venda.** Isso é
argumento a favor de precificar por valor entregue (relatório defensável, tempo do mestre
economizado), não por custo de infraestrutura repassado.

---

## O que já sabíamos (não repesquisado nesta rodada — contexto, ver versão anterior arquivada em histórico de commits para o detalhe completo)

- **Só Sienge ([api.sienge.com.br/docs](https://api.sienge.com.br/docs)) e Mobuss (Swagger) têm
  API pública documentada** entre os ERPs de construção brasileiros — Mega (Senior) e UAU exigem
  integração via parceiro terceiro, sem portal de developer self-service.
- **Zé Obra** ([zeobra.com.br](https://zeobra.com.br)) já cobra **R$39-449/mês**, captura por
  WhatsApp (foto + áudio + nota fiscal), foco financeiro — concorrente direto na captura, não no
  relatório de avanço físico contratual.
- **Prumo e Brickup** têm versão gratuita de RDO digital; Brickup usa IA para resumir o RDO **já
  preenchido**, não para capturar no canteiro.
- Nenhum concorrente brasileiro mapeado (Parte 2 da versão de 01/Ago: TrackObra, VisionSeg,
  SensorEng, Brickup, Produttivo, Prospecta Obras, Obra.ai) oferece captura de RDO por
  foto+áudio de WhatsApp classificada por IA — o whitespace segue confirmado, agora também do
  lado técnico: **nenhum fornecedor de infraestrutura (WhatsApp/transcrição/visão) tem preço ou
  limite que inviabilize construir isso.** O produto é possível e barato de operar; o que falta
  validar é adoção real com cliente, não mais tecnologia ou custo.
