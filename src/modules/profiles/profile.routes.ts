// ============================================================================
// PROFILE ROUTES
// ============================================================================
// Express routes for profile endpoints
// ============================================================================

import { Router } from 'express';
import { authMiddleware, asyncHandler } from '../auth/auth.middleware';
import {
  uploadAvatarMiddleware,
  validateStudentProfileAccess,
  validateTutorProfileAccess,
  validateSchoolProfileAccess,
  validateFileUpload,
} from './profile.middleware';
import * as profileController from './profile.controller';

const router = Router();

/**
 * Get current user's profile
 * GET /api/profiles/me
 */
router.get('/me', authMiddleware, asyncHandler(profileController.getCurrentProfile));

/**
 * Update student profile
 * PATCH /api/profiles/student
 */
router.patch(
  '/student',
  authMiddleware,
  validateStudentProfileAccess,
  asyncHandler(profileController.updateStudentProfile),
);

/**
 * Update tutor profile
 * PATCH /api/profiles/tutor
 */
router.patch(
  '/tutor',
  authMiddleware,
  validateTutorProfileAccess,
  asyncHandler(profileController.updateTutorProfile),
);

/**
 * Update school profile
 * PATCH /api/profiles/school
 */
router.patch(
  '/school',
  authMiddleware,
  validateSchoolProfileAccess,
  asyncHandler(profileController.updateSchoolProfile),
);

/**
 * Upload student avatar
 * POST /api/profiles/upload-avatar/student
 */
router.post(
  '/upload-avatar/student',
  authMiddleware,
  validateStudentProfileAccess,
  uploadAvatarMiddleware,
  validateFileUpload,
  asyncHandler(profileController.uploadStudentAvatar),
);

/**
 * Upload tutor avatar
 * POST /api/profiles/upload-avatar/tutor
 */
router.post(
  '/upload-avatar/tutor',
  authMiddleware,
  validateTutorProfileAccess,
  uploadAvatarMiddleware,
  validateFileUpload,
  asyncHandler(profileController.uploadTutorAvatar),
);

/**
 * Upload school logo
 * POST /api/profiles/upload-avatar/school
 */
router.post(
  '/upload-avatar/school',
  authMiddleware,
  validateSchoolProfileAccess,
  uploadAvatarMiddleware,
  validateFileUpload,
  asyncHandler(profileController.uploadSchoolLogo),
);

export default router;
