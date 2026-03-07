import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
    id: string; // Product _id combined with size and color for unique cart entry
    productId: string;
    title: string;
    price: number;
    image: string;
    size: string;
    color: string;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getSubtotal: () => number;
    isCartOpen: boolean;
    setCartOpen: (isOpen: boolean) => void;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isCartOpen: false,

            addItem: (newItem) => {
                set((state) => {
                    const existingItemIndex = state.items.findIndex((i) => i.id === newItem.id);

                    if (existingItemIndex >= 0) {
                        const updatedItems = [...state.items];
                        updatedItems[existingItemIndex].quantity += newItem.quantity;
                        return { items: updatedItems, isCartOpen: true };
                    }

                    return { items: [...state.items, newItem], isCartOpen: true };
                });
            },

            removeItem: (id) => {
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                }));
            },

            updateQuantity: (id, quantity) => {
                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
                    ),
                }));
            },

            clearCart: () => set({ items: [] }),

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getSubtotal: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
            },

            setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
        }),
        {
            name: "viraasat-cart",
            // Exclude UI state from being persisted to localStorage
            partialize: (state) => ({ items: state.items }),
        }
    )
);
