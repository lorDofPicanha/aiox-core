# Fase 1b — Benchmark visual capturado

**Data:** 2026-07-26 · **Direção alvo:** produto tech moderno (dark elegante, gradiente sutil,
muito respiro, demos de interface animadas).
**Regra que obriga esta fase:** `.out-of-scope/luxury-redesign-without-benchmark.md` — REJECTED,
4ª falha confirmada. Referência vem **antes** do brief, não depois.

Ferramenta **reusada** (não criada): `docs/projects/site-prospector/tools/fork-pipeline/`.

---

## 1. Sondagem de forkabilidade — 13 candidatos

`node probe.cjs <urls>` · regra: CSS externo grande = layout CSS-driven = forka.
CSS externo minúsculo em site complexo = posicionado por JS, colapsa sem os bundles.

| Site | CSS ext | inline | nós | imgs | altura | Veredito |
|---|---:|---:|---:|---:|---:|---|
| **resend.com** | 852 KB | 20 KB | 2.673 | 92 | 14.184 | ✅ forka |
| **clerk.com** | 834 KB | 0 KB | 6.996 | 106 | 10.113 | ✅ forka |
| **liveblocks.io** | 595 KB | 1 KB | 1.613 | 42 | 8.836 | ✅ forka |
| **neon.tech** | 501 KB | 0 KB | 1.236 | 44 | 6.760 | ✅ forka |
| supabase.com | 453 KB | 18 KB | 7.524 | 57 | 9.298 | ✅ forka |
| mintlify.com | 348 KB | 4 KB | 1.865 | 32 | 9.365 | ✅ forka |
| **railway.com** | 339 KB | 59 KB | 9.215 | 65 | 13.550 | ✅ forka |
| dub.co | 284 KB | 32 KB | 5.371 | 99 | 12.822 | ✅ forka |
| **trigger.dev** | 265 KB | 0 KB | 3.432 | 107 | 14.643 | ✅ forka |
| stripe.com | 91 KB | 0 KB | 2.544 | 38 | 15.258 | 🟡 testar |
| attio.com | 83 KB | 26 KB | 4.535 | 107 | 16.618 | 🟡 testar |
| linear.app | 30 KB | 15 KB | 4.296 | 32 | 10.524 | 🟡 testar |
| vercel.com | 23 KB | 0 KB | 1.103 | 19 | 5.186 | ❌ JS-driven |
| cal.com | 5 KB | 471 KB | 3.743 | 78 | 12.516 | ❌ JS-driven |

**Achado que vale registrar:** Linear e Vercel — as duas referências que todo mundo cita quando
fala "site de produto bonito" — **não forkam**. Linear tem só 30 KB de CSS externo para 4.296 nós;
Vercel, 23 KB. O layout é montado por JS. Copiar essas duas exigiria reconstruir do zero a partir
de screenshot, que é exatamente o caminho que produziu os builds genéricos anteriores.

---

## 2. Capturados em disco — 39 MB

`node capture-site.cjs <origin> <outDir> <maxPages>`

| Ref | Páginas | Tam. | CSS | Imgs | Fontes | Por que está aqui |
|---|---:|---:|---:|---:|---:|---|
| **clerk** | 3 (home, pricing, docs) | 17 MB | 841 KB | 99 | 15 | Maior densidade visual. Dark + motion + demo de interface. Página de pricing capturada |
| **railway** | 3 (home, index.md, pricing) | 7,1 MB | 350 KB | 66 | 6 | Motion mais distintivo do lote. 9.215 nós — layout muito trabalhado |
| **resend** | 1 (home) | 5,7 MB | — | 47 | — | Padrão-ouro do "dark elegante + demo". 15 seções, 12.273px |
| **liveblocks** | 3 (home, docs, pricing) | 4,8 MB | 626 KB | 48 | 6 | Foco em demo de produto ao vivo — o mecanismo que substitui case |
| **trigger** | 3 (home, product, ai-agents) | 4,8 MB | 455 KB | 103 | 1 | **Mais próximo do que o founder vende**: automação de workflow. 49 seções na home. Tem página dedicada a agentes de IA |

Estrutura de cada captura:
```
<ref>/
├── asset-manifest.json
├── assets/fonts/     ← woff2 reais
├── assets/img/       ← imagens reais
└── pages/<slug>/     ← DOM + CSS + intel por página
```

---

## 3. O que extrair de cada uma (para a Fase 2)

| Ref | O que ela resolve bem |
|---|---|
| **trigger.dev** | Como explicar "workflow que roda sozinho" para quem não é engenheiro. Página `/product/ai-agents` é o análogo mais direto da oferta do founder |
| **liveblocks** | Demo ao vivo embutida na página — o mecanismo que substitui case quando não há cliente |
| **resend** | Ritmo vertical e respiro. 15 seções em 12.273px sem parecer cansativo |
| **clerk** | Página de preço densa que não assusta — resolve o achado dos "35 segundos" (rejeição por falta de preço) |
| **railway** | Motion com função. Referência de até onde ir sem virar estúdio de design |

---

## 4. Pendências desta fase

- [ ] Rodar `shoot.cjs` para gerar baseline de screenshot de cada referência (comparação A/B na Fase 4)
- [ ] Resend capturado só na home — crawler quebra em link não-HTML (`/static/cube.splinecode`).
      Rodar de novo com lista de páginas explícita se `/pricing` for necessário
- [ ] Decidir se `neon.tech` e `supabase.com` entram como 6ª/7ª referência
