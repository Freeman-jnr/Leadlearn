import { Router, Response } from 'express';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';

const router = Router();

function sanitizeUser(user: any) {
  if (!user) return user;
  const { password, ...rest } = user;
  return rest;
}

// GET /api/profiles/me
router.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json(sanitizeUser(req.user));
});

// PATCH /api/profiles/student
router.patch('/student', requireAuth, requireRole(['STUDENT']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { classLevel, schoolName, age, gender, avatar } = req.body;

    await prisma.studentProfile.upsert({
      where: { userId },
      update: { classLevel, schoolName, age, gender, ...(avatar && { avatar }) },
      create: { userId, classLevel, schoolName, age, gender, avatar },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { student: true, tutor: true, school: true },
    });

    res.json(sanitizeUser(user));
  } catch (error) {
    console.error('Update student profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PATCH /api/profiles/tutor
router.patch('/tutor', requireAuth, requireRole(['TUTOR']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { subjects, qualifications, bio, experience, avatar } = req.body;

    await prisma.tutorProfile.upsert({
      where: { userId },
      update: { subjects, qualifications, bio, experience, ...(avatar && { avatar }) },
      create: { userId, subjects: subjects || [], qualifications, bio, experience, avatar },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { student: true, tutor: true, school: true },
    });

    res.json(sanitizeUser(user));
  } catch (error) {
    console.error('Update tutor profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PATCH /api/profiles/school
router.patch('/school', requireAuth, requireRole(['SCHOOL']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { schoolName, address, schoolType, logo } = req.body;

    await prisma.schoolProfile.upsert({
      where: { userId },
      update: { schoolName, address, schoolType, ...(logo && { logo }) },
      create: { userId, schoolName: schoolName || 'Unknown', address, schoolType, logo },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { student: true, tutor: true, school: true },
    });

    res.json(sanitizeUser(user));
  } catch (error) {
    console.error('Update school profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/profiles/upload-avatar
// NOTE: Full Cloudinary integration requires multer + cloudinary packages.
// This returns a placeholder URL until those are installed.
router.post('/upload-avatar', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const mockAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(req.user.firstName + ' ' + req.user.lastName)}&background=random`;

    await prisma.user.update({
      where: { id: req.user.id },
      data: { avatarUrl: mockAvatarUrl },
    });

    res.json({ avatarUrl: mockAvatarUrl });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
