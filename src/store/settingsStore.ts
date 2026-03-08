import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
    language: 'en' | 'ar';
    setLanguage: (lang: 'en' | 'ar') => void;
    toggleLanguage: () => void;
    rehydrate: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
    language: 'en', // default

    setLanguage: async (lang) => {
        set({ language: lang });
        await AsyncStorage.setItem('safqa_language', lang);
    },

    toggleLanguage: async () => {
        const newLang = get().language === 'en' ? 'ar' : 'en';
        set({ language: newLang });
        await AsyncStorage.setItem('safqa_language', newLang);
    },

    rehydrate: async () => {
        const lang = await AsyncStorage.getItem('safqa_language');
        if (lang === 'en' || lang === 'ar') {
            set({ language: lang });
        }
    }
}));

