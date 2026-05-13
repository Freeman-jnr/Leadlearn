import { Router } from "express";
import { prisma } from "../../config/prisma";
import { authenticate, AuthedRequest } from "../../middleware/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, paginated } from "../../utils/response";

const r = Router();
r.use(authenticate);

r.get(
  "/",
  asyncHandler(async (req: AuthedRequest, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;
    const [items, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: req.user!.sub },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({ where: { userId: req.user!.sub } }),
    ]);
    return paginated(res, items, total, page, pageSize);
  })
);

r.patch(
  "/:id/read",
  asyncHandler(async (req: AuthedRequest, res) => {
    const n = await prisma.notification.update({
      where: { id: req.params.id },
      data: { read: true },
    });
    return ok(res, n);
  })
);

r.patch(
  "/read-all",
  asyncHandler(async (req: AuthedRequest, res) => {
    await prisma.notification.updateMany({
      where: { userId: req.user!.sub, read: false },
      data: { read: true },
    });
    return ok(res, null);
  })
);

export default r;
