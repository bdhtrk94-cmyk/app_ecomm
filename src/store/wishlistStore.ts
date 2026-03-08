import { create } from 'zustand';
import { wishlistApi } from '../services/api';

interface WishlistState {
    wishlistIds: number[];
    isLoading: boolean;
    fetchWishlist: () => Promise<void>;
    toggleWishlist: (productId: number) => Promise<void>;
    isInWishlist: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
    wishlistIds: [],
    isLoading: false,

    fetchWishlist: async () => {
        set({ isLoading: true });
        try {
            const res = await wishlistApi.get();
            const items = res.data?.data || res.data || [];
            // Assuming the API returns a list of wishlist items containing product_id
            const ids = Array.isArray(items) ? items.map((item: any) => item.product_id || item.id) : [];
            set({ wishlistIds: ids });
        } catch (err) {
            console.warn('Failed to fetch wishlist', err);
        } finally {
            set({ isLoading: false });
        }
    },

    toggleWishlist: async (productId: number) => {
        const isFav = get().isInWishlist(productId);

        // Optimistic Update
        set((state) => ({
            wishlistIds: isFav
                ? state.wishlistIds.filter((id) => id !== productId)
                : [...state.wishlistIds, productId],
        }));

        try {
            await wishlistApi.toggle(productId);
        } catch (err) {
            console.warn('Failed to toggle wishlist API', err);
            // Revert Optimistic Update
            set((state) => ({
                wishlistIds: isFav
                    ? [...state.wishlistIds, productId]
                    : state.wishlistIds.filter((id) => id !== productId),
            }));
        }
    },

    isInWishlist: (productId: number) => {
        return get().wishlistIds.includes(productId);
    },
}));
