import { LogOut } from "lucide-react";

/** Logout via form POST (CSRF-safe). Não precisa de JS no cliente. */
export function LogoutButton() {
  return (
    <form action="/api/auth/logout" method="post">
      <button
        type="submit"
        aria-label="Sair"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </form>
  );
}
