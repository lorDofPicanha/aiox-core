type SearchParams = Promise<{ email?: string }>;

export const metadata = {
  title: "Verifique seu email — Livro Caixa ENIAC",
};

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { email } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-surface p-7 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-income-soft text-2xl">
          ✉️
        </div>
        <h1 className="text-xl font-bold tracking-tight">Verifique seu email</h1>
        <p className="text-sm text-muted-foreground">
          Enviamos um link de acesso{email ? <> para <strong className="text-foreground">{email}</strong></> : null}.
          Abra no celular e toque para entrar.
        </p>
      </div>
    </main>
  );
}
