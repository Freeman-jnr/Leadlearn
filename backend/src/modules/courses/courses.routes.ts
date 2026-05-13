import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma";
import { authenticate, authorize, AuthedRequest, optionalAuth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created, paginated } from "../../utils/response";
import { Forbidden, NotFound } from "../../utils/errors";

const r = Router();

const createCourseSchema = z.object({
  title: z.string().min(3).max(150),
  slug: z.string().min(3).max(150),
  description: z.string().min(10),
  thumbnail: z.string().url().optional(),
  level: z.enum(["PRIMARY", "JSS", "SSS", "TERTIARY", "GENERAL"]),
  category: z.string(),
  subject: z.string(),
  price: z.number().nonnegative().default(0),
  isFree: z.boolean().default(false),
  language: z.string().default("English"),
  tags: z.array(z.string()).default([]),
});

// Public list/search
r.get(
  "/",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 12;
    const { level, category, subject, search } = req.query as Record<string, string>;
    const where = {
      status: "PUBLISHED" as const,
      deletedAt: null,
      ...(level ? { level: level as never } : {}),
      ...(category ? { category } : {}),
      ...(subject ? { subject } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              { description: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };
    const [items, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { tutor: { include: { user: { select: { firstName: true, lastName: true, avatar: true } } } } },
        orderBy: { rating: "desc" },
      }),
      prisma.course.count({ where }),
    ]);
    return paginated(res, items, total, page, pageSize);
  })
);

r.get(
  "/:slug",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const course = await prisma.course.findUnique({
      where: { slug: req.params.slug },
      include: {
        tutor: { include: { user: true } },
        modules: { include: { lessons: true }, orderBy: { position: "asc" } },
        reviews: { include: { user: { select: { firstName: true, avatar: true } } }, take: 10 },
      },
    });
    if (!course) throw NotFound();
    return ok(res, course);
  })
);

// Tutor: create
r.post(
  "/",
  authenticate,
  authorize("TUTOR", "ADMIN"),
  validate({ body: createCourseSchema }),
  asyncHandler(async (req: AuthedRequest, res) => {
    const tutor = await prisma.tutorProfile.findUnique({
      where: { userId: req.user!.sub },
    });
    if (!tutor) throw Forbidden("Tutor profile required");
    const course = await prisma.course.create({
      data: { ...req.body, tutorId: tutor.id },
    });
    return created(res, course);
  })
);

r.patch(
  "/:id",
  authenticate,
  authorize("TUTOR", "ADMIN"),
  asyncHandler(async (req, res) => {
    const course = await prisma.course.update({
      where: { id: req.params.id },
      data: req.body,
    });
    return ok(res, course);
  })
);

r.delete(
  "/:id",
  authenticate,
  authorize("TUTOR", "ADMIN"),
  asyncHandler(async (req, res) => {
    await prisma.course.update({
      where: { id: req.params.id },
      data: { deletedAt: new Date(), status: "ARCHIVED" },
    });
    return ok(res, null, "Course deleted");
  })
);

// Modules / Lessons
r.post(
  "/:id/modules",
  authenticate,
  authorize("TUTOR", "ADMIN"),
  asyncHandler(async (req, res) => {
    const m = await prisma.courseModule.create({
      data: { ...req.body, courseId: req.params.id },
    });
    return created(res, m);
  })
);

r.post(
  "/modules/:moduleId/lessons",
  authenticate,
  authorize("TUTOR", "ADMIN"),
  asyncHandler(async (req, res) => {
    const lesson = await prisma.lesson.create({
      data: { ...req.body, moduleId: req.params.moduleId },
    });
    return created(res, lesson);
  })
);

// Enrollment
r.post(
  "/:id/enroll",
  authenticate,
  asyncHandler(async (req: AuthedRequest, res) => {
    const enrollment = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: req.user!.sub, courseId: req.params.id } },
      update: {},
      create: { userId: req.user!.sub, courseId: req.params.id },
    });
    await prisma.course.update({
      where: { id: req.params.id },
      data: { enrollmentCount: { increment: 1 } },
    });
    return created(res, enrollment, "Enrolled");
  })
);

// Lesson progress
r.post(
  "/lessons/:lessonId/progress",
  authenticate,
  asyncHandler(async (req: AuthedRequest, res) => {
    const { watchedSeconds, completed, courseId } = req.body;
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: req.user!.sub, courseId } },
    });
    if (!enrollment) throw NotFound("Not enrolled");
    const progress = await prisma.lessonProgress.upsert({
      where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId: req.params.lessonId } },
      update: { watchedSeconds, completed },
      create: { enrollmentId: enrollment.id, lessonId: req.params.lessonId, watchedSeconds, completed },
    });
    return ok(res, progress);
  })
);

export default r;
