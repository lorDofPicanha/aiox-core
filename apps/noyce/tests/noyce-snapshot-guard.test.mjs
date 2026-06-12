// Guard de dados: um snapshot de discovery vazio derruba todas as abas de detalhe do app
// (regressão real de 11-12/Jun: run bloqueado por WAF sobrescreveu o snapshot de 29/Mai
// com items:[] e o page.tsx quebrava em selectedOpportunity.stage/.id). Este teste faz
// o snapshot vazio reprovar a suite ANTES de chegar no browser.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SNAPSHOT = path.join(__dirname, '..', 'lib', 'data', 'discovery-snapshot.json');

test('discovery-snapshot.json existe e tem itens (app depende disso para não quebrar)', () => {
  const raw = fs.readFileSync(SNAPSHOT, 'utf8');
  const snapshot = JSON.parse(raw);
  assert.ok(Array.isArray(snapshot.items), 'snapshot.items deve ser array');
  assert.ok(
    snapshot.items.length > 0,
    `snapshot vazio (0 itens) — provável overwrite por run bloqueado pelo WAF. ` +
      `Restaure via git (git restore apps/noyce/lib/data/discovery-snapshot.json) ou rode o discovery de IP limpo.`,
  );
});

test('itens do snapshot têm os campos que o app consome (id, stage-derivável, title)', () => {
  const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT, 'utf8'));
  for (const item of snapshot.items.slice(0, 10)) {
    assert.ok(item.id, 'item.id obrigatório');
    assert.ok(item.title, 'item.title obrigatório');
    assert.ok(typeof item.distanceKm === 'number', 'item.distanceKm numérico obrigatório (triagem)');
  }
});
