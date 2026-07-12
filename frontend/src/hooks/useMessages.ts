import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { messageApi } from '@/api/message.api';
import { useAuthStore } from '@/stores/auth.store';
import { useState, useEffect, useRef } from 'react';

export const useContacts = () =>
  useQuery({ queryKey: ['message-contacts'], queryFn: messageApi.getContacts });

export const useChatHistory = (userId: string | null) =>
  useQuery({
    queryKey: ['chat', userId],
    queryFn: () => messageApi.getHistory(userId!),
    enabled: !!userId,
    refetchInterval: 3000, // Poll every 3 seconds
  });

export const useSendMessage = (userId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => messageApi.send(userId, content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['chat', userId] });
      qc.invalidateQueries({ queryKey: ['message-contacts'] });
    },
  });
};

/** Derived hook — get the "other user" in a conversation */
export const useChatPartner = (messages: any[], myId: string) => {
  if (!messages?.length) return null;
  const last = messages[messages.length - 1];
  return last.sender?.id === myId ? null : last.sender;
};
