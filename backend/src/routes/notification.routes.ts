import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notification.controller';

const router = Router();

router.use(requireAuth);

router.get('/', getNotifications);
router.patch('/mark-all-read', markAllAsRead);
router.patch('/:id/read', markAsRead);

export default router;
