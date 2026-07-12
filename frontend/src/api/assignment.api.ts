import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';

export const assignmentApi = {
  list: () => apiClient.get(ENDPOINTS.ASSIGNMENTS.LIST).then(r => r.data),
  create: (data: { courseId: string; title: string; description?: string; dueDate: string; fileUrl?: string }) =>
    apiClient.post(ENDPOINTS.ASSIGNMENTS.CREATE, data).then(r => r.data),
  update: (id: string, data: any) => apiClient.patch(ENDPOINTS.ASSIGNMENTS.UPDATE(id), data).then(r => r.data),
  remove: (id: string) => apiClient.delete(ENDPOINTS.ASSIGNMENTS.REMOVE(id)).then(r => r.data),
};

export const assessmentApi = {
  list: () => apiClient.get(ENDPOINTS.ASSESSMENTS.LIST).then(r => r.data),
  create: (data: { courseId: string; title: string; description?: string; questions?: any[]; dueDate?: string }) =>
    apiClient.post(ENDPOINTS.ASSESSMENTS.CREATE, data).then(r => r.data),
};
