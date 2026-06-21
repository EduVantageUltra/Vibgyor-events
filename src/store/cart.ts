"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  color?: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string, color?: string) => void;
  setQty: (id: string, color: string | undefined, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const key = (id: string, color?: string) => `${id}::${color ?? ""}`;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      add: (item, qty = 1) =>
        set((s) => {
          const k = key(item.id, item.color);
          const existing = s.items.find((i) => key(i.id, i.color) === k);
          if (existing) {
            return {
              items: s.items.map((i) =>
                key(i.id, i.color) === k ? { ...i, qty: i.qty + qty } : i
              ),
              isOpen: true,
            };
          }
          return { items: [...s.items, { ...item, qty }], isOpen: true };
        }),
      remove: (id, color) =>
        set((s) => ({
          items: s.items.filter((i) => key(i.id, i.color) !== key(id, color)),
        })),
      setQty: (id, color, qty) =>
        set((s) => ({
          items: s.items
            .map((i) =>
              key(i.id, i.color) === key(id, color) ? { ...i, qty: Math.max(0, qty) } : i
            )
            .filter((i) => i.qty > 0),
        })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    { name: "rajrishi-cart" }
  )
);

export const cartCount = (items: CartItem[]) =>
  items.reduce((n, i) => n + i.qty, 0);
export const cartTotal = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.price * i.qty, 0);
