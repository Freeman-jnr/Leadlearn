import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma";
import { authenticate, AuthedRequest } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created, paginated } from "../../utils/response";
import { notificationQueue } from "../../jobs/queues";
import { NotFound } from "../../utils/errors";

const r = Router();
r.use(authenticate);

const bookSchema = z.object({
  tutorId: z.string().uuid(),
  subject: z.string().min(2),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  notes: z.string().optional(),
});

r.post(
  "/",
  validate({ body: bookSchema }),
  asyncHandler(async (req: AuthedRequest, res) => {
    const tutor = await prisma.tutorProfile.findUnique({ where: { id: req.body.tutorId } });
    if (!tutor) throw NotFound("Tutor not found");
    const hours =
      (new Date(req.body.endsAt).getTime() - new Date(req.body.startsAt).getTime()) / 3_600_000;
    const amount = Number(tutor.hourlyRate) * Math.max(hours, 0.5);
    const booking = await prisma.booking.create({
      data: {
        studentId: req.user!.sub,
        tutorId: tutor.id,
        subject: req.body.subject,
        startsAt: new Date(req.body.startsAt),
        endsAt: new Date(req.body.endsAt),
        amount,
        notes: req.body.notes,
      },
    });
    await notificationQueue.add("notify", {
      userId: tutor.userId,
      type: "MESSAGE",
      title: "New booking request",
      body: `You have a new booking for ${booking.subject}`,
    });
    return created(res, booking);
  })
);

r.get(
  "/me",
  asyncHandler(async (req: AuthedRequest, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;
    const [items, total] = await Promise.all([
      prisma.booking.findMany({
        where: { studentId: req.user!.sub },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { startsAt: "desc" },
        include: { tutor: { include: { user: true } } },
      }),
      prisma.booking.count({ where: { studentId: req.user!.sub } }),
    ]);
    return paginated(res, items, total, page, pageSize);
  })
);

r.patch(
  "/:id/confirm",
  asyncHandler(async (req, res) => {
    const b = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: "CONFIRMED" },
    });
    return ok(res, b);
  })
);

r.patch(
  "/:id/cancel",
  asyncHandler(async (req, res) => {
    const b = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: "CANCELLED" },
    });
    return ok(res, b);
  })
);

export default r;
