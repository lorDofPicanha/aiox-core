"use client";

import { useEffect, useState } from "react";
import { opportunities, portalAccess } from "@/lib/noyce-data";
import { Rail, type RailBadge } from "@/components/shell/Rail";
import { LifecycleBreadcrumb } from "@/components/shell/LifecycleBreadcrumb";
import { TABS, type TabId } from "@/components/shell/tabs";
import { MesaTab } from "@/components/mesa/MesaTab";
import { MonitorarTab } from "@/components/monitorar/MonitorarTab";
import { AnalisarTab } from "@/components/analisar/AnalisarTab";
import { HabilitarTab } from "@/components/habilitar/HabilitarTab";
import { AcompanharTab } from "@/components/acompanhar/AcompanharTab";
import { RecorrerTab } from "@/components/recorrer/RecorrerTab";
import { GovernancaTab } from "@/components/governanca/GovernancaTab";

// Detail tabs work on the selected opportunity; Mesa/Monitorar/Governança are list/overview.
const DETAIL_TABS: TabId[] = ["analisar", "habilitar", "acompanhar", "recorrer"];

const INTEREST_KEY = "noyce.interesse.v1";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("mesa");
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(opportunities[0]?.id ?? "");
  // Oportunidades marcadas como "tenho interesse" (Monitorar) → entram no fluxo de revisão (Analisar).
  const [interested, setInterested] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const saved = JSON.parse(globalThis.localStorage?.getItem(INTEREST_KEY) ?? "[]");
      if (Array.isArray(saved)) setInterested(new Set(saved));
    } catch {
      /* estado limpo */
    }
  }, []);

  function toggleInterest(id: string) {
    setInterested((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      globalThis.localStorage?.setItem(INTEREST_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  // opportunities pode vir vazio (ex.: snapshot de discovery vazio) — sem guard, as abas de detalhe quebram o app inteiro.
  const selectedOpportunity =
    opportunities.find((opportunity) => opportunity.id === selectedOpportunityId) ?? opportunities[0] ?? null;

  const vaultPending = portalAccess.filter((portal) => portal.status === "aguarda_vault").length;
  const inDispute = opportunities.filter((opportunity) => opportunity.stage === "acompanhar").length;

  const badges: Partial<Record<TabId, RailBadge>> = {
    monitorar: { count: opportunities.length },
    acompanhar: { count: inDispute, urgent: inDispute > 0 },
    governanca: { count: vaultPending },
  };

  const activeDef = TABS.find((tab) => tab.id === activeTab) ?? TABS[0];

  function openInTab(id: string, tab: TabId) {
    setSelectedOpportunityId(id);
    setActiveTab(tab);
  }

  return (
    <main className="shell">
      <Rail active={activeTab} onSelect={setActiveTab} badges={badges} vaultPending={vaultPending} />

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">{activeDef.responsibility}</p>
            <h1>{activeDef.label}</h1>
          </div>
          <div className="status-strip" aria-label="Sprint status">
            <span>Fixtures: {opportunities.length}</span>
            <span>Automação: bloqueada</span>
          </div>
        </header>

        {selectedOpportunity === null && activeTab !== "mesa" && activeTab !== "governanca" ? (
          <div className="empty-state" role="status">
            <h2>Nenhuma oportunidade carregada</h2>
            <p>
              O snapshot de discovery está vazio. Rode{" "}
              <code>node --experimental-strip-types scripts/noyce/build-discovery-snapshot.mjs</code> de um IP com
              acesso ao PNCP (ou restaure o snapshot anterior) e recarregue.
            </p>
          </div>
        ) : (
          <>
            {DETAIL_TABS.includes(activeTab) && selectedOpportunity ? (
              <LifecycleBreadcrumb stage={selectedOpportunity.stage} active={activeTab} onJump={setActiveTab} />
            ) : null}

            {activeTab === "mesa" ? <MesaTab onOpen={openInTab} /> : null}
            {activeTab === "monitorar" && selectedOpportunity ? (
              <MonitorarTab
                selectedId={selectedOpportunity.id}
                onSelect={(id) => openInTab(id, "analisar")}
                interested={interested}
                onToggleInterest={toggleInterest}
              />
            ) : null}
            {activeTab === "analisar" && selectedOpportunity ? (
              <AnalisarTab
                opportunity={selectedOpportunity}
                interested={interested.has(selectedOpportunity.id)}
                onToggleInterest={() => toggleInterest(selectedOpportunity.id)}
              />
            ) : null}
            {activeTab === "habilitar" && selectedOpportunity ? <HabilitarTab opportunity={selectedOpportunity} /> : null}
            {activeTab === "acompanhar" && selectedOpportunity ? <AcompanharTab opportunity={selectedOpportunity} /> : null}
            {activeTab === "recorrer" && selectedOpportunity ? <RecorrerTab opportunity={selectedOpportunity} /> : null}
            {activeTab === "governanca" ? <GovernancaTab /> : null}
          </>
        )}
      </section>
    </main>
  );
}
