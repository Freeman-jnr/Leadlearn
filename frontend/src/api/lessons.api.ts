import { apiClient } from "./axios";
import { ENDPOINTS } from "./endpoints";

export const lessonsApi = {
  listForCourse: async (courseId: string) => {
    const response = await apiClient.get(ENDPOINTS.LESSONS.LIST_FOR_COURSE(courseId));
    return response;
  },
  get: async (lessonId: string) => {
    const response = await apiClient.get(ENDPOINTS.LESSONS.GET(lessonId));
    return response;
  },
  create: async (courseId: string, payload: any) => {
    const response = await apiClient.post(ENDPOINTS.LESSONS.CREATE(courseId), payload);
    return response;
  },
  update: async (lessonId: string, payload: any) => {
    const response = await apiClient.put(ENDPOINTS.LESSONS.UPDATE(lessonId), payload);
    return response;
  },
  remove: async (lessonId: string) => {
    const response = await apiClient.delete(ENDPOINTS.LESSONS.REMOVE(lessonId));
    return response;
  },
};
