# Contador — Production Readiness Record

**Data:** 2026-07-24  
**Status:** tecnicamente avançado para homologação; ainda não liberado para produção fiscal.

## Resumo executivo

O produto possui uma base local estável, com parser fiscal determinístico, motor de classificação, trilha verificável, contratos SQL/RLS, modelos de e-CAC e app Contador compilando. As integrações fiscais externas ainda não foram comprovadas porque dependem de credenciais, certificado, CNPJ autorizado e homologação.

Não há transmissão de nota real habilitada.

## Evidências executadas

### Loop QA

Foram executados 3 ciclos completos, 24 execuções no total, sem falhas:

- `@synkra/contador-parser`
- `@synkra/contador-motor-fiscal`
- `@synkra/contador-trilha-verifier`
- `@synkra/contador-db`
- `@synkra/contador-fitness`
- testes e-CAC
- saúde da carteira
- transação tributária

Logs: `.tmp/contador-loop-qa/summary.json`.

### Build e quality checks

- parser: 38/38 testes + integração;
- motor fiscal: testes verdes;
- trilha/verifier: testes verdes;
- DB/RLS/contracts: testes verdes;
- fitness functions: testes verdes;
- app Contador typecheck: PASS;
- app Contador build: PASS;
- banlist G6: PASS;
- adapter NFS-e lint/typecheck/test: PASS;
- API client mock/Supabase contract: PASS.

## Adapter NFS-e Nacional

Implementado em `packages/contador-nfse-client/`:

- `POST /nfse`;
- `GET /nfse/{chaveAcesso}`;
- `GET` e `HEAD /dps/{id}`;
- `POST` e `GET /nfse/{chaveAcesso}/eventos`;
- modo `dry-run` padrão;
- bloqueio explícito de produção;
- transport injetável para mTLS/gateway;
- erros tipados;
- testes contratuais sem rede.

Rota server-side local: `apps/contador/app/api/nfse/route.ts`.

A tela `/emissor` ainda apresenta rascunho sintético. O envio governamental permanece bloqueado até a configuração de homologação.

## Estado por módulo

| Módulo | Estado atual | Limite conhecido |
|---|---|---|
| Parser NF-e/NFC-e/CT-e/NFS-e | Real local | XSD oficial completo ainda não versionado |
| Motor fiscal | Real local | Golden set ainda sintético |
| Trilha/verifier | Real local | Carimbo externo depende de infraestrutura |
| DB/RLS | Contratos locais verdes | Supabase de produção não provisionado |
| Emissor NFS-e | Adapter + dry-run | Sem certificado/credenciamento/homologação |
| e-CAC | Modelos/adapters em fixture | Sem Integra Contador/Infosimples reais |
| Captura | Contratos/planejamento | Provider ainda não contratado/conectado |
| Recuperação | Fluxo local/sintético | Sem dados fiscais e parceiros reais |
| Gestorize | Código legado analisado | Integração produto-a-produto pendente |

## Arquivos Gestorize analisados

Foram revisados os arquivos locais:

- `C:\Users\kingp\Downloads\gestorize-api-main.zip`;
- `C:\Users\kingp\Downloads\gestorize-admin-main.zip`;
- `C:\Users\kingp\Downloads\gestorize-react-web-main.zip`.

O material contém gestão operacional, Documentize, clientes, obrigações, tenants, contratos e faturas. Não foram encontrados controllers/serviços de emissão NFS-e/NF-e, integração SEFIN/ADN ou gateway fiscal. Os arquivos `.env` não foram copiados para a revisão e nenhum segredo foi salvo neste projeto.

## Ações externas obrigatórias do fundador

1. Escolher integração direta SEFIN/ADN ou gateway fiscal.
2. Provisionar hosting, domínio, Supabase, storage, secrets e observabilidade.
3. Criar conta/contrato de emissão e ambiente de produção restrita.
4. Disponibilizar CNPJ, inscrição municipal, município, regime e certificado de teste.
5. Provisionar Integra Contador/SERPRO e Infosimples.
6. Contratar/configurar provider de captura.
7. Entregar XMLs reais anonimizados e golden set rotulado por tributarista.
8. Aprovar DPA/LGPD, retenção, termos, linguagem fiscal e fluxo humano.
9. Autorizar gastos externos e homologação.

**Nunca enviar chave privada ou segredo por chat.** Cadastrar diretamente no secret manager do ambiente de execução.

## Critério de liberação para produção

Só liberar quando todos forem verdadeiros:

- [ ] emissão real aprovada em produção restrita;
- [ ] consulta por chave e DPS aprovada;
- [ ] cancelamento/substituição aprovado;
- [ ] XML validado contra XSD oficial vigente;
- [ ] e-CAC real testado com procuração;
- [ ] isolamento multi-tenant testado em ambiente real;
- [ ] golden set real revisado por tributarista;
- [ ] backup/restore e expurgo testados;
- [ ] monitoramento e alertas ativos;
- [ ] sign-off jurídico/fiscal concluído;
- [ ] smoke test pós-deploy aprovado.

## Referências oficiais

- Manual da API do Emissor Público Nacional: https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/documentacao-atual/manual-contribuintes-emissor-publico-api-sistema-nacional-nfs-e-v1-2-out2025.pdf
- APIs de produção restrita e produção: https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/apis-prod-restrita-e-producao
- Documentação atual e XSDs: https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/documentacao-atual
