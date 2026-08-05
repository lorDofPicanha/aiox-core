# Bretda Meta — execução dos funis qualificados por ICP

**Data:** 2026-07-28  
**Conta:** `act_381618241134624`  
**Responsável:** Orion / AIOS Master  
**Estado final:** preparados, verificados e pausados; zero ativação e zero novo gasto

## 1. Diagnóstico que motivou a mudança

A campanha CP2 (`120236735188220737`) gastou R$ 439,26 e gerou 73
cadastros entre 23–27/jul. O founder confirmou que os 73 foram
desqualificados.

O problema era estrutural:

- otimização para `Lead` bruto, sem retorno de qualificação ou venda;
- comprador final e profissional especificador no mesmo funil;
- audiência de comprador baseada em sinais aspiracionais de luxo;
- formulário fácil demais e copy sem pré-enquadramento de projeto ativo;
- localização aceitava moradores e visitantes recentes.

Distribuição dos 73 leads:

- 48 no conjunto de arquitetos/designers;
- 25 no conjunto de interesses aspiracionais de luxo.

## 2. Contenção

A campanha CP2 foi pausada e confirmada como `PAUSED`:

| Objeto | ID | Estado |
|---|---:|---|
| Campanha CP2 original | `120236735188220737` | `PAUSED` |

O Ads Bridge registrou a pausa no action log em
`2026-07-28T22:31:08.438Z`.

## 3. Novos funis criados

### Comprador final

| Objeto | ID | Estado |
|---|---:|---|
| Formulário Higher Intent | `1512759320600583` | publicado |
| Campanha | `120250163763260737` | `PAUSED` |
| Conjunto | `120250163763380737` | `PAUSED` |
| Anúncio Aurora | `120250163764260737` | `PAUSED` |
| Criativo | `1052579174017856` | associado |

- orçamento preparado: R$ 60/dia;
- idade: 35–65;
- recorte: 29 cidades e 9 bairros premium;
- localização: somente moradores (`home`);
- sem interesses aspiracionais;
- CTA: `GET_QUOTE`;
- imagem real da mesa Aurora;
- copy exige residência/obra/projeto em andamento e informa prazo aproximado
  de produção, sem divulgar preço.

As cinco perguntas qualificam:

1. estágio do ambiente;
2. prazo de instalação;
3. papel na decisão;
4. disponibilidade de medidas;
5. faixa de investimento.

### Arquiteto/especificador

| Objeto | ID | Estado |
|---|---:|---|
| Formulário Higher Intent | `918761067935816` | publicado |
| Campanha | `120250163763300737` | `PAUSED` |
| Conjunto | `120250163763640737` | `PAUSED` |
| Anúncio Citrino | `120250163764380737` | `PAUSED` |
| Criativo | `1063215062848330` | associado |

- orçamento preparado: R$ 40/dia;
- idade: 30–60;
- mesmo recorte geográfico premium e somente moradores;
- filtro profissional de arquitetura e design de interiores;
- CTA: `GET_QUOTE`;
- imagem real da mesa Citrino;
- copy exige cliente e projeto ativos, sem divulgar preço.

As cinco perguntas qualificam:

1. tipo de projeto;
2. estágio do projeto;
3. papel profissional;
4. prazo;
5. faixa de investimento do cliente.

## 4. Smoke test

Resultado: **PASS estrutural**.

- dois formulários distintos e otimizados para qualidade;
- exatamente cinco perguntas customizadas em cada formulário;
- nome, telefone e e-mail preservados como campos de contato;
- WhatsApp de conclusão usa mensagem diferente por ICP;
- cada anúncio referencia o formulário correto;
- CTAs, links, imagens e copies verificados;
- nenhuma copy contém preço;
- targeting confirma `location_types=["home"]`;
- campanhas, conjuntos e anúncios confirmados como `PAUSED`;
- orçamento total apenas preparado: R$ 100/dia;
- reexecução do builder é idempotente por nome exato.

Não foi submetido lead artificial no smoke test. Isso enviaria PII/conversão
falsa e contaminaria o aprendizado. O teste humano de ponta a ponta deve ser
feito com um contato real autorizado antes da ativação.

## 5. Sinal de lead qualificado

O endpoint `https://bretda.com.br/api/meta-conversion` está em produção e
reportou:

- CAPI configurado;
- pixel e token presentes;
- rate limit configurado;
- filtro de eventos consentidos ativo.

Esse endpoint é o CAPI de eventos do site. Ele **não fecha sozinho** o loop dos
Instant Forms. Para usar a meta de desempenho Conversion Leads, a Meta exige
uma integração separada CRM → CAPI que devolva os eventos posteriores à
captação.

Estado real hoje:

- 73 leads históricos classificados como desqualificados;
- zero evento qualificado legítimo disponível para envio;
- nenhum evento negativo ou positivo foi fabricado;
- novos funis continuam otimizando para geração de lead enquanto o feedback
  CRM não existe;
- ativar Conversion Leads antes de ter dados qualificados seria trocar o nome
  da otimização sem fornecer o sinal necessário.

Próximo requisito de dados: cada novo lead precisa manter `leadgen_id`,
data/hora, telefone/e-mail com base legal, ICP e estágio comercial. Somente os
estágios definidos como sucesso devem voltar ao Meta.

Definição operacional sugerida:

- `desqualificado`: não enviar conversão;
- `qualificado`: projeto/ambiente ativo + prazo aderente + participação na
  decisão + investimento compatível;
- `proposta`: proposta comercial emitida;
- `venda`: contrato/pedido confirmado.

## 6. Gate de ativação

Não ativar até cumprir:

1. founder aprovar as duas copies;
2. teste humano de formulário e WhatsApp passar;
3. confirmar responsável e SLA de atendimento;
4. escolher orçamento inicial sem salto acima de 2×;
5. registrar todos os leads por ICP e estágio;
6. revisar qualidade após os primeiros 10 leads ou R$ 300 por funil, o que
   acontecer primeiro.

## 7. Rollback

- os novos objetos podem permanecer pausados sem custo;
- não excluir objetos: a pausa é reversível e preserva a trilha de auditoria;
- não reativar a CP2 original sem corrigir formulário, audiência e sinal de
  qualificação;
- o builder está em
  `docs/projects/bretda/scripts/build-qualified-funnels-28jul.cjs` e opera em
  dry-run por padrão; alterações reais exigem `--execute`.

## 8. Observabilidade

As criações foram executadas diretamente pela Graph API porque o Ads Bridge
não expõe criação completa de Instant Form. Por isso, o action log do bridge
registra a pausa da CP2, enquanto os IDs acima e o builder idempotente são a
trilha de criação dos novos objetos.

## 9. Quality gates

- `node --check build-qualified-funnels-28jul.cjs`: **PASS**;
- ESLint isolado do builder: **PASS**;
- `git diff --check` dos arquivos desta story: **PASS**;
- reexecução idempotente contra o Meta: **PASS**;
- lint global: **BLOCKED por erros preexistentes** em `.agents/skills`,
  Polymarket e outros arquivos fora desta story;
- typecheck global: **BLOCKED por erros preexistentes** em `apps/noyce`;
- testes globais: **TIMEOUT após 3 minutos**, sem falha atribuída a esta story,
  que não altera código de runtime do produto.
