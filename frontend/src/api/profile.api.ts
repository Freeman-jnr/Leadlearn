/**
 * Profile API functions
 * Reusable functions for fetching and updating user profiles
 */

import { apiClient } from "./axios";
import { ENDPOINTS } from "./endpoints";
import type { UserProfile, StudentProfile, TutorProfile, SchoolProfile } from "@/types/profile.types";

/**
 * Get current user's profile
 */
export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>(ENDPOINTS.PROFILES.ME);
  return response.data;
};

/**
 * Update student profile
 */
export const updateStudentProfile = async (data: Partial<StudentProfile>): Promise<UserProfile> => {
  const response = await apiClient.patch<UserProfile>(ENDPOINTS.PROFILES.UPDATE_STUDENT, data);
  return response.data;
};

/**
 * Update tutor profile
 */
export const updateTutorProfile = async (data: Partial<TutorProfile>): Promise<UserProfile> => {
  const response = await apiClient.patch<UserProfile>(ENDPOINTS.PROFILES.UPDATE_TUTOR, data);
  return response.data;
};

/**
 * Update school profile
 */
export const updateSchoolProfile = async (data: Partial<SchoolProfile>): Promise<UserProfile> => {
  const response = await apiClient.patch<UserProfile>(ENDPOINTS.PROFILES.UPDATE_SCHOOL, data);
  return response.data;
};

/**
 * Upload user avatar
 * @param file - Image file to upload
 */
export const uploadAvatar = async (file: File): Promise<{ avatarUrl: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<{ avatarUrl: string }>(
    ENDPOINTS.PROFILES.UPLOAD_AVATAR,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
