/**
 * Profile type definitions
 * Shared types for profile-related API responses and form data
 */

export interface StudentProfile {
  id: string;
  userId: string;
  gradeLevel: string;
  school?: string;
  interests: string[];
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TutorProfile {
  id: string;
  userId: string;
  subjects: string[];
  qualifications: string[];
  bio?: string;
  hourlyRate: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolProfile {
  id: string;
  userId: string;
  schoolName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  role: "student" | "tutor" | "school";
  student?: StudentProfile;
  tutor?: TutorProfile;
  school?: SchoolProfile;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
}
