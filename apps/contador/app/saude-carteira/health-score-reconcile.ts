/**
 * S12 — Reconciliação de carteira (PURO e testável). Extraído de health-score-data.ts para que
 * a lógica de junção dos dois lados possa ser testada sem tocar as origens reais (api/provider).
 *
 * Só imports de TIPO aqui (FilaLinha, EntradaHealthScore, sinais) — o runner de teste .mjs faz
 * type-stripping nativo do Node, então o arquivo importa-se sem resolver alias `@/`. Nenhuma
 * função abaixo consulta rede/FS/Date.now: recebe os dados já agregados/rotulados por parâmetro.
 */
import type { FilaLinha } from "@/lib/fila-model";
import type {
  EntradaHealthScore,
  SinalCoreCliente,
  SinalEcacCliente,
} from "./health-score-model";

/** Rótulo legível de um cliente (para nomear linhas sem reconsultar a origem). */
export interface RotuloCliente {
  nome: string;
  documento: string;
}

/**
 * Agrega as FilaLinha (indícios pendentes do core) em um SinalCoreCliente por clienteId (PURO).
 * `divergenciasCclasstrib` conta os indícios cuja natureza é cClassTrib divergente — o eixo da
 * Reforma e o que torna o score "cross-módulo" do lado da apuração.
 */
export function agregarSinalCore(fila: FilaLinha[]): Map<string, SinalCoreCliente> {
  const porCliente = new Map<string, SinalCoreCliente>();
  for (const linha of fila) {
    const atual: SinalCoreCliente =
      porCliente.get(linha.clienteId) ?? {
        indiciosAbertos: 0,
        indiciosBaixaConfianca: 0,
        materialidadeEmDisputa: 0,
        divergenciasCclasstrib: 0,
      };
    atual.indiciosAbertos += 1;
    if (linha.bloqueiaAutoAprovacao) atual.indiciosBaixaConfianca += 1;
    atual.materialidadeEmDisputa += linha.materialidade;
    if (linha.tipoDivergencia === "cclasstrib_divergente") atual.divergenciasCclasstrib += 1;
    porCliente.set(linha.clienteId, atual);
  }
  return porCliente;
}

/**
 * Monta as EntradaHealthScore[] reconciliando os dois lados por cliente do CORE (PURO).
 *
 * Para cada cliente do core (chave-âncora): pega o sinal do core e — via `mapaCoreEcac`
 * (core-id → id-eCAC) — o sinal do e-CAC. Sem leitura e-CAC reconciliada → `ecac` null
 * (honesto: o score considera só o lado do core e o sinaliza via semLadoEcac). Clientes que
 * EXISTEM só no e-CAC (sem contraparte no core) entram ao fim com `core` null — carteira
 * completa, sem inventar dado. Os rótulos do lado-só-eCAC vêm de `rotulosEcac` (injetado).
 *
 * @param fila         indícios pendentes do core (FilaLinha) — já carregados.
 * @param nomesCore    clienteId(core) → rótulo, para nomear as linhas.
 * @param sinalEcac    síntese e-CAC por id-eCAC.
 * @param mapaCoreEcac reconciliação explícita core-id → id-eCAC (some em prod; ver data.ts).
 * @param rotulosEcac  id-eCAC → rótulo, para nomear clientes que só existem no e-CAC.
 */
export function montarEntradas(
  fila: FilaLinha[],
  nomesCore: Map<string, RotuloCliente>,
  sinalEcac: Map<string, SinalEcacCliente>,
  mapaCoreEcac: Record<string, string>,
  rotulosEcac: Map<string, RotuloCliente>,
): EntradaHealthScore[] {
  const sinalCore = agregarSinalCore(fila);
  const entradas: EntradaHealthScore[] = [];
  const ecacUsados = new Set<string>();

  for (const [clienteId, info] of nomesCore) {
    const idEcac = mapaCoreEcac[clienteId] ?? null;
    const ecac = idEcac ? sinalEcac.get(idEcac) ?? null : null;
    if (idEcac) ecacUsados.add(idEcac);
    entradas.push({
      clienteId,
      clienteNome: info.nome,
      documento: info.documento,
      core: sinalCore.get(clienteId) ?? null,
      ecac,
    });
  }

  // Clientes que só existem no e-CAC (sem contraparte no core reconciliada) — carteira completa.
  for (const [idEcac, sinal] of sinalEcac) {
    if (ecacUsados.has(idEcac)) continue;
    const rotulo = rotulosEcac.get(idEcac);
    entradas.push({
      clienteId: `ecac:${idEcac}`,
      clienteNome: rotulo?.nome ?? idEcac,
      documento: rotulo?.documento ?? "",
      core: null,
      ecac: sinal,
    });
  }

  return entradas;
}
