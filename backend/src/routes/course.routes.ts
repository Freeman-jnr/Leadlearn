import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

// GET /api/courses
// Public — list all courses with optional search & pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page ?? '1')) || 1);
    const limit = Math.min(50, parseInt(String(req.query.limit ?? '12')) || 12);
    const search = String(req.query.search ?? '').trim();

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
            { instructor: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { lessons: true, enrollments: true },
          },
        },
      }),
      prisma.course.count({ where }),
    ]);

    res.json({
      data: courses,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/courses/:courseId
// Public — get a single course with its lessons
router.get('/:courseId', async (req: Request, res: Response) => {
  try {
    const courseId = String(req.params.courseId);

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/courses
// Requires auth + ADMIN or TUTOR role
router.post('/', requireAuth, requireRole(['ADMIN', 'TUTOR']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, thumbnail, instructor } = req.body as Record<string, string | undefined>;

    if (!title || !description) {
      res.status(400).json({ message: 'title and description are required' });
      return;
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        thumbnail: thumbnail || null,
        instructor: instructor || `${req.user.firstName} ${req.user.lastName}`,
      },
      include: {
        _count: { select: { lessons: true, enrollments: true } },
      },
    });

    res.status(201).json(course);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/courses/:courseId
// Requires auth + ADMIN or TUTOR role
router.put('/:courseId', requireAuth, requireRole(['ADMIN', 'TUTOR']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const courseId = String(req.params.courseId);
    const { title, description, thumbnail, instructor } = req.body as Record<string, string | undefined>;

    const existing = await prisma.course.findUnique({ where: { id: courseId } });
    if (!existing) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    const course = await prisma.course.update({
      where: { id: courseId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(instructor && { instructor }),
      },
      include: {
        _count: { select: { lessons: true, enrollments: true } },
      },
    });

    res.json(course);
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/courses/:courseId
// Requires auth + ADMIN role only
router.delete('/:courseId', requireAuth, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const courseId = String(req.params.courseId);

    const existing = await prisma.course.findUnique({ where: { id: courseId } });
    if (!existing) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    await prisma.course.delete({ where: { id: courseId } });

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
