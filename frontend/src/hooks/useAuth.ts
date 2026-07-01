import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api';

export function useMe() {
  return useQuery(['me'], async () => {
    const res = await authApi.me();
    return res.data;
  }, {
    // don't throw on 401 by default; caller can handle
    retry: false,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation(async (payload: { email: string; password: string }) => {
    const res = await authApi.login(payload);
    const { accessToken, refreshToken, user } = res.data || {};
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    // prime me cache
    qc.setQueryData(['me'], user);
    return res.data;
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation(async (payload: any) => {
    const res = await authApi.register(payload);
    const { accessToken, refreshToken, user } = res.data || {};
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    qc.setQueryData(['me'], user);
    return res.data;
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation(async () => {
    await authApi.logout();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    qc.removeQueries(['me']);
  });
}
