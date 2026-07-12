import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';

export const marketplaceApi = {
  list: (params?: Record<string, any>) =>
    apiClient.get(ENDPOINTS.MARKETPLACE.LIST, { params }).then(r => r.data),
  mine: () => apiClient.get(ENDPOINTS.MARKETPLACE.MINE).then(r => r.data),
  create: (data: { title: string; type: string; price: number; emoji?: string; fileUrl?: string; description?: string }) =>
    apiClient.post(ENDPOINTS.MARKETPLACE.CREATE, data).then(r => r.data),
  update: (id: string, data: Partial<{ title: string; type: string; price: number; emoji: string; fileUrl: string; description: string }>) =>
    apiClient.patch(ENDPOINTS.MARKETPLACE.UPDATE(id), data).then(r => r.data),
  remove: (id: string) => apiClient.delete(ENDPOINTS.MARKETPLACE.REMOVE(id)).then(r => r.data),
};
