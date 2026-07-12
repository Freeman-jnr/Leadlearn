import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

// PUT /api/lessons/:lessonId
// Requires auth + ADMIN or TUTOR role
router.put('/:lessonId', requireAuth, requireRole(['ADMIN', 'TUTOR']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const lessonId = String(req.params.lessonId);
    const { title, content, videoUrl, thumbnailUrl, duration } = req.body;

    const existing = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!existing) {
      res.status(404).json({ message: 'Lesson not found' });
      return;
    }

    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        ...(title && { title }),
        ...(content !== undefined && { content }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(thumbnailUrl !== undefined && { thumbnailUrl }),
        ...(duration !== undefined && { duration: duration ? parseInt(String(duration)) : 0 }),
      },
    });

    res.json(lesson);
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/lessons/:lessonId
// Requires auth + ADMIN or TUTOR role
router.delete('/:lessonId', requireAuth, requireRole(['ADMIN', 'TUTOR']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const lessonId = String(req.params.lessonId);

    const existing = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!existing) {
      res.status(404).json({ message: 'Lesson not found' });
      return;
    }

    await prisma.lesson.delete({ where: { id: lessonId } });

    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
