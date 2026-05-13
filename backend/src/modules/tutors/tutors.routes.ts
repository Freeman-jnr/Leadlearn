import { Router } from "express";
import { prisma } from "../../config/prisma";
import { authenticate, authorize, AuthedRequest, optionalAuth } from "../../middleware/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, paginated } from "../../utils/response";

const r = Router();

r.get(
  "/",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;
    const subject = req.query.subject as string | undefined;
    const where = subject ? { subjects: { has: subject } } : {};
    const [items, total] = await Promise.all([
      prisma.tutorProfile.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
        orderBy: { rating: "desc" },
      }),
      prisma.tutorProfile.count({ where }),
    ]);
    return paginated(res, items, total, page, pageSize);
  })
);

r.get(
  "/me",
  authenticate,
  asyncHandler(async (req: AuthedRequest, res) => {
    const profile = await prisma.tutorProfile.findUnique({
      where: { userId: req.user!.sub },
      include: { user: true },
    });
    return ok(res, profile);
  })
);

r.patch(
  "/me",
  authenticate,
  authorize("TUTOR"),
  asyncHandler(async (req: AuthedRequest, res) => {
    const profile = await prisma.tutorProfile.update({
      where: { userId: req.user!.sub },
      data: req.body,
    });
    return ok(res, profile);
  })
);

r.patch(
  "/:id/verify",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(async (req, res) => {
    const profile = await prisma.tutorProfile.update({
      where: { id: req.params.id },
      data: { isVerified: true },
    });
    return ok(res, profile, "Tutor verified");
  })
);

r.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const tutor = await prisma.tutorProfile.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true } },
        courses: { where: { status: "PUBLISHED" }, take: 12 },
      },
    });
    return ok(res, tutor);
  })
);

export default r;
