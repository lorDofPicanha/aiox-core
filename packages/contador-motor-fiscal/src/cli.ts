#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { classificar, type BaseReferencia, type ContextoMotor, type ItemFiscal } from "./index";

interface CliPayload {
  item: ItemFiscal;
  base: BaseReferencia;
  contexto: ContextoMotor;
}

const inputPath = process.argv[2];

if (!inputPath) {
  console.error("Usage: contador-motor-classificar <payload.json>");
  process.exit(2);
}

const payload = JSON.parse(readFileSync(inputPath, "utf8")) as CliPayload;
const result = classificar(payload.item, payload.base, payload.contexto);

console.log(JSON.stringify(result, null, 2));
