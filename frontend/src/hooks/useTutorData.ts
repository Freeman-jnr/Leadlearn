import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { marketplaceApi } from '@/api/marketplace.api';
import { assignmentApi, assessmentApi } from '@/api/assignment.api';
import { reviewApi } from '@/api/review.api';

// ─── Marketplace ─────────────────────────────────────────────────────────────
export const useMyMarketplaceItems = () =>
  useQuery({ queryKey: ['marketplace-mine'], queryFn: marketplaceApi.mine });

export const useCreateMarketplaceItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: marketplaceApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['marketplace-mine'] });
      qc.invalidateQueries({ queryKey: ['tutor-dashboard'] });
    }
  });
};

export const useDeleteMarketplaceItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: marketplaceApi.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['marketplace-mine'] }),
  });
};

// ─── Assignments ──────────────────────────────────────────────────────────────
export const useAssignments = () =>
  useQuery({ queryKey: ['assignments'], queryFn: assignmentApi.list });

export const useCreateAssignment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: assignmentApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['assignments'] });
      qc.invalidateQueries({ queryKey: ['tutor-dashboard'] });
    }
  });
};

export const useDeleteAssignment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: assignmentApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['assignments'] });
      qc.invalidateQueries({ queryKey: ['tutor-dashboard'] });
    },
  });
};

// ─── Assessments ──────────────────────────────────────────────────────────────
export const useAssessments = () =>
  useQuery({ queryKey: ['assessments'], queryFn: assessmentApi.list });

export const useCreateAssessment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: assessmentApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['assessments'] });
      qc.invalidateQueries({ queryKey: ['tutor-dashboard'] });
    }
  });
};

// ─── Reviews & Earnings ───────────────────────────────────────────────────────
export const useMyReviews = () =>
  useQuery({ queryKey: ['my-reviews'], queryFn: reviewApi.mine });

export const useMyEarnings = () =>
  useQuery({ queryKey: ['my-earnings'], queryFn: reviewApi.earnings });
