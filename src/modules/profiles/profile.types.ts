// ============================================================================
// PROFILE TYPES & ENUMS
// ============================================================================
// Centralized types for profile module
// ============================================================================

import { Role } from '../auth/auth.types';

// Profile error codes
export enum ProfileErrorCode {
  PROFILE_NOT_FOUND = 'PROFILE_NOT_FOUND',
  PROFILE_ALREADY_EXISTS = 'PROFILE_ALREADY_EXISTS',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  UNAUTHORIZED_PROFILE_ACCESS = 'UNAUTHORIZED_PROFILE_ACCESS',
  CLOUDINARY_UPLOAD_FAILED = 'CLOUDINARY_UPLOAD_FAILED',
  INVALID_PROFILE_DATA = 'INVALID_PROFILE_DATA',
  ROLE_MISMATCH = 'ROLE_MISMATCH',
}

// Profile exception
export class ProfileException extends Error {
  constructor(
    public code: ProfileErrorCode,
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ProfileException';
  }
}

// Student profile interface
export interface StudentProfileData {
  classLevel?: string;
  schoolName?: string;
  age?: number;
  gender?: string;
  avatar?: string;
}

// Tutor profile interface
export interface TutorProfileData {
  bio?: string;
  subjects?: string[];
  experience?: number;
  qualifications?: string;
  avatar?: string;
}

// School profile interface
export interface SchoolProfileData {
  schoolName: string;
  address?: string;
  schoolType?: string;
  logo?: string;
}

// Profile response wrapper
export interface ProfileResponse<T = unknown> {
  success: boolean;
  message: string;
  statusCode: number;
  data?: T;
  error?: {
    code: string;
    details: string;
  };
}

// Cloudinary upload response
export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  bytes: number;
}

// File upload metadata
export interface FileUploadMetadata {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
}

// Profile with user data
export interface StudentProfileWithUser extends StudentProfileData {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TutorProfileWithUser extends TutorProfileData {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SchoolProfileWithUser extends SchoolProfileData {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
