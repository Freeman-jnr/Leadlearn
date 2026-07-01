// ============================================================================
// PROFILE UTILITIES
// ============================================================================
// Cloudinary integration and helper functions
// ============================================================================

import { v2 as cloudinary } from 'cloudinary';
import { ProfileException, ProfileErrorCode, CloudinaryUploadResponse } from './profile.types';

// Configure Cloudinary
export function initializeCloudinary(): void {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Upload avatar to Cloudinary
 */
export async function uploadAvatarToCloudinary(
  buffer: Buffer,
  fileName: string,
  folder: string,
): Promise<string> {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `leadlearnhub/profiles/${folder}`,
          public_id: fileName,
          resource_type: 'auto',
          transformation: [
            {
              width: 400,
              height: 400,
              crop: 'fill',
              gravity: 'face',
              quality: 'auto',
            },
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve((result as CloudinaryUploadResponse).secure_url);
          }
        },
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    throw new ProfileException(
      ProfileErrorCode.CLOUDINARY_UPLOAD_FAILED,
      500,
      `Failed to upload avatar: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Delete avatar from Cloudinary
 */
export async function deleteAvatarFromCloudinary(avatarUrl: string): Promise<void> {
  try {
    if (!avatarUrl || !avatarUrl.includes('cloudinary')) {
      return;
    }

    // Extract public ID from URL
    const urlParts = avatarUrl.split('/');
    const fileName = urlParts[urlParts.length - 1].split('.')[0];
    const folderPath = `leadlearnhub/profiles/${urlParts[urlParts.length - 2]}`;
    const publicId = `${folderPath}/${fileName}`;

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('[Cloudinary Delete Error]', error);
    // Don't throw error for deletion failure
  }
}

/**
 * Validate image file
 */
export function validateImageFile(file: Express.Multer.File | undefined): void {
  if (!file) {
    throw new ProfileException(
      ProfileErrorCode.INVALID_FILE_TYPE,
      400,
      'No file uploaded',
    );
  }

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new ProfileException(
      ProfileErrorCode.INVALID_FILE_TYPE,
      400,
      'Only JPEG, PNG, and WebP images are allowed',
    );
  }

  const maxFileSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxFileSize) {
    throw new ProfileException(
      ProfileErrorCode.FILE_TOO_LARGE,
      400,
      'File size must not exceed 5MB',
    );
  }
}

/**
 * Generate unique file name for Cloudinary
 */
export function generateCloudinaryFileName(userId: string): string {
  const timestamp = Date.now();
  return `${userId}-${timestamp}`;
}

/**
 * Format profile response
 */
export function formatProfileResponse<T>(
  success: boolean,
  message: string,
  statusCode: number,
  data?: T,
  error?: { code: string; details: string },
) {
  return {
    success,
    message,
    statusCode,
    ...(data && { data }),
    ...(error && { error }),
  };
}
