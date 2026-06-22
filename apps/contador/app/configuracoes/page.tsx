/**
 * Configurações (#admin) — o painel de administração do escritório.
 *
 * Server Component, espelhando a estrutura de /captura. Cinco seções, todas com base
 * sintética co-localizada (configuracoes-data.ts), sem tocar em nada fora de
 * app/configuracoes/:
 *  1. Perfil do escritório (nome, CNPJ, responsável técnico com CRC, endereço).
 *  2. Equipe / usuários (contadores e analistas; só contador-CRC aprova apuração).
 *  3. Base de referência — régua cClassTrib (DRAFT, pendente validação — gate Fase 3).
 *  4. Captura por cliente (espelha o módulo Captura; default OFF = D2, seletivo).
 *  5. Plano & cobrança (corredor CONTEXT §10 / doc 05; value metric = nota auditada, D7).
 *
 * G6 (doc 45 §5): nada aqui afirma "crédito garantido", "apuração correta", "elimina
 * multa" nem "prova jurídica plena". A régua é RASCUNHO pendente de validação por
 * tributarista; só o contador com CRC ativo aprova apuração (humano no loop é design,
 * D8). Rótulo discreto "dados de demonstração". Base SINTÉTICA (Fase 1).
 */
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, type Column } from "@/components/Table";
import { TopBar } from "@/components/TopBar";
import { brl, cnpjMasked, dataHora } from "@/lib/format";
import {
  ESTADO_REGUA_VIEW,
  MODO_CAPTURA_VIEW,
  PAPEL_VIEW,
  type CapturaClienteConfig,
  type UsuarioEquipe,
} from "./configuracoes-model";
import {
  capturaPorCliente,
  cobrancaResumo,
  listarEquipe,
  perfilEscritorio,
  planosTiers,
  reguaReferencia,
} from "./configuracoes-data";
import styles from "./configuracoes.module.css";

/** Estática: a base é sintética e local (nenhuma I/O), pode prerender. */
export const dynamic = "force-static";

export default function ConfiguracoesPage() {
  const perfil = perfilEscritorio();
  const equipe = listarEquipe();
  const regua = reguaReferencia();
  const captura = capturaPorCliente();
  const planos = planosTiers();
  const cobranca = cobrancaResumo();

  const reguaView = ESTADO_REGUA_VIEW[regua.estado];

  const equipeColumns: Column<UsuarioEquipe>[] = [
    {
      key: "usuario",
      header: "Usuário",
      render: (u) => (
        <span className={styles.cliente}>
          <span className={styles.clienteNome}>{u.nome}</span>
          <span className={`${styles.clienteMeta} muted`}>{u.email}</span>
        </span>
      ),
    },
    {
      key: "papel",
      header: "Papel",
      render: (u) => <span>{PAPEL_VIEW[u.papel].label}</span>,
    },
    {
      key: "crc",
      header: "CRC",
      render: (u) =>
        u.crc ? (
          <span className="mono">{u.crc}</span>
        ) : (
          <span className="muted">— sem registro</span>
        ),
    },
    {
      key: "aprova",
      header: "Aprovação de apuração",
      render: (u) => <StatusBadge view={PAPEL_VIEW[u.papel].badge} />,
    },
    {
      key: "ativo",
      header: "Status",
      render: (u) =>
        u.ativo ? (
          <StatusBadge view={{ variant: "success", glyph: "●", label: "Ativo" }} />
        ) : (
          <StatusBadge view={{ variant: "neutral", glyph: "○", label: "Inativo" }} />
        ),
    },
  ];

  const capturaColumns: Column<CapturaClienteConfig>[] = [
    {
      key: "cliente",
      header: "Cliente",
      render: (c) => (
        <span className={styles.cliente}>
          <span className={styles.clienteNome}>{c.clienteNome}</span>
          <span className={`${styles.clienteMeta} mono muted`}>{cnpjMasked(c.documento)}</span>
        </span>
      ),
    },
    {
      key: "captura",
      header: "Captura automática",
      render: (c) => (
        <span
          className={`${styles.toggle} ${c.capturaAtiva ? styles.toggleOn : ""}`}
          title={
            c.capturaAtiva
              ? `Captura ativa (demo) — modo ${MODO_CAPTURA_VIEW[c.modo].label}`
              : "Captura recolhida (default seletivo, D2). Toggle ilustrativo — a varredura automática real chega na Fase 5."
          }
        >
          <span className={styles.track} aria-hidden="true">
            <span className={styles.knob} />
          </span>
          <span className={c.capturaAtiva ? styles.toggleLabelOn : styles.toggleLabelOff}>
            {c.capturaAtiva ? "ON" : "OFF"}
          </span>
        </span>
      ),
    },
    {
      key: "modo",
      header: "Modo",
      render: (c) => <StatusBadge view={MODO_CAPTURA_VIEW[c.modo]} />,
    },
  ];

  const planoAtual = planos.find((p) => p.atual);

  return (
    <>
      <TopBar
        title="Configurações"
        sub="Painel de administração do escritório — perfil, equipe, base de referência, captura por cliente e plano."
      />
      <div className="content">
        <div className="notice" role="status">
          <span aria-hidden="true">◇</span>
          <span>
            <strong>Dados de demonstração</strong> (Fase 1, base sintética). A administração
            real (equipe, base de referência versionada, cobrança) é entregue na Fase 2+.
            A régua cClassTrib é um <strong>rascunho</strong> pendente de validação por
            tributarista. Nada aqui é crédito garantido, apuração correta nem prova jurídica plena.
          </span>
        </div>

        {/* 1. Perfil do escritório */}
        <Card
          title="Perfil do escritório"
          sub="Identificação do tenant e do responsável técnico (contador com CRC ativo — ato privativo)."
        >
          <dl className={styles.perfil}>
            <div>
              <dt>Razão social</dt>
              <dd>{perfil.nome}</dd>
            </div>
            <div>
              <dt>CNPJ</dt>
              <dd className="mono num">{cnpjMasked(perfil.documento)}</dd>
            </div>
            <div>
              <dt>Responsável técnico</dt>
              <dd>{perfil.responsavelTecnico}</dd>
            </div>
            <div>
              <dt>CRC do responsável</dt>
              <dd className="mono">
                {perfil.crcResponsavel} ({perfil.crcUf})
              </dd>
            </div>
            <div>
              <dt>Endereço</dt>
              <dd>{perfil.endereco}</dd>
            </div>
            <div>
              <dt>Cidade / UF</dt>
              <dd>{perfil.cidadeUf}</dd>
            </div>
            <div>
              <dt>Regime tributário</dt>
              <dd>{perfil.regimeTributario}</dd>
            </div>
          </dl>
        </Card>

        {/* 2. Equipe / usuários */}
        <Card
          title="Equipe e usuários"
          sub="Quem opera o escritório. A aprovação de apuração é ato privativo do contador com CRC ativo (humano no loop é design, D8) — analista prepara e faz triagem, mas não carimba a apuração."
        >
          <Table<UsuarioEquipe>
            columns={equipeColumns}
            rows={equipe}
            rowKey={(u) => u.id}
            empty="Nenhum usuário cadastrado."
          />
        </Card>

        {/* 3. Base de referência — régua cClassTrib */}
        <Card
          title="Base de referência — régua cClassTrib"
          sub="A régua orienta a triagem da Auditoria (cClassTrib/NCM). É a fonte que o motor consulta — nunca o juízo final, que é do contador."
        >
          <p>
            <StatusBadge view={reguaView} />{" "}
            <span className="mono muted">{regua.versao}</span>
          </p>
          <dl className={styles.reguaMetrics}>
            <div>
              <dt>Publicada em</dt>
              <dd className="num" style={{ fontSize: 16 }}>
                {dataHora(regua.dataPublicacaoIso)}
              </dd>
            </div>
            <div>
              <dt>Regras na régua</dt>
              <dd className="num">
                {regua.numeroRegras} <span className="unidade">regras</span>
              </dd>
            </div>
            <div>
              <dt>NCM cobertos</dt>
              <dd className="num">
                {regua.numeroNcmCobertos} <span className="unidade">códigos</span>
              </dd>
            </div>
          </dl>
          <p className="card-sub" style={{ marginBottom: "var(--space-2)" }}>
            {regua.autoria}.
          </p>
          <p className="card-sub" style={{ marginBottom: "var(--space-2)" }}>
            Esta versão é um <strong>rascunho</strong> — ainda <strong>não</strong> foi
            validada por tributarista habilitado. O que falta para sair do rascunho (gate Fase 3):
          </p>
          <ul className="list-reset">
            {regua.pendencias.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </Card>

        {/* 4. Captura por cliente */}
        <Card
          title="Captura por cliente"
          sub="Quais clientes têm captura automática ligada. O default é OFF por design (D2): captura indiscriminada tem custo por CNPJ, então a varredura é seletiva. Toggle ilustrativo — a captura automática real (provider) chega na Fase 5."
        >
          <Table<CapturaClienteConfig>
            columns={capturaColumns}
            rows={captura}
            rowKey={(c) => c.clienteId}
            empty="Nenhum cliente configurado para captura."
          />
        </Card>

        {/* 5. Plano & cobrança */}
        <Card
          title="Plano e cobrança"
          sub="Planos por VOLUME DE NOTA AUDITADA (a métrica de valor é a nota, não a faixa de CNPJ — D7). Exemplo de demonstração; os preços seguem o corredor de mercado do projeto."
        >
          {planoAtual ? (
            <p style={{ marginBottom: "var(--space-4)" }}>
              <StatusBadge
                view={{
                  variant: "info",
                  glyph: "★",
                  label: `Plano atual: ${planoAtual.nome} · ${brl(planoAtual.mensalidade)}/mês`,
                }}
              />
            </p>
          ) : null}

          <div className={styles.planos}>
            {planos.map((p) => (
              <div
                key={p.id}
                className={`${styles.plano} ${p.atual ? styles.planoAtual : ""}`}
              >
                <div className={styles.planoHead}>
                  <span className={styles.planoNome}>{p.nome}</span>
                  {p.atual ? (
                    <StatusBadge view={{ variant: "info", glyph: "✓", label: "Atual" }} />
                  ) : null}
                </div>
                <div className={`${styles.planoPreco} num`}>
                  {brl(p.mensalidade)} <span className="periodo">/ mês</span>
                </div>
                <div className={styles.planoFaixa}>{p.faixaNotas}</div>
                <ul className={styles.planoInclui}>
                  {p.inclui.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <ul className={styles.cobranca} style={{ marginTop: "var(--space-5)" }}>
            <li>
              <span className={styles.cobrancaLabel}>Implantação</span>
              <span className={`${styles.cobrancaValue} num`}>
                {brl(cobranca.implantacao)} — fee único (cobre o custo de aquisição).
              </span>
            </li>
            <li>
              <span className={styles.cobrancaLabel}>Fidelidade</span>
              <span className={styles.cobrancaValue}>{cobranca.fidelidade}</span>
            </li>
            <li>
              <span className={styles.cobrancaLabel}>Recuperação (overlay)</span>
              <span className={styles.cobrancaValue}>{cobranca.successFeeRecuperacao}</span>
            </li>
            <li>
              <span className={styles.cobrancaLabel}>Emissor (revenda)</span>
              <span className={styles.cobrancaValue}>{cobranca.emissorRevenda}</span>
            </li>
          </ul>
        </Card>

        {/* G6 — linguagem segura */}
        <Card title="Linguagem segura (G6)">
          <p className="disclaimer">
            <strong>Dados de demonstração</strong> · base sintética (Fase 1) · régua cClassTrib
            em <strong>rascunho</strong> (pendente de validação por tributarista) · aprovação de
            apuração é <strong>ato privativo do contador com CRC</strong> · sujeito a{" "}
            <strong>revisão humana</strong>. Esta plataforma não promete crédito garantido,
            apuração correta nem eliminação de multa.
          </p>
        </Card>
      </div>
    </>
  );
}
