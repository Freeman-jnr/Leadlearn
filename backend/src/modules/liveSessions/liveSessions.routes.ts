import { Router } from "express";
import { prisma } from "../../config/prisma";
import { authenticate, authorize, AuthedRequest } from "../../middleware/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created, paginated } from "../../utils/response";
import { getIO } from "../../websocket";

const r = Router();

r.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;
    const [items, total] = await Promise.all([
      prisma.liveSession.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { startsAt: "asc" },
        include: { tutor: { include: { user: { select: { firstName: true, lastName: true } } } } },
      }),
      prisma.liveSession.count(),
    ]);
    return paginated(res, items, total, page, pageSize);
  })
);

r.use(authenticate);

r.post(
  "/",
  authorize("TUTOR", "ADMIN"),
  asyncHandler(async (req: AuthedRequest, res) => {
    const tutor = await prisma.tutorProfile.findUnique({
      where: { userId: req.user!.sub },
    });
    const session = await prisma.liveSession.create({
      data: { ...req.body, tutorId: tutor?.id ?? req.body.tutorId },
    });
    return created(res, session);
  })
);

r.post(
  "/:id/start",
  authorize("TUTOR", "ADMIN"),
  asyncHandler(async (req, res) => {
    const session = await prisma.liveSession.update({
      where: { id: req.params.id },
      data: { status: "LIVE" },
    });
    getIO().emit("live:status", { id: session.id, status: "LIVE" });
    return ok(res, session);
  })
);

r.post(
  "/:id/end",
  authorize("TUTOR", "ADMIN"),
  asyncHandler(async (req, res) => {
    const session = await prisma.liveSession.update({
      where: { id: req.params.id },
      data: { status: "ENDED" },
    });
    getIO().emit("live:status", { id: session.id, status: "ENDED" });
    return ok(res, session);
  })
);

r.post(
  "/:id/join",
  asyncHandler(async (req: AuthedRequest, res) => {
    const attendance = await prisma.attendance.upsert({
      where: {
        liveSessionId_userId: { liveSessionId: req.params.id, userId: req.user!.sub },
      },
      update: {},
      create: { liveSessionId: req.params.id, userId: req.user!.sub },
    });
    return ok(res, attendance);
  })
);

r.post(
  "/:id/leave",
  asyncHandler(async (req: AuthedRequest, res) => {
    await prisma.attendance.updateMany({
      where: { liveSessionId: req.params.id, userId: req.user!.sub, leftAt: null },
      data: { leftAt: new Date() },
    });
    return ok(res, null);
  })
);

export default r;
