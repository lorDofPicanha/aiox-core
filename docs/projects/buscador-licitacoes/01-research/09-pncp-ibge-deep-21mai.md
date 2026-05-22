# Pesquisa — PNCP API (a fundo) + dataset geo IBGE — 21/Mai/2026

**Para:** Sprint 0 (descoberta + filtro de raio) + experimento Stage 2. **Fonte da verdade:** Swagger v3 `https://pncp.gov.br/api/consulta/v3/api-docs` (mais preciso que os PDFs, que estão atrasados).

## ✅ CONFLITO RESOLVIDO — teste ao vivo 21/Mai (refuta §10.2.1)
Rodadas reais contra `pncp.gov.br/api/consulta/v1` (HTTP 200) confirmam que **os filtros server-side FUNCIONAM** — o §10.2.1 ("só UF; sem filtro por CNPJ") está **superado**:
| Teste | Query | Resultado |
|---|---|---|
| **codigoMunicipioIbge=5200258** | publicacao, mod=4, jan/2026 | total=6, **100% Águas Lindas/GO** ✅ filtra |
| **cnpj=01616520000196** | publicacao, mod=4, jan/2026 | total=4, **100% esse CNPJ** ✅ filtra (= as 4 concorrências de Águas Lindas do dataset!) |
| **uf=GO** (baseline) | publicacao, mod=4, jan/2026 | total=187 (firehose GO; Novo Gama presente) |
| **contratos?cnpjOrgao=01616520000196** | jan-mai/2026 | total=124 contratos do órgão ✅ filtra → **histórico recuperável** (sinal positivo pro kill-gate Stage 2) |

**Implicação:** a descoberta pode ser feita **direto por município (`codigoMunicipioIbge`) ou por órgão (`cnpj`)** — basta selecionar os municípios dentro do raio (haversine) e consultar cada um. Não precisa paginar a UF inteira nem filtrar client-side. E o histórico do órgão (Stage 2) sai de `contratos?cnpjOrgao=...`.

## 1. Rate limits
- **NÃO documentado** (nem Swagger, nem manuais). Sem headers `RateLimit`/`Retry-After` documentados. → **Throttle defensivo client-side** (poucas req/s) + **backoff exponencial** em 429/5xx; honrar `Retry-After` se aparecer. Consulta API = pública (sem auth); Integração `/api/pncp/v1/...` = Bearer p/ escrita.

## 2. Registro de órgãos
- **NÃO há endpoint de dump completo.** Só lookup **por CNPJ**: `GET /api/pncp/v1/orgaos/{cnpj}` (Integração, requer auth) → 1 órgão (`cnpj`, `razaoSocial`, poder/esfera). ⚠️ Isso **contradiz** o "dump ~45MB" do §10.2.1.
- **Como montar o mapa CNPJ→município:** o `codigoMunicipioIbge`/`municipio`/`uf` vêm **inline em cada item** de contratação/contrato → derivar iterando os resultados da consulta, OU usar os extratos de Dados Abertos. Não depender de um dump de `/orgaos`.

## 3. Datas & paginação (do Swagger v3)
- **Formato de data: `AAAAMMDD`** (`yyyyMMdd`, sem traços), ex. `20240101`.
- **`/v1/contratacoes/publicacao`:** `dataInicial`(req), `dataFinal`(req), `codigoModalidadeContratacao`(**req**), `codigoModoDisputa`, `uf`, `codigoMunicipioIbge`, `cnpj`, `codigoUnidadeAdministrativa`, `pagina`(req, ≥1), **`tamanhoPagina` (max 50)**.
- **`/v1/contratos`:** `dataInicial`,`dataFinal`(req), **`cnpjOrgao`** (filtra por órgão!), `codigoUnidadeAdministrativa`, `pagina`(req), **`tamanhoPagina` (max 500)**.
- ⚠️ **`tamanhoPagina` difere por endpoint: 50 (publicacao) vs 500 (contratos).** (O manual diz "500" para ambos — errado; confiar no Swagger.)
- Resposta inclui `totalRegistros`, `totalPaginas`, `data[]`; `codigoMunicipioIbge` na unidade de cada item.

## 4. Códigos de modalidade (`codigoModalidadeContratacao`)
| Cód | Modalidade |
|---|---|
| 1 | Leilão - Eletrônico |
| 2 | Diálogo Competitivo |
| 3 | Concurso |
| **4** | **Concorrência - Eletrônica** ← nossos editais |
| 5 | Concorrência - Presencial |
| **6** | **Pregão - Eletrônico** ← CEASA |
| 7 | Pregão - Presencial |
| 8 | Dispensa · 9 Inexigibilidade · 10 Manifestação de Interesse · 11 Pré-qualificação · 12 Credenciamento · 13 Leilão - Presencial |
- **Nossos alvos: Concorrência Eletrônica = `4`, Pregão Eletrônico = `6`** (alta confiança). Versões novas podem ter `14`(Inaplicabilidade)/`15` — verificar nas Tabelas de Domínio (`pncp.gov.br/app/entidades-dominio`) se precisar.

## 5. Dados Abertos / OCDS
- **PNCP Dados Abertos:** `gov.br/pncp/pt-br/acesso-a-informacao/dados-abertos` (PCA, contratos, atas; sem login). Página JS → dirigir pela API em vez de links estáticos.
- **OCDS é servido por Compras.gov.br/SEGES** (não pncp.gov.br): Swagger `dadosabertos.compras.gov.br/swagger-ui` → "11 - OCDS / releases". JSON/Excel/CSV, **atualização diária**, ago/2021→presente.
  - **Cobertura ampla (não só federal):** federal + estadual + municipal **dos órgãos no Compras.gov.br** (~563 estaduais + ~1.267 municipais em 2025), mas só fases **licitação + adjudicação**. Para cobertura PNCP completa, ainda é preciso a Consulta API.

## 6. Dataset geo IBGE (para o raio haversine)
- ❌ **IBGE Localidades REST** (`servicodados.ibge.gov.br/api/v1/localidades/municipios`) **não traz lat/long** (só hierarquia administrativa). Bom p/ validar nome/código, inútil p/ geo. (Verificado: `/municipios/5200258` = Águas Lindas de Goiás, sem coordenada.)
- ✅ **Usar "Localidades do Brasil" (geoespacial):** `geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/localidades/` — **GeoPackage/Shapefile/KML com Latitude/Longitude do ponto de referência**. Filtrar categoria **sede municipal (cidade)** → 1 centroide por município.
- ✅ **Compatibilidade de código: SIM.** Cidade usa o **código IBGE de 7 dígitos = mesmo espaço do `codigoMunicipioIbge` do PNCP** → join direto. (Águas Lindas-GO = `5200258` idêntico nos dois lados.)
- **Atalho:** CSV comunitário `github.com/kelvins/municipios-brasileiros` (5.570 munic.: código IBGE, nome, UF, **lat, long**, DDD) — conveniente, mesmos códigos, mas **não-oficial** (p/ produção, preferir o shapefile IBGE). Sede Águas Lindas ≈ **lat -15,7589 / long -48,2828** (verificar no arquivo IBGE).

## Confiança & lacunas
- **Alta:** códigos 4/6; formato `AAAAMMDD`; `tamanhoPagina` 50 vs 500; órgãos só por CNPJ (sem dump); IBGE 7 díg == `codigoMunicipioIbge`; Localidades geoespacial tem lat/long.
- **A verificar ao vivo:** se `cnpj`/`codigoMunicipioIbge` filtram mesmo em `publicacao` (conflito com §10.2.1); rate limit real (capturar headers de uma chamada própria); links de bulk do Dados Abertos.

**URLs-chave:** Swagger `pncp.gov.br/api/consulta/swagger-ui/index.html` · api-docs `pncp.gov.br/api/consulta/v3/api-docs` · Tabelas Domínio `pncp.gov.br/app/entidades-dominio` · IBGE Localidades `geoftp.ibge.gov.br/.../localidades/` · OCDS `dadosabertos.compras.gov.br/swagger-ui`.
