import { apiClient } from "./axios";
import { ENDPOINTS } from "./endpoints";

export const profilesApi = {
  getMe: async () => {
    const response = await apiClient.get(ENDPOINTS.PROFILES.ME);
    return response.data;
  },
  updateStudent: async (payload: any) => {
    const response = await apiClient.patch(ENDPOINTS.PROFILES.UPDATE_STUDENT, payload);
    return response.data;
  },
  updateTutor: async (payload: any) => {
    const response = await apiClient.patch(ENDPOINTS.PROFILES.UPDATE_TUTOR, payload);
    return response.data;
  },
  updateSchool: async (payload: any) => {
    const response = await apiClient.patch(ENDPOINTS.PROFILES.UPDATE_SCHOOL, payload);
    return response.data;
  },
  uploadAvatar: async () => {
    const response = await apiClient.post(ENDPOINTS.PROFILES.UPLOAD_AVATAR);
    return response.data;
  },
};
