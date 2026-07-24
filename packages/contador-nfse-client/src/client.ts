import {
  DpsIdentifier,
  NfseClientError,
  NfseClientOptions,
  NfseEmissionResult,
  NfseEventRequest,
  NfseRequest,
  NfseResponse,
  NfseRunMode,
  NfseSafetyError,
} from "./types";

const OFFICIAL_PATHS = {
  nfse: "/nfse",
  dps: "/dps",
  eventos: "/nfse/{chaveAcesso}/eventos",
} as const;

function trimBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/u, "");
}

function encodePathPart(value: string): string {
  return encodeURIComponent(value);
}

function assertXml(xml: string, field: string): void {
  if (!xml.trim().startsWith("<")) {
    throw new NfseClientError(`${field} deve ser XML não vazio.`);
  }
}

function assertHttpSuccess<T>(response: NfseResponse<T>, request: NfseRequest): NfseResponse<T> {
  if (response.status < 200 || response.status >= 300) {
    throw new NfseClientError(`SEFIN rejeitou ${request.method} ${request.path} com HTTP ${response.status}.`, {
      status: response.status,
      path: request.path,
      responseBody: response.body,
    });
  }
  return response;
}

export class NfseNationalClient {
  readonly environment: NfseClientOptions["environment"];
  readonly mode: NfseRunMode;
  readonly baseUrl: string;
  private readonly transport: NfseClientOptions["transport"];

  constructor(options: NfseClientOptions) {
    this.environment = options.environment;
    this.mode = options.mode ?? "dry-run";
    this.baseUrl = trimBaseUrl(options.baseUrl);
    this.transport = options.transport;

    if (!this.baseUrl) {
      throw new NfseClientError("baseUrl é obrigatório.");
    }
    if (this.mode === "production" && !options.confirmProduction) {
      throw new NfseSafetyError(
        "Produção bloqueada: informe confirmProduction=true somente após aprovação explícita e credenciais mTLS.",
      );
    }
    if (this.mode === "production" && this.environment !== "production") {
      throw new NfseSafetyError("Modo production exige environment=production.");
    }
    if (this.mode === "restricted" && this.environment !== "production-restricted") {
      throw new NfseSafetyError("Modo restricted exige environment=production-restricted.");
    }
  }

  /** Official POST /nfse. Never transmits in dry-run mode. */
  async emitir(xmlDps: string): Promise<NfseEmissionResult> {
    assertXml(xmlDps, "xmlDps");
    const request: NfseRequest = {
      method: "POST",
      path: OFFICIAL_PATHS.nfse,
      headers: { "content-type": "application/xml; charset=utf-8", accept: "application/xml" },
      body: xmlDps,
    };
    if (this.mode === "dry-run") {
      return { status: "rejected", httpStatus: 0, errorBody: { dryRun: true, request } };
    }
    const response = assertHttpSuccess(await this.transport.request<string>(request), request);
    return { status: "emitted", httpStatus: response.status, xml: response.body };
  }

  /** Official GET /nfse/{chaveAcesso}. */
  async consultar(chaveAcesso: string): Promise<NfseResponse<string>> {
    const path = `${OFFICIAL_PATHS.nfse}/${encodePathPart(chaveAcesso)}`;
    return this.requestRead<string>({ method: "GET", path, headers: { accept: "application/xml" } });
  }

  /** Official GET or HEAD /dps/{id}. */
  async consultarDps(id: DpsIdentifier, headOnly = false): Promise<NfseResponse<string | undefined>> {
    const dpsId = [id.codigoMunicipio, id.tipoInscricao, id.inscricaoFederal, id.serieDps, id.numeroDps]
      .map(encodePathPart)
      .join("");
    const path = `${OFFICIAL_PATHS.dps}/${dpsId}`;
    return this.requestRead<string | undefined>({
      method: headOnly ? "HEAD" : "GET",
      path,
      headers: { accept: headOnly ? "*/*" : "application/json" },
    });
  }

  /** Official POST /nfse/{chaveAcesso}/eventos. */
  async registrarEvento(chaveAcesso: string, event: NfseEventRequest): Promise<NfseResponse<string>> {
    assertXml(event.eventXml, "eventXml");
    const path = `${OFFICIAL_PATHS.nfse}/${encodePathPart(chaveAcesso)}/eventos`;
    const request: NfseRequest = {
      method: "POST",
      path,
      headers: { "content-type": "application/json; charset=utf-8", accept: "application/json" },
      body: JSON.stringify({ pedidoRegistroEvento: event.eventXml }),
    };
    if (this.mode === "dry-run") {
      return { status: 200, body: JSON.stringify({ dryRun: true, request }) };
    }
    return assertHttpSuccess(await this.transport.request<string>(request), request);
  }

  /** Official GET /nfse/{chaveAcesso}/eventos. */
  async listarEventos(chaveAcesso: string): Promise<NfseResponse<string>> {
    const path = `${OFFICIAL_PATHS.nfse}/${encodePathPart(chaveAcesso)}/eventos`;
    return this.requestRead<string>({ method: "GET", path, headers: { accept: "application/json" } });
  }

  private async requestRead<T>(request: NfseRequest): Promise<NfseResponse<T>> {
    if (this.mode === "dry-run") {
      return { status: 200, body: undefined };
    }
    return assertHttpSuccess(await this.transport.request<T>(request), request);
  }
}

export function createFetchTransport(baseUrl: string): NfseClientOptions["transport"] {
  const normalized = trimBaseUrl(baseUrl);
  return {
    async request<T>(request: NfseRequest): Promise<NfseResponse<T>> {
      const response = await globalThis.fetch(`${normalized}${request.path}`, {
        method: request.method,
        headers: request.headers,
        body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
      });
      const contentType = response.headers.get("content-type") ?? "";
      const body = response.status === 204 ? undefined : contentType.includes("json") ? await response.json() : await response.text();
      return { status: response.status, headers: { "content-type": contentType }, body: body as T };
    },
  };
}

export { OFFICIAL_PATHS };
