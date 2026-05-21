#!/usr/bin/env node
/**
 * Converts Claude Code slash commands (.claude/commands/**) to Codex prompts (.codex/prompts/).
 *
 * Codex prompts spec:
 * - Location: .codex/prompts/ (project) or ~/.codex/prompts/ (global)
 * - Format: Markdown with YAML frontmatter
 * - YAML fields: `description:`, `argument-hint:`
 * - Filename minus .md = command name
 * - Invocation: /prompts:<name> or /<name>
 *
 * Strategy:
 * - Flat copy preserving original filenames (no collisions verified)
 * - synapse/ prefixed with `synapse-` to avoid generic-name collisions
 * - Auto-derive description from H1 or first non-empty paragraph
 * - Preserve original content below frontmatter
 *
 * Usage: node .aios-core/infrastructure/scripts/convert-commands-to-codex.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '..', '..', '..', '.claude', 'commands');
const TARGET_DIR = path.join(__dirname, '..', '..', '..', '.codex', 'prompts');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function listMdFiles(dir, baseDir = dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listMdFiles(full, baseDir));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      out.push({
        absolute: full,
        relative: path.relative(baseDir, full).replace(/\\/g, '/'),
      });
    }
  }
  return out;
}

function deriveDescription(content, relativePath) {
  // Strategy by command type:
  // AIOS/agents/<name>.md → extract agent.title or agent.role from YAML block
  // AIOS/stories/<name>.md → "Story reference"
  // synapse/* → derive from H2 or first paragraph
  // standalone → derive from first paragraph

  const parts = relativePath.split('/');

  // AIOS agents — use agent title/role from YAML block
  if (parts[0] === 'AIOS' && parts[1] === 'agents') {
    const agentName = parts[parts.length - 1].replace('.md', '');
    // Try to extract title from the embedded YAML block
    const titleMatch = content.match(/^\s*title:\s*(.+)$/m);
    const roleMatch = content.match(/^\s*role:\s*(.+)$/m);
    const title = (titleMatch && titleMatch[1]) || (roleMatch && roleMatch[1]) || '';
    if (title) {
      const clean = title.trim().replace(/^["']|["']$/g, '').slice(0, 100);
      return `Activate ${agentName} — ${clean}`;
    }
    return `Activate ${agentName} agent (AIOS persona)`;
  }

  // AIOS stories
  if (parts[0] === 'AIOS' && parts[1] === 'stories') {
    return `Story reference: ${parts[parts.length - 1].replace('.md', '')}`;
  }

  // Synapse — derive from content
  if (parts[0] === 'synapse') {
    const name = parts[parts.length - 1].replace('.md', '');
    return `SYNAPSE: ${name} command`;
  }

  // Standalone — derive from first paragraph (excluding H1 and metadata)
  const lines = content.split(/\r?\n/);
  let description = null;
  let skipNextHeader = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.startsWith('# ')) {
      if (skipNextHeader) {
        skipNextHeader = false;
        continue;
      }
    }
    if (line.startsWith('<!--')) continue;
    if (line.startsWith('---')) continue;
    if (line.startsWith('```')) continue;
    if (line.startsWith('#')) {
      description = line.replace(/^#+\s*/, '').trim();
      break;
    }
    description = line.replace(/^[*\-]\s*/, '').trim();
    break;
  }

  if (!description) description = 'AIOS command (converted from Claude Code)';
  if (description.length > 160) description = description.slice(0, 157) + '...';
  return description.replace(/"/g, '\\"');
}

function determineFlatName(relativePath) {
  // Strategy:
  // AIOS/agents/abby-covert.md → abby-covert.md
  // AIOS/stories/story-6.1.4.md → story-6.1.4.md
  // synapse/manager.md → synapse-manager.md
  // synapse/tasks/add-rule.md → synapse-add-rule.md
  // synapse/utils/manifest-parser-reference.md → synapse-manifest-parser-reference.md
  // greet.md → greet.md

  const parts = relativePath.split('/');
  const fileName = parts[parts.length - 1]; // base name

  if (parts[0] === 'AIOS') {
    // AIOS commands keep flat names
    return fileName;
  }

  if (parts[0] === 'synapse') {
    // Prefix synapse to avoid generic-name collisions
    return `synapse-${fileName}`;
  }

  // Standalone (root level)
  return fileName;
}

function hasFrontmatter(content) {
  return content.trimStart().startsWith('---');
}

function addOrMergeFrontmatter(content, description, sourcePath) {
  const trimmed = content.trimStart();

  if (hasFrontmatter(content)) {
    // Merge — add description if missing
    const fmEnd = trimmed.indexOf('\n---', 4);
    if (fmEnd > 0) {
      const fmBlock = trimmed.slice(0, fmEnd + 4);
      if (!/^description:/m.test(fmBlock)) {
        const newFm = fmBlock.replace(/^---\n/, `---\ndescription: "${description}"\n`);
        return newFm + trimmed.slice(fmEnd + 4);
      }
    }
    return content; // already has description
  }

  // Add new frontmatter
  return `---
description: "${description}"
source: "claude-code .claude/commands/${sourcePath}"
migrated: "2026-05-19"
---

${content}`;
}

function main() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Source not found: ${SOURCE_DIR}`);
    process.exit(1);
  }

  ensureDir(TARGET_DIR);

  const files = listMdFiles(SOURCE_DIR);
  console.log(`Found ${files.length} source commands`);

  const written = new Set();
  const collisions = [];
  const converted = [];

  for (const file of files) {
    const flatName = determineFlatName(file.relative);

    if (written.has(flatName)) {
      collisions.push({ flatName, source: file.relative });
      continue;
    }

    const content = fs.readFileSync(file.absolute, 'utf8');
    const description = deriveDescription(content, file.relative);
    const newContent = addOrMergeFrontmatter(content, description, file.relative);

    const targetPath = path.join(TARGET_DIR, flatName);
    fs.writeFileSync(targetPath, newContent, 'utf8');
    written.add(flatName);
    converted.push({ source: file.relative, target: flatName, description });
  }

  // Summary
  console.log(`\nConverted: ${converted.length}`);
  console.log(`Collisions: ${collisions.length}`);
  if (collisions.length > 0) {
    console.log('\nCollisions:');
    for (const c of collisions) {
      console.log(`  ${c.flatName} — already taken by another source (${c.source})`);
    }
  }

  // Manifest
  const manifestPath = path.join(TARGET_DIR, '_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify({
    migrated_at: '2026-05-19',
    source: '.claude/commands/',
    target: '.codex/prompts/',
    total_source: files.length,
    total_converted: converted.length,
    collisions,
    entries: converted,
  }, null, 2));
  console.log(`\nManifest: ${manifestPath}`);

  if (collisions.length > 0) {
    process.exit(2);
  }
}

main();
