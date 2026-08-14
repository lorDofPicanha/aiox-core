import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import {
  captureText,
  probeRule,
  validateRule,
  type KeywordConfig,
  type KeywordRule,
  type ProbeTarget,
} from "@/lib/noyce-keywords";
import seedConfig from "@/lib/data/keyword-groups.json";

export const dynamic = "force-dynamic";

const SNAPSHOT_PATH = path.join(process.cwd(), "lib", "data", "discovery-snapshot.json");

interface SnapshotItem {
  id: string;
  title: string;
  buyer?: string;
  city?: string;
  uf?: string;
  proposalDeadline?: string | null;
  estimatedValue?: number | null;
}

/**
 * O universo de teste é o snapshot de discovery em disco — o mesmo dado real que alimenta
 * a Monitorar. É isso que torna o teste de palavra-chave instantâneo e honesto: nenhuma
 * chamada de API, nenhum dado sintético, e o denominador é o que o robô realmente viu.
 */
async function loadTargets(): Promise<{ targets: ProbeTarget[]; generatedAt: string | null }> {
  const snapshot = JSON.parse(await readFile(SNAPSHOT_PATH, "utf8")) as {
    items: SnapshotItem[];
    generatedAt?: string;
  };
  const targets = snapshot.items.map((item) => ({
    id: item.id,
    text: item.title,
    meta: {
      buyer: item.buyer ?? null,
      city: item.city ?? null,
      uf: item.uf ?? null,
      proposalDeadline: item.proposalDeadline ?? null,
      estimatedValue: item.estimatedValue ?? null,
    },
  }));
  return { targets, generatedAt: snapshot.generatedAt ?? null };
}

/** Config semeada + tamanho do universo, para a UI abrir já calibrada. */
export async function GET() {
  try {
    const { targets, generatedAt } = await loadTargets();
    return NextResponse.json(
      { config: seedConfig as unknown as KeywordConfig, universe: targets.length, generatedAt },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ error: "Snapshot de discovery indisponível." }, { status: 503 });
  }
}

interface ProbeBody {
  mode?: "rule" | "profile";
  rule?: KeywordRule;
  config?: KeywordConfig;
  sampleSize?: number;
}

/**
 * POST — dois modos:
 *   mode=rule    (padrão) testa UMA regra e devolve recall + amostra destacada.
 *   mode=profile testa a configuração inteira e devolve cobertura + órfãos.
 */
export async function POST(request: Request) {
  let body: ProbeBody;
  try {
    body = (await request.json()) as ProbeBody;
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  let targets: ProbeTarget[];
  try {
    ({ targets } = await loadTargets());
  } catch {
    return NextResponse.json({ error: "Snapshot de discovery indisponível." }, { status: 503 });
  }

  if (body.mode === "profile") {
    const config = body.config ?? (seedConfig as unknown as KeywordConfig);
    let captured = 0;
    const byGroup: Record<string, number> = {};
    const orphans: Array<{ id: string; text: string }> = [];
    for (const target of targets) {
      const result = captureText(target.text, config);
      if (result.primary) {
        captured++;
        byGroup[result.primary.groupName] = (byGroup[result.primary.groupName] ?? 0) + 1;
      } else if (orphans.length < 25) {
        orphans.push({ id: target.id, text: target.text });
      }
    }
    return NextResponse.json({
      universe: targets.length,
      captured,
      orphanCount: targets.length - captured,
      byGroup,
      orphanSample: orphans,
    });
  }

  const rule = body.rule;
  if (!rule || typeof rule.term !== "string") {
    return NextResponse.json({ error: "Regra ausente." }, { status: 400 });
  }
  const errors = validateRule(rule);
  if (errors.length > 0) {
    return NextResponse.json({ errors, total: 0, blocked: 0, missedByComplementar: 0, universe: targets.length, sample: [], firstBlockReason: null });
  }

  const sampleSize = Math.min(Math.max(body.sampleSize ?? 12, 1), 50);
  return NextResponse.json({ errors: [], ...probeRule(rule, targets, sampleSize) });
}
