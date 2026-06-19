# Linguagem Fiscal Segura - Claims v1

**Projeto:** Contador / Apuracao Defensavel
**Status:** v1 operacional - requer revisao juridica antes de proposta publica
**Data:** 2026-06-18
**Gate:** G6 artefato pronto; claims de acuracia fiscal real seguem bloqueados ate golden-set real.
**Consulta:** Conclave G6 `bfd0b64a-8924-4723-8790-7b7b93b54127`.

---

## 1. Regra-matriz

O Contador pode comunicar **triagem tecnica, indicios, evidencias e trilha verificavel**. Nao pode comunicar **resultado fiscal garantido, recuperacao garantida, prova juridica plena, ausencia de multa, assinatura/carimbo inexistente ou substituicao do profissional habilitado**.

## 2. Termos Permitidos

| Termo | Uso permitido |
|---|---|
| Indicio | Divergencia potencial que exige revisao humana |
| Evidencia tecnica | Registro, hash, snapshot, fundamento e referencia que apoiam a revisao |
| Trilha verificavel | Hash-chain/manifesto que permite checar integridade tecnica |
| Revisao assistida | Motor e tooling apoiam o contador, sem decidir sozinho |
| Laudo tecnico preliminar | Entrega de suporte a decisao, sem parecer juridico pleno |
| Oportunidade potencial | Possibilidade a avaliar, nao credito garantido |
| Abstencao | Sistema pode nao apontar quando falta evidencia suficiente |

## 3. Claims Permitidos

| Pode dizer | Condicao |
|---|---|
| "Organiza evidencias tecnicas para revisao tributaria humana." | Sempre em demo/concierge |
| "Aponta indicios de divergencia por item." | Apenas com base/fundamento exibido |
| "Gera trilha tecnica verificavel." | Quando usar eventos/hash/manifesto implementados |
| "Ajuda o contador a priorizar revisoes." | Sem prometer resultado financeiro |
| "Entrega laudo white-label para discussao profissional." | Com disclaimer de revisao humana |
| "Usa fixtures sinteticas nesta demo." | Obrigatorio quando nao houver dado real |

## 4. Claims Condicionados

| Claim | Condicao minima |
|---|---|
| "Usamos dados reais de clientes." | DPA, suboperadores, retencao, storage, incidente e autorizacao founder |
| "Mede acuracia." | Golden-set real rotulado, metrica definida e intervalo de confianca |
| "Economia estimada." | Metodologia aprovada, revisao humana e sem garantia de recuperacao |
| "Prova de anterioridade." | Integracao real de carimbo/assinatura revisada; hoje proibido |
| "Laudo defensavel." | Permitido como aspiracao interna; externamente usar "laudo com trilha tecnica" ate sign-off |

## 5. Claims Proibidos

| Nao dizer | Por que |
|---|---|
| "Garante credito" | Resultado depende de analise, documentos, regime, prazo e decisao/protocolo |
| "Recupera dinheiro automaticamente" | PER/DCOMP/protocolo e decisao humana estao fora da F1 |
| "Garante apuracao correta" | Sem golden-set real e sem responsabilidade profissional transferida |
| "Elimina risco de multa" | Risco fiscal nao e zerado por ferramenta |
| "Prova juridica plena" | Nao ha parecer/assinatura/carimbo pleno implementado |
| "Tem validade ICP-Brasil/PAdES" | `time_stamp_provider='none'` na F1.3 |
| "A IA decide a classificacao fiscal" | Decisao e revisao sao humanas |
| "Substitui contador/tributarista/advogado" | Produto e suporte a decisao profissional |
| "Acuracia fiscal de X%" | Bloqueado ate golden-set real |

## 6. Disclaimer Padrao

Para demo sem dados reais:

> Demonstracao com dados sinteticos. O Contador aponta indicios e organiza evidencias tecnicas para revisao profissional. A ferramenta nao substitui contador, tributarista ou advogado, nao garante credito, economia, ausencia de multa, apuracao correta ou prova juridica plena.

Para piloto controlado com dados reais, quando liberado:

> Entrega assistida para suporte a decisao profissional. Os apontamentos sao indicios tecnicos sujeitos a revisao humana, validacao documental e criterio do escritorio. Qualquer recuperacao, retificacao ou protocolo depende de aprovacao do profissional responsavel e dos requisitos legais aplicaveis.

## 7. Respostas Seguras a Objecoes

| Pergunta | Resposta |
|---|---|
| "Isso garante credito?" | "Nao. Aponta indicios e organiza evidencias; recuperacao depende da revisao e decisao do profissional responsavel." |
| "A Receita aceita isso como prova?" | "A trilha tecnica ajuda a demonstrar integridade e contexto, mas prova juridica plena depende de documentos, assinatura/carimbo e estrategia profissional." |
| "Qual a acuracia?" | "Hoje medimos contrato tecnico com fixtures. Acuracia fiscal real so sera comunicada apos golden-set rotulado." |
| "A IA decide?" | "Nao. O motor apoia triagem; a decisao fiscal e humana." |
| "Posso mandar XML agora?" | "Ainda nao. Dados reais dependem de DPA, controles LGPD/security e escopo aprovado." |

## 8. Gate de Uso

| Uso | Status |
|---|---|
| Conversa exploratoria sem material externo | PASS com linguagem deste doc |
| Demo com fixture sintetica | PASS com disclaimer |
| Proposta comercial enviada | Requer revisao legal/founder |
| Piloto com XML real | Bloqueado ate G4/G5 revisados + storage/incidente + autorizacao founder |
| Claim de acuracia/economia/credito | Bloqueado ate golden-set real e metodologia aprovada |
