# /greet

Generate one contextual AIOS greeting and stop.

## Execution

1. If an active agent id is obvious from the current request or active persona, use it.
2. Otherwise use `aios-master`.
3. Run exactly:

```bash
node .aios-core/development/scripts/generate-greeting.js <agent-id>
```

4. Return only the greeting output.
5. If the command fails or exceeds 10 seconds, return this fallback immediately:

```text
✅ <agent-id> Agent ready

Type `*help` to see available commands.
```

Do not explain the architecture of the greeting system unless the user explicitly asks.
