import { create } from 'zustand';

export type AuthState = {
  isAuthenticated: boolean;

  setAuthenticated: (isAuthenticated: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,

  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
}));
