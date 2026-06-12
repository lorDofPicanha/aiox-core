// Geração de arquivos .docx das declarações (Sprint D2, 12/Jun): o Noyce GERA o documento
// pronto para assinar e subir no portal. PORTÃO HUMANO (conclave): só itens REVISADOS
// (aprovado ou corrigido) viram arquivo — texto pendente ou travado não sai do sistema.
import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import type { CompanyCapabilityProfile } from "./noyce-model";
import type { ReviewedItem } from "./noyce-review.ts";

export interface DeclarationDocInput {
  item: ReviewedItem;
  ccp: CompanyCapabilityProfile;
  /** Identificação do certame para o cabeçalho do documento. */
  certame: { titulo: string; orgao: string };
}

/** Um item só pode virar arquivo se passou pela revisão humana (portão do conclave). */
export function canGenerate(item: ReviewedItem): boolean {
  return item.status === "aprovado" || item.status === "corrigido";
}

export function buildDeclarationDocument({ item, ccp, certame }: DeclarationDocInput): Document {
  const hoje = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  return new Document({
    sections: [
      {
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: item.label.toUpperCase(), bold: true, size: 28 })],
            spacing: { after: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Ref.: ${certame.titulo} — ${certame.orgao}`, italics: true, size: 22 }),
            ],
            spacing: { after: 400 },
          }),
          ...item.valorFinal.split("\n").map(
            (line) =>
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [new TextRun({ text: line, size: 24 })],
                spacing: { after: 200, line: 360 },
              }),
          ),
          new Paragraph({ children: [], spacing: { after: 600 } }),
          new Paragraph({
            children: [new TextRun({ text: `${ccp.identity.sedeMunicipioIbge === "5200258" ? "Águas Lindas de Goiás/GO" : ""}, ${hoje}.`, size: 24 })],
            spacing: { after: 800 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "_________________________________________", size: 24 })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: ccp.identity.razaoSocial, bold: true, size: 24 })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: `CNPJ ${ccp.identity.cnpj}`, size: 22 })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "(assinatura do representante legal — conferido em revisão humana via Noyce)",
                italics: true,
                size: 18,
              }),
            ],
            spacing: { before: 200 },
          }),
        ],
      },
    ],
  });
}

/** Gera o blob .docx (browser) ou Buffer (node, para testes). */
export async function generateDeclarationBlob(input: DeclarationDocInput): Promise<Blob> {
  return Packer.toBlob(buildDeclarationDocument(input));
}

export async function generateDeclarationBuffer(input: DeclarationDocInput): Promise<Uint8Array> {
  return Packer.toBuffer(buildDeclarationDocument(input));
}

export function declarationFileName(item: ReviewedItem, cnpj: string): string {
  const slug = item.label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `declaracao-${slug}-${cnpj.replace(/\D/g, "")}.docx`;
}
