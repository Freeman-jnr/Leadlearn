import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi, lessonsApi } from '../api';

export function useCourses(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery(['courses', params], async () => {
    const res = await coursesApi.list(params);
    return res.data;
  });
}

export function useCourse(courseId: string) {
  return useQuery(['course', courseId], async () => {
    const res = await coursesApi.get(courseId);
    return res.data;
  }, { enabled: !!courseId });
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation((payload: any) => coursesApi.create(payload).then(r => r.data), {
    onSuccess: () => qc.invalidateQueries(['courses']),
  });
}

export function useUpdateCourse() {
  const qc = useQueryClient();
  return useMutation(({ id, payload }: { id: string; payload: any }) => coursesApi.update(id, payload).then(r => r.data), {
    onSuccess: (_, vars) => qc.invalidateQueries(['course', vars.id]),
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation((id: string) => coursesApi.remove(id).then(r => r.data), {
    onSuccess: () => qc.invalidateQueries(['courses']),
  });
}

export function useCourseLessons(courseId: string) {
  return useQuery(['course', courseId, 'lessons'], async () => {
    const res = await lessonsApi.listForCourse(courseId);
    return res.data;
  }, { enabled: !!courseId });
}
