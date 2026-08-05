import assert from "node:assert/strict";
import { test } from "node:test";

const { selectDiscoveryInbox } = await import("../lib/discovery-inbox.ts");

test("inbox exclui editais vencidos", () => {
  const inbox = selectDiscoveryInbox([
    { id: "expired", proposalDeadline: "2026-06-30T10:00:00Z", publicationDate: "2026-06-20", triage: { verdict: "vai", score: 90 } },
    { id: "open", proposalDeadline: "2026-07-20T10:00:00Z", publicationDate: "2026-07-10", triage: { verdict: "vai", score: 80 } },
  ], "2026-07-13T00:00:00Z");
  assert.deepEqual(inbox.map((item) => item.id), ["open"]);
});

test("inbox prioriza triagem e, dentro dela, publicação mais recente", () => {
  const inbox = selectDiscoveryInbox([
    { id: "olha", proposalDeadline: null, publicationDate: "2026-07-12", triage: { verdict: "olha", score: 100 } },
    { id: "old-vai", proposalDeadline: null, publicationDate: "2026-07-10", triage: { verdict: "vai", score: 100 } },
    { id: "new-vai", proposalDeadline: null, publicationDate: "2026-07-12", triage: { verdict: "vai", score: 1 } },
  ], "2026-07-13T00:00:00Z");
  assert.deepEqual(inbox.map((item) => item.id), ["new-vai", "old-vai", "olha"]);
});
