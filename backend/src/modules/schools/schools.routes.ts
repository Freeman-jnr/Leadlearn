import { Router } from "express";
import { prisma } from "../../config/prisma";
import { authenticate, authorize, AuthedRequest } from "../../middleware/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, paginated } from "../../utils/response";

const r = Router();
r.use(authenticate);

r.get(
  "/",
  authorize("ADMIN"),
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;
    const [items, total] = await Promise.all([
      prisma.schoolProfile.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { user: true },
      }),
      prisma.schoolProfile.count(),
    ]);
    return paginated(res, items, total, page, pageSize);
  })
);

r.get(
  "/me",
  authorize("SCHOOL"),
  asyncHandler(async (req: AuthedRequest, res) => {
    const profile = await prisma.schoolProfile.findUnique({
      where: { userId: req.user!.sub },
      include: { user: true, students: true, resources: true },
    });
    return ok(res, profile);
  })
);

r.patch(
  "/me",
  authorize("SCHOOL"),
  asyncHandler(async (req: AuthedRequest, res) => {
    const profile = await prisma.schoolProfile.update({
      where: { userId: req.user!.sub },
      data: req.body,
    });
    return ok(res, profile);
  })
);

r.get(
  "/me/dashboard",
  authorize("SCHOOL"),
  asyncHandler(async (req: AuthedRequest, res) => {
    const school = await prisma.schoolProfile.findUnique({
      where: { userId: req.user!.sub },
    });
    if (!school) return ok(res, null);
    const [studentCount, resourceCount] = await Promise.all([
      prisma.studentProfile.count({ where: { schoolId: school.id } }),
      prisma.schoolResource.count({ where: { schoolId: school.id } }),
    ]);
    return ok(res, { school, studentCount, resourceCount });
  })
);

r.post(
  "/me/resources",
  authorize("SCHOOL"),
  asyncHandler(async (req: AuthedRequest, res) => {
    const school = await prisma.schoolProfile.findUnique({
      where: { userId: req.user!.sub },
    });
    if (!school) return ok(res, null);
    const resource = await prisma.schoolResource.create({
      data: { ...req.body, schoolId: school.id },
    });
    return ok(res, resource);
  })
);

export default r;
