# Nichos mapeados dentro do dado do PNCP

**Base:** 282 fornecedores com 2+ contratos, SC, jul/2026 (`prospects-pncp-sc.json`).
**Regra de copy:** nenhuma peça identifica cidade de origem do founder.

---

## A descoberta que reorganiza tudo

Os prospects do PNCP não formam **um** nicho. Formam **dois modelos de dor opostos**, e
a mensagem que funciona num não funciona no outro.

| | Distribuidor / suprimento | Construtora / obra |
|---|---|---|
| Exemplo | ALTERMED — 115 contratos | ENGENFOX — **2** contratos |
| Valor | R$ 253k | **R$ 6.183.961** |
| Ticket médio | ~R$ 2,2k | ~R$ 3,1M |
| Dor | **Volume** — dezenas de editais por semana | **Aposta** — escolher errado custa milhões |
| Pergunta que abre | "Quantos editais vocês leram pra chegar nesses 115?" | "Quantas propostas de 40h vocês montaram e perderam?" |
| O que a IA resolve | Triagem em massa, descarte rápido | Decisão de ir/não ir + análise de concorrência |

Vender triagem-de-volume para construtora é errar o alvo: ela lê **poucos** editais.
O caro dela é montar proposta para a obra errada.

---

## 🔨 Construção — o nicho de maior ticket

22 empresas com objeto de obra/engenharia nos 282. Top por valor:

| Empresa | CNPJ | Contratos | Valor jul/26 |
|---|---|---|---|
| ENGENFOX TERRAPLANAGENS | 21285299000148 | 2 | R$ 6.183.961 |
| PINTURAS E OBRAS LITORAL | 13669947000131 | 3 | R$ 5.458.227 |
| AVENIDA CONSTRUÇÕES | 50168586000176 | 2 | R$ 1.430.695 |
| FABSUL PAVIMENTAÇÕES | 05528870000151 | 2 | R$ 678.857 |
| TERRAPLENAGEM POFFO | 03832009000157 | 2 | R$ 588.000 |
| LH TERRAPLENAGEM E CONSTRUÇÕES | 55705682000120 | 2 | R$ 576.908 |
| PAULO R DE SOUZA OBRAS | 21112949000153 | 2 | R$ 417.800 |

### Erro de método que este nicho expôs

O filtro `--min-wins 2` **descarta construtora sistematicamente**. Uma empresa que ganhou
**uma** obra de R$8M em julho é prospect excelente e não aparece na lista. Para distribuidor
o filtro faz sentido (2+ = recorrência); para obra, não.

→ Rodando `--min-wins 1` na janela 01–15/jul para recuperar as de contrato único.

### Por que construção é provavelmente o melhor nicho da carteira

1. **A Regra dos 10x fecha sozinha.** Uma obra de R$3M perdida por má escolha justifica
   R$15-60k de setup sem discussão. No distribuidor você precisa somar horas para chegar lá.
2. **Você já construiu o produto.** O parser de edital do PNCP + cruzamento de atestados é
   exatamente a decisão de ir/não ir. Não é promessa, é software que existe.
3. **Você conhece o domínio** — a ENIAC é construtora. Vocabulário, atestado, capacidade
   técnica, consórcio: você já sabe conversar.

> ⚠️ **Cuidado com o case da ENIAC.** É cliente, não vitrine. Falar "fiz para uma construtora"
> descrevendo capacidade é honesto; usar resultado dela como prova de venda precisa de
> autorização explícita. E resultado entregue continua fora da copy por decisão sua.

---

## 📦 Outros nichos já dentro do dado (sem precisar de nova fonte)

| Nicho | Fornecedores | Maiores |
|---|---|---|
| Medicamentos | 21 | PROMEFARMA (100) · DIMASTER (44) · VÉRTICE (44) |
| Equipamentos de informática | 18 | LICITA SHOP (26) · SOMA ATACADO (17) |
| Material ambulatorial/hospitalar | 17 | CENTERMEDI (186) · ALTERMED (115) · MEDILAR (59) |
| Higienização e limpeza | 11 | GOEDERT (52) · IPÊ (14) |
| Eletrodomésticos | 11 | GO VENDAS (31) · GAZIN (10) |
| Pneus | 10 | PESSOTTO (14) · CPX (10) |
| Material de expediente | 9 | PRINTSUL (65) · SK (49) |
| Material odontológico | 9 | MEGA DENTAL (17) · BIO LÓGICA (9) |
| Material elétrico p/ edificações | 7 | TURCHETTO (19) · INSTALART (10) |
| Móveis para escritório | 6 | MODILAC (24) · PRIMAZZIA (23) |
| Alimentos não perecíveis | 6 | JLM (100 — ❌ micro) · RS DISTRIBUIDORA (38) |

**Móveis para escritório merece nota:** é o único onde você conhece a operação por dentro
(opera duas indústrias de móveis). MODILAC e PRIMAZZIA vendem móvel para órgão público —
mesma cadeia, mesmo vocabulário, mesmos fornecedores de matéria-prima.

---

## Nichos FORA do PNCP (precisam de outra fonte)

O PNCP só enxerga quem vende para o governo. Para têxtil e varejo o caminho é outro:

| Nicho | Fonte de lista | Custo |
|---|---|---|
| **Têxtil / confecção** | Cadastro Industrial FIESC · associados SINTEX (18 municípios) · SINDIVEST Brusque | Associação/assinatura |
| **Varejo multi-loja / atacadista** | Não há base pública boa. Mapeamento manual ou compra de lista. | Alto esforço |
| **Indústria em geral (SC)** | Cadastro Industrial FIESC — traz porte e CNAE | Assinatura |

Nenhum deles tem a propriedade que faz o PNCP ser bom: **evidência pública e verificável da
dor antes do primeiro contato**. No PNCP você chega sabendo quantos contratos a empresa
fechou. Na FIESC você chega sabendo só que ela existe.

> Por isso a recomendação: esgotar PNCP (construção + suprimento) antes de pagar por cadastro.

---

## Ordem recomendada

1. **Construção** — maior ticket, produto pronto, domínio conhecido. Aguardar re-varredura `min-wins 1`.
2. **Suprimento hospitalar/expediente** — 9 já qualificadas com e-mail em `lote-01`. Enviar essa semana.
3. **Móveis para escritório** — nicho pequeno, mas é onde você conhece a operação por dentro.
4. **Têxtil** — só depois de validar a mensagem nos anteriores, porque exige investir em cadastro.
