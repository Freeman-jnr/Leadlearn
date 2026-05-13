import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma";
import { authenticate, authorize, AuthedRequest } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, paginated } from "../../utils/response";
import { NotFound } from "../../utils/errors";

const r = Router();
r.use(authenticate);

const updateMeSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().min(10).max(20).optional(),
  avatar: z.string().url().optional(),
});

r.get(
  "/me",
  asyncHandler(async (req: AuthedRequest, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.sub },
      include: { studentProfile: true, tutorProfile: true, schoolProfile: true },
    });
    if (!user) throw NotFound();
    return ok(res, user);
  })
);

r.patch(
  "/me",
  validate({ body: updateMeSchema }),
  asyncHandler(async (req: AuthedRequest, res) => {
    const user = await prisma.user.update({
      where: { id: req.user!.sub },
      data: req.body,
    });
    return ok(res, user);
  })
);

r.get(
  "/",
  authorize("ADMIN"),
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;
    const search = (req.query.search as string) || "";
    const role = req.query.role as string | undefined;
    const where = {
      deletedAt: null,
      ...(role ? { role: role as never } : {}),
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: "insensitive" as const } },
              { firstName: { contains: search, mode: "insensitive" as const } },
              { lastName: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };
    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);
    return paginated(res, items, total, page, pageSize);
  })
);

r.patch(
  "/:id/suspend",
  authorize("ADMIN"),
  asyncHandler(async (req, res) => {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { status: "SUSPENDED" },
    });
    return ok(res, user, "User suspended");
  })
);

r.delete(
  "/:id",
  authorize("ADMIN"),
  asyncHandler(async (req, res) => {
    await prisma.user.update({
      where: { id: req.params.id },
      data: { deletedAt: new Date(), status: "DELETED" },
    });
    return ok(res, null, "User deleted");
  })
);

export default r;
