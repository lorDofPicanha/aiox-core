# Contador Trilha Verifier

Standalone verifier for the Contador good-faith ledger hash-chain.

It verifies integrity only. It does not re-run LLMs, does not call Supabase, and does not inspect UI state.

## Commands

```powershell
npm test --workspace @synkra/contador-trilha-verifier
```

After build:

```powershell
node packages/contador-trilha-verifier/dist/cli.js path/to/events.json
```
