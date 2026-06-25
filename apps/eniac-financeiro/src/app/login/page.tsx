import { MagicLinkForm } from "@/components/auth/magic-link-form";

export const metadata = {
  title: "Entrar — Livro Caixa ENIAC",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-border bg-surface p-7 shadow-sm">
        <div className="space-y-1.5 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">
            ₵
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Livro Caixa ENIAC</h1>
          <p className="text-sm text-muted-foreground">
            Suas entradas e saídas, na palma da mão.
          </p>
        </div>

        <MagicLinkForm />

        <p className="text-center text-xs text-muted-foreground">
          Enviamos um link de acesso para o seu email. Sem senha.
        </p>
      </div>
    </main>
  );
}
