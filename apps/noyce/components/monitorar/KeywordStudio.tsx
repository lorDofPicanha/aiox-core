"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  emptyRule,
  segmentByHits,
  validateRule,
  type CaptureHit,
  type KeywordConfig,
  type KeywordGroup,
  type KeywordRule,
} from "@/lib/noyce-keywords";
import seedConfig from "@/lib/data/keyword-groups.json";

const STORAGE_KEY = "noyce.keywords.config.v1";
const DEBOUNCE_MS = 220;

interface ProbeState {
  loading: boolean;
  errors: string[];
  total: number;
  blocked: number;
  missedByComplementar: number;
  universe: number;
  firstBlockReason: string | null;
  sample: Array<{ id: string; text: string; hits: CaptureHit[]; meta: Record<string, string | number | null> }>;
}

const EMPTY_PROBE: ProbeState = {
  loading: false,
  errors: [],
  total: 0,
  blocked: 0,
  missedByComplementar: 0,
  universe: 0,
  firstBlockReason: null,
  sample: [],
};

function loadConfig(): KeywordConfig {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as KeywordConfig;
  } catch {
    /* config corrompida no storage volta para o seed calibrado */
  }
  return seedConfig as unknown as KeywordConfig;
}

function persist(config: KeywordConfig) {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    /* storage cheio ou bloqueado: a edição continua válida na sessão */
  }
}

/** Editor de lista de termos: Enter adiciona, × remove. Espelha o padrão de chips do mercado. */
function TermChips({
  label,
  hint,
  tone,
  values,
  onChange,
}: {
  label: string;
  hint: string;
  tone: "complementar" | "indesejada";
  values: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const term = draft.trim();
    if (!term) return;
    if (!values.some((value) => value.toLowerCase() === term.toLowerCase())) onChange([...values, term]);
    setDraft("");
  };

  return (
    <div className="kw-field">
      <label>
        <span>{label}</span>
        <input
          value={draft}
          placeholder="Digite e aperte Enter…"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commit();
            }
            if (event.key === "Backspace" && draft === "" && values.length > 0) onChange(values.slice(0, -1));
          }}
          onBlur={commit}
        />
      </label>
      <p className="kw-hint">{hint}</p>
      {values.length > 0 ? (
        <div className="kw-chips">
          {values.map((value) => (
            <span className={`kw-chip ${tone}`} key={value}>
              {value}
              <button type="button" onClick={() => onChange(values.filter((item) => item !== value))} aria-label={`Remover ${value}`}>
                ×
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Objeto do edital com os trechos que casaram destacados — a prova visual da captura. */
function HighlightedText({ text, hits }: { text: string; hits: CaptureHit[] }) {
  return (
    <p className="kw-objeto">
      {segmentByHits(text, hits).map((segment, index) =>
        segment.hit ? (
          <mark className={`kw-mark ${segment.hit.role}`} key={index} title={`casou com "${segment.hit.term}"`}>
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </p>
  );
}

export function KeywordStudio({ onConfigChange }: { onConfigChange?: (config: KeywordConfig) => void }) {
  const [config, setConfig] = useState<KeywordConfig>(() => seedConfig as unknown as KeywordConfig);
  const [groupId, setGroupId] = useState<string>((seedConfig as unknown as KeywordConfig).groups[0]?.id ?? "");
  const [ruleId, setRuleId] = useState<string>((seedConfig as unknown as KeywordConfig).groups[0]?.rules[0]?.id ?? "");
  const [probe, setProbe] = useState<ProbeState>(EMPTY_PROBE);
  const [coverage, setCoverage] = useState<{ captured: number; universe: number; orphanCount: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hidrata do storage só depois da montagem (o servidor renderiza o seed — sem mismatch).
  useEffect(() => {
    const stored = loadConfig();
    setConfig(stored);
    setGroupId((current) => (stored.groups.some((group) => group.id === current) ? current : stored.groups[0]?.id ?? ""));
  }, []);

  const group: KeywordGroup | undefined = useMemo(
    () => config.groups.find((item) => item.id === groupId) ?? config.groups[0],
    [config, groupId],
  );
  const rule: KeywordRule | undefined = useMemo(
    () => group?.rules.find((item) => item.id === ruleId) ?? group?.rules[0],
    [group, ruleId],
  );

  const commit = useCallback(
    (next: KeywordConfig) => {
      setConfig(next);
      persist(next);
      onConfigChange?.(next);
    },
    [onConfigChange],
  );

  const patchRule = useCallback(
    (patch: Partial<KeywordRule>) => {
      if (!group || !rule) return;
      commit({
        ...config,
        groups: config.groups.map((item) =>
          item.id !== group.id
            ? item
            : { ...item, rules: item.rules.map((entry) => (entry.id === rule.id ? { ...entry, ...patch } : entry)) },
        ),
      });
    },
    [commit, config, group, rule],
  );

  // TESTE AO VIVO — o recall antes de salvar. Debounced contra o snapshot local.
  useEffect(() => {
    if (!rule) return;
    const errors = validateRule(rule);
    if (errors.length > 0) {
      setProbe({ ...EMPTY_PROBE, errors });
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    setProbe((current) => ({ ...current, loading: true }));
    timer.current = setTimeout(() => {
      fetch("/api/keywords", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "rule", rule, sampleSize: 8 }),
      })
        .then((response) => (response.ok ? response.json() : Promise.reject(new Error("probe falhou"))))
        .then((data) => setProbe({ loading: false, ...data }))
        .catch(() => setProbe({ ...EMPTY_PROBE, errors: ["Não foi possível testar agora — snapshot indisponível."] }));
    }, DEBOUNCE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [rule]);

  // Cobertura do perfil inteiro — o número que diz se o motor está deixando edital escapar.
  useEffect(() => {
    fetch("/api/keywords", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mode: "profile", config }),
    })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("cobertura falhou"))))
      .then((data) => setCoverage({ captured: data.captured, universe: data.universe, orphanCount: data.orphanCount }))
      .catch(() => setCoverage(null));
  }, [config]);

  const addRule = () => {
    if (!group) return;
    const next = emptyRule(`r-${Date.now().toString(36)}`);
    commit({
      ...config,
      groups: config.groups.map((item) => (item.id === group.id ? { ...item, rules: [...item.rules, next] } : item)),
    });
    setRuleId(next.id);
  };

  const removeRule = (target: KeywordRule) => {
    if (!group) return;
    commit({
      ...config,
      groups: config.groups.map((item) =>
        item.id === group.id ? { ...item, rules: item.rules.filter((entry) => entry.id !== target.id) } : item,
      ),
    });
  };

  const resetSeed = () => {
    const seed = seedConfig as unknown as KeywordConfig;
    commit(seed);
    setGroupId(seed.groups[0]?.id ?? "");
    setRuleId(seed.groups[0]?.rules[0]?.id ?? "");
  };

  const coveragePct = coverage && coverage.universe > 0 ? Math.round((coverage.captured / coverage.universe) * 100) : null;

  return (
    <section className="kw-studio" aria-label="Motor de palavras-chave">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Motor de captura</p>
          <h2>Palavras-chave — teste antes de valer</h2>
        </div>
        <button type="button" onClick={resetSeed} title="Voltar aos grupos calibrados de fábrica">
          Restaurar seed
        </button>
      </div>

      {coverage ? (
        <p className="kw-coverage" aria-live="polite">
          Este perfil captura <strong>{coverage.captured}</strong> dos <strong>{coverage.universe}</strong> editais do
          radar ({coveragePct}%) · <strong>{coverage.orphanCount}</strong> ficam de fora.{" "}
          <span className="kw-hint-inline">O que fica de fora não é necessariamente perda — a maioria não é obra.</span>
        </p>
      ) : null}

      <div className="kw-grid">
        {/* ---- coluna esquerda: grupos e regras ---- */}
        <div className="kw-rules">
          <div className="kw-field">
            <label>
              <span>Grupo de palavras-chave</span>
              <select value={group?.id ?? ""} onChange={(event) => setGroupId(event.target.value)}>
                {config.groups.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.rules.length})
                  </option>
                ))}
              </select>
            </label>
            {group?.note ? <p className="kw-hint">{group.note}</p> : null}
          </div>

          <ul className="kw-rule-list">
            {group?.rules.map((item) => (
              <li key={item.id} className={item.id === rule?.id ? "selected" : ""}>
                <button type="button" className="kw-rule-pick" onClick={() => setRuleId(item.id)}>
                  <strong>{item.term || "(sem termo)"}</strong>
                  <small>
                    {item.complementares.length > 0
                      ? `${item.complementarMode === "todas" ? "E" : "OU"} ${item.complementares.length}`
                      : "sem refino"}
                    {item.indesejadas.length > 0 ? ` · NÃO ${item.indesejadas.length}` : ""}
                  </small>
                </button>
                <button
                  type="button"
                  className={`kw-toggle ${item.enabled ? "on" : "off"}`}
                  aria-pressed={item.enabled}
                  title={item.enabled ? "Desligar regra" : "Ligar regra"}
                  onClick={() => {
                    if (!group) return;
                    commit({
                      ...config,
                      groups: config.groups.map((entry) =>
                        entry.id !== group.id
                          ? entry
                          : {
                              ...entry,
                              rules: entry.rules.map((r) => (r.id === item.id ? { ...r, enabled: !r.enabled } : r)),
                            },
                      ),
                    });
                  }}
                >
                  {item.enabled ? "On" : "Off"}
                </button>
                <button type="button" className="kw-remove" onClick={() => removeRule(item)} aria-label={`Excluir ${item.term}`}>
                  ×
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="kw-add" onClick={addRule}>
            + Nova palavra-chave
          </button>
        </div>

        {/* ---- coluna do meio: o editor da regra ---- */}
        <div className="kw-editor">
          {rule ? (
            <>
              <div className="kw-field">
                <label>
                  <span>Palavra-chave</span>
                  <input
                    value={rule.term}
                    placeholder="ex.: pavimentação"
                    onChange={(event) => patchRule({ term: event.target.value })}
                  />
                </label>
                <p className="kw-hint">
                  A busca já cobre <strong>acento, caixa, singular/plural e gênero</strong> — "obra" pega "OBRAS",
                  "asfáltico" pega "asfálticas". Casa por palavra inteira, nunca por pedaço.
                </p>
              </div>

              <TermChips
                label="Palavras complementares"
                hint={
                  rule.complementarMode === "todas"
                    ? "Modo E: o edital precisa ter TODAS estas, além da principal."
                    : "Modo OU: basta UMA delas aparecer junto da principal."
                }
                tone="complementar"
                values={rule.complementares}
                onChange={(complementares) => patchRule({ complementares })}
              />

              {rule.complementares.length > 0 ? (
                <div className="kw-field">
                  <label>
                    <span>Como combinar as complementares</span>
                    <select
                      value={rule.complementarMode}
                      onChange={(event) => patchRule({ complementarMode: event.target.value as KeywordRule["complementarMode"] })}
                    >
                      <option value="todas">Todas (E) — mais preciso</option>
                      <option value="qualquer">Qualquer uma (OU) — mais abrangente</option>
                    </select>
                  </label>
                </div>
              ) : null}

              <TermChips
                label="Palavras indesejadas"
                hint="Qualquer uma que apareça descarta o edital. Use expressão inteira quando puder — 'material de construção' é cirúrgico, 'aquisição' é grosso."
                tone="indesejada"
                values={rule.indesejadas}
                onChange={(indesejadas) => patchRule({ indesejadas })}
              />

              {rule.note ? <p className="kw-note">📌 {rule.note}</p> : null}
            </>
          ) : (
            <p className="kw-hint">Selecione ou crie uma palavra-chave.</p>
          )}
        </div>

        {/* ---- coluna direita: o teste ao vivo ---- */}
        <div className="kw-probe" aria-live="polite">
          <div className="panel-heading">
            <p className="eyebrow">Teste ao vivo</p>
            <h3>
              {probe.loading ? "…" : probe.total}{" "}
              <small>
                {probe.total === 1 ? "edital capturado" : "editais capturados"}
                {probe.universe > 0 ? ` de ${probe.universe}` : ""}
              </small>
            </h3>
          </div>

          {probe.errors.length > 0 ? (
            <ul className="kw-errors">
              {probe.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          ) : null}

          {probe.blocked > 0 || probe.missedByComplementar > 0 ? (
            <p className="kw-probe-breakdown">
              {probe.blocked > 0 ? (
                <span>
                  <strong>{probe.blocked}</strong> descartados por palavra indesejada
                </span>
              ) : null}
              {probe.blocked > 0 && probe.missedByComplementar > 0 ? " · " : ""}
              {probe.missedByComplementar > 0 ? (
                <span>
                  <strong>{probe.missedByComplementar}</strong> têm a principal mas falham no refino
                </span>
              ) : null}
            </p>
          ) : null}

          {probe.total === 0 && probe.errors.length === 0 && !probe.loading ? (
            <p className="kw-empty">
              Nenhum edital do radar casaria com esta regra.
              {probe.firstBlockReason ? ` Motivo do primeiro descarte: ${probe.firstBlockReason}` : ""}
            </p>
          ) : null}

          {probe.sample.map((row) => (
            <article className="kw-sample" key={row.id}>
              <HighlightedText text={row.text} hits={row.hits} />
              <small>
                {[row.meta.buyer, row.meta.city && row.meta.uf ? `${row.meta.city}/${row.meta.uf}` : null]
                  .filter(Boolean)
                  .join(" · ")}
              </small>
            </article>
          ))}

          {probe.total > probe.sample.length ? (
            <p className="kw-hint">mostrando {probe.sample.length} de {probe.total} — refine para inspecionar o resto</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
