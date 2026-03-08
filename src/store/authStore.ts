import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, setApiToken, setLogoutHandler } from '../services/api';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    rehydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => {
    // Register global logout for 401s
    setLogoutHandler(() => {
        // Clear local state
        set({ user: null, token: null, isLoggedIn: false });
    });

    return {
        user: null,
        token: null,
        isLoggedIn: false,
        isLoading: false,

        rehydrate: async () => {
            const token = await AsyncStorage.getItem('token');
            const userStr = await AsyncStorage.getItem('user');
            if (token && userStr) {
                setApiToken(token);
                set({ token, user: JSON.parse(userStr), isLoggedIn: true });
            }
        },

        login: async (email, password) => {
            set({ isLoading: true });
            try {
                const res = await authApi.login(email, password);
                const { token, user } = res.data.data;
                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('user', JSON.stringify(user));
                setApiToken(token);
                set({ token, user, isLoggedIn: true });
            } finally {
                set({ isLoading: false });
            }
        },

        register: async (name, email, password) => {
            set({ isLoading: true });
            try {
                const res = await authApi.register(name, email, password, password);
                const { token, user } = res.data.data;
                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('user', JSON.stringify(user));
                setApiToken(token);
                set({ token, user, isLoggedIn: true });
            } finally {
                set({ isLoading: false });
            }
        },

        logout: async () => {
            try { await authApi.logout(); } catch (_) { }
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            setApiToken(null);
            set({ user: null, token: null, isLoggedIn: false });
        },
    };
});
