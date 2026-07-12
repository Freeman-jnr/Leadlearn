import { useQuery } from '@tanstack/react-query';
import { getStudentDashboard, getTutorDashboard, getAdminDashboard, getSchoolDashboard } from '../api/dashboard.api';

export function useStudentDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'student'],
    queryFn: getStudentDashboard,
  });
}

export function useTutorDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'tutor'],
    queryFn: getTutorDashboard,
  });
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: getAdminDashboard,
  });
}

export function useSchoolDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'school'],
    queryFn: getSchoolDashboard,
  });
}
