import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

// GET /api/messages/contacts — Get list of people the user has messaged
router.get('/contacts', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;

    // Get all messages involving the user
    const messages = await prisma.message.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, role: true } },
        receiver: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, role: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Build unique contacts with the last message
    const contactMap = new Map<string, any>();
    for (const msg of messages) {
      const contact = msg.senderId === userId ? msg.receiver : msg.sender;
      if (!contactMap.has(contact.id)) {
        const unread = await prisma.message.count({
          where: { senderId: contact.id, receiverId: userId, isRead: false }
        });
        contactMap.set(contact.id, {
          contact,
          lastMessage: msg.content,
          lastTime: msg.createdAt,
          unread
        });
      }
    }

    res.json(Array.from(contactMap.values()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/messages/:userId — Get chat history with a specific user (polling)
router.get('/:userId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const myId = req.user.id;
    const otherId = req.params.userId;
    const since = req.query.since ? new Date(req.query.since as string) : new Date(0);

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: myId, receiverId: otherId },
          { senderId: otherId, receiverId: myId }
        ],
        createdAt: { gt: since }
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Mark received messages as read
    await prisma.message.updateMany({
      where: { senderId: otherId, receiverId: myId, isRead: false },
      data: { isRead: true }
    });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/messages/:userId — Send a message to a user
router.post('/:userId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) { res.status(400).json({ message: 'Content is required' }); return; }

    const message = await prisma.message.create({
      data: {
        senderId: req.user.id,
        receiverId: req.params.userId,
        content: content.trim()
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } }
      }
    });

    // Create a notification for the receiver
    await prisma.notification.create({
      data: {
        userId: req.params.userId,
        title: `New message from ${req.user.firstName}`,
        message: content.length > 60 ? content.slice(0, 57) + '...' : content,
        type: 'info',
        link: `/tutor/messages`
      }
    });

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
