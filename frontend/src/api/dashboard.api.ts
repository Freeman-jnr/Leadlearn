import { apiClient } from "./axios";

export const getStudentDashboard = async () => {
  const response = await apiClient.get('/dashboard/student');
  return response.data;
};

export const getTutorDashboard = async () => {
  const response = await apiClient.get('/dashboard/tutor');
  return response.data;
};

export const getAdminDashboard = async () => {
  const response = await apiClient.get('/dashboard/admin');
  return response.data;
};

export const getSchoolDashboard = async () => {
  const response = await apiClient.get('/dashboard/school');
  return response.data;
};
