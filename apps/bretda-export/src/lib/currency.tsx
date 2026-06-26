"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type Currency = "usd" | "eur";

const Ctx = createContext<{ cur: Currency; setCur: (c: Currency) => void }>({
  cur: "usd",
  setCur: () => {},
});

export function CurrencyProvider({
  initial,
  children,
}: {
  initial: Currency;
  children: React.ReactNode;
}) {
  const [cur, setCurState] = useState<Currency>(initial);
  useEffect(() => {
    const m = document.cookie.match(/bretda_cur=(usd|eur)/);
    if (m) setCurState(m[1] as Currency);
  }, []);
  const setCur = (c: Currency) => {
    setCurState(c);
    document.cookie = `bretda_cur=${c};path=/;max-age=31536000`;
  };
  return <Ctx.Provider value={{ cur, setCur }}>{children}</Ctx.Provider>;
}

export const useCurrency = () => useContext(Ctx);
