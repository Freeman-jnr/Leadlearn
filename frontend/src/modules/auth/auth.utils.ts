// ============================================================================
// AUTH UTILITIES
// ============================================================================
// JWT token generation, verification, and password utilities
// ============================================================================

import crypto from 'crypto';
import { JWTPayload, Role } from './auth.types';

// Token expiry times (in seconds)
const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days

/**
 * Generate JWT token
 * Uses HMAC-SHA256 for signing
 */
export function generateToken(
  payload: Omit<JWTPayload, 'iat' | 'exp'>,
  secret: string,
  expirySeconds: number,
): string {
  const now = Math.floor(Date.now() / 1000);
  const tokenPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + expirySeconds,
  };

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const body = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64');

  return `${header}.${body}.${signature}`;
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string, secret: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${body}`)
      .digest('base64');

    if (signature !== expectedSignature) return null;

    const payload: JWTPayload = JSON.parse(Buffer.from(body, 'base64').toString());
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp < now) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Generate access token
 */
export function generateAccessToken(
  userId: string,
  email: string,
  role: Role,
  secret: string,
): string {
  return generateToken(
    { userId, email, role },
    secret,
    ACCESS_TOKEN_EXPIRY,
  );
}

/**
 * Generate refresh token
 */
export function generateRefreshToken(
  userId: string,
  email: string,
  role: Role,
  secret: string,
): string {
  return generateToken(
    { userId, email, role },
    secret,
    REFRESH_TOKEN_EXPIRY,
  );
}

/**
 * Hash password using SHA-256
 */
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Compare password with hash
 */
export function comparePassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

/**
 * Validate password strength
 * Requirements: 8+ chars, uppercase, lowercase, number, special char
 */
export function isStrongPassword(password: string): boolean {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Generate random token (for refresh token storage)
 */
export function generateRandomToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Export token expiry constants
export const TOKEN_EXPIRY = {
  ACCESS: ACCESS_TOKEN_EXPIRY,
  REFRESH: REFRESH_TOKEN_EXPIRY,
};
