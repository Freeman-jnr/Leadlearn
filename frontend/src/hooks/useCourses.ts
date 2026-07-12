import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '../api/courses.api';
import { lessonsApi } from '../api/lessons.api';

export function useCourses(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: async () => {
      const res = await coursesApi.list(params);
      return res.data;
    }
  });
}

export function useCourse(courseId: string) {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const res = await coursesApi.get(courseId);
      return res.data;
    },
    enabled: !!courseId,
  });
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => coursesApi.create(payload).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  });
}

export function useUpdateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => coursesApi.update(id, payload).then(r => r.data),
    onSuccess: (_: any, vars: { id: string; payload: any }) => qc.invalidateQueries({ queryKey: ['course', vars.id] }),
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => coursesApi.remove(id).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  });
}

export function useCourseLessons(courseId: string) {
  return useQuery({
    queryKey: ['course', courseId, 'lessons'],
    queryFn: async () => {
      const res = await lessonsApi.listForCourse(courseId);
      return res.data;
    },
    enabled: !!courseId,
  });
}

export function useCreateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, payload }: { courseId: string; payload: any }) => lessonsApi.create(courseId, payload).then(r => r.data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['course', vars.courseId, 'lessons'] });
      qc.invalidateQueries({ queryKey: ['dashboard', 'tutor'] });
    },
  });
}

export function useUpdateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => lessonsApi.update(id, payload).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard', 'tutor'] });
    },
  });
}

export function useDeleteLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => lessonsApi.remove(id).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard', 'tutor'] });
    },
  });
}

