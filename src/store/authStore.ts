import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';
import { User, UserResponse, transformUserResponse } from '@/types/auth';

interface AuthState {
  // 로그인 상태
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;

  // 회원가입 토큰 (OIDC callback 후 약관 동의 전까지)
  registrationToken: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setRegistrationToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  clearRegistrationToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      isLoading: false,
      registrationToken: null,

      setUser: (user) => set({
        user,
        isLoggedIn: !!user,
        registrationToken: null, // 로그인 완료 시 토큰 초기화
      }),

      setRegistrationToken: (token) => set({ registrationToken: token }),

      setLoading: (loading) => set({ isLoading: loading }),

      clearRegistrationToken: () => set({ registrationToken: null }),

      logout: () => set({
        user: null,
        isLoggedIn: false,
        registrationToken: null,
      }),

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get<{ success: boolean; user: UserResponse }>('/account/info');
          if (response.data.success && response.data.user) {
            const user = transformUserResponse(response.data.user);
            set({ user, isLoggedIn: true, isLoading: false });
            return true;
          }
        } catch {
          set({ user: null, isLoggedIn: false });
        }
        set({ isLoading: false });
        return false;
      },
    }),
    {
      name: 'gmatch-auth',
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        // registrationToken은 persist하지 않음 (보안)
      }),
    }
  )
);
