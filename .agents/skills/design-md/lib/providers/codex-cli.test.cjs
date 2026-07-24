"use strict";

const assert = require("node:assert/strict");
const { test } = require("node:test");
const { invoke, resolveCodexInvocation } = require("./codex-cli.cjs");

test("codex-cli exposes an invoke function", () => {
  assert.equal(typeof invoke, "function");
});

test("codex-cli resolves a native executable invocation", () => {
  const invocation = resolveCodexInvocation();
  assert.equal(typeof invocation.executable, "string");
  assert.ok(Array.isArray(invocation.prefixArgs));
  assert.equal(typeof invocation.shell, "boolean");
  if (process.platform === "win32") {
    assert.equal(invocation.shell, false);
    assert.equal(invocation.prefixArgs.length, 1);
  }
});
