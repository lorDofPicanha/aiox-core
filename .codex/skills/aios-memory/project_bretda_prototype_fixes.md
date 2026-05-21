---
name: Bretda Prototype Fixes (16/Abr)
description: Sessão de correções visuais + infra no site HTML prototype em D:\AIOS\docs\projects\bretda-landingpage\prototype (localhost:8080). Vídeos pendentes para integração.
type: project
originSessionId: 8f1da152-edb4-4886-b4e5-a234291ef1f3
---
# Bretda Prototype Fixes — Sessão 16/Abr/2026

## Contexto
Site HTML estático (prototype, não Next.js) em `D:\AIOS\docs\projects\bretda-landingpage\prototype\` servido em `localhost:8080`. Decisão anterior: evoluir este site antigo (não `bretda-website-v2` que foi abandonado).

## Correções Aplicadas Nesta Sessão

### P0-P3 Visuais (via aios-dev)
- Logo oficial + tipografia + mobile overflow fixes
- Hero typography reduzida: xl 68→56px, md 56→44px, sm 48→36px
- Eliminados todos `text-6xl/7xl` → adicionado `text-wrap: balance`
- 6 forms WhatsApp refatorados: `onsubmit inline` → `addEventListener` (index x2, produto, catalogo, configurador, arquiteto)
- Título "Ferramenta 3D para Arquitetos" → `text-wrap: balance + max-w-md`

### Remoção da Seção 360° (produto.html)
- Script model-viewer CDN removido
- CSS model-viewer (5 linhas) removido
- `<section>` "Explore em 360 graus" + fallback removido
- JS init/error handler/timeout removido
- Referência `modelViewer` em `loadProduct()` removida
- Arquivo: 137KB → 72KB (−48%)

### Fix Crítico: Infinite Loading
**Causa raiz:** Python `SimpleHTTPServer` era single-threaded. `configurador.html` dispara 36+ requests concorrentes (fonts Google, three.js CDN, model-viewer, imagens) → Chrome abortava com `ERR_INSUFFICIENT_RESOURCES`.

**Fix em `serve-nocache.py`:**
```python
class ThreadingServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True
```
+ headers `Cache-Control: no-store` para evitar cache do Chrome.

**Validação:** 10 requests paralelos no configurador = 200 OK em 215–246ms.

## Stack Disponível
- **FFmpeg 8.0.1** em `C:\Users\kingp\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_*\bin\`
- **Whisper** em `D:\tools\transcrever.bat` (model=small, CUDA)

## Servidor
- Script: `D:\AIOS\docs\projects\bretda-landingpage\prototype\serve-nocache.py`
- Rodar: `cd /d/AIOS/docs/projects/bretda-landingpage/prototype && python serve-nocache.py`
- URL: `http://localhost:8080`

## Páginas do Site
- `index.html` — home
- `produto.html` — detalhe produto (360° REMOVIDO)
- `configurador.html` — config 3D arquiteto
- `arquiteto.html` — LP arquitetos
- `catalogo.html` — catálogo
- `contato.html` — form contato
- `lp-ads.html` — LP para ads

## PRÓXIMO PASSO
Usuário vai enviar múltiplos vídeos para integrar no site.

**Workflow definido:**
1. User manda caminhos dos vídeos
2. FFmpeg extrai 5-8 frames-chave + metadata
3. Analisar frames como imagens + Whisper se tiver áudio/falas
4. Perguntar seção de destino + comportamento (autoplay/loop/mute)
5. Converter para web: `.webm` + `.mp4` fallback + poster.jpg
6. Implementar no HTML via aios-dev

## Decisões Tomadas
- Site antigo (prototype HTML) é o site oficial evoluído, NÃO Next.js v2
- Model-viewer 360° removido por complexidade + bugs de clipping
- Threading server obrigatório para servir múltiplos assets em paralelo
