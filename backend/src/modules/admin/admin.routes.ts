import { Router } from "express";
import { prisma } from "../../config/prisma";
import { authenticate, authorize } from "../../middleware/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, paginated } from "../../utils/response";

const r = Router();
r.use(authenticate, authorize("ADMIN"));

r.get(
  "/overview",
  asyncHandler(async (_req, res) => {
    const [pendingTutors, pendingCourses, openOrders] = await Promise.all([
      prisma.tutorProfile.count({ where: { isVerified: false } }),
      prisma.course.count({ where: { status: "DRAFT" } }),
      prisma.order.count({ where: { status: "PENDING" } }),
    ]);
    return ok(res, { pendingTutors, pendingCourses, openOrders });
  })
);

r.patch(
  "/courses/:id/approve",
  asyncHandler(async (req, res) => {
    const c = await prisma.course.update({
      where: { id: req.params.id },
      data: { status: "PUBLISHED" },
    });
    return ok(res, c);
  })
);

r.patch(
  "/courses/:id/archive",
  asyncHandler(async (req, res) => {
    const c = await prisma.course.update({
      where: { id: req.params.id },
      data: { status: "ARCHIVED" },
    });
    return ok(res, c);
  })
);

r.get(
  "/audit-logs",
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 50;
    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { email: true, role: true } } },
      }),
      prisma.auditLog.count(),
    ]);
    return paginated(res, items, total, page, pageSize);
  })
);

export default r;
