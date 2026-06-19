import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "../../..");
const packageRoots = [
  "packages/contador-db",
  "packages/contador-motor-fiscal",
  "packages/contador-trilha-verifier",
  "packages/contador-fitness"
].map((path) => resolve(repoRoot, path));

const forbiddenPatterns = [
  {
    pattern: /from\s+["'][^"']*apps\/radar-fiscal/i,
    message: "Contador foundation package must not import apps/radar-fiscal"
  },
  {
    pattern: /from\s+["'][^"']*gestorize/i,
    message: "Contador foundation package must not import Gestorize"
  },
  {
    pattern: /from\s+["'][^"']*@supabase/i,
    message: "Pure foundation packages must not import Supabase client directly"
  },
  {
    pattern: /require\(["'][^"']*apps\/radar-fiscal/i,
    message: "Contador foundation package must not require apps/radar-fiscal"
  }
];

const sourceFiles = packageRoots.flatMap((root) => listFiles(root)).filter((file) => {
  return /\.(ts|tsx|js|mjs|cjs)$/.test(file) && !file.includes(`${sep()}dist${sep()}`);
});

const failures = [];
for (const file of sourceFiles) {
  const content = readFileSync(file, "utf8");
  for (const rule of forbiddenPatterns) {
    if (rule.pattern.test(content)) {
      failures.push(`${relative(repoRoot, file)}: ${rule.message}`);
    }
  }
}

if (failures.length > 0) {
  console.error("FF-1 import boundary failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`PASS FF-1 import boundary (${sourceFiles.length} files checked)`);

function listFiles(dir) {
  const entries = readdirSync(dir);
  return entries.flatMap((entry) => {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      if (entry === "node_modules" || entry === "dist") {
        return [];
      }
      return listFiles(path);
    }
    return [path];
  });
}

function sep() {
  return process.platform === "win32" ? "\\" : "/";
}
