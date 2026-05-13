import { Router } from "express";
import { prisma } from "../../config/prisma";
import { authenticate, authorize, AuthedRequest } from "../../middleware/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, paginated } from "../../utils/response";

const r = Router();
r.use(authenticate);

r.get(
  "/",
  authorize("ADMIN", "SCHOOL"),
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;
    const [items, total] = await Promise.all([
      prisma.studentProfile.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { user: true, school: true },
      }),
      prisma.studentProfile.count(),
    ]);
    return paginated(res, items, total, page, pageSize);
  })
);

r.get(
  "/me",
  asyncHandler(async (req: AuthedRequest, res) => {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user!.sub },
      include: { user: true, school: true },
    });
    return ok(res, profile);
  })
);

r.patch(
  "/me",
  asyncHandler(async (req: AuthedRequest, res) => {
    const profile = await prisma.studentProfile.update({
      where: { userId: req.user!.sub },
      data: req.body,
    });
    return ok(res, profile);
  })
);

r.get(
  "/me/dashboard",
  asyncHandler(async (req: AuthedRequest, res) => {
    const userId = req.user!.sub;
    const [enrollments, results, certificates, upcomingLive] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId },
        include: { course: true },
        take: 10,
        orderBy: { enrolledAt: "desc" },
      }),
      prisma.result.findMany({
        where: { userId },
        take: 5,
        orderBy: { submittedAt: "desc" },
      }),
      prisma.certificate.count({ where: { userId } }),
      prisma.liveSession.findMany({
        where: { startsAt: { gt: new Date() }, status: "SCHEDULED" },
        take: 5,
        orderBy: { startsAt: "asc" },
      }),
    ]);
    return ok(res, { enrollments, results, certificates, upcomingLive });
  })
);

export default r;
