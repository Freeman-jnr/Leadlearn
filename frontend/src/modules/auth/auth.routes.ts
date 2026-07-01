// ============================================================================
// AUTH ROUTES
// ============================================================================
// Authentication module route definitions
// ============================================================================

import { Router } from 'express';
import * as authController from './auth.controller';
import { authMiddleware, authorize, asyncHandler, rateLimitMiddleware } from './auth.middleware';
import { Role } from './auth.types';

const router = Router();

/**
 * Public Routes (No authentication required)
 */

// POST /api/auth/register
router.post(
  '/register',
  rateLimitMiddleware,
  asyncHandler(authController.register),
);

// POST /api/auth/login
router.post(
  '/login',
  rateLimitMiddleware,
  asyncHandler(authController.login),
);

// POST /api/auth/refresh
router.post(
  '/refresh',
  rateLimitMiddleware,
  asyncHandler(authController.refreshToken),
);

/**
 * Protected Routes (Authentication required)
 */

// POST /api/auth/logout
router.post(
  '/logout',
  authMiddleware,
  asyncHandler(authController.logout),
);

// GET /api/auth/me
router.get(
  '/me',
  authMiddleware,
  asyncHandler(authController.getProfile),
);

// POST /api/auth/change-password
router.post(
  '/change-password',
  authMiddleware,
  asyncHandler(authController.changePassword),
);

export default router;
