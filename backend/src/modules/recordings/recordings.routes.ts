import { Router } from "express";
import { prisma } from "../../config/prisma";
import { authenticate, authorize, AuthedRequest } from "../../middleware/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created, paginated } from "../../utils/response";

const r = Router();

r.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;
    const [items, total] = await Promise.all([
      prisma.recordedVideo.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.recordedVideo.count(),
    ]);
    return paginated(res, items, total, page, pageSize);
  })
);

r.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const video = await prisma.recordedVideo.update({
      where: { id: req.params.id },
      data: { views: { increment: 1 } },
    });
    return ok(res, video);
  })
);

r.use(authenticate);

r.post(
  "/",
  authorize("TUTOR", "ADMIN", "SCHOOL"),
  asyncHandler(async (req, res) => {
    const v = await prisma.recordedVideo.create({ data: req.body });
    return created(res, v);
  })
);

export default r;
