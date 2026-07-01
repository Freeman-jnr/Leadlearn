// ============================================================================
// PROFILE CONTROLLER
// ============================================================================
// HTTP request handlers for profile endpoints
// ============================================================================

import { Request, Response } from 'express';
import { AuthRequest } from '../auth/auth.types';
import * as profileService from './profile.service';
import {
  updateStudentProfileSchema,
  updateTutorProfileSchema,
  updateSchoolProfileSchema,
} from './profile.validation';
import { formatProfileResponse } from './profile.utils';

/**
 * Get current user's profile
 */
export async function getCurrentProfile(req: Request, res: Response): Promise<void> {
  const authReq = req as unknown as AuthRequest & Request;
  const userId = authReq.user.id;
  const userRole = authReq.user.role;

  let profile;

  if (userRole === 'STUDENT') {
    profile = await profileService.getStudentProfile(userId);
  } else if (userRole === 'TUTOR') {
    profile = await profileService.getTutorProfile(userId);
  } else if (userRole === 'SCHOOL') {
    profile = await profileService.getSchoolProfile(userId);
  }

  const response = formatProfileResponse(
    true,
    'Profile retrieved successfully',
    200,
    profile,
  );

  res.status(200).json(response);
}

/**
 * Update student profile
 */
export async function updateStudentProfile(req: Request, res: Response): Promise<void> {
  const authReq = req as unknown as AuthRequest & Request;
  const userId = authReq.user.id;
  const body = updateStudentProfileSchema.parse(req.body);

  const profile = await profileService.updateStudentProfile(userId, body);

  const response = formatProfileResponse(
    true,
    'Student profile updated successfully',
    200,
    profile,
  );

  res.status(200).json(response);
}

/**
 * Update tutor profile
 */
export async function updateTutorProfile(req: Request, res: Response): Promise<void> {
  const authReq = req as unknown as AuthRequest & Request;
  const userId = authReq.user.id;
  const body = updateTutorProfileSchema.parse(req.body);

  const profile = await profileService.updateTutorProfile(userId, body);

  const response = formatProfileResponse(
    true,
    'Tutor profile updated successfully',
    200,
    profile,
  );

  res.status(200).json(response);
}

/**
 * Update school profile
 */
export async function updateSchoolProfile(req: Request, res: Response): Promise<void> {
  const authReq = req as unknown as AuthRequest & Request;
  const userId = authReq.user.id;
  const body = updateSchoolProfileSchema.parse(req.body);

  const profile = await profileService.updateSchoolProfile(userId, body);

  const response = formatProfileResponse(
    true,
    'School profile updated successfully',
    200,
    profile,
  );

  res.status(200).json(response);
}

/**
 * Upload student avatar
 */
export async function uploadStudentAvatar(req: Request, res: Response): Promise<void> {
  const authReq = req as unknown as AuthRequest & Request;
  const userId = authReq.user.id;

  if (!req.file) {
    res.status(400).json(
      formatProfileResponse(false, 'No file uploaded', 400, undefined, {
        code: 'INVALID_FILE_TYPE',
        details: 'No file uploaded',
      }),
    );
    return;
  }

  const profile = await profileService.uploadStudentAvatar(userId, req.file);

  const response = formatProfileResponse(
    true,
    'Avatar uploaded successfully',
    200,
    profile,
  );

  res.status(200).json(response);
}

/**
 * Upload tutor avatar
 */
export async function uploadTutorAvatar(req: Request, res: Response): Promise<void> {
  const authReq = req as unknown as AuthRequest & Request;
  const userId = authReq.user.id;

  if (!req.file) {
    res.status(400).json(
      formatProfileResponse(false, 'No file uploaded', 400, undefined, {
        code: 'INVALID_FILE_TYPE',
        details: 'No file uploaded',
      }),
    );
    return;
  }

  const profile = await profileService.uploadTutorAvatar(userId, req.file);

  const response = formatProfileResponse(
    true,
    'Avatar uploaded successfully',
    200,
    profile,
  );

  res.status(200).json(response);
}

/**
 * Upload school logo
 */
export async function uploadSchoolLogo(req: Request, res: Response): Promise<void> {
  const authReq = req as unknown as AuthRequest & Request;
  const userId = authReq.user.id;

  if (!req.file) {
    res.status(400).json(
      formatProfileResponse(false, 'No file uploaded', 400, undefined, {
        code: 'INVALID_FILE_TYPE',
        details: 'No file uploaded',
      }),
    );
    return;
  }

  const profile = await profileService.uploadSchoolLogo(userId, req.file);

  const response = formatProfileResponse(
    true,
    'Logo uploaded successfully',
    200,
    profile,
  );

  res.status(200).json(response);
}
