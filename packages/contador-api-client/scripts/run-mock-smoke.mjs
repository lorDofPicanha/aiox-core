// Smoke test do MockApiClient + integração com o trilha-verifier.
// Roda sobre o dist compilado (npm test = build && node este script).

import { createApiClient } from "../dist/index.js";
import { verificarCadeia } from "@synkra/contador-trilha-verifier";

const ESC = "00000000-0000-4000-8000-000000000001";
let failures = 0;
function check(name, cond) {
  if (cond) {
    console.log(`  ok  ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${name}`);
  }
}

const api = createApiClient({ mode: "mock" });

const esc = await api.getEscritorio(ESC);
check("getEscritorio retorna escritório sintético", esc && esc.id === ESC);

const clientes = await api.listarClientes(ESC);
check("listarClientes retorna 3 clientes", clientes.length === 3);

const pendentes = await api.listarApontamentos({ escritorioId: ESC, status: "pendente" });
check("3 apontamentos (indícios) pendentes no seed", pendentes.length === 3);

const contadores = await api.listarContadores(ESC);
check("1 contador com CRC ativo", contadores.length === 1 && contadores[0].crcSituacao === "ativo");

// Trilha do seed deve ser um hash-chain válido.
const dump = api.dumpEventos();
const verif = verificarCadeia(dump);
check("trilha do seed verifica (hash-chain ok)", verif.ok === true && verif.checked === dump.length);

// Aprovação (ato privativo do contador).
const alvo = pendentes[0];
await api.aprovarApontamento({ apontamentoId: alvo.id, revisorId: contadores[0].id, motivoTexto: "Revisado manualmente (demo)." });
const aprovado = await api.getApontamento(alvo.id);
check("apontamento fica aprovado após RPC", aprovado.status === "aprovado");

// Aprovar sem CRC válido deve falhar.
let bloqueado = false;
try {
  await api.aprovarApontamento({ apontamentoId: pendentes[1].id, revisorId: "00000000-0000-4000-8000-deadbeef0000" });
} catch {
  bloqueado = true;
}
check("aprovação por não-contador é bloqueada (P17)", bloqueado);

// Trilha continua válida após a decisão humana.
const verif2 = verificarCadeia(api.dumpEventos());
check("trilha permanece válida após aprovação", verif2.ok === true);

// registrarAnalise adiciona novo indício pendente.
const novoId = await api.registrarAnalise({
  escritorioId: ESC,
  clienteId: clientes[0].id,
  itemId: "00000000-0000-4000-8000-000000000102",
  motorVersaoId: "00000000-0000-4000-8000-0000000000d0",
  baseVersaoId: "00000000-0000-4000-8000-0000000000b0",
  tipoDivergencia: "cclasstrib_divergente",
  descricao: "Indício adicional (demo).",
  confianca: 0.7,
});
const novo = await api.getApontamento(novoId);
check("registrarAnalise cria apontamento pendente", novo && novo.status === "pendente");

// Closeout Fase 1 = carimbo 'none'.
const closeoutId = await api.registrarCloseout({
  escritorioId: ESC,
  tipo: "diario",
  periodoInicio: "2026-01-22T00:00:00.000Z",
  periodoFim: "2026-01-23T00:00:00.000Z",
  eventoCount: dump.length,
  merkleRoot: null,
  verifierVersion: "0.1.0",
  resultado: "pass",
  manifesto: { nota: "demo" },
});
const closeouts = await api.listarCloseouts(ESC);
check("registrarCloseout grava manifesto com carimbo 'none'", closeouts.some((c) => c.id === closeoutId && c.carimboTempoProvider === "none"));

if (failures > 0) {
  console.error(`\n${failures} verificação(ões) falharam.`);
  process.exit(1);
}
console.log("\nMock smoke test: todas as verificações passaram.");
