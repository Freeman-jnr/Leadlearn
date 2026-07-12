import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';

export const getNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const limit = Math.min(50, parseInt(String(req.query.limit ?? '10')) || 10);

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false },
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    // Verify ownership
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const markAllAsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
