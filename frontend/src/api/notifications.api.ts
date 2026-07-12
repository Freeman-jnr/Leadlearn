import { apiClient } from "./axios";
import { ENDPOINTS } from "./endpoints";

export const notificationsApi = {
  list: async (params?: { limit?: number }) => {
    const response = await apiClient.get(ENDPOINTS.NOTIFICATIONS.LIST, { params });
    return response.data;
  },
  markAsRead: async (id: string) => {
    const response = await apiClient.patch(ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await apiClient.patch(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
    return response.data;
  },
};
