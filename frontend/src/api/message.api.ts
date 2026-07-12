import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';

export const messageApi = {
  getContacts: () => apiClient.get(ENDPOINTS.MESSAGES.CONTACTS).then(r => r.data),
  getHistory: (userId: string, since?: string) =>
    apiClient.get(ENDPOINTS.MESSAGES.HISTORY(userId), { params: since ? { since } : {} }).then(r => r.data),
  send: (userId: string, content: string) =>
    apiClient.post(ENDPOINTS.MESSAGES.SEND(userId), { content }).then(r => r.data),
};
