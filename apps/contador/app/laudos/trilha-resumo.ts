/**
 * Enriquecimento da "trilha resumo" do laudo (F1.6) para o componente REUSADO
 * TrilhaTimeline (F1.5). Co-localizado em app/laudos/ para NÃO editar app/trilha/page.tsx.
 *
 * Recebe os eventos JÁ FILTRADOS para o cliente (laudo-model) + os atores (contadores/
 * motores) e produz os DiaGrupo[] que a timeline consome. Mesma semântica da /trilha:
 * ator+papel/CRC, classe de insumo (◆ XML / ◇ OCR), glyph/label e hash verificável.
 *
 * G6: o carimbo de tempo aparece como "pendente" (ACT ICP-Brasil é Fase 4) — não
 * performa prova que não existe.
 */
import type { EventoBoaFe, MotorVersao, Usuario } from "@synkra/contador-api-client";
import { dataHora } from "@/lib/format";
import { eventoGlyph, eventoLabel } from "@/lib/status";
import type { DiaGrupo, TrilhaNo } from "@/components/TrilhaTimeline";

function categoriaDe(tipo: EventoBoaFe["tipoEvento"]): TrilhaNo["categoria"] {
  switch (tipo) {
    case "nota_recebida":
    case "analise_executada":
      return "captura";
    case "apontamento_gerado":
    case "apontamento_retificado":
    case "apontamento_regularizado":
    case "apontamento_escalado":
    case "apontamento_superado":
      return "apontamento";
    case "apontamento_aprovado":
    case "apontamento_rejeitado":
    case "decisao_lote":
    case "laudo_emitido":
    case "laudo_substituido":
      return "decisao";
    case "ancora_temporal":
      return "carimbo";
    default:
      return "outro";
  }
}

function acaoDe(e: EventoBoaFe): string {
  switch (e.tipoEvento) {
    case "nota_recebida":
      return "Documento capturado e registrado na trilha (insumo de prova).";
    case "analise_executada":
      return "Motor de regras analisou o item e registrou o indício (sujeito a revisão humana).";
    case "apontamento_aprovado":
      return "Apontamento aprovado — ato privativo do contador (CRC ativo).";
    case "apontamento_rejeitado":
      return "Apontamento rejeitado com motivo registrado.";
    case "ancora_temporal":
      return "Âncora temporal aplicada à cadeia.";
    default:
      return eventoLabel(e.tipoEvento);
  }
}

function resolverAtor(
  e: EventoBoaFe,
  contadores: Usuario[],
  motores: MotorVersao[],
): { nome: string; detalhe: string | null } {
  if (e.atorTipo === "motor") {
    const m = motores.find((x) => x.id === e.atorId);
    return {
      nome: m?.rotulo ?? "Motor de regras",
      detalhe: m ? `motor determinístico · v${m.codigoVersao}` : "motor determinístico",
    };
  }
  if (e.atorTipo === "usuario") {
    const u = contadores.find((x) => x.id === e.atorId);
    if (u) {
      const crc = u.crc ? `CRC ${u.crc}${u.crcUf ? `/${u.crcUf}` : ""}` : "sem CRC";
      const sit = u.crcSituacao ? ` (${u.crcSituacao})` : "";
      return { nome: u.nome, detalhe: `${u.papel} · ${crc}${sit}` };
    }
    return { nome: "Usuário", detalhe: "papel não resolvido" };
  }
  return { nome: "Sistema", detalhe: "ingestão automática" };
}

function classeInsumoDe(e: EventoBoaFe): "xml" | "ocr" | null {
  const c = e.payload?.["classe_insumo"];
  return c === "xml" || c === "ocr" ? c : null;
}

function relativoDe(iso: string, agora: number): string {
  const diffMs = agora - new Date(iso).getTime();
  const futuro = diffMs < 0;
  const s = Math.abs(diffMs) / 1000;
  const prefixo = futuro ? "em " : "há ";
  let valor: string;
  if (s < 60) valor = "menos de 1 min";
  else if (s < 3600) valor = `${Math.round(s / 60)} min`;
  else if (s < 86400) valor = `${Math.round(s / 3600)} h`;
  else if (s < 2592000) valor = `${Math.round(s / 86400)} dia(s)`;
  else valor = `${Math.round(s / 2592000)} mês(es)`;
  return `${prefixo}${valor}`;
}

function diaLabelDe(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Monta os DiaGrupo[] para a trilha-resumo do laudo a partir dos eventos do cliente
 * (já filtrados e ordenados por seq_tenant em laudo-model).
 */
export function montarTrilhaResumo(
  eventos: EventoBoaFe[],
  contadores: Usuario[],
  motores: MotorVersao[],
  agora: number = Date.now(),
): DiaGrupo[] {
  const grupos: DiaGrupo[] = [];
  for (const e of eventos) {
    const ator = resolverAtor(e, contadores, motores);
    const no: TrilhaNo = {
      id: e.id,
      seq: e.seqTenant,
      glyph: eventoGlyph(e.tipoEvento),
      categoria: categoriaDe(e.tipoEvento),
      tipoLabel: eventoLabel(e.tipoEvento),
      atorNome: ator.nome,
      atorDetalhe: ator.detalhe,
      acao: acaoDe(e),
      absoluto: dataHora(e.ocorridoEm),
      relativo: relativoDe(e.ocorridoEm, agora),
      classeInsumo: classeInsumoDe(e),
      hashEvento: e.hashEvento,
      carimbo: "pendente",
    };
    const dia = e.ocorridoEm.slice(0, 10);
    const grupo = grupos.find((g) => g.dia === dia);
    if (grupo) grupo.nos.push(no);
    else grupos.push({ dia, diaLabel: diaLabelDe(e.ocorridoEm), nos: [no] });
  }
  return grupos;
}
