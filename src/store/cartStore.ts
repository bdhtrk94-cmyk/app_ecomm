import { create } from 'zustand';
import { cartApi } from '../services/api';

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  nameAr: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  storeName: string;
  isExpress: boolean;
  deliveryDate?: string;
  cartItemId?: number; // Added to track backend ID
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (item: Omit<CartItem, 'quantity' | 'cartItemId'>) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
  getSavings: () => number;
  getItemCount: () => number;
}

const mapApiCartItem = (item: any): CartItem => ({
  id: item.product?.id, // Local ID mapping
  cartItemId: item.id, // Backend CartItem ID
  productId: item.product?.id,
  name: item.product?.name || 'Product',
  nameAr: item.product?.name_ar || item.product?.name || 'Product',
  image: item.product?.images?.[0]?.url || item.product?.image || 'https://picsum.photos/id/1/200/200',
  price: parseFloat(item.unit_price || item.price || item.product?.price || '0'),
  originalPrice: item.product?.original_price ? parseFloat(item.product?.original_price) : undefined,
  quantity: item.quantity,
  storeName: item.product?.store?.name || 'Safqa Store',
  isExpress: item.product?.is_express || false,
  deliveryDate: 'Soon',
});

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const res = await cartApi.get();
      const cartItems = res.data?.data?.items || res.data?.items || [];
      set({ items: Array.isArray(cartItems) ? cartItems.map(mapApiCartItem) : [] });
    } catch (err) {
      console.warn('Failed to fetch cart', err);
      set({ items: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (item) => {
    const existing = get().items.find((i) => i.productId === item.productId);

    // Optimistic UI update
    set((state) => {
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1, id: item.productId }] };
    });

    try {
      if (existing && existing.cartItemId) {
        // Increment quantity via API
        await cartApi.update(existing.cartItemId, existing.quantity + 1);
      } else {
        // Add new item via API
        await cartApi.add(item.productId, 1);
      }
      get().fetchCart(); // Sync exact state with backend
    } catch (err) {
      console.warn('Failed to add to cart API', err);
      get().fetchCart(); // Revert on failure
    }
  },

  removeItem: async (productId) => {
    const item = get().items.find((i) => i.productId === productId);
    if (!item) return;

    // Optimistic mapping
    set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }));

    try {
      if (item.cartItemId) {
        await cartApi.remove(item.cartItemId);
      } else {
        get().fetchCart(); // Fallback if no cartItemId
      }
    } catch (err) {
      console.warn('Failed to remove cart item API', err);
      get().fetchCart(); // Revert on failure
    }
  },

  updateQuantity: async (productId, quantity) => {
    const item = get().items.find((i) => i.productId === productId);
    if (!item) return;

    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    // Optimistic update
    set((state) => ({
      items: state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    }));

    try {
      if (item.cartItemId) {
        await cartApi.update(item.cartItemId, quantity);
      }
    } catch (err) {
      console.warn('Failed to update cart quantity API', err);
      get().fetchCart(); // Revert
    }
  },

  clearCart: async () => {
    set({ items: [] });
    try {
      await cartApi.clear();
    } catch (err) {
      console.warn('Failed to clear cart API', err);
    }
  },

  getTotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getSavings: () => {
    return get().items.reduce((sum, item) => {
      if (item.originalPrice) {
        return sum + (item.originalPrice - item.price) * item.quantity;
      }
      return sum;
    }, 0);
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
