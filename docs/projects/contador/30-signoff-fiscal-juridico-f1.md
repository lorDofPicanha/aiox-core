# Sign-off Fiscal/Juridico - F1 Foundation

> Data: 2026-06-16
> Escopo: liberacao fiscal/juridica antes de qualquer piloto pago ou uso produtivo da F1 Foundation.
> Status: **CONCERNS - F1.1/F1.2 tecnica aplicada; producao segue bloqueada ate respostas finais dos especialistas, LGPD, golden-set real e fecho/carimbo.**

---

## 1. Consultas abertas

As consultas foram abertas via `self-consultation.js`. O mecanismo local retornou prompt/ID; as respostas finais dos clones/especialistas ainda precisam ser preenchidas ou recebidas.

| Especialista | Foco | Consultation ID | Status |
|---|---|---|---|
| `heleno-taveira-torres` | Defensabilidade juridico-tributaria, decisao humana, linguagem proibida | `17dd90dd-8835-447c-ab5b-07c5487af3cd` | Aberta |
| `roberto-dias-duarte` | Fisco digital/SPED, dado fiscal, operacionalizacao do escritorio | `17cd221d-6f40-44fa-9a6a-fc5570f9403f` | Aberta |
| `patricia-peck` | LGPD, minimizacao, evidencias, retencao, operadores | `91f0ff0a-2761-43c1-a6d4-852922572d75` | Aberta |

Pergunta-base:

> Projeto Contador F1 Foundation passou tecnicamente em Postgres 15.18. Antes de producao, revise o contrato atual em alto nivel: schema `core_api_v1` com `registrar_analise`/`aprovar`/`rejeitar`/`superar`, `evento_boa_fe` hash-chain, ator contador com CRC ativo, decisao individualizada, payload de evidencia, verificador standalone e golden-set sintetico. Quais condicoes bloqueiam uso produtivo? Quais campos/contratos precisam mudar agora, antes de pilotos pagos? Responda com PASS/CONCERNS/FAIL e itens acionaveis.

## 2. Veredito operacional ate as respostas

**CONCERNS.**

A F1 esta tecnicamente apta como foundation interna, mas nao deve ser usada em piloto pago/producao ate os pontos abaixo serem resolvidos ou explicitamente aceitos pelo founder com escopo limitado.

## 3. Bloqueios de producao

### B1 - Snapshot do sujeito habilitado

O RPC valida `papel='contador'`, `crc is not null` e `crc_situacao='ativo'`, mas o evento grava apenas:

- `ator_id`
- `decisao_individualizada=true`
- `revisor_crc_validado=true`

Para valor probatorio, o evento deve snapshotar os atributos materiais da validacao no momento da decisao:

- `revisor_crc`
- `revisor_crc_situacao`
- `revisor_nome` ou identificador profissional adequado
- `validado_em`
- fonte/criterio da validacao do CRC, quando houver

**Status 2026-06-16:** mitigado tecnicamente pela migration `002_decision_evidence.sql`. Os eventos humanos passam a gravar `revisor_snapshot` com `usuario_id`, `nome`, `cpf`, `crc`, `crc_uf`, `crc_situacao` e `validado_em`.

**Complemento F1.2:** `003_secure_decision_rpc.sql` exige que o caller autenticado seja o proprio revisor (`sub = p_revisor_id`), com tenant claim presente e papel `contador`.

### B2 - Evidencia fiscal minima no payload da decisao

A aprovacao/rejeicao registra motivo, mas nao fixa no evento a evidencia fiscal usada pelo contador.

Antes de producao, decidir se a F1 deve gravar no evento ou referenciar de forma imutavel:

- `nota_id` e/ou `nota_hash`
- `item_id`
- `base_versao_id`
- `motor_versao_id`
- `analise_execucao_id`
- `apontamento_id`
- fundamento/resumo da regra aplicada

**Status 2026-06-16:** mitigado tecnicamente pela migration `002_decision_evidence.sql`. Os eventos humanos passam a gravar `evidencia_ref` com `nota_id`, `item_id`, `apontamento_id`, `analise_execucao_id`, `base_versao_id`, `motor_versao_id`, `regra_id`, `tipo_divergencia`, `cclasstrib_referencia` e `fundamento`.

**Complemento F1.2:** `003_secure_decision_rpc.sql` adiciona `fiscal_snapshot` e `evidencia_hash` sobre nota/item/apontamento para reduzir dependencia de tabelas mutaveis.

### B3 - Assinatura/carimbo ainda fora do contrato

O ledger hash-chain e verificavel, mas ainda nao ha contrato para:

- fecho diario/mensal;
- raiz Merkle por tenant;
- carimbo de tempo ICP-Brasil/PAdES;
- assinatura e-CPF/e-CNPJ do contador/laudo.

Isso nao bloqueia F1 interna, mas bloqueia promessa de valor pericial completa e uso produtivo com linguagem de "prova de anterioridade".

### B4 - LGPD: minimizacao, retencao e bases legais

O schema trata XML/hash/storage path e dados de usuarios/CRC, mas ainda falta o pacote de governanca:

- mapa de dados pessoais por tabela/campo;
- base legal por finalidade;
- matriz de retencao por tipo documental;
- papel controlador/operador entre SaaS, escritorio, cliente e provider de captura;
- procedimento de incidentes e acesso por tenant.

Sem isso, nao iniciar piloto pago com dados reais de clientes.

### B5 - Golden-set real

O golden-set sintetico e valido como teste de contrato, nao como prova de acuracia fiscal.

Antes de qualquer claim de acuracia ou automacao fiscal:

- recrutar tributarista rotulador;
- rotular 200-500 itens reais;
- duplo rotulo em pelo menos 20%;
- calibrar falso-positivo/abstencao;
- versionar snapshot em `ref.golden_set_versao`.

## 4. Ajustes recomendados para F1.1

1. ~~Criar migration `002_decision_evidence.sql` com payload/colunas de snapshot do contador e referencias de evidencia fiscal.~~ Feito.
2. ~~Criar testes SQL para garantir que eventos de decisao gravam CRC snapshotado e referencia imutavel de evidencia.~~ Feito.
3. ~~Fechar impersonacao/tenant claim nas RPCs humanas.~~ Feito em `003_secure_decision_rpc.sql`.
4. ~~Criar runbook `time-stamp-closeout` para fecho diario/mensal da trilha, ainda sem integracao ICP real.~~ Feito em `35-time-stamp-closeout-runbook.md`; integracao ICP/PAdES segue bloqueio posterior.
5. Criar `31-data-map-lgpd-f1.md` antes de processar XML real. Complemento operacional criado em `36-lgpd-operational-pack-f1.md`; requer revisao Patricia/juridico.
6. Criar `32-tributarista-labeling-brief.md` para contratar/briefar o rotulador do golden-set.
7. Criar kit Concierge com linguagem segura antes de qualquer contato comercial. Feito em `37-concierge-demo-kit-f1.md`.

## 5. Gate

| Uso | Decisao |
|---|---|
| Foundation interna / desenvolvimento | **PASS TECNICO** |
| Demo sem dados reais, sem promessa fiscal | **PASS com disclaimer** |
| Piloto pago com XML real de cliente | **CONCERNS / bloqueado ate B3-B5 + respostas dos especialistas** |
| Claim de acuracia fiscal ou defensabilidade completa | **FAIL ate B3+B5** |

## 6. Linguagem permitida ate novo sign-off

Pode dizer:

> A foundation registra evidencias e decisoes em trilha tecnica verificavel, com motor deterministico testado contra fixtures sinteticas.

Nao dizer:

> Garante apuracao correta, credito, ausencia de multa, prova juridica plena ou acuracia fiscal real.

**Complemento G6 2026-06-18:** matriz operacional criada em `45-safe-fiscal-language-claims-v1.md`. Ela separa claims permitidos, condicionados e proibidos e deve ser usada em qualquer demo, roteiro, proposta ou conversa concierge. O artefato nao substitui revisao juridica/fiscal final.

---

Proximo passo recomendado: revisao juridica/LGPD dos docs 35-37, threat model F1 e rotulador do golden-set. Nada de UI, captura, RAG ou e-CAC.
