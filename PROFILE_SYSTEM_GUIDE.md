# 🎓 LearnHub Profile System - Complete Implementation Guide

## Overview

This document provides a comprehensive guide to the LearnHub User Profile System implementation. The system manages profiles for Students, Tutors, and Schools with avatar/logo upload capabilities.

---

## 📋 Table of Contents

1. [Architecture](#architecture)
2. [Module Structure](#module-structure)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Setup Instructions](#setup-instructions)
6. [Usage Examples](#usage-examples)
7. [Error Handling](#error-handling)
8. [Security](#security)

---

## 🏗️ Architecture

### Clean Architecture Pattern

```
Request → Router → Middleware → Controller → Service → Database
           ↑                        ↓
        Routes              Business Logic
```

### Module Components

- **profile.routes.ts**: Express routes with authentication
- **profile.controller.ts**: HTTP request handlers
- **profile.service.ts**: Business logic and database operations
- **profile.middleware.ts**: File upload and authorization
- **profile.validation.ts**: Input validation with Zod
- **profile.utils.ts**: Cloudinary integration and helpers
- **profile.types.ts**: TypeScript interfaces and enums

---

## 📁 Module Structure

```
src/modules/profiles/
├── profile.controller.ts      # HTTP handlers
├── profile.service.ts         # Business logic
├── profile.routes.ts          # Express routes
├── profile.validation.ts      # Zod schemas
├── profile.middleware.ts      # Multer & auth
├── profile.types.ts           # Interfaces & enums
├── profile.utils.ts           # Cloudinary & helpers
└── index.ts                   # Exports
```

---

## 🗄️ Database Schema

### StudentProfile

```prisma
model StudentProfile {
  id          String   @id @default(uuid())
  userId      String   @unique
  classLevel  String?       # e.g., "10A", "Form 4"
  schoolName  String?       # Name of school
  age         Int?          # Age 5-120
  gender      String?       # MALE, FEMALE, OTHER
  avatar      String?       # Cloudinary URL
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### TutorProfile

```prisma
model TutorProfile {
  id              String   @id @default(uuid())
  userId          String   @unique
  bio             String?       # Bio (max 500 chars)
  subjects        String[]      # Array of subjects
  experience      Int?          # Years of experience (0-60)
  qualifications  String?       # Qualifications (max 500 chars)
  avatar          String?       # Cloudinary URL
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### SchoolProfile

```prisma
model SchoolProfile {
  id           String   @id @default(uuid())
  userId       String   @unique
  schoolName   String        # School name (required)
  address      String?       # School address
  schoolType   String?       # e.g., "Primary", "Secondary"
  logo         String?       # Cloudinary URL
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## 🔌 API Endpoints

### Authentication Required (All Endpoints)

All endpoints require JWT token in Authorization header:

```
Authorization: Bearer <jwt_token>
```

### 1. Get Current User Profile

**Endpoint:** `GET /api/profiles/me`

**Roles:** STUDENT, TUTOR, SCHOOL

**Response:**

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "statusCode": 200,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "classLevel": "10A",
    "schoolName": "Example School",
    "age": 16,
    "gender": "MALE",
    "avatar": "https://cloudinary.com/...",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 2. Update Student Profile

**Endpoint:** `PATCH /api/profiles/student`

**Roles:** STUDENT only

**Request Body:**

```json
{
  "classLevel": "10A",
  "schoolName": "Example School",
  "age": 16,
  "gender": "MALE"
}
```

**Response:** (Same as Get Profile)

### 3. Update Tutor Profile

**Endpoint:** `PATCH /api/profiles/tutor`

**Roles:** TUTOR only

**Request Body:**

```json
{
  "bio": "Experienced mathematics tutor with 10 years of experience",
  "subjects": ["Mathematics", "Physics", "Chemistry"],
  "experience": 10,
  "qualifications": "M.Sc Mathematics, B.Ed"
}
```

**Response:** (Same as Get Profile)

### 4. Update School Profile

**Endpoint:** `PATCH /api/profiles/school`

**Roles:** SCHOOL only

**Request Body:**

```json
{
  "schoolName": "Example High School",
  "address": "123 Main Street, City",
  "schoolType": "Secondary"
}
```

**Response:** (Same as Get Profile)

### 5. Upload Student Avatar

**Endpoint:** `POST /api/profiles/upload-avatar/student`

**Roles:** STUDENT only

**Request:** Form-data

```
Content-Type: multipart/form-data

Form Fields:
- avatar: <image_file> (JPEG, PNG, WebP, max 5MB)
```

**Response:**

```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "statusCode": 200,
  "data": {
    "id": "uuid",
    "avatar": "https://cloudinary.com/...",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 6. Upload Tutor Avatar

**Endpoint:** `POST /api/profiles/upload-avatar/tutor`

**Roles:** TUTOR only

**Request:** Form-data (same as student)

**Response:** (Same as student avatar upload)

### 7. Upload School Logo

**Endpoint:** `POST /api/profiles/upload-avatar/school`

**Roles:** SCHOOL only

**Request:** Form-data (same as student)

**Response:** (Same as student avatar upload)

---

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install multer cloudinary
npm install --save-dev @types/multer
```

### 2. Update Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Add Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run Prisma Migration

```bash
npx prisma migrate dev --name add_profiles
npx prisma generate
```

### 4. Initialize Cloudinary in Server

In your main Express setup file:

```typescript
import { initializeCloudinary } from './modules/profiles';

// Initialize Cloudinary
initializeCloudinary();
```

### 5. Register Profile Routes

In your main Express setup:

```typescript
import { profileRoutes } from './modules/profiles';

// Register routes
app.use('/api/profiles', profileRoutes);
```

---

## 📝 Usage Examples

### Example 1: Student Updates Profile

```bash
curl -X PATCH http://localhost:3000/api/profiles/student \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "classLevel": "10A",
    "schoolName": "Cambridge High",
    "age": 16,
    "gender": "MALE"
  }'
```

### Example 2: Tutor Uploads Avatar

```bash
curl -X POST http://localhost:3000/api/profiles/upload-avatar/tutor \
  -H "Authorization: Bearer <jwt_token>" \
  -F "avatar=@/path/to/avatar.jpg"
```

### Example 3: School Updates Profile

```bash
curl -X PATCH http://localhost:3000/api/profiles/school \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "schoolName": "Cambridge High School",
    "address": "123 Main Street, London",
    "schoolType": "Secondary"
  }'
```

---

## ❌ Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "statusCode": 400,
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error description"
  }
}
```

### Common Error Codes

| Code | Status | Message |
|------|--------|----------|
| `PROFILE_NOT_FOUND` | 404 | Profile does not exist |
| `PROFILE_ALREADY_EXISTS` | 409 | Profile already exists |
| `INVALID_FILE_TYPE` | 400 | Only JPEG, PNG, WebP allowed |
| `FILE_TOO_LARGE` | 400 | File size exceeds 5MB |
| `ROLE_MISMATCH` | 403 | User role doesn't match |
| `UNAUTHORIZED_PROFILE_ACCESS` | 403 | User cannot access this profile |
| `CLOUDINARY_UPLOAD_FAILED` | 500 | Avatar upload failed |
| `INVALID_PROFILE_DATA` | 400 | Invalid profile data provided |

---

## 🔒 Security Features

### 1. JWT Authentication

- All endpoints protected with JWT verification
- Token extracted from `Authorization: Bearer <token>` header
- Token expiration validation

### 2. Role-Based Access Control

- Students can only access/edit student profiles
- Tutors can only access/edit tutor profiles
- Schools can only access/edit school profiles
- ADMIN role can manage all profiles

### 3. File Upload Security

- Whitelist MIME types (JPEG, PNG, WebP)
- File size limit: 5MB
- Multer memory storage (no disk exposure)
- File extension validation

### 4. Cloudinary Integration

- API credentials from environment variables
- Automatic image transformations (400x400, face-focused)
- Organized folder structure per role
- Old file automatic cleanup on update

### 5. Input Validation

- Zod schema validation
- Type-safe request/response
- Sanitization of string inputs

---

## 🎯 Key Features

✅ **Clean Architecture**: Separated concerns (routes, controllers, services)

✅ **Type-Safe**: Full TypeScript support

✅ **Error Handling**: Comprehensive error management

✅ **File Upload**: Multer + Cloudinary integration

✅ **Role-Based Access**: RBAC protection

✅ **Auto Profile Creation**: Profiles created on first login

✅ **Image Optimization**: Cloudinary transformations

✅ **Production Ready**: Error logging, validation, security

---

## 🔄 Workflow Example

### Student Registration & Profile Creation

1. User registers with role `STUDENT`
2. User profile created in `User` table
3. Empty `StudentProfile` auto-created via trigger/service
4. User can update profile details
5. User can upload avatar

### Profile Update Flow

```
Request → Middleware (Auth + Role Check)
   ↓
Validation (Zod Schema)
   ↓
Controller (Parse Request)
   ↓
Service (Update Database)
   ↓
Response (Format & Return)
```

### Avatar Upload Flow

```
Request with File → Multer (Parse Form-Data)
   ↓
File Validation (Type, Size)
   ↓
Cloudinary Upload (Transform & Store)
   ↓
Database Update (New Avatar URL)
   ↓
Old Avatar Deletion (Cleanup)
   ↓
Response (Return New URL)
```

---

## 📚 Future Enhancements

- [ ] Social media links for profiles
- [ ] Profile verification badges
- [ ] Profile search and filtering
- [ ] Profile visibility settings
- [ ] Profile activity history
- [ ] Batch avatar processing
- [ ] CDN caching optimization
- [ ] Profile recommendations

---

## 📞 Support

For issues or questions:

1. Check the error code in response
2. Review the environment variables
3. Verify Cloudinary credentials
4. Check JWT token validity
5. Verify user role permissions

---

**System Status**: ✅ Production Ready

**Last Updated**: 2024-01-01
