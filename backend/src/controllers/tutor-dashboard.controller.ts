import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';

export const getTutorDashboard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const tutorName = `${req.user.firstName} ${req.user.lastName}`;

    const courses = await prisma.course.findMany({
      where: { instructor: tutorName },
      include: {
        enrollments: { include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } } },
        liveClasses: { where: { scheduledAt: { gte: new Date() } }, orderBy: { scheduledAt: 'asc' }, take: 5 },
        homework: { orderBy: { dueDate: 'asc' }, take: 5, include: { submissions: true } },
        assessments: { take: 5 },
        lessons: { orderBy: { order: 'asc' } },
        reviews: { include: { author: { select: { firstName: true, lastName: true, avatarUrl: true } } }, orderBy: { createdAt: 'desc' }, take: 5 }
      }
    });

    if (!courses || courses.length === 0) {
      res.json({
        state: 'empty',
        message: 'Welcome! Create your first course to get started.',
        stats: { totalStudents: 0, activeCourses: 0, totalEarnings: 0, rating: 0 },
        classes: [], recordedLessons: [], assignments: [], assessments: [],
        messages: [], reviews: [], materials: [], notifications: [], schedule: []
      });
      return;
    }

    const totalStudents = courses.reduce((acc, c) => acc + c.enrollments.length, 0);

    // Earnings
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    const totalEarnings = transactions.reduce((acc, t) => acc + t.amount, 0);

    // Tutor profile for rating
    const tutorProfile = await prisma.tutorProfile.findUnique({ where: { userId } });

    // Recent notifications
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Marketplace items
    const materials = await prisma.marketplaceItem.findMany({
      where: { tutorId: userId },
      orderBy: { createdAt: 'desc' }
    });

    // Recent messages (conversation partners)
    const messages = await prisma.message.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        receiver: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    // Build schedule from upcoming live classes + homework due dates
    const schedule = [
      ...courses.flatMap(c => c.liveClasses.map(lc => ({
        id: lc.id, type: 'live', title: lc.title, courseTitle: c.title,
        time: lc.scheduledAt, durationMins: lc.durationMins, meetingUrl: lc.meetingUrl, isLive: lc.isLive
      }))),
      ...courses.flatMap(c => c.homework.map(hw => ({
        id: hw.id, type: 'assignment', title: hw.title, courseTitle: c.title, time: hw.dueDate
      })))
    ].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    const classes = courses.map(c => ({
      id: c.id,
      subject: c.title,
      level: 'All Levels',
      students: c.enrollments.length,
      next: c.liveClasses.length > 0 ? c.liveClasses[0].scheduledAt : null,
      progress: 0,
      color: 'var(--brand-blue)',
      emoji: '📐',
      lessons: c.lessons.length
    }));

    const recordedLessons = courses.flatMap(c =>
      c.lessons.map(l => ({
        id: l.id, name: l.title, subject: c.title, courseId: c.id,
        videoUrl: l.videoUrl, thumbnailUrl: l.thumbnailUrl, duration: l.duration, order: l.order
      }))
    );

    const assignments = courses.flatMap(c =>
      c.homework.map(hw => ({
        id: hw.id, title: hw.title, course: c.title, courseId: c.id,
        dueDate: hw.dueDate, fileUrl: hw.fileUrl,
        submitted: hw.submissions.filter(s => s.status !== 'pending').length,
        total: c.enrollments.length, description: hw.description
      }))
    );

    const assessments = courses.flatMap(c =>
      c.assessments.map(a => ({
        id: a.id, title: a.title, course: c.title, courseId: c.id,
        dueDate: a.dueDate, description: a.description, questions: a.questions
      }))
    );

    const reviews = courses.flatMap(c =>
      c.reviews.map(r => ({
        id: r.id,
        student: `${r.author.firstName} ${r.author.lastName}`,
        avatar: r.author.avatarUrl,
        rating: r.rating,
        comment: r.comment,
        course: c.title,
        date: r.createdAt
      }))
    );

    // Build student performance data
    const students = courses.flatMap(c =>
      c.enrollments.map(e => ({
        id: e.user.id,
        name: `${e.user.firstName} ${e.user.lastName}`,
        avatar: e.user.avatarUrl,
        course: c.title,
        courseId: c.id,
        enrolledAt: e.enrolledAt
      }))
    );

    res.json({
      state: 'active',
      stats: {
        totalStudents,
        activeCourses: courses.length,
        totalEarnings,
        rating: tutorProfile?.rating || 0,
        totalReviews: tutorProfile?.totalReviews || 0
      },
      classes,
      recordedLessons,
      assignments,
      assessments,
      schedule,
      students,
      reviews,
      materials: materials.map(m => ({
        id: m.id, name: m.title, type: m.type, price: `₦${m.price.toLocaleString()}`,
        priceRaw: m.price, sales: m.sales, emoji: m.emoji || '📄', fileUrl: m.fileUrl, description: m.description
      })),
      notifications,
      transactions: transactions.map(t => ({
        id: t.id, amount: t.amount, type: t.type, description: t.description,
        status: t.status, date: t.createdAt
      })),
      messages
    });
  } catch (error) {
    console.error('Error fetching tutor dashboard:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { getTutorDashboard as default };
