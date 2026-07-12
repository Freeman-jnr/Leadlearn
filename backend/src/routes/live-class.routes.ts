import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

// GET /api/live-classes — List tutor's live classes
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tutorName = `${req.user.firstName} ${req.user.lastName}`;
    const courses = await prisma.course.findMany({ where: { instructor: tutorName }, select: { id: true } });
    const courseIds = courses.map(c => c.id);

    const liveClasses = await prisma.liveClass.findMany({
      where: { courseId: { in: courseIds } },
      include: { course: { select: { title: true } } },
      orderBy: { scheduledAt: 'asc' }
    });

    res.json(liveClasses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/live-classes — Schedule a new live class
router.post('/', requireAuth, requireRole(['TUTOR', 'ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { courseId, title, scheduledAt, durationMins, meetingUrl } = req.body;

    if (!courseId || !title || !scheduledAt) {
      res.status(400).json({ message: 'courseId, title, and scheduledAt are required' });
      return;
    }

    // Generate a Jitsi room name if no meetingUrl provided
    const jitsiRoom = meetingUrl || `leadlearnhub-${courseId}-${Date.now()}`;

    const liveClass = await prisma.liveClass.create({
      data: {
        courseId,
        title,
        scheduledAt: new Date(scheduledAt),
        durationMins: durationMins || 60,
        meetingUrl: jitsiRoom
      },
      include: { course: { select: { title: true } } }
    });

    res.status(201).json(liveClass);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/live-classes/:id/start — Mark class as live
router.patch('/:id/start', requireAuth, requireRole(['TUTOR', 'ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const liveClass = await prisma.liveClass.update({
      where: { id: req.params.id },
      data: { isLive: true }
    });
    res.json(liveClass);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/live-classes/:id/end — End a live class
router.patch('/:id/end', requireAuth, requireRole(['TUTOR', 'ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const liveClass = await prisma.liveClass.update({
      where: { id: req.params.id },
      data: { isLive: false, endedAt: new Date() }
    });
    res.json(liveClass);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/live-classes/:id — Get a single live class (with messages for chat)
router.get('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const liveClass = await prisma.liveClass.findUnique({
      where: { id: req.params.id },
      include: {
        course: { select: { title: true } },
        messages: {
          include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
          orderBy: { createdAt: 'asc' },
          take: 100
        }
      }
    });

    if (!liveClass) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(liveClass);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/live-classes/:id/messages — Send a chat message (polling-based)
router.post('/:id/messages', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) { res.status(400).json({ message: 'Message content required' }); return; }

    const message = await prisma.liveClassMessage.create({
      data: { liveClassId: req.params.id, userId: req.user.id, content: content.trim() },
      include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } }
    });

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/live-classes/:id/messages — Get chat messages since a timestamp (for polling)
router.get('/:id/messages', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const since = req.query.since ? new Date(req.query.since as string) : new Date(0);
    const messages = await prisma.liveClassMessage.findMany({
      where: { liveClassId: req.params.id, createdAt: { gt: since } },
      include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
      orderBy: { createdAt: 'asc' }
    });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
