export type NfseEnvironment = "production-restricted" | "production";
export type NfseRunMode = "dry-run" | "restricted" | "production";

export interface NfseRequest {
  method: "GET" | "HEAD" | "POST";
  path: string;
  headers: Record<string, string>;
  body?: string;
}

export interface NfseResponse<T = unknown> {
  status: number;
  headers?: Record<string, string>;
  body?: T;
}

/** Transport boundary for mTLS/certificate-aware implementations. */
export interface NfseTransport {
  request<T = unknown>(request: NfseRequest): Promise<NfseResponse<T>>;
}

export interface NfseClientOptions {
  environment: NfseEnvironment;
  mode?: NfseRunMode;
  /** Required only for production mode; prevents accidental real transmission. */
  confirmProduction?: boolean;
  /** Base URL of the official SEFIN Nacional API or a controlled gateway. */
  baseUrl: string;
  transport: NfseTransport;
}

export interface DpsIdentifier {
  codigoMunicipio: string;
  tipoInscricao: "1" | "2";
  inscricaoFederal: string;
  serieDps: string;
  numeroDps: string;
}

export interface NfseEmissionResult {
  status: "emitted" | "rejected";
  httpStatus: number;
  xml?: string;
  errorBody?: unknown;
}

export interface NfseEventRequest {
  /** XML signed event payload as required by the official layout. */
  eventXml: string;
}

export class NfseClientError extends Error {
  readonly status?: number;
  readonly path?: string;
  readonly responseBody?: unknown;

  constructor(message: string, details: { status?: number; path?: string; responseBody?: unknown } = {}) {
    super(message);
    this.name = "NfseClientError";
    this.status = details.status;
    this.path = details.path;
    this.responseBody = details.responseBody;
    Object.setPrototypeOf(this, NfseClientError.prototype);
  }
}

export class NfseSafetyError extends NfseClientError {
  constructor(message: string) {
    super(message);
    this.name = "NfseSafetyError";
    Object.setPrototypeOf(this, NfseSafetyError.prototype);
  }
}
