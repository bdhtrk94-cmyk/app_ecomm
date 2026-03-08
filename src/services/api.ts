import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { useSettingsStore } from '../store/settingsStore';

// 10.0.2.2 = localhost from Android Emulator
// For real device on same WiFi: replace with your PC IP e.g. 192.168.1.x
// For Web: 127.0.0.1
const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Keep a reference to the token in memory to avoid async race conditions on Web
let currentToken: string | null = null;
let on401: (() => void) | null = null;

export const setApiToken = (token: string | null) => {
  currentToken = token;
};

export const setLogoutHandler = (handler: () => void) => {
  on401 = handler;
};

// Attach token to every request
api.interceptors.request.use(async (config) => {
  try {
    // 1. Try memory token first
    let token = currentToken;

    // 2. Fallback to storage if no memory token
    if (!token) {
      token = await AsyncStorage.getItem('token');
      if (token) currentToken = token;
    }

    if (token) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    } else {
      console.warn('No token available for request to', config.url);
    }

    // Add Language Header for localization
    const lang = useSettingsStore.getState().language;
    if (config.headers && typeof config.headers.set === 'function') {
      config.headers.set('Accept-Language', lang);
    } else {
      (config.headers as any)['Accept-Language'] = lang;
    }
  } catch (err) {
    console.warn('Error fetching token for request:', err);
  }

  // Debug log outgoing headers
  console.log('AXIOS Request to:', config.url, 'Headers:', JSON.stringify(config.headers));

  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear BOTH persistent storage AND in-memory token
      currentToken = null;
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');

      // Trigger global logout in store if registered
      if (on401) on401();
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (name: string, email: string, password: string, password_confirmation: string) =>
    api.post('/auth/register', { name, email, password, password_confirmation }),

  me: () => api.get('/auth/me'),

  logout: () => api.post('/auth/logout'),
};

// ── Products (Public) ─────────────────────────────
export const productsApi = {
  list: (params?: { category_id?: number; search?: string; page?: number; per_page?: number; min_price?: string; max_price?: string; sort?: string }) =>
    api.get('/products', { params }),

  show: (slug: string) => api.get(`/products/${slug}`),

  categories: () => api.get('/categories'),

  flashDeals: () => api.get('/flash-deals'),
};

// ── Banners (Public) ──────────────────────────────
export const bannersApi = {
  list: () => api.get('/banners'),
};

// ── Customer — Cart ───────────────────────────────
export const cartApi = {
  get: () => api.get('/customer/cart'),
  add: (product_id: number, quantity: number) =>
    api.post('/customer/cart', { product_id, quantity }),
  update: (itemId: number, quantity: number) =>
    api.put(`/customer/cart/${itemId}`, { quantity }),
  remove: (itemId: number) => api.delete(`/customer/cart/${itemId}`),
  clear: () => api.delete('/customer/cart'),
};

// ── Customer — Checkout ───────────────────────────
export const checkoutApi = {
  checkout: (data: { address_id: number; coupon?: string }) =>
    api.post('/customer/checkout', data),
  validateCoupon: (code: string, total: number) =>
    api.post('/customer/checkout/validate-coupon', { code, total }),
};

// ── Customer — Orders ─────────────────────────────
export const ordersApi = {
  list: () => api.get('/customer/orders'),
  show: (id: number) => api.get(`/customer/orders/${id}`),
  cancel: (id: number) => api.post(`/customer/orders/${id}/cancel`),
};

// ── Customer — Profile ────────────────────────────
export const profileApi = {
  get: () => api.get('/customer/profile'),
  update: (data: any) => api.put('/customer/profile', data),
};

// ── Customer — Wishlist ───────────────────────────
export const wishlistApi = {
  get: () => api.get('/customer/wishlist'),
  toggle: (product_id: number) => api.post('/customer/wishlist', { product_id }),
};

// ── Customer — Addresses ──────────────────────────
export const addressesApi = {
  list: () => api.get('/customer/addresses'),
  add: (data: any) => api.post('/customer/addresses', data),
};

// ── Customer — Reviews ────────────────────────────────
export const reviewsApi = {
  submit: (data: { product_id: number; order_id: number; rating: number; comment?: string }) =>
    api.post('/customer/reviews', data),
  myReviews: () => api.get('/customer/reviews'),
};

export default api;
