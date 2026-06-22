#!/usr/bin/env node
/**
 * Banlist G6 (FF-10) — gate de linguagem fiscal segura para a UI do Contador.
 *
 * Varre o texto de UI (app/** + components/**) procurando AFIRMAÇÕES proibidas pelo
 * doc `45-safe-fiscal-language-claims-v1.md` (G6): "crédito garantido", "apuração
 * correta", "elimina multa", "prova jurídica plena", "garante", "recupera dinheiro
 * automaticamente", "validade ICP-Brasil", "a IA decide", "substitui contador", etc.
 * Falha (exit 1) se achar uma afirmação proibida.
 *
 * Por que isto não é um simples grep: os disclaimers G6 LEGITIMAMENTE citam esses
 * termos para NEGÁ-LOS ("não promete crédito garantido", "nunca prova jurídica plena").
 * O banlist só acusa quando o termo NÃO está sob uma negação na vizinhança imediata —
 * é assim que distingue uma promessa de uma ressalva.
 *
 * Uso:
 *   node apps/contador/scripts/banlist-g6.mjs            # varre a UI (default)
 *   node apps/contador/scripts/banlist-g6.mjs --all      # idem (mantido p/ clareza)
 *   node apps/contador/scripts/banlist-g6.mjs --self-test # planta um termo proibido e prova que pega
 *
 * Será gate de CI na Fase 2 (rodar antes do build). Exit 0 = passa, 1 = afirmação proibida.
 *
 * Fonte de verdade: docs/projects/contador/45-safe-fiscal-language-claims-v1.md §5.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = resolve(__dirname, "..");

// Diretórios de UI varridos (texto que o usuário lê).
const SCAN_DIRS = ["app", "components"];
const SCAN_EXT = new Set([".tsx", ".ts", ".jsx", ".js", ".mdx"]);

// Não varrer o próprio banlist (ele cita os termos por definição) nem builds.
const IGNORE = new Set(["node_modules", ".next", "scripts", "dist"]);

/**
 * Termos/afirmações proibidos (doc 45 §5 + termos-âncora). Cada entrada é uma RegExp
 * (case-insensitive, sem acento sensível — ver normalize). Mantemos a forma "afirmativa"
 * para reduzir ruído; a checagem de negação acontece à parte.
 */
const PROIBIDOS = [
  { id: "credito-garantido", re: /credito\s+garantido/gi, motivo: "Resultado depende de análise/documentos/regime/prazo/decisão (doc 45 §5)." },
  { id: "garante-credito", re: /garante\s+credito/gi, motivo: "Não prometer crédito (doc 45 §5)." },
  { id: "recupera-dinheiro-auto", re: /recupera\s+dinheiro\s+automaticamente/gi, motivo: "PER/DCOMP/decisão humana fora da F1 (doc 45 §5)." },
  { id: "apuracao-correta", re: /apuracao\s+correta/gi, motivo: "Sem golden-set real e sem responsabilidade transferida (doc 45 §5)." },
  { id: "garante-apuracao", re: /garante\s+(a\s+)?apuracao/gi, motivo: "Não garantir apuração (doc 45 §5)." },
  { id: "elimina-multa", re: /elimina(r)?\s+(o\s+)?risco\s+de\s+multa/gi, motivo: "Risco fiscal não é zerado por ferramenta (doc 45 §5)." },
  { id: "elimina-multa-2", re: /elimina(r)?\s+(a\s+)?multa/gi, motivo: "Risco fiscal não é zerado por ferramenta (doc 45 §5)." },
  { id: "sem-multa", re: /ausencia\s+de\s+multa/gi, motivo: "Não prometer ausência de multa (doc 45 §1)." },
  { id: "prova-juridica-plena", re: /prova\s+juridica\s+plena/gi, motivo: "Sem parecer/assinatura/carimbo pleno implementado (doc 45 §5)." },
  { id: "validade-icp", re: /validade\s+icp[-\s]?brasil/gi, motivo: "time_stamp_provider='none' na F1 (doc 45 §5)." },
  { id: "validade-pades", re: /validade\s+pades/gi, motivo: "Sem carimbo/assinatura plena (doc 45 §5)." },
  { id: "ia-decide", re: /(a\s+)?ia\s+decide\s+(a\s+)?(classificacao|apuracao)/gi, motivo: "Decisão e revisão são humanas (doc 45 §5)." },
  { id: "ia-decide-2", re: /motor\s+decide\s+(a\s+)?(classificacao|apuracao)/gi, motivo: "Decisão é humana; motor apoia triagem (doc 45 §5)." },
  { id: "substitui-contador", re: /substitui\s+(o\s+)?(contador|tributarista|advogado|profissional)/gi, motivo: "Produto é suporte à decisão profissional (doc 45 §5)." },
  { id: "acuracia-pct", re: /acuracia\s+(fiscal\s+)?de\s+\d/gi, motivo: "Bloqueado até golden-set real (doc 45 §5)." },
];

/**
 * Cues de NEGAÇÃO que tornam uma menção LÍCITA (é uma ressalva, não uma promessa).
 * Verificadas numa janela ANTES da ocorrência (mesma frase/linha).
 */
const NEGACOES = [
  /\bnao\b/, // não (normalizado sem acento)
  /\bnunca\b/,
  /\bnada\b/, // "nada aqui é/promete/afirma <termo>" — ressalva
  /\bsem\b/,
  /\bnem\b/, // continuação de enumeração negada
  /\bjamais\b/,
  /\bnenhum[ao]?\b/,
  /\bdepende\b/,
  /\bbloquead[ao]?\b/,
  /\bproibid[ao]s?\b/,
  /\bpendente\b/,
  /\bafirma\b/, // "nada afirma <termo>" / "não afirma" (comentários de doc)
  /\bpromete\b/, // "não promete <termo>"
  /\bdiz\b/,
  // "≠" já foi convertido para "nao" em normalize() — coberto por /\bnao\b/.
];

// Janela ampla o bastante para alcançar a negação que rege uma enumeração inteira
// (ex.: "nada aqui é crédito garantido, apuração correta nem prova jurídica plena").
const JANELA_NEGACAO = 180; // chars antes da ocorrência para procurar a negação.

/** Normaliza: minúsculas + remove acentos (para casar "crédito"/"credito"). O sinal
 *  "≠" (diferente de) é uma negação semântica → vira a palavra "nao" antes do strip
 *  (a decomposição NFD de ≠ viraria "=", que seria ruído). */
function normalize(s) {
  return s
    .replace(/≠/g, " nao ")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function listFiles(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    if (IGNORE.has(name)) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...listFiles(full));
    } else if (SCAN_EXT.has(full.slice(full.lastIndexOf(".")))) {
      out.push(full);
    }
  }
  return out;
}

/** Qualificadores que SEGUEM o termo e o transformam em ressalva (ex.: "X depende de…"). */
const QUALIFICADORES_POS = [/^\s*depende\b/, /^\s*so\s+sera\b/, /^\s*so\s+apos\b/];

/** True se houver negação na janela imediatamente antes de `index` (texto normalizado). */
function temNegacaoAntes(textoNorm, index) {
  const inicio = Math.max(0, index - JANELA_NEGACAO);
  // Colapsa quebras de linha/indentação: em JSX/HTML e comentários o texto de uma
  // mesma frase quebra em várias linhas — newline NÃO é fim de frase. Só ./; são.
  const janela = textoNorm.slice(inicio, index).replace(/\s+/g, " ");
  const corte = Math.max(janela.lastIndexOf("."), janela.lastIndexOf(";"));
  const frase = corte >= 0 ? janela.slice(corte + 1) : janela;
  return NEGACOES.some((re) => re.test(frase));
}

/** True se logo após o termo vier um qualificador que o torna ressalva ("depende de…"). */
function temQualificadorDepois(textoNorm, indexFim) {
  // Remove tags JSX/HTML (ex.: "</strong>") entre o termo e o qualificador.
  const depois = textoNorm
    .slice(indexFim, indexFim + 60)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ");
  return QUALIFICADORES_POS.some((re) => re.test(depois));
}

/** Varre um conteúdo; retorna lista de violações {id, motivo, trecho, linha}. */
function scanContent(conteudo) {
  const violacoes = [];
  const norm = normalize(conteudo);
  for (const termo of PROIBIDOS) {
    termo.re.lastIndex = 0;
    let m;
    while ((m = termo.re.exec(norm)) !== null) {
      const idx = m.index;
      const fim = idx + m[0].length;
      if (temNegacaoAntes(norm, idx)) continue; // ressalva lícita (negada antes)
      if (temQualificadorDepois(norm, fim)) continue; // ressalva lícita ("X depende de…")
      const linha = conteudo.slice(0, idx).split("\n").length;
      const ctxStart = Math.max(0, idx - 40);
      const ctxEnd = Math.min(norm.length, idx + m[0].length + 40);
      const trecho = conteudo.slice(ctxStart, ctxEnd).replace(/\s+/g, " ").trim();
      violacoes.push({ id: termo.id, motivo: termo.motivo, trecho, linha });
      if (m.index === termo.re.lastIndex) termo.re.lastIndex++;
    }
  }
  return violacoes;
}

function run() {
  const args = process.argv.slice(2);
  const selfTest = args.includes("--self-test");

  const files = [];
  for (const d of SCAN_DIRS) files.push(...listFiles(join(APP_ROOT, d)));

  let total = 0;
  const reportadas = [];

  for (const file of files) {
    const conteudo = readFileSync(file, "utf8");
    const viols = scanContent(conteudo);
    for (const v of viols) {
      reportadas.push({ file: relative(APP_ROOT, file), ...v });
      total += 1;
    }
  }

  // Self-test: planta uma afirmação proibida sintética e prova que o detector pega.
  if (selfTest) {
    const amostraRuim = "Esta plataforma garante credito e elimina a multa com apuracao correta.";
    const amostraBoa = "Esta plataforma nao garante credito, nem elimina a multa; nada de apuracao correta.";
    const ruim = scanContent(amostraRuim);
    const boa = scanContent(amostraBoa);
    console.log("── banlist-g6 self-test ──");
    console.log(`  amostra PROIBIDA  -> ${ruim.length} violação(ões) detectada(s): ${ruim.map((v) => v.id).join(", ")}`);
    console.log(`  amostra NEGADA    -> ${boa.length} violação(ões) (esperado 0; negação = ressalva lícita)`);
    if (ruim.length === 0) {
      console.error("  ✗ FALHA do self-test: detector NÃO pegou a afirmação proibida.");
      process.exit(1);
    }
    if (boa.length !== 0) {
      console.error("  ✗ FALHA do self-test: falso-positivo em texto negado (ressalva G6).");
      process.exit(1);
    }
    console.log("  ✓ self-test OK: pega afirmação proibida, ignora ressalva negada.\n");
  }

  console.log(`banlist-g6: ${files.length} arquivo(s) de UI varrido(s) (app/, components/).`);
  if (total > 0) {
    console.error(`\n✗ ${total} afirmação(ões) proibida(s) pelo G6 (doc 45 §5):\n`);
    for (const v of reportadas) {
      console.error(`  ${v.file}:${v.linha}  [${v.id}]`);
      console.error(`     ${v.motivo}`);
      console.error(`     …${v.trecho}…\n`);
    }
    console.error("Corrija a linguagem (use indício/evidência/trilha verificável/revisão humana) ou negue explicitamente o termo.");
    process.exit(1);
  }

  console.log("✓ banlist-g6 PASS — nenhuma afirmação fiscal proibida na UI (G6 respeitado).");
  process.exit(0);
}

run();
