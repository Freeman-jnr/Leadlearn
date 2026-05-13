import { Router } from "express";
import { prisma } from "../../config/prisma";
import { authenticate, authorize, AuthedRequest } from "../../middleware/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created } from "../../utils/response";

const r = Router();
r.use(authenticate);

// Virtual classroom container — list classrooms (live + scheduled) for the current user
r.get(
  "/me",
  asyncHandler(async (req: AuthedRequest, res) => {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user!.sub },
      include: {
        course: {
          include: {
            liveSessions: { where: { status: { in: ["SCHEDULED", "LIVE"] } } },
          },
        },
      },
    });
    return ok(res, enrollments);
  })
);

r.post(
  "/",
  authorize("TUTOR", "ADMIN", "SCHOOL"),
  asyncHandler(async (req, res) => {
    // Classrooms here are stored as scheduled live sessions
    const session = await prisma.liveSession.create({ data: req.body });
    return created(res, session);
  })
);

export default r;
