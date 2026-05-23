# Noyce - ENIAC access onboarding

Data: 2026-05-23
Status: pending credentials, do not store secrets in repo

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
- usuarios e papeis ainda pendentes;
- fonte publica primeiro;
- fonte autenticada somente depois de vault, consentimento, ToS e logs.
