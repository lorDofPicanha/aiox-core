#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { verificarCadeia, type EventoBoaFeDump } from "./index";

const inputPath = process.argv[2];

if (!inputPath) {
  console.error("Usage: contador-trilha-verify <events.json>");
  process.exit(2);
}

const eventos = JSON.parse(readFileSync(inputPath, "utf8")) as EventoBoaFeDump[];
const result = verificarCadeia(eventos);

if (!result.ok) {
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(result, null, 2));
