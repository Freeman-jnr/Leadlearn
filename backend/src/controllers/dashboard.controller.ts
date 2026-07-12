import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';

export const getStudentDashboard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;

    // Fetch enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            liveClasses: {
              where: { scheduledAt: { gte: new Date() } },
              orderBy: { scheduledAt: 'asc' },
              take: 2
            },
            homework: {
              where: { dueDate: { gte: new Date() } },
              take: 3
            }
          }
        }
      }
    });

    if (!enrollments || enrollments.length === 0) {
      // Empty state
      res.json({
        state: 'empty',
        message: 'Welcome! You have not enrolled in any courses yet.',
        courses: [],
        liveClasses: [],
        recorded: [],
        homework: [],
        tutors: [],
        achievements: []
      });
      return;
    }

    // Process data for frontend
    const courses = enrollments.map(e => ({
      id: e.course.id,
      subject: e.course.title,
      tutor: e.course.instructor || "Unknown",
      progress: 0, // Should be calculated based on LessonProgress
      remaining: 0, // Placeholder
      color: "var(--brand-blue)", // We can make this dynamic later
      emoji: "📚"
    }));

    const liveClasses = enrollments.flatMap(e => 
      e.course.liveClasses.map(lc => ({
        id: lc.id,
        subject: e.course.title,
        teacher: e.course.instructor || "Unknown",
        time: lc.scheduledAt.toLocaleString(),
        live: lc.isLive,
        mins: lc.durationMins
      }))
    );

    const homework = enrollments.flatMap(e =>
      e.course.homework.map(hw => ({
        id: hw.id,
        subject: e.course.title,
        title: hw.title,
        due: hw.dueDate.toLocaleString(),
        status: "pending"
      }))
    );

    res.json({
      state: 'active',
      courses,
      liveClasses,
      recorded: [], // Placeholder
      homework,
      tutors: [], // Placeholder
      achievements: [] // Placeholder
    });
  } catch (error) {
    console.error('Error fetching student dashboard:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTutorDashboard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    // Assuming the tutor's name is in the User model, and we match instructor string (or we should use tutorId relation in the future)
    // For now, let's look up courses where this user is instructor... Wait, the schema says `instructor String?` in Course.
    // It's probably better to assume `instructor` stores the tutor's name or we need to query by name?
    // Let's use the tutor's name for now
    const tutorName = `${req.user.firstName} ${req.user.lastName}`;

    const courses = await prisma.course.findMany({
      where: { instructor: tutorName },
      include: {
        enrollments: true,
        liveClasses: {
          where: { scheduledAt: { gte: new Date() } },
          orderBy: { scheduledAt: 'asc' },
          take: 3
        },
        homework: true
      }
    });

    if (!courses || courses.length === 0) {
      res.json({
        state: 'empty',
        message: 'Welcome! Create your first course to get started.',
        stats: { totalStudents: 0, activeCourses: 0, totalEarnings: 0, rating: 0 },
        classes: [],
        recordedLessons: [],
        assignments: [],
        messages: [],
        reviews: [],
        materials: [],
        notifications: []
      });
      return;
    }

    const totalStudents = courses.reduce((acc, course) => acc + course.enrollments.length, 0);

    const classes = courses.map(c => ({
      subject: c.title,
      level: "All Levels", // Placeholder
      students: c.enrollments.length,
      next: c.liveClasses.length > 0 ? c.liveClasses[0].scheduledAt.toLocaleString() : "No upcoming",
      progress: 0,
      color: "var(--brand-blue)",
      emoji: "📐"
    }));

    res.json({
      state: 'active',
      stats: {
        totalStudents,
        activeCourses: courses.length,
        totalEarnings: 0, // Placeholder
        rating: 5.0 // Placeholder
      },
      classes,
      upcomingClasses: courses.flatMap(c => c.liveClasses.map(lc => ({
        subject: c.title,
        time: lc.scheduledAt.toLocaleString(),
        students: c.enrollments.length
      }))),
      recordedLessons: [],
      assignments: [],
      messages: [],
      reviews: [],
      materials: [],
      notifications: []
    });
  } catch (error) {
    console.error('Error fetching tutor dashboard:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAdminDashboard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const [totalUsers, totalCourses, totalEnrollments] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.enrollment.count()
    ]);

    res.json({
      state: 'active',
      stats: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalRevenue: 0, // Placeholder
        activeSubscriptions: 0 // Placeholder
      }
    });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSchoolDashboard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    res.json({
      state: 'active',
      stats: {
        totalStudents: 0,
        totalTeachers: 0,
        averageAttendance: 0
      },
      recentActivities: []
    });
  } catch (error) {
    console.error('Error fetching school dashboard:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
