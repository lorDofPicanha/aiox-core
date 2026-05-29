"use client";

import { useState } from "react";
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

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("mesa");
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(opportunities[0]?.id ?? "");

  const selectedOpportunity =
    opportunities.find((opportunity) => opportunity.id === selectedOpportunityId) ?? opportunities[0];

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

        {DETAIL_TABS.includes(activeTab) ? (
          <LifecycleBreadcrumb stage={selectedOpportunity.stage} active={activeTab} onJump={setActiveTab} />
        ) : null}

        {activeTab === "mesa" ? <MesaTab onOpen={openInTab} /> : null}
        {activeTab === "monitorar" ? (
          <MonitorarTab selectedId={selectedOpportunity.id} onSelect={(id) => openInTab(id, "analisar")} />
        ) : null}
        {activeTab === "analisar" ? <AnalisarTab opportunity={selectedOpportunity} /> : null}
        {activeTab === "habilitar" ? <HabilitarTab opportunity={selectedOpportunity} /> : null}
        {activeTab === "acompanhar" ? <AcompanharTab opportunity={selectedOpportunity} /> : null}
        {activeTab === "recorrer" ? <RecorrerTab opportunity={selectedOpportunity} /> : null}
        {activeTab === "governanca" ? <GovernancaTab /> : null}
      </section>
    </main>
  );
}
