import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { liveClassApi } from '@/api/live-class.api';

export const useLiveClasses = () =>
  useQuery({ queryKey: ['live-classes'], queryFn: liveClassApi.list });

export const useLiveClass = (id: string) =>
  useQuery({ queryKey: ['live-class', id], queryFn: () => liveClassApi.get(id), enabled: !!id });

export const useCreateLiveClass = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: liveClassApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['live-classes'] }),
  });
};

export const useStartLiveClass = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: liveClassApi.start,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['live-classes'] });
      qc.invalidateQueries({ queryKey: ['tutor-dashboard'] });
    }
  });
};

export const useEndLiveClass = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: liveClassApi.end,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['live-classes'] }),
  });
};

export const useLiveClassMessages = (id: string, since?: string) =>
  useQuery({
    queryKey: ['live-class-messages', id, since],
    queryFn: () => liveClassApi.getMessages(id, since),
    enabled: !!id,
    refetchInterval: 3000, // Poll every 3 seconds for real-time feel
  });

export const useSendLiveClassMessage = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => liveClassApi.sendMessage(id, content),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['live-class-messages', id] }),
  });
};
