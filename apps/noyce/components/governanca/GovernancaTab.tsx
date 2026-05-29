import { portalAccess } from "@/lib/noyce-data";
import { buildReadinessReport } from "@/lib/noyce-readiness";
import { sourceClass, sourceLabel } from "@/lib/noyce-operational";

export function GovernancaTab() {
  const readiness = buildReadinessReport();

  return (
    <section className="area area-governanca">
      <section className="portal-matrix" aria-labelledby="portal-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Onboarding ENIAC</p>
            <h2 id="portal-title">Portais confirmados</h2>
          </div>
          <span>Credenciais somente via vault</span>
        </div>

        <div className="portal-grid">
          {portalAccess.map((portal) => (
            <div className="portal" key={portal.source}>
              <span className={`source source-${sourceClass(portal.source)}`}>{sourceLabel(portal.source)}</span>
              <strong>{portal.name}</strong>
              <p>{portal.requiresLogin ? "Login pendente" : "Consulta pública"}</p>
              <small>ToS: {portal.tosStatus} · 2FA: {portal.requires2fa}</small>
              {portal.portalUrl ? (
                <a className="portal-link" href={portal.portalUrl} rel="noreferrer" target="_blank">
                  Abrir portal
                </a>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="readiness-matrix" aria-labelledby="readiness-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Fases 6-10</p>
            <h2 id="readiness-title">Readiness do piloto</h2>
          </div>
          <span>{readiness.validation.ok ? "offline PASS" : "revisar gates"}</span>
        </div>

        <div className="readiness-grid">
          {Object.entries(readiness.phases).map(([phase, status]) => (
            <div className={`readiness-card ${status}`} key={phase}>
              <span>{phase.toUpperCase()}</span>
              <strong>{status}</strong>
            </div>
          ))}
        </div>

        <div className="morning-grid">
          <div className="morning-panel">
            <h3>Bloqueios para amanhã</h3>
            {readiness.humanBlockers.map((blocker) => (
              <div className="morning-row" key={blocker.id}>
                <strong>{blocker.label}</strong>
                <p>{blocker.reason}</p>
                <span>{blocker.requiredFrom}</span>
              </div>
            ))}
          </div>

          <div className="morning-panel">
            <h3>Jobs liberados em dry-run</h3>
            {readiness.jobs.map((job) => (
              <div className="morning-row" key={job.id}>
                <strong>{job.label}</strong>
                <p>{job.idempotencyKey}</p>
                <span>{job.mode}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
