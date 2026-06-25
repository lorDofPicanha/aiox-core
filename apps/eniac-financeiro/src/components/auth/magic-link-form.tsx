"use client";

import { useActionState } from "react";
import { sendMagicLink, type AuthActionResult } from "@/app/login/actions";
import { Button } from "@/components/ui/button";

const INITIAL_STATE: AuthActionResult | null = null;

export function MagicLinkForm() {
  const [state, action, pending] = useActionState(sendMagicLink, INITIAL_STATE);

  return (
    <form action={action} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-muted-foreground">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="voce@empresa.com.br"
          className="h-12 rounded-xl border border-border bg-surface px-4 text-base text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
        />
      </label>

      {state?.status === "error" && (
        <p className="text-sm text-expense" role="alert">
          {state.message}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Enviando..." : "Entrar com link mágico"}
      </Button>
    </form>
  );
}
