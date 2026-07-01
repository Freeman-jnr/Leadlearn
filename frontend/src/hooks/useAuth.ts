/**
 * Custom hook for authentication
 * Provides easy access to auth state and common auth operations
 */

import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth.store";
import { loginUser, registerUser, logoutUser, getCurrentUser } from "@/api/auth.api";
import type { LoginCredentials, RegisterCredentials } from "@/types/auth.types";

export const useAuth = () => {
  const navigate = useNavigate();
  const store = useAuthStore();

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        store.setLoading(true);
        store.setError(null);

        const response = await loginUser(credentials);
        // Backend returns flat: { accessToken, refreshToken, user }
        const { user, accessToken, refreshToken } = response as any;
        store.setAuth({
          user,
          accessToken,
          refreshToken,
        });

        // Redirect based on role
        const role = user?.role?.toLowerCase();
        if (role === "admin") {
          await navigate({ to: "/admin-dashboard" });
        } else if (role === "tutor") {
          await navigate({ to: "/tutor-dashboard" });
        } else if (role === "school") {
          await navigate({ to: "/school-dashboard" });
        } else {
          await navigate({ to: "/dashboard" });
        }
        return response;
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
        store.setError(errorMessage);
        throw error;
      } finally {
        store.setLoading(false);
      }
    },
    [store, navigate]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      try {
        store.setLoading(true);
        store.setError(null);

        const response = await registerUser(credentials);
        // Backend returns flat: { accessToken, refreshToken, user }
        // Auto-login after register
        const { user, accessToken, refreshToken } = response as any;
        if (user && accessToken) {
          store.setAuth({ user, accessToken, refreshToken });
        }
        await navigate({ to: "/account-success" });
        return response;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Registration failed. Please try again.";
        store.setError(errorMessage);
        throw error;
      } finally {
        store.setLoading(false);
      }
    },
    [store, navigate]
  );

  const logout = useCallback(async () => {
    try {
      store.setLoading(true);
      await logoutUser();
      store.logout();
      await navigate({ to: "/login" });
    } catch (error: any) {
      console.error("Logout error:", error);
      // Still logout locally even if backend call fails
      store.logout();
      await navigate({ to: "/login" });
    } finally {
      store.setLoading(false);
    }
  }, [store, navigate]);

  const refreshUser = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      store.setUser(user);
      return user;
    } catch (error: any) {
      console.error("Failed to refresh user:", error);
      // If we can't get the current user, logout
      if (error.response?.status === 401) {
        store.logout();
        await navigate({ to: "/login" });
      }
      throw error;
    }
  }, [store, navigate]);

  return {
    // State
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    accessToken: store.accessToken,

    // Actions
    login,
    register,
    logout,
    refreshUser,
    clearError: store.clearError,
  };
};
