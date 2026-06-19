# Contador Motor Fiscal

Pure deterministic classifier for the F1 foundation.

Rules:

- No database access.
- No network.
- No filesystem dependency in `src/`.
- Input data in, candidate findings out.
- Synthetic golden-set only until a tributary reviewer labels real examples.

## Commands

```powershell
npm test --workspace @synkra/contador-motor-fiscal
```

After build, classify a JSON payload:

```powershell
node packages/contador-motor-fiscal/dist/cli.js payload.json
```

Payload shape:

```json
{
  "item": { "id": "item-1", "descricao": "...", "ncm": "30049099", "valor": 100 },
  "base": { "baseVersaoId": "base-1", "regras": [] },
  "contexto": { "motorVersaoId": "motor-1" }
}
```
