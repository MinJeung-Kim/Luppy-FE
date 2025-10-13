import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthStore = {
    token: string | null;
    setToken: (token: string | null) => void;
}

const useAuthStore = create(
    persist<AuthStore>(
        (set) => ({
            token: null,
            setToken: (token) => set({ token })
        }),
        {
            name: 'auth-storage' // 로컬 스토리지 키
        }
    ));

export default useAuthStore;
