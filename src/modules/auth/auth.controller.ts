// ============================================================================
// AUTH CONTROLLER
// ============================================================================
// HTTP request handlers for authentication endpoints
// ============================================================================

import { Request, Response } from 'express';
import { registerSchema, loginSchema, changePasswordSchema } from './auth.validation';
import * as authService from './auth.service';
import { HTTPStatus, AuthResponse, AuthRequest } from './auth.types';

/**
 * Register endpoint handler
 */
export async function register(req: Request, res: Response): Promise<void> {
  const body = registerSchema.parse(req.body);

  const user = await authService.registerUser(
    body.fullName,
    body.email,
    body.password,
    body.role,
  );

  const response: AuthResponse = {
    success: true,
    statusCode: HTTPStatus.CREATED,
    message: 'User registered successfully',
    data: user,
  };

  res.status(HTTPStatus.CREATED).json(response);
}

/**
 * Login endpoint handler
 */
export async function login(req: Request, res: Response): Promise<void> {
  const body = loginSchema.parse(req.body);

  const result = await authService.loginUser(body.email, body.password);

  const response: AuthResponse = {
    success: true,
    statusCode: HTTPStatus.OK,
    message: 'Login successful',
    data: {
      user: result.user,
      tokens: result.tokens,
    },
  };

  res.status(HTTPStatus.OK).json(response);
}

/**
 * Refresh token endpoint handler
 */
export async function refreshToken(req: Request, res: Response): Promise<void> {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(HTTPStatus.BAD_REQUEST).json({
      success: false,
      statusCode: HTTPStatus.BAD_REQUEST,
      message: 'Refresh token is required',
    });
    return;
  }

  const tokens = await authService.refreshAccessToken(refreshToken);

  const response: AuthResponse = {
    success: true,
    statusCode: HTTPStatus.OK,
    message: 'Token refreshed successfully',
    data: tokens,
  };

  res.status(HTTPStatus.OK).json(response);
}

/**
 * Logout endpoint handler
 */
export async function logout(req: Request, res: Response): Promise<void> {
  const authReq = req as unknown as AuthRequest & Request;
  const userId = authReq.user.id;

  await authService.logoutUser(userId);

  const response: AuthResponse = {
    success: true,
    statusCode: HTTPStatus.OK,
    message: 'Logout successful',
  };

  res.status(HTTPStatus.OK).json(response);
}

/**
 * Get current user profile endpoint handler
 */
export async function getProfile(req: Request, res: Response): Promise<void> {
  const authReq = req as unknown as AuthRequest & Request;
  const userId = authReq.user.id;

  const user = await authService.getUserProfile(userId);

  const response: AuthResponse = {
    success: true,
    statusCode: HTTPStatus.OK,
    message: 'Profile retrieved successfully',
    data: user,
  };

  res.status(HTTPStatus.OK).json(response);
}

/**
 * Change password endpoint handler
 */
export async function changePassword(req: Request, res: Response): Promise<void> {
  const authReq = req as unknown as AuthRequest & Request;
  const userId = authReq.user.id;
  const body = changePasswordSchema.parse(req.body);

  await authService.changePassword(
    userId,
    body.currentPassword,
    body.newPassword,
  );

  const response: AuthResponse = {
    success: true,
    statusCode: HTTPStatus.OK,
    message: 'Password changed successfully',
  };

  res.status(HTTPStatus.OK).json(response);
}
