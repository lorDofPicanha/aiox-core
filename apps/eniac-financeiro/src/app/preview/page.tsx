import { notFound } from "next/navigation";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

import { CompanySwitcher } from "@/components/company-switcher";
import { BalanceCard } from "@/components/balance-card";
import { AlertsStrip } from "@/components/alerts-strip";
import { MonthNav } from "@/components/month-nav";
import { EntryList } from "@/components/entry-list";
import { QuickAddSheet } from "@/components/quick-add-sheet";
import { ReportView } from "@/components/report-view";
import { ScheduledManager } from "@/components/scheduled-manager";
import { ForecastView } from "@/components/forecast-view";
import { AssistantChat } from "@/components/assistant-chat";
import { BottomNav } from "@/components/bottom-nav";

import { computeAlerts } from "@/lib/alerts";
import { computeForecast } from "@/lib/forecast";
import { formatBRL } from "@/lib/money";
import { monthLabel } from "@/lib/dates";
import type { Company, Entry, MonthSummary } from "@/lib/data";
import type { Scheduled, ScheduledTotals } from "@/lib/scheduled";

/**
 * Vitrine visual (dev-only) — renderiza os componentes REAIS com dados-semente,
 * sem Supabase nem auth. Serve só para revisar a direção de design rodando.
 * Interações que gravam (salvar, trocar empresa) não persistem aqui.
 */

const COMPANIES: Company[] = [
  { id: "co-obras", name: "ENIAC · Obras" },
  { id: "co-incorp", name: "ENIAC · Incorporadora" },
  { id: "co-serv", name: "ENIAC · Serviços" },
];

const SUMMARY: MonthSummary = { balance: 148920, totalIn: 92400, totalOut: 61180 };

const ENTRIES: Entry[] = [
  { id: "e1", company_id: "co-obras", entry_date: "2026-07-02", type: "in", amount: 42000, category: "Recebimentos", description: "Medição — Residencial Aurora", created_at: "2026-07-02T12:00:00Z" },
  { id: "e2", company_id: "co-obras", entry_date: "2026-07-02", type: "out", amount: 8740, category: "Fornecedores", description: "Cimento e vergalhão", created_at: "2026-07-02T10:00:00Z" },
  { id: "e3", company_id: "co-obras", entry_date: "2026-07-01", type: "out", amount: 23500, category: "Salários", description: "Folha da equipe de obra", created_at: "2026-07-01T09:00:00Z" },
  { id: "e4", company_id: "co-obras", entry_date: "2026-07-01", type: "in", amount: 6500, category: "Serviços", description: "Projeto estrutural", created_at: "2026-07-01T08:00:00Z" },
  { id: "e5", company_id: "co-obras", entry_date: "2026-07-01", type: "out", amount: 4200, category: "Aluguel", description: "Galpão", created_at: "2026-07-01T07:00:00Z" },
];

const SCHEDULED: Scheduled[] = [
  { id: "s1", company_id: "co-obras", direction: "payable", description: "Boleto areia/brita", category: "Fornecedores", amount: 3200, due_date: "2026-06-28", status: "open", paid_at: null },
  { id: "s2", company_id: "co-obras", direction: "payable", description: "DAS competência 06", category: "Impostos", amount: 4180, due_date: "2026-07-05", status: "open", paid_at: null },
  { id: "s3", company_id: "co-obras", direction: "receivable", description: "Medição parcial — obra B", category: "Recebimentos", amount: 15000, due_date: "2026-07-08", status: "open", paid_at: null },
  { id: "s4", company_id: "co-obras", direction: "payable", description: "Aluguel do galpão — julho", category: "Aluguel", amount: 8400, due_date: "2026-07-20", status: "open", paid_at: null },
];

const TOTALS: ScheduledTotals = { toReceive: 15000, toPay: 15780 };

const YEAR = 2026;
const MONTH = 7;

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter((p) => p !== "·");
  if (parts.length === 0) return "–";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Screen({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="mx-auto max-w-md rounded-[28px] border border-border bg-background p-4 shadow-sm">
        {children}
      </div>
    </section>
  );
}

export default function PreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const alerts = computeAlerts(SUMMARY.balance, SCHEDULED);
  const forecast = computeForecast(SUMMARY.balance, SCHEDULED);
  const groupTotal = COMPANIES.reduce(
    (acc, _c, i) => {
      // números-semente por empresa só para a vitrine do consolidado
      const s = [SUMMARY, { balance: 61230, totalIn: 40100, totalOut: 22800 }, { balance: 28450, totalIn: 18900, totalOut: 15300 }][i];
      return { balance: acc.balance + s.balance, totalIn: acc.totalIn + s.totalIn, totalOut: acc.totalOut + s.totalOut };
    },
    { balance: 0, totalIn: 0, totalOut: 0 },
  );
  const perCompany = [SUMMARY, { balance: 61230, totalIn: 40100, totalOut: 22800 }, { balance: 28450, totalIn: 18900, totalOut: 15300 }];

  return (
    <div className="min-h-screen px-4 pb-28 pt-6">
      <header className="mx-auto mb-8 max-w-md text-center">
        <h1 className="text-xl font-bold">Livro Caixa ENIAC — vitrine de design</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Componentes reais com dados de exemplo. Toque no <b className="text-foreground">+</b> para abrir a folha
          de lançar. Salvar/editar não persiste aqui (sem banco).
        </p>
      </header>

      {/* Início */}
      <Screen title="Início">
        <div className="mb-4">
          <CompanySwitcher companies={COMPANIES} selectedId="co-obras" />
        </div>
        <div className="mb-4">
          <BalanceCard summary={SUMMARY} monthName={monthLabel(YEAR, MONTH)} />
        </div>
        <AlertsStrip alerts={alerts} />
        <div className="mb-3">
          <MonthNav year={YEAR} month={MONTH} />
        </div>
        <EntryList entries={ENTRIES} />
      </Screen>

      {/* Relatórios */}
      <Screen title="Relatórios">
        <ReportView entries={ENTRIES} summary={SUMMARY} monthName={monthLabel(YEAR, MONTH)} companyName="ENIAC · Obras" />
      </Screen>

      {/* Vencimentos */}
      <Screen title="Vencimentos">
        <ScheduledManager companyId="co-obras" items={SCHEDULED} totals={TOTALS} />
      </Screen>

      {/* Previsão */}
      <Screen title="Previsão de caixa">
        <ForecastView forecast={forecast} />
      </Screen>

      {/* Consolidado */}
      <Screen title="Consolidado do grupo">
        <section className="hero-ink mb-5 rounded-[22px] p-5 text-primary-foreground shadow-lg shadow-primary/25">
          <p className="text-sm font-medium text-white/60">Saldo somado ({COMPANIES.length} empresas)</p>
          <p className="tnum mt-1 text-3xl font-bold tracking-tight">{formatBRL(groupTotal.balance)}</p>
          <div className="mt-4 flex gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-white/72">
              <span className="flex h-4 w-4 items-center justify-center rounded-md bg-income/20 text-income">
                <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
              </span>
              <span className="tnum">{formatBRL(groupTotal.totalIn)}</span>
            </span>
            <span className="flex items-center gap-1.5 text-white/72">
              <span className="flex h-4 w-4 items-center justify-center rounded-md bg-expense/25 text-expense">
                <ArrowDownLeft className="h-3 w-3" strokeWidth={2.5} />
              </span>
              <span className="tnum">{formatBRL(groupTotal.totalOut)}</span>
            </span>
          </div>
          <p className="mt-2 text-xs capitalize text-white/50">{monthLabel(YEAR, MONTH)}</p>
        </section>
        <div className="space-y-2">
          {COMPANIES.map((company, i) => (
            <div key={company.id} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-xs font-bold text-foreground">
                {initials(company.name)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold">{company.name}</span>
                  <span className="tnum shrink-0 text-sm font-bold">{formatBRL(perCompany[i].balance)}</span>
                </div>
                <div className="mt-1 flex gap-3 text-xs">
                  <span className="tnum text-income">+{formatBRL(perCompany[i].totalIn)}</span>
                  <span className="tnum text-expense">−{formatBRL(perCompany[i].totalOut)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Screen>

      {/* Copiloto */}
      <Screen title="Copiloto (assistente)">
        <AssistantChat companyId="co-obras" />
      </Screen>

      {/* FAB (folha de lançar) + nav — flutuam sobre a página */}
      <QuickAddSheet companyId="co-obras" />
      <BottomNav />
    </div>
  );
}
