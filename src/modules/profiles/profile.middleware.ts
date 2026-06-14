// ============================================================================
// PROFILE MIDDLEWARE
// ============================================================================
// File upload, role verification, and auth middleware
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { ProfileException, ProfileErrorCode } from './profile.types';
import { validateImageFile } from './profile.utils';
import { AuthRequest, Role } from '../auth/auth.types';

// Multer storage configuration (memory storage for Cloudinary)
const storage = multer.memoryStorage();

// Multer upload middleware
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new ProfileException(
          ProfileErrorCode.INVALID_FILE_TYPE,
          400,
          'Only JPEG, PNG, and WebP images are allowed',
        ),
      );
    }
  },
});

/**
 * Avatar upload middleware for single file
 */
export function uploadAvatarMiddleware(req: Request, res: Response, next: NextFunction): void {
  const singleUpload = upload.single('avatar');
  singleUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'FILE_TOO_LARGE') {
        throw new ProfileException(
          ProfileErrorCode.FILE_TOO_LARGE,
          400,
          'File size must not exceed 5MB',
        );
      }
      throw new ProfileException(
        ProfileErrorCode.INVALID_FILE_TYPE,
        400,
        err.message,
      );
    } else if (err) {
      throw err;
    }
    next();
  });
}

/**
 * Validate student profile access
 */
export function validateStudentProfileAccess(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authReq = req as unknown as AuthRequest & Request;
  const userRole = authReq.user.role;

  if (userRole !== Role.STUDENT) {
    throw new ProfileException(
      ProfileErrorCode.ROLE_MISMATCH,
      403,
      'Only students can access student profiles',
    );
  }

  next();
}

/**
 * Validate tutor profile access
 */
export function validateTutorProfileAccess(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authReq = req as unknown as AuthRequest & Request;
  const userRole = authReq.user.role;

  if (userRole !== Role.TUTOR) {
    throw new ProfileException(
      ProfileErrorCode.ROLE_MISMATCH,
      403,
      'Only tutors can access tutor profiles',
    );
  }

  next();
}

/**
 * Validate school profile access
 */
export function validateSchoolProfileAccess(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authReq = req as unknown as AuthRequest & Request;
  const userRole = authReq.user.role;

  if (userRole !== Role.SCHOOL) {
    throw new ProfileException(
      ProfileErrorCode.ROLE_MISMATCH,
      403,
      'Only schools can access school profiles',
    );
  }

  next();
}

/**
 * Validate file upload in request
 */
export function validateFileUpload(req: Request, res: Response, next: NextFunction): void {
  if (!req.file) {
    throw new ProfileException(
      ProfileErrorCode.INVALID_FILE_TYPE,
      400,
      'No file uploaded',
    );
  }

  validateImageFile(req.file);
  next();
}
