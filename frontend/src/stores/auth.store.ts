/**
 * Authentication Store (Zustand)
 * Manages auth state globally with localStorage persistence
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, AuthResponse } from "@/types/auth.types";

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setAuth: (data: AuthResponse) => void;
  logout: () => void;
  clearError: () => void;
  hydrateFromStorage: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => {
        set({ user, isAuthenticated: true });
      },

      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error });
      },

      setAuth: (data: AuthResponse) => {
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
          error: null,
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      hydrateFromStorage: () => {
        // This is called after localStorage is loaded
        const state = get();
        if (state.accessToken && state.user) {
          set({ isAuthenticated: true });
        }
      },
    }),
    {
      name: "auth-store",
      version: 1,
      // Only persist specific parts of state
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      // Called after rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrateFromStorage();
        }
      },
    }
  )
);
