# Concierge Demo Kit - F1 Foundation

> Data: 2026-06-16
> Status: v1 para Renan/Breno - alinhado a G6
> Escopo: abordagem comercial segura antes de dados reais, UI, captura, RAG ou e-CAC.

---

## 1. Objetivo da conversa

Validar se escritorios contabeis pagam por um laudo defensavel de divergencias tributarias e oportunidades de revisao, sem vender software pronto, automacao completa ou garantia fiscal.

O teste continua sendo: dinheiro real, contrato de success-fee assinado ou recusa clara.

## 2. Posicionamento permitido

Usar `45-safe-fiscal-language-claims-v1.md` como fonte de verdade da linguagem. Em caso de duvida, escolher o termo mais conservador: indicio, evidencia tecnica, trilha verificavel e revisao humana.

Pode dizer:

> Estamos validando um servico assistido para produzir um laudo de indicios tributarios com trilha tecnica verificavel e revisao humana.

> O objetivo e ajudar o contador a enxergar divergencias potenciais por item e organizar evidencias para uma decisao profissional.

> A etapa atual nao protocola PER/DCOMP, nao substitui o contador e nao promete credito garantido.

Disclaimer obrigatorio para demo:

> Demonstracao com dados sinteticos. O Contador aponta indicios e organiza evidencias tecnicas para revisao profissional. A ferramenta nao substitui contador, tributarista ou advogado, nao garante credito, economia, ausencia de multa, apuracao correta ou prova juridica plena.

Nao dizer:

> O sistema garante credito.

> O laudo elimina risco de multa.

> A plataforma ja tem prova juridica plena ou carimbo ICP-Brasil.

> A IA decide a classificacao fiscal sozinha.

> Basta subir XML e recuperar dinheiro automaticamente.

## 3. Roteiro de call

1. Contexto: o escritorio quer revisar clientes de alto SKU sem gastar semanas abrindo item por item.
2. Tese: ha divergencias potenciais em NCM/cClassTrib/CST/CFOP que merecem triagem defensavel.
3. Oferta concierge: Breno + AIOS analisam lote limitado e devolvem laudo white-label.
4. Limite: o laudo aponta indicios e evidencias; decisao, parecer e protocolo seguem com contador/tributarista habilitado.
5. Pergunta de valor: se o laudo encontrar oportunidades acionaveis, o escritorio prefere piloto mensal ou success-fee?
6. Proximo passo: se houver interesse real, coletar escopo, volume e responsavel, mas nao coletar XML real ate gate LGPD/security.

## 4. Perguntas de descoberta

- Quais segmentos de clientes geram maior volume e maior dor tributaria hoje?
- Como voces revisam NCM/cClassTrib/CST/CFOP atualmente?
- Quanto tempo leva para produzir um parecer ou diagnostico desses hoje?
- Quem decide se uma oportunidade vira PER/DCOMP ou ajuste?
- Qual risco faria voces rejeitarem uma ferramenta desse tipo?
- O que precisaria aparecer no laudo para voces mostrarem ao cliente final?
- Como voces preferem pagar: diagnostico recorrente ou success-fee por recuperacao validada?

## 5. Criterios de qualificacao

| Sinal | InterpretaÃ§Ã£o |
|---|---|
| Aceita pagar piloto R$300-500/mes | WTP inicial positiva |
| Aceita success-fee 15-25% assinado | WTP ligada a recuperacao |
| Quer apenas "ver depois" sem pagamento | Interesse nao validado |
| Exige captura/e-CAC/app antes de pagar | Risco de construir commodity |
| Quer garantia de credito | Desqualificar ou educar expectativa |
| Tem 2-5 clientes de alto SKU | Bom candidato concierge |

## 6. Pacote de entrega permitido

Para demo sem dados reais:

- Exemplo sintetico de laudo.
- Exemplo sintetico de trilha de boa-fe.
- Explicacao de confidence/abstencao.
- Explicacao de que golden-set real ainda esta em construcao.

Para piloto com dados reais, somente apos gates:

- DPA/termos assinados.
- Escopo de XML limitado.
- Cliente final ou escritorio ciente do tratamento.
- Revisao tributaria humana antes de entrega.
- Linguagem de indicio/oportunidade, nao garantia.

## 7. Script curto para Renan

> Estamos testando um servico para escritorios que querem revisar clientes com maior chance de divergencia tributaria por item. A entrega nao e um robo que promete credito; e um laudo white-label com indicios, fundamento e trilha tecnica, para o contador decidir com seguranca o que vale revisar. A pergunta e simples: se encontrarmos oportunidades acionaveis em um lote limitado, voces preferem pagar um piloto mensal pequeno ou um contrato de success-fee sobre recuperacao validada?

## 8. ObjeÃ§Ãµes e respostas

| Objecao | Resposta permitida |
|---|---|
| "Isso garante credito?" | Nao. Aponta indicios e organiza evidencias para decisao profissional. |
| "Ja automatiza e-CAC?" | Nao nesta fase. O piloto valida valor do laudo antes de construir captura. |
| "A IA decide?" | Nao. A decisao fiscal e humana, por contador/tributarista habilitado. |
| "Posso mandar XML agora?" | Ainda nao, primeiro fechamos DPA, escopo e controles de dados reais. |
| "Serve como prova juridica?" | A trilha tecnica e verificavel; prova plena/carimbo/assinatura sao gates posteriores. |
| "Qual a acuracia?" | Ainda nao comunicamos acuracia fiscal real. Hoje temos testes tecnicos com fixtures; metrica fiscal depende de golden-set real rotulado. |
| "Quanto vou recuperar?" | Nao prometemos recuperacao. Podemos estimar cenarios apenas depois de revisao humana e metodologia aprovada. |

## 9. Registro de resultado

Para cada escritorio, registrar:

- Nome do escritorio e decisor.
- Segmentos/clientes candidatos.
- Volume aproximado de XML/itens.
- Modelo preferido: mensal, success-fee ou nenhum.
- Valor aceito ou recusado.
- ObjeÃ§Ãµes textuais.
- Proximo passo e data.
- Se pediu dados reais antes dos gates.

## 10. Decisao apos 5 escritorios

| Resultado | Decisao |
|---|---|
| 3+ pagam ou assinam success-fee | Persevere: liberar proxima Fase 1 comercial com gates |
| 1-2 pagam | Pivot: ajustar nicho/oferta/laudo |
| 0 pagam | Kill/repensar tese antes de construir infra |

Este criterio nao deve ser alterado depois das conversas.
