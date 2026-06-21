"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishState = { ids: string[]; toggle: (id: string) => void };

export const useWishlist = create<WishState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) => set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id] })),
    }),
    { name: "rajrishi-wishlist" }
  )
);
