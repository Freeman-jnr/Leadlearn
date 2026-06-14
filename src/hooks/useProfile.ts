/**
 * Custom hook for profile operations
 * Provides access to user profile data and update operations
 */

import { useCallback, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import {
  getMyProfile,
  updateStudentProfile,
  updateTutorProfile,
  updateSchoolProfile,
  uploadAvatar,
} from "@/api/profile.api";
import type { UserProfile, StudentProfile, TutorProfile, SchoolProfile } from "@/types/profile.types";

interface UseProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

export const useProfile = () => {
  const [state, setState] = useState<UseProfileState>({
    profile: null,
    isLoading: false,
    error: null,
  });
  const { user } = useAuthStore();

  const fetchProfile = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const profile = await getMyProfile();
      setState((prev) => ({ ...prev, profile, isLoading: false }));
      return profile;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to fetch profile";
      setState((prev) => ({ ...prev, error: errorMessage, isLoading: false }));
      throw error;
    }
  }, []);

  const updateStudent = useCallback(async (data: Partial<StudentProfile>) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const updated = await updateStudentProfile(data);
      setState((prev) => ({ ...prev, profile: updated, isLoading: false }));
      return updated;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update student profile";
      setState((prev) => ({ ...prev, error: errorMessage, isLoading: false }));
      throw error;
    }
  }, []);

  const updateTutor = useCallback(async (data: Partial<TutorProfile>) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const updated = await updateTutorProfile(data);
      setState((prev) => ({ ...prev, profile: updated, isLoading: false }));
      return updated;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update tutor profile";
      setState((prev) => ({ ...prev, error: errorMessage, isLoading: false }));
      throw error;
    }
  }, []);

  const updateSchool = useCallback(async (data: Partial<SchoolProfile>) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const updated = await updateSchoolProfile(data);
      setState((prev) => ({ ...prev, profile: updated, isLoading: false }));
      return updated;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update school profile";
      setState((prev) => ({ ...prev, error: errorMessage, isLoading: false }));
      throw error;
    }
  }, []);

  const uploadUserAvatar = useCallback(async (file: File) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const result = await uploadAvatar(file);
      // Update profile with new avatar URL
      if (state.profile) {
        const updated = { ...state.profile, avatarUrl: result.avatarUrl };
        setState((prev) => ({ ...prev, profile: updated, isLoading: false }));
      }
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to upload avatar";
      setState((prev) => ({ ...prev, error: errorMessage, isLoading: false }));
      throw error;
    }
  }, [state.profile]);

  return {
    // State
    profile: state.profile,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    fetchProfile,
    updateStudent,
    updateTutor,
    updateSchool,
    uploadAvatar: uploadUserAvatar,
  };
};
