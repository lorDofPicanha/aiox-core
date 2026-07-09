/**
 * S1 + S4 — Composição dos adapters reais sob o contrato `SaudeFiscalProvider`.
 *
 * Combina o adapter do Integra Contador (S1 — caixa postal / situação fiscal / eventos) com o
 * adapter Infosimples (S4 — CNDs) numa única leitura `LeituraSaudeFiscal`, exatamente o contrato
 * que a page S3/S5 consome. É a "ponta real" que substitui o MockSaudeFiscalProvider QUANDO há
 * credencial (gate do founder — handoff 58 §2); sem credencial, cada adapter cai no seu próprio
 * MODO FIXTURE e a composição continua funcionando (dados sintéticos, ZERO rede).
 *
 * ┌─ COMPORTAMENTO DEFAULT INALTERADO ─────────────────────────────────────────────────────┐
 * │ O `saudeFiscalProvider` default da page CONTINUA sendo o Mock (saude-fiscal-provider.ts).│
 * │ Esta composição só é usada QUANDO `temCredenciaisSaudeFiscal()` — do contrário o app se   │
 * │ comporta exatamente como hoje. FF-1: o dialeto SERPRO/Infosimples fica nos adapters; aqui │
 * │ só se orquestram os contratos brutos.                                                    │
 * └────────────────────────────────────────────────────────────────────────────────────────┘
 */
import type { LeituraSaudeFiscal, SaudeFiscalProvider } from "../saude-fiscal-provider";
import { IntegraContadorAdapter, type IntegraContadorConfig } from "./integra-contador-adapter.ts";
import { InfosimplesAdapter, type InfosimplesConfig } from "./infosimples-adapter.ts";

export interface ComposedSaudeFiscalConfig {
  integra?: IntegraContadorConfig;
  infosimples?: InfosimplesConfig;
  /** Adapters já instanciados (DI/testes) — têm precedência sobre `integra`/`infosimples`. */
  integraAdapter?: IntegraContadorAdapter;
  infosimplesAdapter?: InfosimplesAdapter;
}

/**
 * Provider composto: S1 (Integra Contador) + S4 (Infosimples) → `LeituraSaudeFiscal`. As quatro
 * consultas independentes rodam em paralelo (Promise.all). Situação fiscal (SITFIS) e eventos
 * entram nos campos OPCIONAIS aditivos do contrato — S3/S5 seguem lendo mensagens + cnds.
 */
export class ComposedSaudeFiscalProvider implements SaudeFiscalProvider {
  integra: IntegraContadorAdapter;
  infosimples: InfosimplesAdapter;

  constructor(config: ComposedSaudeFiscalConfig = {}) {
    this.integra = config.integraAdapter ?? new IntegraContadorAdapter(config.integra);
    this.infosimples = config.infosimplesAdapter ?? new InfosimplesAdapter(config.infosimples);
  }

  async listarSaudeFiscal(escritorioId: string, refIso: string): Promise<LeituraSaudeFiscal> {
    const [mensagens, situacoesFiscais, eventos, cnds] = await Promise.all([
      this.integra.listarMensagens(escritorioId, refIso),
      this.integra.obterSituacaoFiscal(escritorioId, refIso),
      this.integra.detectarEventos(escritorioId, refIso),
      this.infosimples.listarCnds(escritorioId, refIso),
    ]);
    return { refIso, mensagens, cnds, situacoesFiscais, eventos };
  }
}

/**
 * True quando há QUALQUER credencial de saúde fiscal no ambiente (SERPRO OU Infosimples). É o
 * gate que a page usa para decidir entre o Mock (default) e a composição real.
 */
export function temCredenciaisSaudeFiscal(env: Record<string, string | undefined> = process.env): boolean {
  const temSerpro = Boolean(env.SERPRO_CONSUMER_KEY && env.SERPRO_CONSUMER_SECRET && env.SERPRO_BASE_URL);
  const temInfosimples = Boolean(env.INFOSIMPLES_TOKEN);
  return temSerpro || temInfosimples;
}

/** Instancia a composição (cada adapter decide real/fixture pelo seu próprio env). */
export function criarSaudeFiscalProviderComposto(
  config: ComposedSaudeFiscalConfig = {},
): ComposedSaudeFiscalProvider {
  return new ComposedSaudeFiscalProvider(config);
}
