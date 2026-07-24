# Site Prospector — prospects e-commerce num raio de 300 km de Blumenau

**Data da pesquisa:** 2026-07-23
**Executor:** Orion (aios-master) via workflow de 6 agentes de pesquisa web real + verificação adversarial
**Decisão suportada:** quais negócios de produto (foco e-commerce) merecem diligência na próxima rodada, ampliando o alcance geográfico para ~300 km
**Geografia:** raio de ~300 km a partir de Blumenau/SC (6 zonas)
**Uso:** pesquisa interna. **Nenhum contato, proposta, mockup, envio ou deploy foi autorizado ou realizado.**

> Complementa — não substitui — a rodada do Codex de 2026-07-19 (`2026-07-19-cross-niche-ecommerce-candidates.md`), que cobriu **só o município de Blumenau**. Esta rodada cobre **o entorno em 300 km, excluindo Blumenau-cidade** (já coberta).

---

## Veredito executivo

A varredura encontrou **53 negócios qualificados únicos** e rejeitou **53 negócios** (taxa de exclusão de 50% — bem acima do piso de disciplina), em 6 zonas e 15+ nichos. Há oportunidade densa fora de Blumenau, com concentração clara em **chocolate/alimentos gourmet, semijoias, moda (praia/infantil/feminina), confecção têxtil e móveis sob medida**.

**Top tier (verificação adversarial + spot-check meu por WebFetch):**

1. **Chocolates Brandt** (Joinville) — fábrica+empório de chocolate ~25 anos; domínio próprio no ar mostrando **só página "Em Breve…"** (zero e-commerce). Lacuna confirmada 2× de forma independente. **Score 77.**
2. **Bananas Gostosas / Ind. Langer** (Corupá) — fábrica pioneira de banana-passa com **Indicação Geográfica**; site oficial **caducou** (DNS morto), opera só por Instagram/WhatsApp/revendedores. **Score 81.**
3. **Chocolatier — Chocolates Finos** (Ituporanga) — site institucional **datado (~2015), sem loja online**; vendas só presenciais. Caso-livro de "site velho". *(Spot-check meu confirmou.)*

**Ressalva estratégica de peso:** o diferencial do projeto é **presença física do founder** (oferta presencial + sessão de fotos). Num raio de 300 km isso **só se sustenta no anel próximo (~≤100–140 km)**. Ver [Tensão geográfica](#tensão-geográfica--o-ponto-que-precisa-de-decisão-do-founder) — é a decisão nº 1 antes de qualquer outreach.

---

## Tensão geográfica — o ponto que precisa de decisão do founder

O `CONTEXT.md` trava o piloto em **Blumenau-only** porque o moat é presencial. Você pediu **300 km**. Isso é coerente **para e-commerce** (que vende nacional e não depende de foto presencial), mas parte os prospects em **dois modelos de negócio diferentes**:

| Anel | Distância de Blumenau | Moat presencial? | Modelo de venda | Prospects desta rodada |
|---|---|---|---|---|
| **A — Presencial-viável** | ~≤100–140 km | ✅ Mantém (foto + oferta no local) | Igual ao CONTEXT: "Presença Local Premium" | Brandt (Joinville ~90km), Chocolatier (Ituporanga ~100km), Chokolaten + Delicaten (Pomerode ~30km), Bananas Gostosas (Corupá ~100km), Engel Joias (Itajaí ~50km), Inventikids (Brusque ~45km), Jully (Ibirama ~55km), Cellitá + Dona d'Si (Jaraguá/Joinville), Zabelê + Emporio Casa (Floripa/São José ~140km, limítrofe) |
| **B — E-commerce remoto** | ~150–300 km | ❌ Não há foto presencial nem oferta no local | **Outro produto**: build + onboarding remoto, pitch por valor de e-commerce, sem sessão de fotos | Curitiba (Nuscaa, DM Semijoias, Caos, Ametista), Sul SC (COOFANOVE, Ivic Store, Armazém Sabor Serrano), Litoral PR (Cataia, Bala de Banana Morretes), móveis São Bento/Rio Negrinho (Maju, Movelaria Fragata) |

**Recomendação:** rodar o próximo protótipo-ouro (ADR-0004) num prospect do **Anel A** — mantém o moat e a tese testável. O **Anel B** é uma linha de negócio nova (agência de e-commerce remota) que merece decisão explícita antes de gastar sample; se for GO, precisa de oferta/pitch próprios (sem "sessão de fotos presencial" no stack).

---

## Método

Workflow determinístico: 6 agentes de pesquisa (um por zona) → merge + dedup em código → verificação adversarial dos 24 melhores (tenta **refutar** cada um por WebFetch no site alegado).

**Zonas:** (1) Grande Floripa + Costa Esmeralda · (2) Norte SC / Joinville metro · (3) Vale do Itajaí arredores (Blumenau-cidade excluída) · (4) Sul SC · (5) Curitiba + RMC/PR · (6) Litoral PR + Campos Gerais + Serra SC (borda 300 km).

**Rubrica (0–100):** lacuna de site 30 · vitalidade comercial 20 · capacidade de investimento 20 · ativos first-party visuais 15 · vantagem local 10 · baixo risco comercial 5.

**Inclusão (os 3):** sinal de CNPJ ativo · vitalidade comercial (Insta ativo / reviews / loja física) · **sem site OU site quebrado/antigo/template/só-Linktree**.
**Exclusão:** já tem e-commerce moderno forte · franquia · sem qualquer presença digital · CNPJ baixado · fora da zona.

> ⚠️ **Nota de execução:** a verificação adversarial completou **2 dos 24** (limite de sessão interrompeu 2×). Os outros 22 estão **coletados com evidência real de pesquisa, mas com verificação adversarial pendente** — tratar como shortlist forte, não como confirmado. Fiz spot-check manual por WebFetch em 4 (Brandt, Chocolatier, Nuscaa, COOFANOVE) para validar a metodologia.

---

## Tier 1 — verificado (pronto para diligência)

### 1. Chocolates Brandt — Joinville · chocolate artesanal (fabricante)
- **Anel A** (~90 km) · **Score 77** · e-commerce **alta**
- **Lacuna:** `chocolatesbrandt.com.br` no ar exibindo só "Em Breve…" + links Instagram/WhatsApp + endereço (R. Padre Kolb, 1419 – Anita Garibaldi). Zero produtos/preços/carrinho. **Confirmado 2× (subagente + eu).**
- **Sinais:** @chocolatesbrandt, ~25 anos, presença iFood, WhatsApp (47) 99765-6867. CNPJ 79.829.081/0001-97.
- **Ressalvas:** contagem de seguidores/iFood não re-verificada; chocolate tem atrito de logística/cadeia fria para venda nacional (verão).

### 2. Bananas Gostosas (Ind. Langer) — Corupá · banana-passa / cachaça / chocolate (fabricante c/ IG)
- **Anel A** (~100 km) · **Score 81** · e-commerce **alta**
- **Lacuna:** domínio `bananasgostosas.com/.com.br` **morto (DNS ENOTFOUND)** — o site oficial (citado em matéria de 2021) caducou. Opera por @gostosasbananas, Facebook, WhatsApp (47) 99138-5241 e revendedores.
- **Sinais:** fábrica de 3ª geração, **Indicação Geográfica de Corupá desde 2018**, produtos shelf-stable (cesta gourmet natural). CNPJ 34.264.919/0001-04 ativo. Decisor: Daniel Langer + Gisleini.
- **Ressalvas:** microempresa em cidade de ~15 mil hab. → capacidade de investimento provavelmente modesta; decisão possivelmente lenta.

### 3. Chocolatier — Chocolates Finos — Ituporanga · chocolate fino (fabricante, 2 lojas)
- **Anel A** (~100 km) · e-commerce **alta**
- **Lacuna:** `chocolatier.ind.br` = site institucional **datado (~2015, "Desenvolvido por CompletaWeb")**, sem catálogo/carrinho/pagamento; vendas presenciais em Ituporanga e Rio do Sul. **Spot-check meu confirmou.**
- **Fit forte** com o brief "site muito velho e desatualizado".

---

## Tier 2 — shortlist forte (evidência real, verificação adversarial pendente)

Ordenados por ranking do workflow. `Anel` = alcance presencial (A ≤~140 km / B remoto).

| # | Empresa | Cidade | Anel | Nicho | Status do site | Evidência |
|---:|---|---|:---:|---|---|---|
| 1 | **Chokolaten** | Pomerode | A | Chocolate artesanal | só Insta (15 mil seg.) | [@chokolaten](https://www.instagram.com/chokolaten/) · CNPJ 41.887.017/0001-90 |
| 2 | **COOFANOVE** | Nova Veneza | B | Alimentos coloniais italianos (cooperativa) | site c/ **SSL quebrado** (confirmei) | [@coofanove](https://www.instagram.com/coofanove/) · coofanove.com.br |
| 3 | **Zabelê Home Decor** | São José/Floripa | A* | Decoração / presentes | quebrado | [@zabelehomedecor](https://www.instagram.com/zabelehomedecor/) |
| 4 | **DM Semijoias** | Curitiba | B | Semijoias (15 anos) | só Insta | [@dmsemijoias](https://www.instagram.com/dmsemijoias/) |
| 5 | **Cataia Moda Praia** | Paranaguá/PR | B | Moda praia autoral / crochê caiçara | só Insta | [@cataiamodapraia](https://www.instagram.com/cataiamodapraia/) |
| 6 | **Bala de Banana Morretes** | Morretes/PR | B | Doces c/ Indicação Geográfica | só Insta | [@balamorretes](https://www.instagram.com/balamorretes/) · CNPJ 37.082.720/0001-53 |
| 7 | **Engel Joias** | Itajaí | A | Joias/prata 925/semijoias | só Insta/Linktree | [@engeljoias](https://www.instagram.com/engeljoias/) · CNPJ 30.712.751/0001-00 |
| 8 | **Nuscaa Chocolate** | Curitiba | B | Chocolate DTC | domínio quebrado ("Loading…" eterno — confirmei) | [@nuscaachocolate](https://www.instagram.com/nuscaachocolate/) · CNPJ 47.277.922/0001-04 |
| 9 | **Ametista Semi-Joias** | Ponta Grossa/PR | B | Semijoias/bijuterias | fraco (só Facebook) | [FB](https://www.facebook.com/ametistacomerciodesemijoias/) |
| 10 | **Ivic Store** | Criciúma | B | Moda feminina (marca própria + multimarcas) | só Insta | [@ivicstore_](https://www.instagram.com/ivicstore_/) |
| 11 | **Jully Confecções** | Ibirama | A | Moda infantil (confecção) | só Insta/Linktree | [@jullyconfeccoes](https://www.instagram.com/jullyconfeccoes/) |
| 12 | **Emporio Casa Decoração** | Florianópolis | A* | Decoração / presentes | quebrado | [@lojaemporiocasa](https://www.instagram.com/lojaemporiocasa/) |
| 13 | **Cellitá** | Jaraguá do Sul | A | Moda feminina | só Insta/Linktree | [@lojacellita](https://www.instagram.com/lojacellita/) |
| 14 | **Delicaten** | Pomerode | A | Biscoitos e cucas coloniais | só Insta/Linktree | [@delicatenbiscoitos](https://www.instagram.com/delicatenbiscoitos/) |
| 15 | **Feirão dos Calçados Mix** | Sombrio | B | Calçados | só Insta/Linktree | [@feiraodoscalcadosmix](https://www.instagram.com/feiraodoscalcadosmix/) |
| 16 | **Dona d'Si Semijoias** | Joinville | A | Semijoias | só Insta/Linktree | [@donad.si_semijoias](https://www.instagram.com/donad.si_semijoias/) |
| 17 | **Inventikids** | Brusque | A | Moda infantil (fábrica) | só Insta/Linktree | [@inventikidsoficial](https://www.instagram.com/inventikidsoficial/) |
| 18 | **Armazém Sabor Serrano** | Lages/SC | B | Queijo/doce de leite/geleias coloniais | sem site | econodata · CNPJ 04.740.231/0001-92 |
| 19 | **Maju Projetados** | São Bento do Sul | B | Móveis sob medida (fabricante) | fraco | econodata · CNPJ 30.898.313/0001-70 |
| 20 | **Caos Chocolate** | Curitiba | B | Chocolate bean-to-bar | só Insta/Linktree | [@caoschocolate](https://www.instagram.com/caoschocolate/) |
| 21 | **Movelaria Fragata** | Rio Negrinho | B | Móveis / jantar / planejados (fabricante) | fraco | econodata · CNPJ 10.454.103/0001-85 |

\* Floripa/São José (~140 km) = limite do anel presencial; viável mas com deslocamento.

**Próxima verificação (todos):** reproduzir a lacuna no mobile · confirmar CNPJ ativo em certidão oficial · confirmar decisor + capacidade de investimento · confirmar que não é migração temporária.

---

## Tier 3 — longlist (score mais baixo, sem verificação)

Malharia Adriana (Curitiba) · Asa Moda Praia (Matinhos) · Vive L'essence (velas, Timbo) · Camisas Schroeder (Jaraguá) · La Bela Semijoias (Joinville) · Orpanel Semijoias (Tubarão) · Zaira de Luca Cerâmica (Criciúma) · Seboldrink cachaça (Pomerode) · Mundo Encantado Baby (Tubarão) · Degus't Geleia (Curitiba) · Maria Emília Moda Praia (Tubarão) · Cervejaria União Serrana (Lages) · Raiamar Beachwear (Brusque) · J Joias (Curitiba) · Terral Artesanatos (Bombinhas) · Cervejaria Green Coast (Itajaí) · MD Marcenaria (S.J. Pinhais) · ALMAZ Essências (Tubarão) · inima moda autoral (Curitiba) · D'Corpo Moda Fitness (Biguaçu) · Sabor & Arte Chocolates (Ponta Grossa) · Floral Home Decor (Curitiba) · PN Confecção (Itajaí) · Código Zero malharia (Içara) · King Malharia (Brusque) · L'Artesanais (Guaratuba) · Sabor Família do Campo (Caçador) · Cachaçaria Morretes · VelaSpa Boutique (Bal. Camboriú).

---

## Exclusões notáveis (disciplina anti-ruído — 53 no total)

**Já têm e-commerce forte (sem lacuna):** Camytá Cosméticos, Dona Fran, Inmoda Store, Gute Schokolade (Joinville), Oxford Porcelanas (Pomerode), Malharia Indaial, Cantinho Perfumado (Brusque), Tood's Wear (Brusque), Reiwiu (Brusque), Vinícolas Goethe de Urussanga (Mazon/Trevisol/Damian), Balas de Banana Antonina, Nice/Bot Art Porcelanas (Campo Largo), Entorno Cerâmica, Cativa Natureza, ID Chocolates, Love Lingerie, Havana Store, Miller/Ativa/Irimar Móveis, Vinícola Santa Augusta, IT44 Destilaria.

**Franquia:** Loja Maria Dolores (BC), Miss Make (BC), Rhana Cosméticos.
**CNPJ baixado / encerrado:** Nutri+ Pet Food (baixado 2017), Meu Mundo Doce (fechou 01/2026).
**Vitalidade insuficiente:** Chocoboom (blog parado 2014), @produtocolonial_ (73 seg.), Lirie Aromas (108 seg.), Perfil dormente.
**Fora da zona (falso-match):** Embutidos Engelmann (RS), Sol da Barra (RJ), Casa da Madeira (SP), Deluxe Biquínis (S. Amaro da Imperatriz).
**Modelo/nicho errado:** Cerâmica Santo Antônio (material de construção), Estúdio Ceramina (escola/serviço), Associação Serra Artesanal (sem fins lucrativos), revendedores (Qualittá, Cosméticos Carioca).

---

## Revisão adversarial

**Tese.** Ampliar para 300 km e priorizar e-commerce multiplica o número de negócios de produto com lacuna material e ticket plausível — sobretudo nos polos industriais (chocolate/Joinville, têxtil/Brusque-Gaspar, móveis/São Bento, semijoias, cerâmica/Criciúma). A amostra confirma densidade real.

**Antítese.** O raio de 300 km **quebra o único moat defensável do projeto** (presença física do founder). No Anel B, "Site-Prospector" vira uma agência de e-commerce remota como mil outras — sem foto presencial, sem oferta no local, competindo em preço. Além disso, ~40% dos qualificados são "só Instagram/Linktree", onde a lacuna pode ser **escolha deliberada** (o dono vende bem no direct) e não dor — o que derruba willingness-to-pay. E a verificação adversarial ficou incompleta (2/24): há risco de falso-positivo nas 22 não-verificadas.

**Síntese.** Não abrir batch nem outreach ainda. **Concentrar o próximo protótipo-ouro (ADR-0004) em 1 prospect do Anel A** — de preferência **Chocolates Brandt** ou **Chocolatier** (lacuna cristalina, fábrica com produto shelf-stable fotografável, dentro do alcance presencial). Só depois de 1 golden aprovado + 1 venda, decidir explicitamente se o **Anel B (e-commerce remoto)** vira linha de negócio nova — e, se virar, redesenhar a oferta sem o item "sessão de fotos presencial".

---

## Guardrails (mantidos do projeto)

- **Nenhuma** mensagem, proposta ou mockup sem aprovação humana explícita.
- Não usar nº de seguidores como proxy universal de saúde comercial.
- Não assumir faturamento, margem ou orçamento.
- Não copiar identidade, texto ou mídia de nenhum prospect/concorrente.
- Revalidar CNPJ + site + atividade **imediatamente antes** de qualquer abordagem.
- ADR-0004: **1 protótipo-ouro aprovado antes de qualquer segundo prospect.**

---

## Próxima ação recomendada

1. **Founder decide:** Anel A (mantém moat, recomendado) vs. abrir Anel B (e-commerce remoto — nova linha).
2. **Se Anel A:** escolher entre **Chocolates Brandt** e **Chocolatier** para o protótipo-ouro; montar ficha de diligência (mobile audit, SKUs, decisor, ativos first-party, stack atual).
3. **Terminar a verificação adversarial das 22** da shortlist (re-rodar o workflow — as 6 zonas voltam do cache, só as verificações rodam) OU verificar manualmente as 5–6 candidatas do Anel A.
4. **Só então** congelar o lote e decidir o protótipo.

---

## Validade e limitações

- Pesquisa desktop em 2026-07-23; **revalidar em até 30 dias** ou antes de outreach.
- Registros de CNPJ vêm de agregadores públicos (cnpj.biz, casadosdados, econodata), **não** de certidão oficial — obter comprovante na diligência final.
- Verificação adversarial: **2/24 completas** por limite de sessão; 4 spot-checks manuais meus. As 22 da shortlist são **coletadas, não confirmadas**.
- Distâncias de Blumenau são estimativas rodoviárias aproximadas.
- Ausência de site indexado não prova inexistência de portal privado (relevante para os B2B/fábricas).
