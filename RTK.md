# RTK - Rust Token Killer (Codex CLI)

**Usage**: Token-optimized CLI proxy for shell commands.

## Rule

Always prefix shell commands with `rtk`.

Examples:

```bash
rtk git status
rtk cargo test
rtk npm run build
rtk pytest -q
```

PowerShell cmdlets are not PATH executables. Wrap them in PowerShell instead
of calling them directly through RTK:

```powershell
rtk powershell -NoProfile -Command "Get-Content -Path AGENTS.md -TotalCount 80"
rtk powershell -NoProfile -Command "Get-ChildItem -Path .codex\agents"
```

## Meta Commands

```bash
rtk gain            # Token savings analytics
rtk gain --history  # Recent command savings history
rtk proxy <cmd>     # Run raw command without filtering
```

## Verification

```bash
rtk --version
rtk gain
which rtk
```
