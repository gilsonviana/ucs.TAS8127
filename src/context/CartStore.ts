"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  productId: number;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: number) => void;
  increment: (productId: number) => void;
  decrement: (productId: number) => void;
  clear: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem(item) {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },

      removeItem(productId) {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      increment(productId) {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }));
      },

      decrement(productId) {
        set((state) => ({
          items: state.items
            .map((i) =>
              i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i
            )
            .filter((i) => i.quantity > 0),
        }));
      },

      clear() {
        set({ items: [] });
      },

      totalItems() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      totalPrice() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },
    }),
    { name: "ts_cart" }
  )
);
