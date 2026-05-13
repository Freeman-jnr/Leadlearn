import { Router } from "express";
import { prisma } from "../../config/prisma";
import { authenticate, authorize, AuthedRequest } from "../../middleware/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/response";

const r = Router();
r.use(authenticate);

// Platform-wide (admin)
r.get(
  "/platform",
  authorize("ADMIN"),
  asyncHandler(async (_req, res) => {
    const [users, students, tutors, schools, courses, orders, revenueAgg] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "TUTOR" } }),
      prisma.user.count({ where: { role: "SCHOOL" } }),
      prisma.course.count({ where: { status: "PUBLISHED" } }),
      prisma.order.count({ where: { status: "PAID" } }),
      prisma.payment.aggregate({ where: { status: "SUCCESS" }, _sum: { amount: true } }),
    ]);
    return ok(res, {
      users,
      students,
      tutors,
      schools,
      courses,
      orders,
      revenue: revenueAgg._sum.amount ?? 0,
    });
  })
);

r.get(
  "/student/me",
  asyncHandler(async (req: AuthedRequest, res) => {
    const userId = req.user!.sub;
    const [enrollments, completed, results] = await Promise.all([
      prisma.enrollment.count({ where: { userId } }),
      prisma.enrollment.count({ where: { userId, completed: true } }),
      prisma.result.aggregate({
        where: { userId },
        _avg: { score: true },
        _count: true,
      }),
    ]);
    return ok(res, {
      enrollments,
      completed,
      avgScore: results._avg.score ?? 0,
      assessmentsTaken: results._count,
    });
  })
);

r.get(
  "/tutor/me",
  authorize("TUTOR"),
  asyncHandler(async (req: AuthedRequest, res) => {
    const tutor = await prisma.tutorProfile.findUnique({
      where: { userId: req.user!.sub },
    });
    if (!tutor) return ok(res, null);
    const [courses, enrollments, sessions] = await Promise.all([
      prisma.course.count({ where: { tutorId: tutor.id } }),
      prisma.enrollment.count({ where: { course: { tutorId: tutor.id } } }),
      prisma.liveSession.count({ where: { tutorId: tutor.id } }),
    ]);
    return ok(res, {
      courses,
      enrollments,
      sessions,
      rating: tutor.rating,
      totalEarnings: tutor.totalEarnings,
    });
  })
);

r.get(
  "/school/me",
  authorize("SCHOOL"),
  asyncHandler(async (req: AuthedRequest, res) => {
    const school = await prisma.schoolProfile.findUnique({
      where: { userId: req.user!.sub },
    });
    if (!school) return ok(res, null);
    const students = await prisma.studentProfile.count({ where: { schoolId: school.id } });
    return ok(res, { school, students });
  })
);

export default r;
