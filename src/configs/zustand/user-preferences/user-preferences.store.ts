import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

type UserPreferencesState = {
  theme: Theme;
  sidebarOpen: boolean;

  setTheme: (theme: Theme) => void;
  setSidebarOpen: (open: boolean) => void;
};

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      theme: 'system',
      sidebarOpen: true,

      setTheme: (theme) => set({ theme }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    {
      name: 'alpine-user-preferences',
    }
  )
);
