import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

// GET /api/marketplace — List marketplace items (public)
router.get('/', async (req: any, res: Response) => {
  try {
    const { tutorId, type, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (tutorId) where.tutorId = tutorId;
    if (type) where.type = type;

    const [items, total] = await Promise.all([
      prisma.marketplaceItem.findMany({
        where,
        include: { tutor: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit as string)
      }),
      prisma.marketplaceItem.count({ where })
    ]);

    res.json({ data: items, meta: { total, page: parseInt(page as string), limit: parseInt(limit as string) } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/marketplace/mine — Get tutor's own items
router.get('/mine', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const items = await prisma.marketplaceItem.findMany({
      where: { tutorId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/marketplace — Upload a new marketplace item
router.post('/', requireAuth, requireRole(['TUTOR', 'ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, type, price, emoji, fileUrl, description } = req.body;

    if (!title || !type || price === undefined) {
      res.status(400).json({ message: 'title, type, and price are required' });
      return;
    }

    const item = await prisma.marketplaceItem.create({
      data: {
        tutorId: req.user.id,
        title,
        type,
        price: parseFloat(price),
        emoji: emoji || '📄',
        fileUrl: fileUrl || null,
        description: description || null
      }
    });

    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/marketplace/:id — Update a marketplace item
router.patch('/:id', requireAuth, requireRole(['TUTOR', 'ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, type, price, emoji, fileUrl, description } = req.body;
    const item = await prisma.marketplaceItem.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(type && { type }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(emoji && { emoji }),
        ...(fileUrl !== undefined && { fileUrl }),
        ...(description !== undefined && { description })
      }
    });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/marketplace/:id — Remove an item
router.delete('/:id', requireAuth, requireRole(['TUTOR', 'ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    await prisma.marketplaceItem.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
