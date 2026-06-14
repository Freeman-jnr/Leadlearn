// ============================================================================
// PROFILE SERVICE
// ============================================================================
// Business logic for profile operations
// ============================================================================

import { PrismaClient } from '@prisma/client';
import {
  ProfileException,
  ProfileErrorCode,
  StudentProfileData,
  TutorProfileData,
  SchoolProfileData,
} from './profile.types';
import {
  uploadAvatarToCloudinary,
  deleteAvatarFromCloudinary,
  generateCloudinaryFileName,
} from './profile.utils';

const prisma = new PrismaClient();

/**
 * Create student profile
 */
export async function createStudentProfile(userId: string): Promise<any> {
  try {
    const existingProfile = await prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new ProfileException(
        ProfileErrorCode.PROFILE_ALREADY_EXISTS,
        409,
        'Student profile already exists',
      );
    }

    const profile = await prisma.studentProfile.create({
      data: {
        userId,
      },
    });

    return profile;
  } catch (error) {
    if (error instanceof ProfileException) throw error;
    throw new ProfileException(
      ProfileErrorCode.INVALID_PROFILE_DATA,
      500,
      `Failed to create student profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Create tutor profile
 */
export async function createTutorProfile(userId: string): Promise<any> {
  try {
    const existingProfile = await prisma.tutorProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new ProfileException(
        ProfileErrorCode.PROFILE_ALREADY_EXISTS,
        409,
        'Tutor profile already exists',
      );
    }

    const profile = await prisma.tutorProfile.create({
      data: {
        userId,
        subjects: [],
      },
    });

    return profile;
  } catch (error) {
    if (error instanceof ProfileException) throw error;
    throw new ProfileException(
      ProfileErrorCode.INVALID_PROFILE_DATA,
      500,
      `Failed to create tutor profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Create school profile
 */
export async function createSchoolProfile(userId: string, schoolName: string): Promise<any> {
  try {
    const existingProfile = await prisma.schoolProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new ProfileException(
        ProfileErrorCode.PROFILE_ALREADY_EXISTS,
        409,
        'School profile already exists',
      );
    }

    const profile = await prisma.schoolProfile.create({
      data: {
        userId,
        schoolName,
      },
    });

    return profile;
  } catch (error) {
    if (error instanceof ProfileException) throw error;
    throw new ProfileException(
      ProfileErrorCode.INVALID_PROFILE_DATA,
      500,
      `Failed to create school profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Get student profile
 */
export async function getStudentProfile(userId: string): Promise<any> {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new ProfileException(
        ProfileErrorCode.PROFILE_NOT_FOUND,
        404,
        'Student profile not found',
      );
    }

    return profile;
  } catch (error) {
    if (error instanceof ProfileException) throw error;
    throw new ProfileException(
      ProfileErrorCode.PROFILE_NOT_FOUND,
      500,
      `Failed to fetch student profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Get tutor profile
 */
export async function getTutorProfile(userId: string): Promise<any> {
  try {
    const profile = await prisma.tutorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new ProfileException(
        ProfileErrorCode.PROFILE_NOT_FOUND,
        404,
        'Tutor profile not found',
      );
    }

    return profile;
  } catch (error) {
    if (error instanceof ProfileException) throw error;
    throw new ProfileException(
      ProfileErrorCode.PROFILE_NOT_FOUND,
      500,
      `Failed to fetch tutor profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Get school profile
 */
export async function getSchoolProfile(userId: string): Promise<any> {
  try {
    const profile = await prisma.schoolProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new ProfileException(
        ProfileErrorCode.PROFILE_NOT_FOUND,
        404,
        'School profile not found',
      );
    }

    return profile;
  } catch (error) {
    if (error instanceof ProfileException) throw error;
    throw new ProfileException(
      ProfileErrorCode.PROFILE_NOT_FOUND,
      500,
      `Failed to fetch school profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Update student profile
 */
export async function updateStudentProfile(
  userId: string,
  data: StudentProfileData,
): Promise<any> {
  try {
    const profile = await prisma.studentProfile.update({
      where: { userId },
      data: {
        classLevel: data.classLevel,
        schoolName: data.schoolName,
        age: data.age,
        gender: data.gender,
        ...(data.avatar && { avatar: data.avatar }),
      },
    });

    return profile;
  } catch (error) {
    if (error instanceof ProfileException) throw error;
    throw new ProfileException(
      ProfileErrorCode.INVALID_PROFILE_DATA,
      500,
      `Failed to update student profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Update tutor profile
 */
export async function updateTutorProfile(
  userId: string,
  data: TutorProfileData,
): Promise<any> {
  try {
    const profile = await prisma.tutorProfile.update({
      where: { userId },
      data: {
        bio: data.bio,
        subjects: data.subjects,
        experience: data.experience,
        qualifications: data.qualifications,
        ...(data.avatar && { avatar: data.avatar }),
      },
    });

    return profile;
  } catch (error) {
    if (error instanceof ProfileException) throw error;
    throw new ProfileException(
      ProfileErrorCode.INVALID_PROFILE_DATA,
      500,
      `Failed to update tutor profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Update school profile
 */
export async function updateSchoolProfile(
  userId: string,
  data: SchoolProfileData,
): Promise<any> {
  try {
    const profile = await prisma.schoolProfile.update({
      where: { userId },
      data: {
        schoolName: data.schoolName,
        address: data.address,
        schoolType: data.schoolType,
        ...(data.logo && { logo: data.logo }),
      },
    });

    return profile;
  } catch (error) {
    if (error instanceof ProfileException) throw error;
    throw new ProfileException(
      ProfileErrorCode.INVALID_PROFILE_DATA,
      500,
      `Failed to update school profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Upload student avatar
 */
export async function uploadStudentAvatar(
  userId: string,
  file: Express.Multer.File,
): Promise<any> {
  try {
    // Get current profile to find old avatar
    const profile = await getStudentProfile(userId);

    // Upload new avatar
    const fileName = generateCloudinaryFileName(userId);
    const avatarUrl = await uploadAvatarToCloudinary(file.buffer, fileName, 'students');

    // Delete old avatar if exists
    if (profile.avatar) {
      await deleteAvatarFromCloudinary(profile.avatar);
    }

    // Update profile with new avatar
    const updatedProfile = await prisma.studentProfile.update({
      where: { userId },
      data: { avatar: avatarUrl },
    });

    return updatedProfile;
  } catch (error) {
    if (error instanceof ProfileException) throw error;
    throw new ProfileException(
      ProfileErrorCode.CLOUDINARY_UPLOAD_FAILED,
      500,
      `Failed to upload avatar: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Upload tutor avatar
 */
export async function uploadTutorAvatar(
  userId: string,
  file: Express.Multer.File,
): Promise<any> {
  try {
    // Get current profile to find old avatar
    const profile = await getTutorProfile(userId);

    // Upload new avatar
    const fileName = generateCloudinaryFileName(userId);
    const avatarUrl = await uploadAvatarToCloudinary(file.buffer, fileName, 'tutors');

    // Delete old avatar if exists
    if (profile.avatar) {
      await deleteAvatarFromCloudinary(profile.avatar);
    }

    // Update profile with new avatar
    const updatedProfile = await prisma.tutorProfile.update({
      where: { userId },
      data: { avatar: avatarUrl },
    });

    return updatedProfile;
  } catch (error) {
    if (error instanceof ProfileException) throw error;
    throw new ProfileException(
      ProfileErrorCode.CLOUDINARY_UPLOAD_FAILED,
      500,
      `Failed to upload avatar: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Upload school logo
 */
export async function uploadSchoolLogo(
  userId: string,
  file: Express.Multer.File,
): Promise<any> {
  try {
    // Get current profile to find old logo
    const profile = await getSchoolProfile(userId);

    // Upload new logo
    const fileName = generateCloudinaryFileName(userId);
    const logoUrl = await uploadAvatarToCloudinary(file.buffer, fileName, 'schools');

    // Delete old logo if exists
    if (profile.logo) {
      await deleteAvatarFromCloudinary(profile.logo);
    }

    // Update profile with new logo
    const updatedProfile = await prisma.schoolProfile.update({
      where: { userId },
      data: { logo: logoUrl },
    });

    return updatedProfile;
  } catch (error) {
    if (error instanceof ProfileException) throw error;
    throw new ProfileException(
      ProfileErrorCode.CLOUDINARY_UPLOAD_FAILED,
      500,
      `Failed to upload logo: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
