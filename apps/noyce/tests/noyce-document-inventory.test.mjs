import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const inventoryPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "lib",
  "data",
  "eniac-document-inventory.json",
);
const inventory = JSON.parse(readFileSync(inventoryPath, "utf8"));

test("ENIAC document inventory deduplicates the received packet", () => {
  const documents = inventory.documents;
  const unique = documents.filter((doc) => doc.duplicateOf === null);
  const duplicates = documents.filter((doc) => doc.duplicateOf !== null);

  assert.equal(documents.length, 25);
  assert.equal(unique.length, 21);
  assert.equal(duplicates.length, 4);
  assert.ok(duplicates.every((doc) => doc.status === "duplicate"));
});

test("ENIAC document inventory preserves hashes and redacts local absolute paths", () => {
  for (const doc of inventory.documents) {
    assert.match(doc.hashSha256, /^[a-f0-9]{64}$/);
    assert.ok(doc.originalPath.startsWith("Downloads/"));
    assert.doesNotMatch(doc.originalPath, /^[A-Z]:\\/i);
    assert.equal(doc.requiresHumanValidation, true);
  }
});

test("ENIAC document inventory does not store secrets or extracted financial guesses", () => {
  const serialized = JSON.stringify(inventory).toLowerCase();

  assert.doesNotMatch(serialized, /senha=|password=|cookie=|private_key=|chave privada=/);

  const balanceDocs = inventory.documents.filter((doc) => doc.kind === "BALANCO" && doc.duplicateOf === null);
  assert.equal(balanceDocs.length, 2);
  assert.ok(balanceDocs.every((doc) => Object.keys(doc.extractedFields).length === 0));
  assert.ok(balanceDocs.every((doc) => doc.notes.includes("nao inferir PL")));
});
