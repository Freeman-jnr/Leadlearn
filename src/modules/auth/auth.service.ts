// ============================================================================
// AUTH SERVICE
// ============================================================================
// Core authentication business logic
// ============================================================================

import { prisma } from '../../lib/prisma';
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  isStrongPassword,
  isValidEmail,
} from './auth.utils';
import { AuthException, AuthErrorCode, HTTPStatus, Role, TokenPair, UserProfile } from './auth.types';

/**
 * Register new user
 */
export async function registerUser(
  fullName: string,
  email: string,
  password: string,
  role: Role,
): Promise<UserProfile> {
  // Validate email
  if (!isValidEmail(email)) {
    throw new AuthException(
      AuthErrorCode.INVALID_EMAIL,
      HTTPStatus.BAD_REQUEST,
      'Invalid email format',
    );
  }

  // Validate password strength
  if (!isStrongPassword(password)) {
    throw new AuthException(
      AuthErrorCode.WEAK_PASSWORD,
      HTTPStatus.BAD_REQUEST,
      'Password does not meet security requirements',
    );
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AuthException(
      AuthErrorCode.USER_ALREADY_EXISTS,
      HTTPStatus.CONFLICT,
      'User with this email already exists',
    );
  }

  // Hash password
  const hashedPassword = hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      role,
    },
  });

  return formatUserProfile(user);
}

/**
 * Login user and return tokens
 */
export async function loginUser(
  email: string,
  password: string,
): Promise<{ user: UserProfile; tokens: TokenPair }> {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AuthException(
      AuthErrorCode.INVALID_CREDENTIALS,
      HTTPStatus.BAD_REQUEST,
      'Invalid email or password',
    );
  }

  // Verify password
  if (!comparePassword(password, user.password)) {
    throw new AuthException(
      AuthErrorCode.INVALID_CREDENTIALS,
      HTTPStatus.BAD_REQUEST,
      'Invalid email or password',
    );
  }

  // Generate tokens
  const accessSecret = process.env.JWT_SECRET || 'default-secret';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';

  const accessToken = generateAccessToken(user.id, user.email, user.role, accessSecret);
  const refreshToken = generateRefreshToken(user.id, user.email, user.role, refreshSecret);

  // Store refresh token
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return {
    user: formatUserProfile(user),
    tokens: {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
    },
  };
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<TokenPair> {
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';

  // Verify refresh token
  const { verifyToken } = await import('./auth.utils');
  const payload = verifyToken(refreshToken, refreshSecret);

  if (!payload) {
    throw new AuthException(
      AuthErrorCode.INVALID_TOKEN,
      HTTPStatus.UNAUTHORIZED,
      'Invalid or expired refresh token',
    );
  }

  // Verify refresh token matches stored token
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user || user.refreshToken !== refreshToken) {
    throw new AuthException(
      AuthErrorCode.INVALID_TOKEN,
      HTTPStatus.UNAUTHORIZED,
      'Refresh token mismatch',
    );
  }

  // Generate new access token
  const accessSecret = process.env.JWT_SECRET || 'default-secret';
  const newAccessToken = generateAccessToken(user.id, user.email, user.role, accessSecret);

  // Generate new refresh token
  const newRefreshToken = generateRefreshToken(user.id, user.email, user.role, refreshSecret);

  // Update refresh token
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: newRefreshToken },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    expiresIn: 15 * 60,
  };
}

/**
 * Logout user
 */
export async function logoutUser(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string): Promise<UserProfile> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AuthException(
      AuthErrorCode.USER_NOT_FOUND,
      HTTPStatus.NOT_FOUND,
      'User not found',
    );
  }

  return formatUserProfile(user);
}

/**
 * Change password
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  // Find user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AuthException(
      AuthErrorCode.USER_NOT_FOUND,
      HTTPStatus.NOT_FOUND,
      'User not found',
    );
  }

  // Verify current password
  if (!comparePassword(currentPassword, user.password)) {
    throw new AuthException(
      AuthErrorCode.INVALID_CREDENTIALS,
      HTTPStatus.BAD_REQUEST,
      'Current password is incorrect',
    );
  }

  // Validate new password strength
  if (!isStrongPassword(newPassword)) {
    throw new AuthException(
      AuthErrorCode.WEAK_PASSWORD,
      HTTPStatus.BAD_REQUEST,
      'New password does not meet security requirements',
    );
  }

  // Hash new password
  const hashedPassword = hashPassword(newPassword);

  // Update password
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}

/**
 * Format user profile response
 */
function formatUserProfile(user: any): UserProfile {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
