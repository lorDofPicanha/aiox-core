---
name: Tocks Ads URL Fix (13/Abr/2026)
description: Anuncios Tocks reprovados por redirect chain — corrigidos via criacao de novos RSAs com URL www
type: project
originSessionId: bec23607-5d01-4c86-84dc-a5d26661c39d
---
Anuncios da campanha TOCKS_Search_Alta-Intencao foram reprovados por URL de destino.

**Causa raiz:** URL `https://tockscustom.com.br` (sem www) fazia 3 redirects incluindo downgrade HTTPS→HTTP.

**Why:** O Google Ads reprova anuncios com redirect chains e downgrade de protocolo.

**Solucao aplicada (13/Abr/2026):**
- Criados 4 novos RSAs identicos com URL correta `https://www.tockscustom.com.br/`
- Antigos pausados, novos ativados
- Google Ads API trata `final_urls` como campo IMUTAVEL em RSAs — nao e possivel editar, so criar novo

**IDs dos novos anuncios:**
| Ad Group | Novo Ad ID |
|----------|-----------|
| 01 - Compra Direta (197860071827) | 805111434466 |
| 02 - Premium Artesanal (197861050547) | 805111438270 |
| 04 - Mesa Jantar 2em1 (195505567875) | 805111445896 |
| 03 - Marca Tocks (194892667676) | 805077009342 |

**How to apply:** Sempre usar `https://www.tockscustom.com.br/` (com www) em novos anuncios Tocks. Subdominio `lp.tockscustom.com.br` NAO existe em DNS.
