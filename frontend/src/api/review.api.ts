import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';

export const reviewApi = {
  mine: () => apiClient.get(ENDPOINTS.REVIEWS.MINE).then(r => r.data),
  create: (tutorId: string, data: { rating: number; comment?: string; courseId?: string }) =>
    apiClient.post(ENDPOINTS.REVIEWS.CREATE(tutorId), data).then(r => r.data),
  earnings: () => apiClient.get(ENDPOINTS.REVIEWS.EARNINGS).then(r => r.data),
};
