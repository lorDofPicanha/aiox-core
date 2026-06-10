# Noyce - ENIAC access onboarding

Data: 2026-05-23
Status: pending credentials, do not store secrets in repo

Atualizacao founder 2026-05-29:

- CNPJ informado e alinhado ao acervo real ENIAC: `36.819.268/0001-05`.
- Razao social/nome operacional informado: ENIAC.
- Usuarios: 4 pessoas com acesso operacional equivalente.
- Perfil master/admin: Stafani, com acesso geral.
- Demais usuarios: podem operar; nomes/e-mails ficam para registrar depois.
- Portais prioritarios informados: BLL, BNC e Portal de Compras Publicas.
- URLs informadas:
  - BLL: `https://bllcompras.com/Participant/ProcessSearch?param1=0`
  - BNC: `https://bnccompras.com/Participant/ProcessSearch?param1=0`
  - Portal de Compras Publicas: `https://operacao.portaldecompraspublicas.com.br/4/Pregoes/`
- Owner indicado para aceite/risco ToS: Stafani.
- Autorizacao founder: primeiro dry-run real com fonte publica autorizado.
- Observacao de seguranca: esta atualizacao nao inclui login, senha, token, certificado, cookie ou qualquer segredo.

## Escopo corrigido

O Noyce, neste momento, sera usado para uma unica empresa:

- Empresa: ENIAC
- Papel: empresa licitante
- Modelo operacional: single-company, multi-user

Isso substitui a premissa anterior de "3 empresas" para o modulo de licitacoes.

## Regra de seguranca

Login, senha, token, certificado digital, cookie, chave API ou qualquer segredo nao deve ser enviado no chat nem salvo em Markdown, JSON, CSV, print, PDF ou commit.

Credenciais devem entrar apenas por um cofre/vault ou gerenciador de senhas aprovado.

## Acessos necessarios

Coletar acesso aos buscadores/portais realmente usados pela ENIAC:

| Fonte | Precisa de login? | Status | Observacoes |
|---|---:|---|---|
| PNCP | Nao para consulta publica | Confirmado uso | Usar API publica para descoberta e historico parcial |
| PCP - Portal de Compras Publicas | Sim/possivel chave API | Confirmado uso; credencial pendente no vault | Solicitar/confirmar acesso e eventual chave API |
| BLL | Sim | Confirmado uso; credencial pendente no vault | Automacao depende de ToS e consentimento |
| BNC | Sim | Confirmado uso; credencial pendente no vault | Verificar feed de email se existir |
| ComprasGov | Sim para area autenticada | Confirmado uso; credencial pendente no vault | Coletar via vault |
| SISLOG | Sim/possivel area autenticada | Confirmado uso; credencial pendente no vault | Maior cuidado ToS; dry-run ate validacao |
| Outros portais | A confirmar | Pendente | Registrar como `source_candidate` |

Confirmacao owner 2026-05-23:

- ENIAC usa todos os portais acima.
- Prioridade inicial de integracao deve considerar todos como fontes operacionais reais.
- PNCP permanece publico; os demais exigem onboarding de acesso antes de qualquer automacao autenticada.

Confirmacao founder 2026-05-29:

- Fontes mais frequentes nesta fase: BLL, BNC e Portal de Compras Publicas.
- Nao existe um portal unico prioritario; a prioridade operacional deve tratar essas tres fontes como primeiro recorte.
- Stafani fica como perfil master e owner humano para risco ToS.
- PNCP publico esta autorizado para primeiro dry-run real sem login.
- Automacao autenticada continua bloqueada ate vault, ToS por portal, consentimento documentado, logs/auditoria e feature flag.

## Dados que podem ser registrados em doc

Permitido:

- nome da fonte;
- URL de login;
- nome de usuario responsavel pelo acesso, sem senha;
- tipo de segundo fator, sem codigo;
- quem autoriza o uso;
- data de consentimento;
- escopo permitido;
- risco ToS;
- status de vault configurado.

Nao permitido:

- senha;
- token;
- cookie;
- certificado;
- chave privada;
- codigo 2FA;
- pergunta/resposta secreta;
- print da tela logada com dado sensivel.

## Checklist por portal

Para cada portal:

- [x] Confirmar que ENIAC usa o portal.
- [ ] Registrar URL publica/login.
- [ ] Confirmar se ha 2FA/certificado.
- [ ] Guardar credencial no vault, nao no repo.
- [ ] Registrar consentimento da ENIAC para uso operacional.
- [ ] Avaliar ToS antes de automacao.
- [ ] Rodar primeiro em dry-run.
- [ ] Habilitar automacao por feature flag apenas depois dos gates.

## Implicacao no produto

O Sprint 0 continua multi-fonte, mas o tenant inicial e single-company:

- uma organizacao;
- uma empresa licitante: ENIAC;
- CNPJ informado e alinhado ao acervo real ENIAC: `36.819.268/0001-05`;
- razao social/nome operacional informado: ENIAC;
- 4 usuarios previstos com acesso operacional equivalente;
- Stafani como perfil master/admin e owner de aceite/risco ToS;
- fonte publica PNCP primeiro, com dry-run autorizado;
- fonte autenticada somente depois de vault, consentimento, ToS e logs.

## Recomendacao de seguranca para vault - 2026-05-29

Consulta solicitada ao council de seguranca: `88e5afb9-02b2-4331-b6ce-b94a9ebc8b69`.

Recomendacao pragmatica para piloto:

- Usar um cofre compartilhado com MFA e controle de acesso por item, preferencialmente 1Password ou Bitwarden/Vaultwarden.
- Stafani deve ser admin do cofre do cliente; operadores recebem acesso minimo necessario.
- Cada portal deve ter item separado no vault, com URL, responsavel, tipo de 2FA/certificado e escopo permitido.
- Noyce nao deve armazenar segredo no banco/app nesta fase; apenas status, owner, URL publica/login e referencia ao item do vault.
- Automacao autenticada so libera depois de ToS por portal, consentimento, auditoria/redaction e feature flag por fonte.
