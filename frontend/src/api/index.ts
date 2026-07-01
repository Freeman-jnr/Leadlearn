import client from './client';

// Auth
export const authApi = {
  register: (payload: any) => client.post('/api/auth/register', payload),
  login: (payload: any) => client.post('/api/auth/login', payload),
  logout: () => client.post('/api/auth/logout'),
  me: () => client.get('/api/auth/me'),
};

// Courses
export const coursesApi = {
  list: (params?: { page?: number; limit?: number; search?: string }) =>
    client.get('/api/courses', { params }),
  get: (courseId: string) => client.get(`/api/courses/${courseId}`),
  create: (payload: any) => client.post('/api/courses', payload),
  update: (courseId: string, payload: any) => client.put(`/api/courses/${courseId}`, payload),
  remove: (courseId: string) => client.delete(`/api/courses/${courseId}`),
};

// Lessons
export const lessonsApi = {
  listForCourse: (courseId: string) => client.get(`/api/courses/${courseId}/lessons`),
  get: (lessonId: string) => client.get(`/api/lessons/${lessonId}`),
  create: (courseId: string, payload: any) => client.post(`/api/courses/${courseId}/lessons`, payload),
  update: (lessonId: string, payload: any) => client.put(`/api/lessons/${lessonId}`, payload),
  remove: (lessonId: string) => client.delete(`/api/lessons/${lessonId}`),
};

// Progress
export const progressApi = {
  get: () => client.get('/api/progress'),
  markLessonComplete: (lessonId: string) => client.post(`/api/progress/lesson/${lessonId}`),
};

// Profiles
export const profilesApi = {
  getMyProfile: () => client.get('/api/profiles/me'),
  updateAuthProfile: (payload: any) => client.put('/api/auth/me', payload),
  updateStudent: (payload: any) => client.patch('/api/profiles/student', payload),
  updateTutor: (payload: any) => client.patch('/api/profiles/tutor', payload),
  updateSchool: (payload: any) => client.patch('/api/profiles/school', payload),
  uploadAvatar: (formData: FormData) => client.post('/api/profiles/upload-avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export default {
  authApi,
  coursesApi,
  lessonsApi,
  progressApi,
  profilesApi,
};
