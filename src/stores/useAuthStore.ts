import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthStore = {
    token: string | null;
    setToken: (token: string | null) => void;
    clearAccessToken: () => void;
}

const useAuthStore = create(
    persist<AuthStore>(
        (set) => ({
            token: null,
            setToken: (token) => set({ token }),
            clearAccessToken: () => {
                console.log('clearAccessToken called');

                localStorage.removeItem('auth-storage');
                set({ token: null });
            },
        }),
        {
            name: 'auth-storage' // 로컬 스토리지 키
        }
    )
);

export default useAuthStore;
