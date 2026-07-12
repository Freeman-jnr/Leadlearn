import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { getStudentDashboard, getAdminDashboard, getSchoolDashboard } from '../controllers/dashboard.controller';
import { getTutorDashboard } from '../controllers/tutor-dashboard.controller';

const router = Router();

// GET /api/dashboard/student
router.get('/student', requireAuth, requireRole(['STUDENT']), getStudentDashboard);

// GET /api/dashboard/tutor
router.get('/tutor', requireAuth, requireRole(['TUTOR', 'ADMIN']), getTutorDashboard);

// GET /api/dashboard/school
router.get('/school', requireAuth, requireRole(['SCHOOL']), getSchoolDashboard);

// GET /api/dashboard/admin
router.get('/admin', requireAuth, requireRole(['ADMIN']), getAdminDashboard);

export default router;
