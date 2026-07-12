import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

// GET /api/assignments — Tutor's assignments
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tutorName = `${req.user.firstName} ${req.user.lastName}`;
    const courses = await prisma.course.findMany({ where: { instructor: tutorName }, select: { id: true, title: true } });
    const courseIds = courses.map(c => c.id);

    const homework = await prisma.homework.findMany({
      where: { courseId: { in: courseIds } },
      include: {
        course: { select: { title: true, enrollments: { select: { id: true } } } },
        submissions: { select: { status: true, studentId: true } }
      },
      orderBy: { dueDate: 'asc' }
    });

    res.json(homework.map(hw => ({
      id: hw.id, title: hw.title, course: hw.course.title, courseId: hw.courseId,
      dueDate: hw.dueDate, fileUrl: hw.fileUrl, description: hw.description,
      submitted: hw.submissions.filter(s => s.status !== 'pending').length,
      total: hw.course.enrollments.length
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/assignments — Create assignment
router.post('/', requireAuth, requireRole(['TUTOR', 'ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { courseId, title, description, dueDate, fileUrl } = req.body;

    if (!courseId || !title || !dueDate) {
      res.status(400).json({ message: 'courseId, title, and dueDate are required' });
      return;
    }

    const hw = await prisma.homework.create({
      data: { courseId, title, description: description || null, dueDate: new Date(dueDate), fileUrl: fileUrl || null },
      include: { course: { select: { title: true } } }
    });

    // Notify enrolled students
    const enrollments = await prisma.enrollment.findMany({ where: { courseId }, select: { userId: true } });
    await prisma.notification.createMany({
      data: enrollments.map(e => ({
        userId: e.userId,
        title: `New Assignment: ${title}`,
        message: `Your tutor has posted a new assignment in ${hw.course.title}. Due: ${new Date(dueDate).toLocaleDateString()}`,
        type: 'info',
        link: '/dashboard'
      }))
    });

    res.status(201).json(hw);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/assignments/:id — Update assignment
router.patch('/:id', requireAuth, requireRole(['TUTOR', 'ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, dueDate, fileUrl } = req.body;
    const hw = await prisma.homework.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(fileUrl !== undefined && { fileUrl })
      }
    });
    res.json(hw);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/assignments/:id
router.delete('/:id', requireAuth, requireRole(['TUTOR', 'ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    await prisma.homework.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Assessments ─────────────────────────────────────────────────────────────

// GET /api/assignments/assessments
router.get('/assessments', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tutorName = `${req.user.firstName} ${req.user.lastName}`;
    const courses = await prisma.course.findMany({ where: { instructor: tutorName }, select: { id: true, title: true } });
    const courseIds = courses.map(c => c.id);

    const assessments = await prisma.assessment.findMany({
      where: { courseId: { in: courseIds } },
      include: {
        course: { select: { title: true } },
        submissions: { select: { score: true, studentId: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(assessments.map(a => ({
      id: a.id, title: a.title, course: a.course.title, courseId: a.courseId,
      dueDate: a.dueDate, description: a.description,
      avgScore: a.submissions.length
        ? Math.round(a.submissions.reduce((acc, s) => acc + (s.score || 0), 0) / a.submissions.length)
        : null,
      submissions: a.submissions.length
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/assignments/assessments — Create assessment
router.post('/assessments', requireAuth, requireRole(['TUTOR', 'ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { courseId, title, description, questions, dueDate } = req.body;
    if (!courseId || !title) { res.status(400).json({ message: 'courseId and title required' }); return; }

    const assessment = await prisma.assessment.create({
      data: {
        courseId, title,
        description: description || null,
        questions: questions || [],
        dueDate: dueDate ? new Date(dueDate) : null
      },
      include: { course: { select: { title: true } } }
    });

    res.status(201).json(assessment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
