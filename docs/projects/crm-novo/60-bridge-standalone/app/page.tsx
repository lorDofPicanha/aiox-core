export default function HomePage() {
  return (
    <main style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>CRM Bridge Standalone</h1>
      <p style={{ marginBottom: 24, color: '#444' }}>
        Meta CAPI + Google Ads offline conversion bridge — Week 0 standalone.
      </p>

      <h2 style={{ fontSize: 20, marginBottom: 8 }}>Endpoints</h2>
      <ul style={{ marginBottom: 24, paddingLeft: 24 }}>
        <li>
          <code>POST /api/inngest</code> — Inngest webhook (não chamar manualmente)
        </li>
        <li>
          <code>POST /api/manual-trigger</code> — dispatch manual com Bearer token
        </li>
      </ul>

      <h2 style={{ fontSize: 20, marginBottom: 8 }}>Status</h2>
      <p>Bridge live. Veja:</p>
      <ul style={{ paddingLeft: 24 }}>
        <li>
          <a href="https://app.inngest.com" target="_blank" rel="noopener">
            Inngest Dashboard
          </a>{' '}
          — function runs + DLQ
        </li>
        <li>Supabase → tabelas <code>bridge_audit_log</code>, <code>bridge_dlq</code></li>
      </ul>
    </main>
  );
}
