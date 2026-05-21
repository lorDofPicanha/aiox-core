---
name: feedback-git-pr-destination
description: NUNCA mandar NADA (push, PR, branch, issue) pro SynkraAI/aios-core. Tudo via fork lorDofPicanha/aiox-core. Tratar origin como read-only inacessível.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: ebc3b731-9d6b-4767-b83b-150411c4d83b
---

# Git: NUNCA Mandar Nada pro SynkraAI

**REGRA ABSOLUTA: Nunca enviar QUALQUER coisa pro `origin` (`SynkraAI/aios-core`).** Não é só PR — não pushar branches, não abrir issues, não criar releases, NADA. User não tem acesso de escrita nesse upstream. Qualquer coisa que vai pra lá fica fora do alcance dele.

User reforçou 16/Mai/2026: **"nunca mandar nada para o synkraAi"** (ênfase explícita após PR #645 ter ido pra lá em 04/Mai/2026 e ficar preso indefinidamente).

## Topology de remotes (D:/AIOS)

```
origin → https://github.com/SynkraAI/aios-core.git   ❌ user SEM merge access (upstream)
fork   → https://github.com/lorDofPicanha/aiox-core.git   ✅ user com full access
```

## Comportamentos corretos

| Cenário | Faça | NÃO faça |
|---|---|---|
| Trabalho em feature branch local | `git push fork <branch>` | `git push` (vazio = origin) ou `git push origin` |
| Precisa de PR review | `gh pr create --repo lorDofPicanha/aiox-core ...` | `gh pr create` (default = origin upstream) |
| Hotfix direto pra main | Commit local + `git push fork main` | Push pra `origin/main` mesmo se tivesse acesso |
| Sync com upstream (leitura) | `git fetch origin && git merge origin/main` | `git push origin` em qualquer circunstância |
| Issue tracking | Issues no `lorDofPicanha/aiox-core` ou ferramenta externa | `gh issue create` sem `--repo` (vai pra origin) |

**Origin é estritamente READ-ONLY.** Só `git fetch origin` é permitido. Tudo write (push, PR, issue, release, tag remote) → `fork`.

## Comandos com flag de destino explícita

```bash
gh pr create --repo lorDofPicanha/aiox-core --base main --head <branch>
# NÃO: gh pr create  (default vai pra origin)

git push fork <branch>
# NÃO: git push origin <branch>
```

## Por que isso aconteceu (case PR #645)

PR #645 (Tocks Meta CAPI D++) foi aberto contra `SynkraAI/aiox-core` em 04/Mai/2026. User comentou ainda 16/Mai/2026: "este PR eu nunca vou conseguir dar merge, mandou para um lugar que eu não tenho acesso, não faça isso novamente". Branch ainda existe em `fork/feat/tocks-capi-d-plus-plus` — pode ser reaproveitada se reabrir PR no destino certo.

**Why:** User está em fork-based workflow (origin = upstream Synkra, fork = pessoal). `gh pr create` default usa repo upstream (`origin`) como base — comportamento padrão do GitHub CLI quando há fork relationship. Sem `--repo` explícito, PR vai pro lugar errado.

**How to apply:**
- Antes de qualquer `git push`, `gh pr create`, `gh issue create`, `gh release create` neste repo D:/AIOS: **sempre** validar `git remote -v` e usar destino explícito = `fork` ou `--repo lorDofPicanha/aiox-core`.
- Se um deploy/CAPI/feature precisa de "merge antes do prazo X", lembrar que só vale se estiver no fork do user.
- @devops é o único autorizado a push — mesma regra aplica-se a ele.
- Aplica-se a TODO trabalho neste repo `D:/AIOS`, qualquer projeto: Tocks/Bretda/KR/Vorza/Polymarket/Site-Prospector/CRM-novo/AIOS framework/etc.
- Se em dúvida sobre destino → parar e perguntar ao user antes de pushar.

Linka a [[feedback_squad_delegation]] (mind clones / squad-first também precisam respeitar esse boundary).
