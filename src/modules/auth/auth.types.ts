// ============================================================================
// AUTH TYPES & ENUMS
// ============================================================================
// Centralized types for authentication module
// Includes enums, interfaces, RBAC configuration, and error handling
// ============================================================================

// Error codes for authentication
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  INVALID_EMAIL = 'INVALID_EMAIL',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

// HTTP Status codes
export enum HTTPStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
}

// Role-based access control
export enum Role {
  STUDENT = 'STUDENT',
  TUTOR = 'TUTOR',
  SCHOOL = 'SCHOOL',
  ADMIN = 'ADMIN',
}

// Permission types
export enum Permission {
  CREATE_USER = 'CREATE_USER',
  READ_USER = 'READ_USER',
  UPDATE_USER = 'UPDATE_USER',
  DELETE_USER = 'DELETE_USER',
  MANAGE_ROLES = 'MANAGE_ROLES',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
}

// Role permissions matrix
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.STUDENT]: [Permission.READ_USER, Permission.UPDATE_USER],
  [Role.TUTOR]: [Permission.READ_USER, Permission.UPDATE_USER, Permission.VIEW_ANALYTICS],
  [Role.SCHOOL]: [Permission.CREATE_USER, Permission.READ_USER, Permission.UPDATE_USER, Permission.VIEW_ANALYTICS],
  [Role.ADMIN]: [
    Permission.CREATE_USER,
    Permission.READ_USER,
    Permission.UPDATE_USER,
    Permission.DELETE_USER,
    Permission.MANAGE_ROLES,
    Permission.VIEW_ANALYTICS,
  ],
};

// Custom auth exception
export class AuthException extends Error {
  constructor(
    public code: AuthErrorCode,
    public status: HTTPStatus,
    message: string,
  ) {
    super(message);
    this.name = 'AuthException';
  }
}

// JWT payload interface
export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
}

// Authenticated request interface
export interface AuthRequest {
  user: {
    id: string;
    email: string;
    role: Role;
  };
}

// Auth response wrapper
export interface AuthResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  error?: {
    code: string;
    details: string;
  };
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Register credentials
export interface RegisterCredentials {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
}

// Token pair response
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// User profile response
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Password change request
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
