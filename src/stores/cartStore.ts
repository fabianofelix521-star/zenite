import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, ProductColor } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (
    product: Product,
    size: string,
    color: ProductColor,
    quantity?: number,
  ) => void;
  removeItem: (productId: string, size: string, colorName: string) => void;
  updateQuantity: (
    productId: string,
    size: string,
    colorName: string,
    quantity: number,
  ) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, size, color, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.selectedSize === size &&
              item.selectedColor.name === color.name,
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity,
            };
            return { items: updated };
          }

          return {
            items: [
              ...state.items,
              { product, quantity, selectedSize: size, selectedColor: color },
            ],
          };
        });
      },

      removeItem: (productId, size, colorName) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                item.selectedSize === size &&
                item.selectedColor.name === colorName
              ),
          ),
        }));
      },

      updateQuantity: (productId, size, colorName, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor.name === colorName
              ? { ...item, quantity }
              : item,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        ),
    }),
    { name: "zenite-cart" },
  ),
);
