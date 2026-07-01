import { Router, Response } from 'express';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

// GET /api/dashboard/student
router.get('/student', requireAuth, requireRole(['STUDENT']), async (req: AuthenticatedRequest, res: Response) => {
  // Return mocked data based on what the frontend expects
  const data = {
    courses: [
      { subject: "Mathematics", tutor: "Mr. Adeyemi", progress: 72, remaining: 6, color: "var(--brand-blue)", emoji: "📐" },
      { subject: "English Language", tutor: "Mrs. Okafor", progress: 58, remaining: 9, color: "var(--brand-pink)", emoji: "📚" }
    ],
    liveClasses: [
      { subject: "Physics — Waves & Sound", teacher: "Engr. Okonkwo", time: "Today · 2:00 PM", live: true, mins: 18 }
    ],
    recorded: [
      { title: "Quadratic Equations", subject: "Math", duration: "24 min", progress: 60, hue: 220 }
    ],
    homework: [
      { subject: "Mathematics", title: "Algebra Worksheet 3", due: "Tomorrow", status: "pending" }
    ],
    tutors: [
      { name: "Mrs. Adaeze O.", subject: "Mathematics", rating: 4.9, online: true }
    ],
    achievements: [
      { icon: "Flame", label: "7-Day Streak", color: "var(--brand-orange)" }
    ]
  };
  res.json(data);
});

// GET /api/dashboard/tutor
router.get('/tutor', requireAuth, requireRole(['TUTOR']), async (req: AuthenticatedRequest, res: Response) => {
  const data = {
    stats: {
      totalStudents: 120,
      activeCourses: 5,
      totalEarnings: 45000,
      rating: 4.8
    },
    upcomingClasses: [
      { subject: "Mathematics", time: "Today · 4:00 PM", students: 25 }
    ]
  };
  res.json(data);
});

// GET /api/dashboard/school
router.get('/school', requireAuth, requireRole(['SCHOOL']), async (req: AuthenticatedRequest, res: Response) => {
  const data = {
    stats: {
      totalStudents: 500,
      totalTeachers: 30,
      averageAttendance: 95
    },
    recentActivities: [
      { activity: "New student enrolled", time: "2 mins ago" }
    ]
  };
  res.json(data);
});

// GET /api/dashboard/admin
router.get('/admin', requireAuth, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  const data = {
    stats: {
      totalUsers: 1500,
      totalRevenue: 1500000,
      activeSubscriptions: 800
    }
  };
  res.json(data);
});

export default router;
