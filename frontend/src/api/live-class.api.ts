import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';

export const liveClassApi = {
  list: () => apiClient.get(ENDPOINTS.LIVE_CLASSES.LIST).then(r => r.data),
  get: (id: string) => apiClient.get(ENDPOINTS.LIVE_CLASSES.GET(id)).then(r => r.data),
  create: (data: { courseId: string; title: string; scheduledAt: string; durationMins?: number; meetingUrl?: string }) =>
    apiClient.post(ENDPOINTS.LIVE_CLASSES.CREATE, data).then(r => r.data),
  start: (id: string) => apiClient.patch(ENDPOINTS.LIVE_CLASSES.START(id)).then(r => r.data),
  end: (id: string) => apiClient.patch(ENDPOINTS.LIVE_CLASSES.END(id)).then(r => r.data),
  getMessages: (id: string, since?: string) =>
    apiClient.get(ENDPOINTS.LIVE_CLASSES.MESSAGES(id), { params: since ? { since } : {} }).then(r => r.data),
  sendMessage: (id: string, content: string) =>
    apiClient.post(ENDPOINTS.LIVE_CLASSES.MESSAGES(id), { content }).then(r => r.data),
};
