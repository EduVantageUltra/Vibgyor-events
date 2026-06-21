"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "en" | "hi";

const DICT: Record<string, { en: string; hi: string }> = {
  shop: { en: "Shop", hi: "दुकान" },
  home: { en: "Home", hi: "होम" },
  cart: { en: "Your bag", hi: "आपका बैग" },
  empty: { en: "Your bag is empty.", hi: "आपका बैग खाली है।" },
  browse: { en: "Browse the shop", hi: "दुकान देखें" },
  checkout: { en: "Checkout", hi: "चेकआउट" },
  viewBag: { en: "View full bag", hi: "पूरा बैग देखें" },
  subtotal: { en: "Subtotal", hi: "कुल" },
  addToBag: { en: "Add to bag", hi: "बैग में डालें" },
  buyNow: { en: "Buy now", hi: "अभी खरीदें" },
  orderWhatsapp: { en: "Order on WhatsApp", hi: "व्हाट्सएप पर ऑर्डर करें" },
  freeShip: { en: "more for free shipping", hi: "और जोड़ें मुफ़्त शिपिंग के लिए" },
};

type LangState = { lang: Lang; set: (l: Lang) => void };

export const useLang = create<LangState>()(
  persist((set) => ({ lang: "en", set: (l) => set({ lang: l }) }), { name: "rajrishi-lang" })
);

/** Hook returning a translator t(key) for the active language. */
export function useT() {
  const lang = useLang((s) => s.lang);
  return (key: string) => DICT[key]?.[lang] ?? DICT[key]?.en ?? key;
}
