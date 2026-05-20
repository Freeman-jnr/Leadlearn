// ============================================================================
// AUTH MIDDLEWARE
// ============================================================================
// JWT verification, RBAC, error handling, and rate limiting middleware
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './auth.utils';
import { AuthException, AuthErrorCode, HTTPStatus, Role, Permission, ROLE_PERMISSIONS, JWTPayload, AuthRequest } from './auth.types';

// Rate limiting store (in-memory, use Redis for production)
const rateLimitStore: Record<string, { count: number; resetTime: number }> = {};

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 10;

/**
 * Rate limiting middleware
 */
export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
  const identifier = req.ip || 'unknown';
  const now = Date.now();

  if (!rateLimitStore[identifier]) {
    rateLimitStore[identifier] = { count: 1, resetTime: now + RATE_LIMIT_WINDOW };
    next();
    return;
  }

  const record = rateLimitStore[identifier];

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + RATE_LIMIT_WINDOW;
    next();
    return;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    throw new AuthException(
      AuthErrorCode.RATE_LIMIT_EXCEEDED,
      HTTPStatus.TOO_MANY_REQUESTS,
      'Too many requests. Please try again later.',
    );
  }

  record.count++;
  next();
}

/**
 * JWT authentication middleware
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthException(
      AuthErrorCode.UNAUTHORIZED,
      HTTPStatus.UNAUTHORIZED,
      'Missing or invalid authorization header',
    );
  }

  const token = authHeader.substring(7);
  const secret = process.env.JWT_SECRET || 'default-secret';

  const payload = verifyToken(token, secret);

  if (!payload) {
    throw new AuthException(
      AuthErrorCode.INVALID_TOKEN,
      HTTPStatus.UNAUTHORIZED,
      'Invalid or expired token',
    );
  }

  // Attach user to request
  (req as unknown as AuthRequest & Request).user = {
    id: payload.userId,
    email: payload.email,
    role: payload.role,
  };

  next();
}

/**
 * Role-based authorization middleware
 */
export function authorize(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as unknown as AuthRequest & Request;

    if (!authReq.user) {
      throw new AuthException(
        AuthErrorCode.UNAUTHORIZED,
        HTTPStatus.UNAUTHORIZED,
        'User not authenticated',
      );
    }

    if (!allowedRoles.includes(authReq.user.role)) {
      throw new AuthException(
        AuthErrorCode.FORBIDDEN,
        HTTPStatus.FORBIDDEN,
        'You do not have permission to access this resource',
      );
    }

    next();
  };
}

/**
 * Permission-based authorization middleware
 */
export function requirePermission(...permissions: Permission[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as unknown as AuthRequest & Request;

    if (!authReq.user) {
      throw new AuthException(
        AuthErrorCode.UNAUTHORIZED,
        HTTPStatus.UNAUTHORIZED,
        'User not authenticated',
      );
    }

    const userPermissions = ROLE_PERMISSIONS[authReq.user.role];

    if (!permissions.some((p) => userPermissions.includes(p))) {
      throw new AuthException(
        AuthErrorCode.FORBIDDEN,
        HTTPStatus.FORBIDDEN,
        'Insufficient permissions',
      );
    }

    next();
  };
}

/**
 * Error handling middleware
 */
export function errorHandlingMiddleware(err: Error | AuthException, req: Request, res: Response, next: NextFunction): void {
  console.error('[Auth Error]', err);

  if (err instanceof AuthException) {
    res.status(err.status).json({
      success: false,
      statusCode: err.status,
      message: err.message,
      error: {
        code: err.code,
        details: err.message,
      },
    });
    return;
  }

  res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: HTTPStatus.INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
    error: {
      code: 'INTERNAL_ERROR',
      details: err.message,
    },
  });
}

/**
 * Async error wrapper
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
