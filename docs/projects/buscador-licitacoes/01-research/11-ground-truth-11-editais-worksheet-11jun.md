# Ground-Truth dos 11 Editais Reais — Planilha de Validação Humana

**Data:** 11/Jun/2026 · **Preenchimento:** cliente (equipe ENIAC) · **Dono técnico:** Orion (aios-master)
**Para que serve:** este é o gabarito oficial do **kill-gate Stage 2**. O motor já tentou recuperar desfechos via PNCP (cobertura 45% = REPROVA na 1ª rodada; vencedor recuperado 73%; MAPE preço 13,7%). Sem o gabarito humano, não dá pra saber se o erro é do PNCP (dado não existe lá) ou do motor (dado existe e não achamos). **Cada linha preenchida vira um caso de teste permanente.**

---

## Como preencher (5 min por edital)

1. Para cada edital abaixo, preencher as colunas **em branco** com o que a equipe sabe/consegue ver na plataforma de disputa (PCP/BLL/BNC/ComprasGov).
2. **Desfecho** = um de: `HOMOLOGADO` · `FRACASSADO` · `DESERTO` · `REVOGADO/ANULADO` · `SUSPENSO` · `EM ANDAMENTO`.
3. Se HOMOLOGADO: anotar **CNPJ e razão social do vencedor** + **valor homologado** (o final, não o estimado).
4. **ENIAC participou?** Se sim: colocação final + se foi inabilitada, o **motivo textual** da ata (esse motivo é ouro — alimenta o motor de habilitação).
5. Não precisa formatar — pode responder por áudio/WhatsApp linha a linha que nós estruturamos.

---

## Planilha

| # | Edital | Órgão | Plataforma | Valor estimado | **Desfecho** | **Data result.** | **Vencedor (CNPJ + nome)** | **Valor homologado** | **Nº propostas** | **ENIAC participou? Colocação/motivo** |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Concorrência 01/2026 — obra | Pref. Águas Lindas/GO | PCP | R$ 2.252.849,20 | | | | | | |
| 2 | Concorrência 04052026 — obra | Pref. Águas Lindas/GO | PCP | R$ 174.823,04 | | | | | | |
| 3 | Concorrência 05/2026 (republicação) — obra Cultura | Pref. Águas Lindas/GO (Cultura) | PCP | R$ 2.140.134,13 | | | | | | |
| 4 | UBS II — Jardim Santa Lúcia | Pref. Águas Lindas/GO | PCP | R$ 2.831.789,56 | | | | | | |
| 5 | Praça c/ quadra (Pedregal) — sessão 16/04 | Pref. Novo Gama/GO | BLL | a confirmar | | | | | | |
| 6 | Creche (Seção A3L) | Pref. Novo Gama/GO | BLL | a confirmar | | | | | | |
| 7 | Reforma + ampliação da Câmara | Câmara Mun. Abadiânia/GO | BNC | R$ 670.864,32 | | | | | | |
| 8 | Conclusão de obra remanescente — sessão 19/03 | Mun. Pirenópolis/GO | BNC | R$ 1.035.758,22 | | | | | | |
| 9 | CE 002/2026 — obra, sessão 17/03 | Pref. Anápolis/GO | ComprasGov | a confirmar | | | | | | |
| 10 | Construção galpão 5.000 m² | CEASA/GO (Lei 13.303) | BLL | a confirmar | | | | | | |
| 11 | Reforma geral de prédio (SEI 59297613) | CEASA/GO (Lei 13.303) | BLL | a confirmar | | | | | | |

### Perguntas-bônus (se a equipe souber de cabeça)

- **B1.** Dos 11, em quais a ENIAC chegou a **enviar proposta** (vs só analisou e desistiu)?
- **B2.** Houve algum em que a ENIAC foi **inabilitada**? Qual documento/critério pegou? (alimenta direto o motor de habilitação — doc 26)
- **B3.** Valores estimados dos editais 5, 6, 9, 10, 11 (estavam só na planilha anexa, não no corpo do edital).
- **B4.** Algum desses teve **recurso** (da ENIAC ou de terceiros)? Resultado?

---

## O que acontece com as respostas

| Resposta | Vira |
|---|---|
| Desfecho + vencedor + valor | Gabarito do eval offline Stage 2 (re-rodar kill-gate: cobertura real vs 45%) |
| Motivo de inabilitação | Caso de teste do motor de habilitação (doc 26 §3) — checar se o motor teria previsto o NO-GO |
| Nº propostas | Calibração do fator competitividade (doc 26 §5.2) |
| B3 (valores) | Completa o dataset `04-editais-reais-21mai.md` |

*Regra de proveniência: cada célula preenchida ganha `fonte: cliente-11jun` no dataset. Nada inferido.*
