# Site-Prospector — tools

- `ig-scrape.cjs` — scraper reutilizável de Instagram via Apify. Uso:
  `node tools/ig-scrape.cjs <handle> <outDir> [limit]`
  (token lido de `D:/jarvis/apify.env` em runtime; nada hardcoded)
- `serve-mockups.cjs` — servidor estático local dos mockups em `http://127.0.0.1:8792`
  (root = `03-proposal-mockups`). Uso: `node tools/serve-mockups.cjs`
