/**
 * Centralized API endpoint constants
 * All backend endpoints are defined here for easy maintenance and refactoring
 */

export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    VERIFY: "/auth/verify",
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

  // Courses
  COURSES: {
    LIST: "/courses",
    GET: (id: string) => `/courses/${id}`,
    CREATE: "/courses",
    UPDATE: (id: string) => `/courses/${id}`,
    REMOVE: (id: string) => `/courses/${id}`,
    LESSONS: (courseId: string) => `/courses/${courseId}/lessons`,
  },

  // Lessons
  LESSONS: {
    LIST_FOR_COURSE: (courseId: string) => `/courses/${courseId}/lessons`,
    GET: (id: string) => `/lessons/${id}`,
    CREATE: (courseId: string) => `/courses/${courseId}/lessons`,
    UPDATE: (id: string) => `/lessons/${id}`,
    REMOVE: (id: string) => `/lessons/${id}`,
  },

  // Progress
  PROGRESS: {
    GET: "/progress",
    MARK_COMPLETE: (lessonId: string) => `/progress/lesson/${lessonId}`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: "/notifications",
    MARK_ALL_READ: "/notifications/mark-all-read",
    MARK_READ: (id: string) => `/notifications/${id}/read`,
  },

  // Live Classes
  LIVE_CLASSES: {
    LIST: "/live-classes",
    GET: (id: string) => `/live-classes/${id}`,
    CREATE: "/live-classes",
    START: (id: string) => `/live-classes/${id}/start`,
    END: (id: string) => `/live-classes/${id}/end`,
    MESSAGES: (id: string) => `/live-classes/${id}/messages`,
  },

  // Messages (DM)
  MESSAGES: {
    CONTACTS: "/messages/contacts",
    HISTORY: (userId: string) => `/messages/${userId}`,
    SEND: (userId: string) => `/messages/${userId}`,
  },

  // Marketplace
  MARKETPLACE: {
    LIST: "/marketplace",
    MINE: "/marketplace/mine",
    CREATE: "/marketplace",
    UPDATE: (id: string) => `/marketplace/${id}`,
    REMOVE: (id: string) => `/marketplace/${id}`,
  },

  // Assignments & Assessments
  ASSIGNMENTS: {
    LIST: "/assignments",
    CREATE: "/assignments",
    UPDATE: (id: string) => `/assignments/${id}`,
    REMOVE: (id: string) => `/assignments/${id}`,
  },
  ASSESSMENTS: {
    LIST: "/assignments/assessments",
    CREATE: "/assignments/assessments",
  },

  // Reviews & Earnings
  REVIEWS: {
    MINE: "/reviews",
    CREATE: (tutorId: string) => `/reviews/${tutorId}`,
    EARNINGS: "/reviews/earnings",
  },
} as const;

// Helper to build full URLs if needed
export const getEndpointUrl = (endpoint: string): string => {
  return endpoint;
};
