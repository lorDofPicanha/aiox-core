---
name: Tocks Master Asset Library Triagem 06/Mai
description: User dropped 2 ZIPs (1.3GB) + 28 WhatsApp 17/Abr renders. Triagem confirmou TUDO Tocks. Asset library canon criada em docs/projects/tocks/assets/. Resolve risco "fotos comerciais com filter CSS" das 3 teses v4-fantastic + substitui placeholders Cardo/Big Shoulders por fontes oficiais Libre Caslon Text + Poppins.
type: project
originSessionId: 8d94e965-b41e-4b2e-8105-b08a41d13672
---
# Tocks Master Asset Library — 06/Mai 11h triagem

## Material recebido

User dropped via Downloads:
1. `drive-download-20260506T113413Z-3-001.zip` (895 MB → 957 MB unpacked)
2. `Material de apoio-20260506T113032Z-3-001.zip` (573 MB → 430 MB unpacked)
3. 28 fotos `WhatsApp Image 2026-04-17 at 13.{38.30,40.20,40.21}*.jpeg`

Triagem Orion confirmou: **100% Tocks**. Não Bretda nem Vorza.

## Path canônico criado

`docs/projects/tocks/assets/` — gitignored exceto `MANIFEST.md` + 8 SVG logos (4.9KB Tocks + 4 Skara + 3 símbolos).

Subdirs:
- `master-drive/` — ZIP 1 unpacked: Identidade Visual (Tocks + Skara), Fotos (curated por linha), Acabamentos Skara (10 madeiras + 16 tecidos), Dados de acesso
- `material-apoio-2022/` — ZIP 2 unpacked: 205 HEIC iPhone + 279 JPG legacy 2022 organizados por modelo (Sinuca Contemporanea/Gabe/Monaco/Nobus)
- `whatsapp-17abr-renders/` — 28 renders dated 17/Abr 2026

## Inventário crítico

- **2 fontes oficiais zipadas:** Libre Caslon Text (display) + Poppins (body/UI)
- **8 SVG logos** versionados em git (Tocks logo + 3 símbolos branco/azul/dourado + 4 Skara logos)
- **~520 MB de vídeo** (111 MP4 + 11 MOV) raw — possível hero video v4 (precisa curation pass)
- **1 PSD 144 MB** source design
- **Linha Premium 10 modelos:** Aparato, Elemento, Gabe, Modern Inox, Tenro, Dubai, Mônaco, Harley, Nobus, Rustic
- **Linha Criativa 4 modelos:** Berlin, Contemporânea, Master, Modern
- **Acabamentos Skara:** 10 madeiras (Angelin, Canelão, Carvalho Branco, Cerejeira, Ebano, Freijo, Goiabão Escuro, Itaúba, Marupa, Wengue) + 16 tecidos (códigos numéricos)
- **Subfolders /No /no /NO** = rejected/alternates (não usar sem confirmar)

## Implicação direta v4-fantastic

### Substitui placeholders nas 3 teses

| Thesis | Antes (placeholder) | Agora (oficial) |
|---|---|---|
| A — Editorial | Cardo italic + DM Sans | **Libre Caslon Text + Poppins** |
| B — Dark Gallery | Big Shoulders Display 900 | Libre Caslon Text Bold (testar peso) |
| C — Underground | Space Grotesk + Crimson Pro | Manter (não bate com Caslon brutalista) |

### Resolve "fotos comerciais com filter CSS" risk

Reports v4 todos flagaram que `/produtos/vertice/` e `/produtos/elipse/` usavam filter CSS pra dar mood. **Não precisa fotógrafo Itajaí R$3-5k mais** — tem photo library oficial.

**Pergunta pendente user:** Vértice/Elipse → mapear pra qual modelo da Linha Premium? (Aparato? Gabe? Mônaco?)

### Skara é sub-brand separada

Pendente decisão: Skara faz parte do site Tocks v4, ou é site próprio? Se integrada, expor 16 tecidos + 10 madeiras como configurador.

## HEIC conversion needed

- 41 HEIC em master-drive/Fotos/001
- 205 HEIC em material-apoio-2022 (iPhone legacy)

Comando: `magick mogrify -format jpg -quality 90 *.HEIC` (ImageMagick) ou Sharp/heic-convert (Node).

## ✅ Autopilot Round 2 — 06/Mai (segundo trigger user "faça isso qualquer coisa eu corrijo depois")

Após triagem Round 1, user autorizou full autopilot. Orion executou:

1. **Mapping Vértice/Elipse** (visual + descritor):
   - Vértice = Mesa de Bilhar **Gabe Madeira Maciça** (angular A-frame wood, "geometria angular em madeira maciça")
   - Elipse = Mesa de Bilhar **Aparato Alto Padrão** (wave-form continuous base, "base curva contínua" — match exato)

2. **Fontes oficiais** instaladas via `next/font/local`:
   - Thesis A: Libre Caslon Text (Reg/Italic/Bold) + Poppins (Reg/Med/SemiBold/Bold) ← era Cardo + DM Sans
   - Thesis B: Poppins body + Libre Caslon italic acento ← era Big Shoulders CSS-only
   - Thesis C: mantido Space Grotesk + Crimson Pro (brutalist grotesque não bate com Caslon serif)
   - Files: `apps/tocks-website/public/fonts/{libre-caslon-text,poppins}/`

3. **Photos master** promovidas:
   - `/produtos/vertice/`: hero=Gabe-003 outdoor twilight, lifestyle=Gabe-001 indoor pool, gallery-02=Gabe-000 cutout, gallery-04=Gabe-001
   - `/produtos/elipse/`: hero=Aparato-001 black wave on marble, detail-base=Aparato-002 white wave, lifestyle=Aparato-002
   - Originais placeholder backup em `_legacy-placeholder/` (untracked)

4. **Logos oficiais** em `/public/`: tocks-logo.svg + tocks-symbol-{white,blue,gold}.svg

5. **Subagents background:**
   - **Skara decision (SEPARATE site, MEDIUM-HIGH)** — papelaria DOCX + 16×10 catálogo configurador-heavy = B2B/contratual; clash com editorial v4. **Open Q user**: Skara é (a) sub-brand mesmo CNPJ, (b) sister company, (c) brand B2B-only? Doc: `docs/projects/tocks/v4-fantastic/research/skara-decision-06mai.md`
   - **Video curation 122 files** — 78% (~95) WhatsApp 848x480 rejeitados; top-3 hero (16:9 1920x1080): `IMG_5112.mov` 42.8s narrative master, `IMG_0895.mov` 26.8s loop-friendly, `IMG_5113.mov` 26.3s alt angle; top-3 stories vertical batch `VIDEO-2024-04-13-*`. Gap: Renders/ vazio, sem 4K, sem drone/dolly. Doc: `.../research/video-curation-06mai.md`

6. **TypeScript check:** PASS (zero errors)

7. **Commit:** `9da8ba3b feat(tocks): master asset library + v4 real fonts/photos [06/Mai]` — 53 files +1009 insertions

8. **HEIC conversion:** deferred (ImageMagick não instalado nessa máquina; usar heic-convert/Sharp se necessário depois)

## ✅ Round 3 — User clarification + correction (06/Mai)

User respondeu 4 questões: Skara=CNPJ antigo, todos modelos no site oficial, "faça como achar melhor" videos, sim captures.

**Correções:**
1. **Skara reverted SEPARATE → INTEGRATED LEGACY:** É CNPJ antigo Tocks. Logos/papelaria = legacy histórico; "Opções de acabamento Skara" (10 madeiras + 16 tecidos) = catálogo OFICIAL Tocks Custom hoje (cross-validated em tockscustom.com.br/linha-original/mesa-de-bilhar-{vertice,elipse}).
2. **Vértice/Elipse ARE REAL** Linha Original models (R$ 15.900 + R$ 19.900). Round 2 mapping (Gabe→Vertice, Aparato→Elipse) foi engano — squad já tinha as photos oficiais. Reverti pra real photos. Photos Gabe/Aparato realocadas pra `/produtos/{gabe,aparato}/` com Linha Premium.
3. **Catálogo full Tocks Custom inventoried** (15 modelos: Linha Original 4, Linha Premium 9, Linha Pebolim 2). Master library tem 5 modelos discontinued não-listados no site (Modern Inox, Berlin, Contemporânea, Modern, Dubai).
4. **Fix bug fonts:** `next/font/local` path tinha 5 `../` (overshooting pra apps/), corrigido pra 4 `../` (apontando pra public/). Sem isso, todas rotas thesis A/B retornavam 500.

**Captures:** 12 PNGs em `docs/projects/tocks/v4-fantastic/captures/comparison-06mai/` — desktop+mobile × hero+fullpage × 3 teses. Dev server boot clean, 200 OK em todas rotas. Visual confirmation:
- Thesis A: Libre Caslon Text serif elegante + Pau-Brasil red italic ("arquitetos") ✅
- Thesis B: Big Shoulders Display brutalist + cream void ✅ (Poppins body via fallback)
- Thesis C: Space Grotesk + glyphs M✦ESAS DE→LUXO ✅

**Commits feat/redesign-foundation-tokens:**
- `9da8ba3b` master asset library + v4 fonts (initial, with mistakes)
- `2206c9bf` fix correction Vértice/Elipse + Skara
- `8c26dd9f` fix localFont path resolution
- `841fb9ac` chore: 12 v4 captures + script copy
- `4a96b81c` docs: ads action plan 06/Mai
- `356b9376` docs: update Action 1 PR #645 push
- `9c6d97b8` fix: mirror CodeRabbit analytics fixes + vercel gitignore

**Commit feat/tocks-capi-d-plus-plus (worktree, pushed to lorDofPicanha/aiox-core fork):**
- `96f6edd9` fix(tocks-capi): CodeRabbit review (try/catch + sanitize source_url)

**Vercel deploy pessoal (Path F):**
- URL: https://tocks-fork-preview-31cfgv8zh-brenodecerqueira-4418s-projects.vercel.app
- Project: brenodecerqueira-4418s-projects/tocks-fork-preview
- Status: READY, deployment protection ON (user owns, navega logado)
- User confirmou "ja ta funcionando"

**Action 1 final state:** PR #645 fixes pushed, awaiting merge by SynkraAI owner. lorDofPicanha não tem write SynkraAI nem Vercel team Member.

**Action 2 done:** 9 brand keywords adicionadas em "03 - Marca Tocks" ad group via MCP.
**Action 3 done:** Watch criteria documentado.
**Action D em curso:** User instalando GA4 + Google Ads conversion tag no painel Tray (walkthrough entregue 06/Mai). Trigger ao terminar: `tray instalado`.

## Triggers próxima sessão

| User diz | O que disparar |
|---|---|
| `mapeia vertice/elipse → modelos master` | Subagent inspeciona /preview/v4-thesis-* + photo library, propõe match |
| `aplica fontes oficiais nas 3 teses` | Edit token JSONs + preview pages com Libre Caslon + Poppins |
| `cura videos hero` | Playwright/script preview dos 122 videos, recomenda top-3 hero candidates |
| `decide skara: integrada ou separada` | Faço análise + propostas de IA |
| `converte heic` | Roda ImageMagick batch nos 246 HEICs |
| `aprova manifest` | Commit MANIFEST.md + 8 SVG logos (assets gitignored) |
