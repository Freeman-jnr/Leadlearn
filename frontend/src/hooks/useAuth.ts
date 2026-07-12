import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, loginUser, registerUser, logoutUser, verifyUser } from '../api/auth.api';
import { useAuthStore } from '../stores/auth.store';

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const data = await getCurrentUser();
      return data;
    },
    retry: false,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  const setAuth = useAuthStore(state => state.setAuth);
  
  return useMutation({
    mutationFn: async (payload: any) => {
      const data = await loginUser(payload);
      setAuth(data);
      qc.setQueryData(['me'], data.user);
      return data;
    }
  });
}

export function useRegister() {
  const qc = useQueryClient();
  const setAuth = useAuthStore(state => state.setAuth);
  
  return useMutation({
    mutationFn: async (payload: any) => {
      const data = await registerUser(payload);
      setAuth(data);
      qc.setQueryData(['me'], data.user);
      return data;
    }
  });
}

export function useLogout() {
  const qc = useQueryClient();
  const logout = useAuthStore(state => state.logout);
  
  return useMutation({
    mutationFn: async () => {
      await logoutUser();
      logout();
      qc.removeQueries({ queryKey: ['me'] });
    }
  });
}

export function useVerify() {
  const setAuth = useAuthStore(state => state.setAuth);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { email: string; otp: string }) => {
      const data = await verifyUser(payload);
      setAuth(data);
      qc.setQueryData(['me'], data.user);
      return data;
    }
  });
}

export function useAuth() {
  const store = useAuthStore();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const verifyMutation = useVerify();

  const login = async (credentials: any) => {
    try {
      useAuthStore.getState().setError(null);
      const data = await loginMutation.mutateAsync(credentials);
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Login failed";
      useAuthStore.getState().setError(msg);
      throw err;
    }
  };

  const register = async (data: any) => {
    try {
      useAuthStore.getState().setError(null);
      const data = await registerMutation.mutateAsync(data);
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Registration failed";
      useAuthStore.getState().setError(msg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (err: any) {
      console.error("Logout error:", err);
    }
  };

  const verify = async (payload: { email: string; otp: string }) => {
    try {
      useAuthStore.getState().setError(null);
      const data = await verifyMutation.mutateAsync(payload);
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Verification failed";
      useAuthStore.getState().setError(msg);
      throw err;
    }
  };

  const clearError = () => {
    useAuthStore.getState().setError(null);
  };

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isVerified: store.user?.isVerified ?? false,
    isLoading: store.isLoading || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending || verifyMutation.isPending,
    error: store.error,
    login,
    register,
    logout,
    verify,
    clearError,
  };
}
