"use strict";

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function resolveCodexInvocation() {
  if (process.platform !== "win32") {
    return { executable: "codex", prefixArgs: [], shell: false };
  }

  const lookup = spawnSync("where.exe", ["codex.cmd"], { encoding: "utf8" });
  const shimPath = (lookup.stdout || "").split(/\r?\n/).find(Boolean);
  const entrypoint = shimPath && path.join(
    path.dirname(shimPath.trim()),
    "node_modules",
    "@openai",
    "codex",
    "bin",
    "codex.js"
  );

  if (entrypoint && fs.existsSync(entrypoint)) {
    return { executable: process.execPath, prefixArgs: [entrypoint], shell: false };
  }

  // npm's Windows launcher is a batch file and requires cmd.exe as a fallback.
  return { executable: "codex.cmd", prefixArgs: [], shell: true };
}

function invoke(promptText, options = {}) {
  const envTimeout = parseInt(process.env.DESIGN_MD_TIMEOUT_MS || "", 10);
  const timeoutDefault = Number.isFinite(envTimeout) && envTimeout > 0 ? envTimeout : 900000;
  const { timeoutMs = timeoutDefault, cwd, model, designMdPath } = options;

  console.log("[codex-cli] spawning headless session...");

  const invocation = resolveCodexInvocation();
  const args = [
    ...invocation.prefixArgs,
    "exec",
    "--cd", cwd || process.cwd(),
    "--sandbox", "workspace-write",
    "--skip-git-repo-check",
    "--ephemeral",
  ];

  if (model) {
    args.push("--model", model);
  }

  if (designMdPath) {
    args.push("--add-dir", path.dirname(path.resolve(designMdPath)));
  }

  // Read the prompt from stdin so large extracted CSS/HTML contexts do not
  // exceed the Windows command-line limit when invoking the npm .cmd shim.
  args.push("-");

  const result = spawnSync(invocation.executable, args, {
    cwd,
    input: promptText,
    stdio: ["pipe", "pipe", "pipe"],
    shell: invocation.shell,
    timeout: timeoutMs,
    encoding: "utf8",
  });

  const errorMessage = result.error ? String(result.error.message || result.error) : "";

  return {
    status: result.status == null ? 1 : result.status,
    stdout: result.stdout || "",
    stderr: [result.stderr || "", errorMessage].filter(Boolean).join("\n"),
    timedOut: result.error?.code === "ETIMEDOUT",
  };
}

module.exports = { invoke, resolveCodexInvocation };
