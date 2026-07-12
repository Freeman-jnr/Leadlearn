import { apiClient } from "./axios";
import { ENDPOINTS } from "./endpoints";

export const progressApi = {
  get: async () => {
    const response = await apiClient.get(ENDPOINTS.PROGRESS.GET);
    return response;
  },
  markLessonComplete: async (lessonId: string) => {
    const response = await apiClient.post(ENDPOINTS.PROGRESS.MARK_COMPLETE(lessonId));
    return response;
  },
};
