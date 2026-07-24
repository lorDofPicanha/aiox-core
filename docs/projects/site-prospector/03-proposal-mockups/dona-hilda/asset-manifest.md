# Dona Hilda Confeitaria — Asset Manifest (Blumenau prospect #1 · ÂNCORA)

**Prospect P-006** · piloto `blumenau-padaria-artesanal` · score 9.0 (top).
**Objetivo:** golden prototype privado, fiel a UMA referência (ADR-0004), com marca + fotos reais.
**Regra:** 0 fato inventado · 0 preço (é mockup) · 100% mídia first-party (IG) com proveniência.

## 1. Identidade verificada (fonte: 01-prospect-list.md P-006)

| Campo | Valor | Fonte |
|---|---|---|
| Nome | Dona Hilda Confeitaria | prospect-list |
| Razão social | Dona Hilda Doces e Salgados LTDA | prospect-list |
| CNPJ | 81.621.054/0001-76 | prospect-list (revalidar em certidão antes de outreach) |
| Fundação | LTDA 1990 → **~36 anos de tradição** | prospect-list |
| Endereço | R. Antonio da Veiga, 440 — Itoupava Seca, Blumenau/SC · CEP 89.012-500 | prospect-list |
| Bairro | Itoupava Seca (priority, ~2km do centro) | prospect-list |
| Instagram | [@donahildaconfeitaria](https://www.instagram.com/donahildaconfeitaria/) · 13k | prospect-list |
| Site atual | http://www.donahilda.com.br — **HTML estático 2008-era**, sem HTTPS (`/confeitaria.html`, `/contato.html`) | prospect-list |
| Produtos (sinal) | pão, cuca, bolo, doces/salgados (confeitaria tradicional) | prospect-list |
| Vitalidade | Yelp "updated March 2026" = negócio ativo | prospect-list |

## 2. A dor (tese de venda)

13k seguidores no Insta (audiência tracionada) + **site parado em 2008** (HTML estático, HTTP, sem mobile/schema). 36 anos de patrimônio reputacional que o site não representa. Todo tráfego que chega no domínio evapora. → Caso perfeito de **Dor→Teach→Reveal** (o anchor do piloto).

## 3. Referência-mestra (ADR-0004) — **Magnolia Bakery** (warm heritage)

- **Por que NÃO buckssauce:** público tradicional/mais velho → anti-pattern "estética moderna fria pra 55+". Precisa quente, legível, herança.
- **Magnolia Bakery:** padaria de herança, quente, produto-herói, acolhedora. Benchmark **já extraído** no repo: `03-proposal-mockups/confectionery/benchmarks/magnolia-bakery/DESIGN.md`.
- Estrutura reutilizável (mesma espinha do template): hero + produtos + história/herança + presentes + reviews + footer. Tokens quentes por cima.

## 4. Assets — STATUS

- 🟡 **IG scrape rodando** (Apify @donahildaconfeitaria → `assets/instagram/`) — fotos de produto + logo + proveniência.
- 🔴 **Google Maps pendente:** fachada real, telefone/WhatsApp, horário, nota★/avaliações, cores reais da fachada/logo. (Puxar via browser/WebSearch, igual fiz no Brandt.)
- 🔴 **Cores de marca:** derivar do logo + feed após o scrape (target/DESIGN.md).

## 5. Gaps que bloqueiam o build

1. 🟡 Fotos IG (scrape em andamento)
2. 🔴 Dados Google Maps (fachada, telefone, horário, reviews reais) — próximo
3. 🔴 target/DESIGN.md (cores/tipografia a partir do logo+feed)
