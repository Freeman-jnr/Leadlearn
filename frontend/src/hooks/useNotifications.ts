import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications.api';

export function useNotifications(limit?: number) {
  return useQuery({
    queryKey: ['notifications', limit],
    queryFn: async () => {
      const data = await notificationsApi.list({ limit });
      return data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}
