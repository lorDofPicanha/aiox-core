---
name: RTK (Rust Token Killer) Setup
description: RTK v0.37.2 instalado em D:\AIOS com hook escopo local (não global), profile forensics-safe — afeta apenas sessões Claude rodando em D:\AIOS
type: project
originSessionId: 52e441df-798a-4add-ab62-7b45a8a40970
---
RTK ativo em D:\AIOS desde 28/Abr/2026 com escopo **local** (não global) e profile **forensics-safe**.

**Why:** User aprovou teste de RTK (proxy CLI que comprime output de comandos -60-90% antes de chegar no contexto LLM). Escolha de escopo local pra teste de 1 semana sem afetar outras sessões Claude. Profile forensics-safe exclui `cat/head/tail/grep/rg/diff/tcpdump/wireshark/openssl` da reescrita pra preservar fidelidade exata em debug/audit (exemplo: Polymarket data leak audit precisou ver grep/diff completos).

**How to apply:**

- **Binário:** `C:\Users\kingp\.local\bin\rtk.exe` (já no PATH)
- **Config global:** `C:\Users\kingp\AppData\Roaming\rtk\config.toml` (forensics-safe, tee.mode="always")
- **Hook script:** `D:\AIOS\.rtk\rtk-rewrite.sh` (downloaded oficial, chmod +x)
- **Hook ativo em:** `D:\AIOS\.claude\settings.local.json` (gitignored, hooks.PreToolUse → Bash)
- **Backup pre-RTK:** `D:\AIOS\.claude\settings.local.json.pre-rtk.bak`
- **CLAUDE.md (raíz):** criado pelo RTK, gitignored — instrui agent a usar `rtk` em comandos
- **`.rtk/`:** gitignored (adicionado em `.gitignore` linha 85)

**Comportamento:**
- `ls`, `git status/commit/push`, `npm test`, `cargo test`, `lint`, `tsc` → reescritos com auto-allow (-60-90% tokens)
- `cat`, `head`, `tail`, `grep`, `rg`, `diff`, security tools → **passam direto** (output exato, sem compressão)
- Tee logs em `~/.local/share/rtk/tee/` (mode="always", backup raw sempre disponível, max 5MB/200 files)

**Reverter completamente:**
```bash
rm C:\Users\kingp\.local\bin\rtk.exe
rm -rf C:\Users\kingp\AppData\Roaming\rtk
mv D:/AIOS/.claude/settings.local.json.pre-rtk.bak D:/AIOS/.claude/settings.local.json
rm -rf D:/AIOS/.rtk D:/AIOS/CLAUDE.md
# editar .gitignore removendo `.rtk/`
```

**Bypass por comando:** prefixar com `\` (ex: `\git diff` ignora hook).
**Bypass sessão inteira:** `RTK_HOOK_DISABLED=1 claude` (variável env).
**Verificar economia:** `rtk gain` em qualquer momento.

**Próximo gate:** Após 1 semana de uso real (~5/Mai), avaliar se vale instalar global ou expandir pra outros projetos. Se houver problemas em forensics, exclude_commands aceita mais entradas.
