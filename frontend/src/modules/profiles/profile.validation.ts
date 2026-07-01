// ============================================================================
// PROFILE VALIDATION SCHEMAS
// ============================================================================
// Input validation for profile operations
// ============================================================================

import { z } from 'zod';

// Student profile update schema
export const updateStudentProfileSchema = z.object({
  classLevel: z.string().optional(),
  schoolName: z.string().optional(),
  age: z.number().int().min(5).max(120).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
});

export type UpdateStudentProfileInput = z.infer<typeof updateStudentProfileSchema>;

// Tutor profile update schema
export const updateTutorProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  subjects: z.array(z.string()).optional(),
  experience: z.number().int().min(0).max(60).optional(),
  qualifications: z.string().max(500).optional(),
});

export type UpdateTutorProfileInput = z.infer<typeof updateTutorProfileSchema>;

// School profile update schema
export const updateSchoolProfileSchema = z.object({
  schoolName: z.string().min(2).max(255),
  address: z.string().max(500).optional(),
  schoolType: z.string().optional(),
});

export type UpdateSchoolProfileInput = z.infer<typeof updateSchoolProfileSchema>;

// File upload validation schema
export const fileUploadSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.enum(['image/jpeg', 'image/png', 'image/webp']),
  size: z.number().max(5 * 1024 * 1024), // 5MB max
  buffer: z.instanceof(Buffer),
});

export type FileUploadInput = z.infer<typeof fileUploadSchema>;

// Create student profile on registration
export const createStudentProfileSchema = z.object({
  userId: z.string().uuid(),
});

// Create tutor profile on registration
export const createTutorProfileSchema = z.object({
  userId: z.string().uuid(),
});

// Create school profile on registration
export const createSchoolProfileSchema = z.object({
  userId: z.string().uuid(),
  schoolName: z.string().min(2).max(255),
});
