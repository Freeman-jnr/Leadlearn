import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

// GET /api/reviews — Get reviews for the authenticated tutor
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { targetId: req.user.id },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        course: { select: { title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const avg = reviews.length
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

    res.json({ reviews, averageRating: parseFloat(avg.toFixed(1)), total: reviews.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/reviews/:tutorId — Leave a review for a tutor
router.post('/:tutorId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { rating, comment, courseId } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      res.status(400).json({ message: 'Rating must be between 1 and 5' });
      return;
    }

    const review = await prisma.review.create({
      data: {
        authorId: req.user.id,
        targetId: req.params.tutorId,
        rating: parseInt(rating),
        comment: comment || null,
        courseId: courseId || null
      },
      include: {
        author: { select: { firstName: true, lastName: true, avatarUrl: true } }
      }
    });

    // Update tutor profile aggregate rating
    const allReviews = await prisma.review.findMany({ where: { targetId: req.params.tutorId }, select: { rating: true } });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    await prisma.tutorProfile.upsert({
      where: { userId: req.params.tutorId },
      update: { rating: parseFloat(avgRating.toFixed(1)), totalReviews: allReviews.length },
      create: { userId: req.params.tutorId, subjects: [], rating: parseFloat(avgRating.toFixed(1)), totalReviews: 1 }
    });

    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/reviews/earnings — Get tutor earnings and transactions
router.get('/earnings', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    const total = transactions.reduce((acc, t) => acc + t.amount, 0);
    const thisMonth = transactions
      .filter(t => new Date(t.createdAt).getMonth() === new Date().getMonth())
      .reduce((acc, t) => acc + t.amount, 0);

    res.json({ transactions, totalEarnings: total, thisMonthEarnings: thisMonth });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
