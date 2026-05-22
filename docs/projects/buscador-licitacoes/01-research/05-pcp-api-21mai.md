# Pesquisa — API do Portal de Compras Públicas (PCP) — 21/Mai/2026

**Para:** adapter PCP (X1) + descoberta (Stage 1). **Fonte primária:** apiDoc oficial servido pelo próprio host (`apipcp.portaldecompraspublicas.com.br/publico/apidoc/` → `api_data.js`/`api_project.js`, v2.2.2/2.2.3, mar/2025).

## TL;DR (impacto no build)
🚨 **A API pública do PCP NÃO tem filtro por órgão/CNPJ/UF/município/modalidade.** Os únicos filtros de `listarProcessos` são **status (`cdSituacao`) + janela de data de publicação + paginação**. → mesma limitação do PNCP: **paginar a janela e filtrar client-side** (por raio/CNPJ/objeto). O registro da lista também **não traz campo de órgão/município** — identificação só pelo texto (`identificacao`/`observacoes`/`url`).

## Acesso / credencial
- **Auth:** uma `publicKey` (string) passada como **query-param em toda requisição**. Sem OAuth, sem bearer.
- **Obtenção:** formulário de solicitação → **PublicKey enviada por e-mail em ~7 dias úteis**. Tipo de credencial: só `2 = Permanente` (Prazo Fixo descontinuado).
- **Contatos oficiais:** `gestor@portaldecompraspublicas.com.br` · (61) 3120-3737 · `comprador@portaldecompraspublicas.com.br`.
- **Lead time ~7 dias úteis → solicitar JÁ se D2 confirmar PCP como P0.** URL exata do formulário está atrás do artigo Zendesk (deu 403); pegar via help center ou e-mails acima.

## Endpoints públicos (base `https://apipcp.portaldecompraspublicas.com.br`)
| Endpoint | Método | Função | Params |
|---|---|---|---|
| `/publico/listarProcessos/` | GET | Listar processos/editais | `publicKey`(req), `cdSituacao`(req: 1=Aberto…4=Encerrado…), `dataInicio`(req), `dataFim`(req), `pagina` |
| `/publico/obteranexoslicitacao` | GET | Documentos/PDFs do edital | `publicKey`, `idLicitacao` → `Anexos[].url` (download) |
| `/publico/obterAtas/` | GET | Atas/atos (vencedor, adjudicação, homologação) | `publicKey`, `idLicitacao`, `tipoAta`(1–14) → job async (`codigoStatus` 1..4; `url` quando 4) |
| `/publico/obterItensEmDisputa/` | GET | Lotes/itens + `valorReferencia` + lances | `publicKey`, `idLicitacao` |
| `/publico/obterChat` | GET | Chat do processo (50/pág) | `publicKey`, `idLicitacao`, `idUltimaFrase`, `pagina` |

**Resposta `listarProcessos`:** `quantidadeTotal`, `paginaAtual`, `dadosLicitacoes[]` = `{idLicitacao, codLicitacao, dataInicioPropostas, horaInicioPropostas, dataFinalPropostas, ..., identificacao, numero, observacoes, url, codSituacaoEdital}`. **Sem órgão/UF/município/modalidade estruturados.** Datas e horas em campos separados.

## Cobertura municipal
- A plataforma anuncia licitações municipais+estaduais e o `tipoAta` inclui "Decreto Municipal" → **municipais SÃO carregadas**. Mas sem filtro/campo de município, não dá pra consultar "só Águas Lindas" — identifica-se o órgão pelo texto da `identificacao`/`url`. Cobertura de um município específico depende de o órgão usar o PCP.
- **Evidência nossa:** 4 editais reais de **Águas Lindas** estão no PCP (dataset §11) → confirma uso municipal por essa prefeitura.

## Implicações para a arquitetura
1. **Adapter PCP = API-based, mas com filtro client-side** (paginar janela de data + status, depois filtrar por órgão/objeto/raio do nosso lado). Atualiza o spike `08-spike-x1`.
2. **Desfecho (vencedor)** vem de `obterAtas` (async, polling até `codigoStatus=4`) — não é campo direto.
3. **PDFs** via `obteranexoslicitacao` → alimenta Stage 4 (Docling).
4. Combinar com **PNCP** (descoberta primária por lei) — PCP entra como reforço/D+0 e fonte de atas/itens.

## Verificar ao obter acesso
- Formato exato de `dataInicio`/`dataFim` (provável `YYYY-MM-DD`, não confirmado).
- Tamanho de página (não-chat) e **rate limits/quotas** (não documentados).
- Mapa completo de `tipoAta` 1–14 (qual = homologação/adjudicação/vencedor).
- ⚠️ Existe um host v2 não-oficial (`compras.api.portaldecompraspublicas.com.br/v2/...`) visto em projeto de terceiros — **não usar** num build real (instável/não documentado).

**Fontes:** apidoc oficial (`/publico/apidoc/` + `api_data.js`/`api_project.js`); `portaldecompraspublicas.com.br/novidades/...416`; bibliotecapcp.zendesk (403).
