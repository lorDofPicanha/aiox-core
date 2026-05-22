# Per-Squad HYDRA Runs

**Strategy:** 36 sequential HYDRA pipeline runs, one per squad, each with squad-specific source subset + targeted clones.

## Why per-squad?

The Phase 1 mega-run (15/Mai 09:32) distributed 61 items to 85 clones using ~80 generic sources. Coverage map showed:
- 15 squads bem cobertos
- 6 squads cobertura média
- 15 squads sub-cobertos

This per-squad approach adds **~110 targeted sources** (3-5 per squad) that don't exist in the base sources.yaml — guaranteeing fresh items relevant to each squad.

## Execution

```bash
# Full overnight run
node tools/hydra/scripts/run-all-squads.js

# Resume from a specific squad after crash
node tools/hydra/scripts/run-all-squads.js --resume squad-legal

# Test a single squad
node tools/hydra/scripts/run-all-squads.js --only squad-design

# Validate without executing
node tools/hydra/scripts/run-all-squads.js --dry-run
```

## Expected output per squad

```
{squad-name}/
├── sources.yaml      Config used (3-5 targeted sources)
├── run.log           Full pipeline output (~stdout)
├── digest.md         Distribution digest
└── summary.md        Top insights (post-processing)
```

## Top-level outputs

```
per-squad-runs/
├── README.md              This file
├── master.log             Timestamped log of all squad starts/ends
├── MASTER-SUMMARY.md      Final table of all 36 runs
└── {squad-name}/          Per-squad output (see above)
```

## Estimated timing

- Per squad: 5-15min (varies by # sources + LLM throughput)
- 36 squads: 4-9h total
- Background-safe via `nohup` or detached process

## Cache behavior

HYDRA SQLite cache is **global across runs** — items deduplicated globally. This is intentional:
- Sources NEW to each squad fetch fresh items
- Sources OVERLAPPING with prior runs skip-as-duplicate
- Net result: each squad gets items unique to its source subset

## Risks

1. **OOM** — mitigated by `HYDRA_SKIP_VECTOR_STORE=1` + `--max-old-space-size=4096`
2. **Stuck LLM call** — mitigated by 30min timeout per squad
3. **Bad RSS source** — logged in run.log; pipeline continues
4. **SQLite contention** — sequential runs prevent concurrent writes
