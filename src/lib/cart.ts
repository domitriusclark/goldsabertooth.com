import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Cart } from './types';
import { createCart, addToCart, updateCartLines, removeCartLines } from './shopify';

interface CartStore {
  // State
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  isOpen: boolean;

  // Actions
  init: () => Promise<void>;
  add: (variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  remove: (lineId: string) => Promise<void>;
  clear: () => void;
  clearError: () => void;
  
  // UI Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}


export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      cart: null,
      isLoading: false,
      error: null,
      isOpen: false,

      // Initialize cart - create if doesn't exist
      init: async () => {
        const { cart } = get();
        
        if (cart) {
          return; // Cart already exists
        }

        set({ isLoading: true, error: null });

        try {
          const newCart = await createCart();
          set({ cart: newCart, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create cart';
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          console.error('Failed to initialize cart:', error);
        }
      },

      // Add item to cart
      add: async (variantId: string, quantity: number = 1) => {
        let { cart } = get();
        console.log('🛒 ADD TO CART - Starting with cart:', cart);
        console.log('🛒 ADD TO CART - variantId:', variantId, 'quantity:', quantity);

        set({ isLoading: true, error: null });

        try {
          // Create cart if it doesn't exist
          if (!cart) {
            cart = await createCart();
            set({ cart });
          }

          // Add item to cart
          const updatedCart = await addToCart(cart.id, variantId, quantity);
          
          set({ 
            cart: updatedCart, 
            isLoading: false
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart';
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
        }
      },

      // Update item quantity
      updateQuantity: async (lineId: string, quantity: number) => {
        const { cart } = get();
        if (!cart) return;

        set({ isLoading: true, error: null });

        try {
          const updatedCart = await updateCartLines(cart.id, [{ id: lineId, quantity }]);
          set({ 
            cart: updatedCart, 
            isLoading: false
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update cart';
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          console.error('Failed to update cart:', error);
        }
      },

      // Remove item from cart
      remove: async (lineId: string) => {
        const { cart } = get();
        if (!cart) return;

        set({ isLoading: true, error: null });

        try {
          const updatedCart = await removeCartLines(cart.id, [lineId]);
          set({ 
            cart: updatedCart, 
            isLoading: false
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to remove item';
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          console.error('Failed to remove item:', error);
        }
      },

      // Clear cart state (for logout, etc.)
      clear: () => {
        set({ 
          cart: null, 
          isLoading: false, 
          error: null,
          isOpen: false
        });
      },

      // Clear error state
      clearError: () => {
        set({ error: null });
      },

      // UI Actions
      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },
    }),
    {
      name: 'goldsabertooth-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
      }),
      onRehydrateStorage: () => () => {
        // Cart rehydrated successfully
      },
    }
  )
);

// Hook for getting cart count (useful for header badge)
export function useCartCount() {
  return useCartStore((state) => state.cart?.totalQuantity || 0);
}

// Hook for cart loading state
export function useCartLoading() {
  return useCartStore((state) => state.isLoading);
}

// Hook for cart error state
export function useCartError() {
  return useCartStore((state) => state.error);
}