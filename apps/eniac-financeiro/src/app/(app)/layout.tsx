import { BottomNav } from "@/components/bottom-nav";

export const dynamic = "force-dynamic";

function ConfigPending() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center justify-center p-6">
      <div className="rounded-2xl border border-border bg-surface p-6 text-center">
        <h1 className="text-lg font-bold">Configuração pendente</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Defina <code>NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> no <code>.env.local</code> para iniciar.
        </p>
      </div>
    </main>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return <ConfigPending />;
  }

  return (
    <>
      <div className="mx-auto min-h-screen max-w-md">{children}</div>
      <BottomNav />
    </>
  );
}
