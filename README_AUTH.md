# Authentication Foundation - LearnHub Backend

## Overview

This document describes the authentication foundation for the LearnHub backend. The implementation includes user registration, login, JWT token management, role-based access control (RBAC), and comprehensive error handling.

## Architecture

### Module Structure

```
src/modules/auth/
├── auth.types.ts       # Types, enums, interfaces
├── auth.utils.ts       # JWT, password utilities
├── auth.validation.ts  # Zod validation schemas
├── auth.middleware.ts  # Auth & error handling
├── auth.service.ts     # Business logic
├── auth.controller.ts  # HTTP handlers
├── auth.routes.ts      # Route definitions
└── index.ts            # Module exports
```

### Clean Architecture

- **Types Layer**: Enums, interfaces, error handling
- **Utils Layer**: Cryptography and token operations
- **Service Layer**: Business logic and database operations
- **Controller Layer**: HTTP request handling
- **Middleware Layer**: Authentication, authorization, error handling
- **Routes Layer**: API endpoint definitions

## Features

### Security

✅ **JWT Token Management**
- 15-minute access tokens
- 7-day refresh tokens
- HMAC-SHA256 signing
- Automatic token rotation on refresh

✅ **Password Security**
- SHA-256 hashing
- Password strength validation (8+ chars, uppercase, lowercase, number, special)
- Secure password comparison

✅ **Role-Based Access Control (RBAC)**
- 4 roles: STUDENT, TUTOR, SCHOOL, ADMIN
- Permission matrix per role
- Route-level authorization

✅ **Rate Limiting**
- 10 requests per 15 minutes per IP
- In-memory storage (upgrade to Redis for production)

✅ **Error Handling**
- Custom authentication exceptions
- Structured error responses
- HTTP status codes

## Database Schema

### User Model

```prisma
model User {
  id            String   @id @default(uuid())
  fullName      String
  email         String   @unique
  password      String
  role          Role
  isVerified    Boolean  @default(false)
  refreshToken  String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum Role {
  STUDENT
  TUTOR
  SCHOOL
  ADMIN
}
```

## API Endpoints

### Public Routes

#### 1. Register

```bash
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "role": "STUDENT"
}

Response (201):
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "isVerified": false,
    "createdAt": "2026-05-20T10:00:00Z",
    "updatedAt": "2026-05-20T10:00:00Z"
  }
}
```

#### 2. Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response (200):
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "STUDENT",
      "isVerified": false,
      "createdAt": "2026-05-20T10:00:00Z",
      "updatedAt": "2026-05-20T10:00:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": 900
    }
  }
}
```

#### 3. Refresh Token

```bash
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response (200):
{
  "success": true,
  "statusCode": 200,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 900
  }
}
```

### Protected Routes

#### 4. Get Current User Profile

```bash
GET /api/auth/me
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "statusCode": 200,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "isVerified": false,
    "createdAt": "2026-05-20T10:00:00Z",
    "updatedAt": "2026-05-20T10:00:00Z"
  }
}
```

#### 5. Logout

```bash
POST /api/auth/logout
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "statusCode": 200,
  "message": "Logout successful"
}
```

#### 6. Change Password

```bash
POST /api/auth/change-password
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "currentPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!",
  "confirmPassword": "NewSecurePass456!"
}

Response (200):
{
  "success": true,
  "statusCode": 200,
  "message": "Password changed successfully"
}
```

## Error Responses

### Invalid Credentials (400)

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Invalid email or password",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "details": "Invalid email or password"
  }
}
```

### User Already Exists (409)

```json
{
  "success": false,
  "statusCode": 409,
  "message": "User with this email already exists",
  "error": {
    "code": "USER_ALREADY_EXISTS",
    "details": "User with this email already exists"
  }
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid or expired token",
  "error": {
    "code": "INVALID_TOKEN",
    "details": "Invalid or expired token"
  }
}
```

### Forbidden (403)

```json
{
  "success": false,
  "statusCode": 403,
  "message": "You do not have permission to access this resource",
  "error": {
    "code": "FORBIDDEN",
    "details": "You do not have permission to access this resource"
  }
}
```

### Rate Limit (429)

```json
{
  "success": false,
  "statusCode": 429,
  "message": "Too many requests. Please try again later.",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "details": "Too many requests. Please try again later."
  }
}
```

## Role Permissions Matrix

| Permission | STUDENT | TUTOR | SCHOOL | ADMIN |
|-----------|---------|-------|--------|-------|
| CREATE_USER | ❌ | ❌ | ✅ | ✅ |
| READ_USER | ✅ | ✅ | ✅ | ✅ |
| UPDATE_USER | ✅ | ✅ | ✅ | ✅ |
| DELETE_USER | ❌ | ❌ | ❌ | ✅ |
| MANAGE_ROLES | ❌ | ❌ | ❌ | ✅ |
| VIEW_ANALYTICS | ❌ | ✅ | ✅ | ✅ |

## Setup Instructions

### 1. Install Dependencies

```bash
npm install express jsonwebtoken zod @prisma/client prisma
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and set your values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/leadlearnhub"
JWT_SECRET="generate with: openssl rand -base64 32"
JWT_REFRESH_SECRET="generate with: openssl rand -base64 32"
```

### 3. Initialize Database

```bash
# Run migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
```

### 4. Start Development Server

```bash
npm run dev
```

## Usage Examples

### Node.js / JavaScript Client

```javascript
const API_URL = 'http://localhost:3000/api';

// Register
const registerResponse = await fetch(`${API_URL}/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123!',
    confirmPassword: 'SecurePass123!',
    role: 'STUDENT',
  }),
});

const registerData = await registerResponse.json();
console.log(registerData);

// Login
const loginResponse = await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'SecurePass123!',
  }),
});

const loginData = await loginResponse.json();
const { accessToken } = loginData.data.tokens;

// Get Profile
const profileResponse = await fetch(`${API_URL}/auth/me`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
});

const profileData = await profileResponse.json();
console.log(profileData);
```

## Future Enhancements

- [ ] Email verification on signup
- [ ] Password reset flow
- [ ] Two-factor authentication (2FA)
- [ ] OAuth2 integration (Google, GitHub)
- [ ] JWT token blacklisting
- [ ] Activity logging and audit trail
- [ ] IP whitelist/blacklist
- [ ] Device management
- [ ] Session management
- [ ] CORS configuration

## Security Best Practices

1. **Secrets Management**
   - Use strong, random JWT secrets
   - Store secrets in environment variables
   - Rotate secrets regularly
   - Never commit `.env` file

2. **Password Handling**
   - Enforce strong password requirements
   - Use secure hashing algorithms
   - Never log passwords
   - Implement password reset securely

3. **Token Management**
   - Use short expiry times for access tokens
   - Store refresh tokens securely
   - Implement token rotation
   - Revoke tokens on logout

4. **Rate Limiting**
   - Implement rate limiting on auth endpoints
   - Use Redis for distributed rate limiting
   - Monitor for suspicious patterns

5. **HTTPS**
   - Always use HTTPS in production
   - Set secure flags on cookies
   - Implement HSTS headers

## Troubleshooting

### "Invalid token" Error

- Verify JWT_SECRET is set correctly
- Check token hasn't expired
- Ensure Bearer token format is correct

### "User not found" Error

- Verify user exists in database
- Check email spelling
- Ensure user was created in correct database

### "Invalid credentials" Error

- Verify email and password are correct
- Check email address exists
- Ensure password is typed correctly

### Database Connection Error

- Verify DATABASE_URL is correct
- Check PostgreSQL service is running
- Ensure database exists
- Verify user has proper permissions

## Support

For issues or questions, please contact the development team or create an issue in the repository.
