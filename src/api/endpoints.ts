/**
 * Centralized API endpoint constants
 * All backend endpoints are defined here for easy maintenance and refactoring
 */

export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
    ME: "/auth/me",
  },

  // User Profiles
  PROFILES: {
    ME: "/profiles/me",
    UPDATE_STUDENT: "/profiles/student",
    UPDATE_TUTOR: "/profiles/tutor",
    UPDATE_SCHOOL: "/profiles/school",
    UPLOAD_AVATAR: "/profiles/upload-avatar",
  },
} as const;

// Helper to build full URLs if needed
export const getEndpointUrl = (endpoint: string): string => {
  return endpoint;
};
