import assert from "node:assert/strict";
import { NfseNationalClient, NfseSafetyError } from "../dist/index.js";

const requests = [];
const transport = {
  async request(request) {
    requests.push(request);
    if (request.path === "/nfse") return { status: 201, body: "<NFSe/>" };
    return { status: 200, body: "{}" };
  },
};

const validXml = "<DPS xmlns=\"http://www.sped.fazenda.gov.br/nfse\"><infDPS/></DPS>";
const dry = new NfseNationalClient({
  baseUrl: "https://sefin.producaorestrita.nfse.gov.br/API/SefinNacional",
  environment: "production-restricted",
  transport,
});
const dryResult = await dry.emitir(validXml);
assert.equal(dryResult.httpStatus, 0);
assert.equal(requests.length, 0, "dry-run nunca pode transmitir");

const restricted = new NfseNationalClient({
  baseUrl: "https://sefin.producaorestrita.nfse.gov.br/API/SefinNacional",
  environment: "production-restricted",
  mode: "restricted",
  transport,
});
const emission = await restricted.emitir(validXml);
assert.equal(emission.status, "emitted");
assert.equal(requests.at(-1).path, "/nfse");
await restricted.consultar("NFSE-123");
assert.equal(requests.at(-1).path, "/nfse/NFSE-123");
await restricted.consultarDps({ codigoMunicipio: "4205407", tipoInscricao: "2", inscricaoFederal: "12345678000199", serieDps: "00001", numeroDps: "000000000000001" });
assert.equal(requests.at(-1).path, "/dps/420540721234567800019900001000000000000001");
await restricted.consultarDps({ codigoMunicipio: "4205407", tipoInscricao: "2", inscricaoFederal: "12345678000199", serieDps: "00001", numeroDps: "000000000000001" }, true);
assert.equal(requests.at(-1).method, "HEAD");
await restricted.registrarEvento("NFSE-123", { eventXml: "<pedRegEvento/>" });
assert.equal(requests.at(-1).path, "/nfse/NFSE-123/eventos");
await restricted.listarEventos("NFSE-123");
assert.equal(requests.at(-1).path, "/nfse/NFSE-123/eventos");

assert.throws(
  () => new NfseNationalClient({ baseUrl: "https://sefin.nfse.gov.br", environment: "production", mode: "production", transport }),
  NfseSafetyError,
  "produção sem confirmação deve ser bloqueada",
);
await assert.rejects(() => restricted.emitir("not xml"), /XML não vazio/);
console.log("PASS NFS-e contract: dry-run guard + official paths + production safety");
