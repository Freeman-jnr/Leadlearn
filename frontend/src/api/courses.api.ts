import { apiClient } from "./axios";
import { ENDPOINTS } from "./endpoints";

export const coursesApi = {
  list: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await apiClient.get(ENDPOINTS.COURSES.LIST, { params });
    return response;
  },
  get: async (courseId: string) => {
    const response = await apiClient.get(ENDPOINTS.COURSES.GET(courseId));
    return response;
  },
  create: async (payload: any) => {
    const response = await apiClient.post(ENDPOINTS.COURSES.CREATE, payload);
    return response;
  },
  update: async (courseId: string, payload: any) => {
    const response = await apiClient.put(ENDPOINTS.COURSES.UPDATE(courseId), payload);
    return response;
  },
  remove: async (courseId: string) => {
    const response = await apiClient.delete(ENDPOINTS.COURSES.REMOVE(courseId));
    return response;
  },
};
