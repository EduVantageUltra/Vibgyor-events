"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const CURRENCIES: Record<string, { symbol: string; rate: number; locale: string }> = {
  INR: { symbol: "₹", rate: 1, locale: "en-IN" },
  USD: { symbol: "$", rate: 0.012, locale: "en-US" },
  EUR: { symbol: "€", rate: 0.011, locale: "de-DE" },
  GBP: { symbol: "£", rate: 0.0095, locale: "en-GB" },
  AED: { symbol: "AED ", rate: 0.044, locale: "en-AE" },
};

type CurrencyState = { currency: string; set: (c: string) => void };

export const useCurrency = create<CurrencyState>()(
  persist((set) => ({ currency: "INR", set: (c) => set({ currency: c }) }), { name: "rajrishi-currency" })
);

/** Hook returning a price formatter for the active currency (converts from INR). */
export function useFormatPrice() {
  const currency = useCurrency((s) => s.currency);
  const c = CURRENCIES[currency] ?? CURRENCIES.INR;
  return (inr: number) => `${c.symbol}${Math.round(inr * c.rate).toLocaleString(c.locale)}`;
}
