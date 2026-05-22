'use strict';

/**
 * Zero-dependency .env loader.
 *
 * Walks up from `startDir` (default: this file's dir) to find the nearest `.env`,
 * parses `KEY=VALUE` lines, and sets `process.env[KEY]` ONLY when the key is not
 * already defined — the real environment always wins. Safe to call repeatedly.
 *
 * Why not `dotenv`: the bridge must work with zero install footprint, in every IDE.
 *
 * @param {string} [startDir] - Directory to start the upward search from.
 * @returns {boolean} true if a .env was found and applied, false otherwise.
 */
function loadEnv(startDir) {
  const fs = require('fs');
  const path = require('path');
  try {
    let dir = startDir || __dirname;
    let envPath = null;
    for (let i = 0; i < 10; i++) {
      const candidate = path.join(dir, '.env');
      if (fs.existsSync(candidate)) { envPath = candidate; break; }
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
    if (!envPath) return false;

    const text = fs.readFileSync(envPath, 'utf8');
    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      if (!key || process.env[key] !== undefined) continue;
      let val = line.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
    return true;
  } catch {
    return false;
  }
}

module.exports = { loadEnv };
