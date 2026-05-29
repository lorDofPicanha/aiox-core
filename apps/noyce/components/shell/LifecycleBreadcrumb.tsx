import { stageToTab, type TabId } from "@/components/shell/tabs";

const STEPS: Array<{ tab: TabId; label: string }> = [
  { tab: "monitorar", label: "Monitorar" },
  { tab: "analisar", label: "Analisar" },
  { tab: "habilitar", label: "Habilitar" },
  { tab: "acompanhar", label: "Acompanhar" },
  { tab: "recorrer", label: "Recorrer" },
];

// Shows where the selected opportunity is in its lifecycle and lets the operator jump
// the same opportunity into another stage's tab without losing context.
export function LifecycleBreadcrumb({
  stage,
  active,
  onJump,
}: {
  stage: string;
  active: TabId;
  onJump: (tab: TabId) => void;
}) {
  const currentTab = stageToTab(stage);
  return (
    <nav className="lifecycle" aria-label="Ciclo de vida da oportunidade">
      {STEPS.map((step, index) => {
        const state = step.tab === currentTab ? "current" : step.tab === active ? "viewing" : "";
        return (
          <button className={`lifecycle-step ${state}`} key={step.tab} onClick={() => onJump(step.tab)} type="button">
            <span className="lifecycle-num">{index + 1}</span>
            {step.label}
          </button>
        );
      })}
    </nav>
  );
}
