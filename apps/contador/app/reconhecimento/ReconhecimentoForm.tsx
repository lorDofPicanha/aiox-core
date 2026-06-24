"use client";

/**
 * ReconhecimentoForm — corpo interativo do módulo #5 (pipeline REAL).
 *
 * Cliente fino: coleta (a) a amostra selecionada OU (b) o XML colado e dispara a
 * Server Action `reconhecerAction` (que roda parse+classificação no SERVIDOR —
 * o XML cru não é processado aqui; LGPD CONTEXT §7). O resultado volta como
 * view-model serializável e é renderizado abaixo: documento, itens, e os
 * apontamentos do motor com confiança/banda/fatores explícitos.
 *
 * G6: baixa confiança = "revisar — fila humana". A tela SINALIZA indícios; nada
 * é aprovado automaticamente. Decisão e assinatura são do contador (CRC).
 */

import { useActionState, useState } from "react";
import { Card } from "@/components/Card";
import { brl } from "@/lib/format";
import { reconhecerAction } from "./actions";
import {
  RECONHECIMENTO_VAZIO,
  bandaBadge,
  type ApontamentoView,
  type ReconhecimentoView,
} from "./recognize-view";
import type { FixtureAmostra } from "./fixtures";
import styles from "./reconhecimento.module.css";

export function ReconhecimentoForm({ amostras }: { amostras: FixtureAmostra[] }) {
  const [state, formAction, pending] = useActionState<ReconhecimentoView, FormData>(
    reconhecerAction,
    RECONHECIMENTO_VAZIO,
  );

  // Modo de entrada: amostra pré-carregada (default) ou XML colado.
  const [modo, setModo] = useState<"amostra" | "colar">("amostra");
  const [amostraId, setAmostraId] = useState(amostras[0]?.id ?? "");
  const [xml, setXml] = useState("");

  const podeReconhecer =
    modo === "amostra" ? amostraId.length > 0 : xml.trim().length > 0;

  const amostraSel = amostras.find((a) => a.id === amostraId);

  return (
    <div className={styles.explorer}>
      <Card
        title="Reconhecer um documento"
        sub="Selecione uma amostra real (fixtures do parser) ou cole o XML de uma NF-e / NFC-e 4.00. O reconhecimento roda no servidor."
      >
        <form action={formAction} className={styles.form}>
          <div className={styles.modoToggle} role="radiogroup" aria-label="Origem do XML">
            <button
              type="button"
              role="radio"
              aria-checked={modo === "amostra"}
              className={`${styles.modoBtn} ${modo === "amostra" ? styles.modoActive : ""}`}
              onClick={() => setModo("amostra")}
            >
              <span aria-hidden="true">◆</span> Amostra real
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={modo === "colar"}
              className={`${styles.modoBtn} ${modo === "colar" ? styles.modoActive : ""}`}
              onClick={() => setModo("colar")}
            >
              <span aria-hidden="true">⌨</span> Colar meu XML
            </button>
          </div>

          {modo === "amostra" ? (
            <div className={styles.campo}>
              <label htmlFor="fixtureSel" className={styles.label}>
                Amostra a reconhecer
              </label>
              <select
                id="fixtureSel"
                name="fixtureId"
                value={amostraId}
                onChange={(e) => setAmostraId(e.target.value)}
                className={styles.select}
              >
                {amostras.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.rotulo}
                  </option>
                ))}
              </select>
              {amostraSel ? (
                <p className={styles.amostraDesc}>{amostraSel.descricao}</p>
              ) : null}
            </div>
          ) : (
            <div className={styles.campo}>
              <label htmlFor="xmlInput" className={styles.label}>
                XML da NF-e / NFC-e
              </label>
              <textarea
                id="xmlInput"
                name="xml"
                rows={8}
                value={xml}
                onChange={(e) => setXml(e.target.value)}
                className={styles.textarea}
                placeholder="Cole aqui o XML (nfeProc / NFe, versão 4.00). O conteúdo é processado no servidor e não é persistido nesta tela."
                spellCheck={false}
              />
              <p className={styles.amostraDesc}>
                O XML é enviado ao servidor só para o reconhecimento ao vivo — não fica
                gravado nesta tela (Fase 1). A captura/ingestão automática é Fase B.
              </p>
            </div>
          )}

          <div className={styles.acoes}>
            <button type="submit" className={styles.btnReconhecer} disabled={!podeReconhecer || pending}>
              {pending ? "Reconhecendo…" : "Reconhecer"}
            </button>
            <span className={styles.acoesNota}>
              Parser determinístico + motor de classificação — indícios sujeitos a revisão humana (CRC).
            </span>
          </div>
        </form>
      </Card>

      {/* Erro tipado (G1) — amigável, não quebra a tela. */}
      {state.erro ? (
        <Card>
          <div className={styles.erroBox} role="alert">
            <span className={styles.erroGlyph} aria-hidden="true">
              ⚠
            </span>
            <div>
              <strong className={styles.erroTitulo}>Não foi possível reconhecer.</strong>
              <p className={styles.erroMsg}>{state.erro.mensagem}</p>
              <p className={styles.erroMeta}>
                Código: <span className="mono">{state.erro.codigo}</span>
                {state.erro.campo ? (
                  <>
                    {" · "}Campo: <span className="mono">{state.erro.campo}</span>
                  </>
                ) : null}
              </p>
            </div>
          </div>
        </Card>
      ) : null}

      {/* Resultado — documento + itens + apontamentos do motor. */}
      {state.ok && state.documento ? (
        <Resultado view={state} />
      ) : null}
    </div>
  );
}

function Resultado({ view }: { view: ReconhecimentoView }) {
  const doc = view.documento!;
  const prov = view.proveniencia;

  return (
    <>
      {/* Selo de proveniência — classe de insumo (base do moat / trilha). */}
      <Card>
        <div className={styles.provHead}>
          <span className={styles.provSelo} data-forte={prov?.assinado ? "1" : "0"}>
            <span aria-hidden="true">{prov?.assinado ? "◆" : "◇"}</span>
            {prov?.assinado
              ? "XML assinado — evidência forte"
              : "XML sem assinatura — evidência mais fraca"}
          </span>
          <span className={styles.provNota}>
            {prov?.assinado
              ? "Presença de bloco XMLDSig (proveniência leve — não valida a cadeia ICP-Brasil nesta fase)."
              : "Sem bloco de assinatura no XML — classe de insumo de menor força probatória."}
          </span>
        </div>
        <p className={styles.amostraDesc} style={{ marginTop: 8 }}>
          Reconhecido a partir de: <strong>{view.origem}</strong>.
        </p>
      </Card>

      {/* Cabeçalho do documento parseado. */}
      <Card title="Documento reconhecido" sub="Saída do parser determinístico (entidades tipadas, sem dialeto de fornecedor).">
        <dl className={styles.docDl}>
          <div>
            <dt>Modelo</dt>
            <dd>{doc.modeloRotulo}</dd>
          </div>
          <div>
            <dt>Chave de acesso</dt>
            <dd className="mono num">{doc.chaveAcesso}</dd>
          </div>
          <div>
            <dt>Série / Número</dt>
            <dd className="num">
              {doc.serie} / {doc.numero}
            </dd>
          </div>
          <div>
            <dt>Emissão</dt>
            <dd className="num">{doc.dataEmissao}</dd>
          </div>
          <div>
            <dt>Emitente</dt>
            <dd>
              {doc.emitenteNome}
              {doc.emitenteDoc ? (
                <span className={styles.docDoc}>
                  {" "}
                  · <span className="mono num">{doc.emitenteDoc}</span>
                </span>
              ) : null}
            </dd>
          </div>
          <div>
            <dt>Destinatário</dt>
            <dd>
              {doc.destinatarioNome}
              {doc.destinatarioDoc ? (
                <span className={styles.docDoc}>
                  {" "}
                  · <span className="mono num">{doc.destinatarioDoc}</span>
                </span>
              ) : null}
            </dd>
          </div>
          <div>
            <dt>Valor total (vNF)</dt>
            <dd className="num">{brl(doc.valorTotal)}</dd>
          </div>
          <div>
            <dt>Itens</dt>
            <dd className="num">{doc.qtdItens}</dd>
          </div>
        </dl>
      </Card>

      {/* Tabela de itens parseados. */}
      <Card title="Itens da nota" sub="NCM · CFOP · CST PIS/COFINS · valor — como o parser extraiu do XML.">
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th className="num">#</th>
                <th>Descrição</th>
                <th>NCM</th>
                <th>CFOP</th>
                <th>CST ICMS</th>
                <th>CST PIS/COFINS</th>
                <th className="num">vProd</th>
              </tr>
            </thead>
            <tbody>
              {view.itens.map((it) => (
                <tr key={it.id}>
                  <td className="num">{it.numero}</td>
                  <td>{it.descricao}</td>
                  <td className="mono num">{it.ncm ?? "—"}</td>
                  <td className="mono num">{it.cfop ?? "—"}</td>
                  <td className="mono num">{it.cstIcms ?? "—"}</td>
                  <td className="mono num">
                    {it.cstPis ?? "—"}
                    {it.cstCofins && it.cstCofins !== it.cstPis ? ` / ${it.cstCofins}` : ""}
                  </td>
                  <td className="num">{brl(it.valor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Apontamentos do motor — o coração da prova. */}
      <Card
        title="Apontamentos do motor"
        sub="Indícios produzidos pelo motor REAL (cClassTrib + crédito potencial monofásico). Cada número de confiança deriva de fatores explícitos."
      >
        {view.apontamentos.length === 0 ? (
          <p className={styles.semApontamento}>
            <span aria-hidden="true">✓</span> Nenhum indício de divergência neste documento —
            a tributação observada é coerente com a referência. (Ausência de indício não é
            parecer; é só o que o motor encontrou nesta amostra.)
          </p>
        ) : (
          <>
            <p className={styles.apResumo}>
              <strong>{view.apontamentos.length}</strong> indício(s) ·{" "}
              <strong className="num">{brl(view.valorEnvolvidoTotal)}</strong> de valor envolvido
              (estimativa ilustrativa, sujeita a revisão).
            </p>
            <ul className={styles.apLista}>
              {view.apontamentos.map((ap, i) => (
                <Apontamento key={`${ap.itemId}-${ap.origem}-${i}`} ap={ap} />
              ))}
            </ul>
          </>
        )}
      </Card>

      {/* Selo de honestidade G6. */}
      <Card title="Linguagem segura (G6)">
        <p className="disclaimer">
          <strong>Motor real sobre amostra.</strong> Esta tela executa o pipeline de
          reconhecimento de verdade (parser + classificação) — a integração de captura
          automática de documentos é Fase B. Cada apontamento é um <strong>indício</strong>{" "}
          potencialmente recuperável, sujeito a <strong>análise e revisão do tributarista
          habilitado (CRC)</strong>. Baixa confiança = revisar antes de aprovar. Esta tela não
          promete crédito garantido, apuração correta, eliminação de multa nem prova jurídica
          plena; ela <strong>sinaliza</strong> — quem decide e assina é o contador.
        </p>
      </Card>
    </>
  );
}

function Apontamento({ ap }: { ap: ApontamentoView }) {
  const badge = bandaBadge(ap.bandaConfianca);
  const pctConf = Math.round(ap.confianca * 100);

  return (
    <li className={`${styles.ap} ${ap.bloqueiaAutoAprovacao ? styles.apRevisar : ""}`}>
      <div className={styles.apHead}>
        <div className={styles.apIdent}>
          <span className={styles.apTipo}>{ap.tipoDivergenciaRotulo}</span>
          <span className={styles.apItem}>{ap.itemDescricao}</span>
        </div>
        <div className={styles.apConf}>
          <span className={`badge badge-${badge.variant}`}>
            <span className="badge-glyph" aria-hidden="true">
              {badge.glyph}
            </span>
            {badge.label}
          </span>
          <span className={styles.apConfPct} title="Confiança calibrada">
            <span className="num">{pctConf}%</span>
          </span>
        </div>
      </div>

      <p className={styles.apDescricao}>{ap.descricao}</p>

      {ap.bloqueiaAutoAprovacao ? (
        <p className={styles.apBloqueio} role="note">
          <span aria-hidden="true">▲</span> <strong>Revisar antes de aprovar.</strong> Confiança
          abaixo do limiar — <strong>auto-aprovação bloqueada</strong>; vai para a fila de revisão
          humana (CRC). O indício não some — vira fila.
        </p>
      ) : null}

      <div className={styles.apGrid}>
        <div>
          <span className={styles.apMetaLabel}>Valor envolvido</span>
          <span className={`${styles.apMetaValor} num`}>{brl(ap.valorEnvolvido)}</span>
        </div>
        <div>
          <span className={styles.apMetaLabel}>Referência</span>
          <span className={`${styles.apMetaValor} mono`}>{ap.cclasstribReferencia}</span>
        </div>
        <div>
          <span className={styles.apMetaLabel}>Base / versão</span>
          <span className={`${styles.apMetaValor} mono`}>{ap.baseVersaoId}</span>
        </div>
      </div>

      {/* Fatores explícitos da confiança (A3 — o número não é mágico). */}
      <details className={styles.apFatores}>
        <summary>Por que esta confiança? ({ap.fatores.length} fatores)</summary>
        <ul className={styles.fatorLista}>
          {ap.fatores.map((f, i) => (
            <li key={i} className={styles.fator}>
              <span className={styles.fatorRotulo}>{f.rotulo}</span>
              <span
                className={`${styles.fatorValor} num`}
                data-sinal={f.valor >= 0 ? "pos" : "neg"}
              >
                {f.valor >= 0 ? "+" : ""}
                {f.valor.toFixed(3)}
              </span>
              <span className={styles.fatorExplica}>{f.explica}</span>
            </li>
          ))}
        </ul>
      </details>

      {/* Fundamento normativo (trilha de boa-fé). */}
      {ap.fundamento.length > 0 ? (
        <details className={styles.apFatores}>
          <summary>Fundamento normativo ({ap.fundamento.length})</summary>
          <ul className={styles.fundamentoLista}>
            {ap.fundamento.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </details>
      ) : null}
    </li>
  );
}
