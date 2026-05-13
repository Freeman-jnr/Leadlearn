import { Router } from "express";
import { prisma } from "../../config/prisma";
import { authenticate, authorize, AuthedRequest } from "../../middleware/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created } from "../../utils/response";
import { BadRequest, NotFound } from "../../utils/errors";

const r = Router();
r.use(authenticate);

r.post(
  "/",
  authorize("TUTOR", "SCHOOL", "ADMIN"),
  asyncHandler(async (req, res) => {
    const a = await prisma.assessment.create({ data: req.body });
    return created(res, a);
  })
);

r.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const a = await prisma.assessment.findUnique({
      where: { id: req.params.id },
      include: { questions: true },
    });
    if (!a) throw NotFound();
    return ok(res, a);
  })
);

r.post(
  "/:id/questions",
  authorize("TUTOR", "SCHOOL", "ADMIN"),
  asyncHandler(async (req, res) => {
    const q = await prisma.question.create({
      data: { ...req.body, assessmentId: req.params.id },
    });
    return created(res, q);
  })
);

// Submit answers — auto-grade MCQ/TF/Short
r.post(
  "/:id/submit",
  asyncHandler(async (req: AuthedRequest, res) => {
    const { answers, startedAt } = req.body as {
      answers: Record<string, string>;
      startedAt: string;
    };
    const assessment = await prisma.assessment.findUnique({
      where: { id: req.params.id },
      include: { questions: true },
    });
    if (!assessment) throw NotFound();
    if (!answers) throw BadRequest("answers required");

    let score = 0;
    let totalPoints = 0;
    for (const q of assessment.questions) {
      totalPoints += q.points;
      if (q.type === "ESSAY") continue; // graded manually
      if (q.correctAnswer && answers[q.id]?.toString().trim().toLowerCase() === q.correctAnswer.toLowerCase()) {
        score += q.points;
      }
    }
    const passed = totalPoints > 0 && (score / totalPoints) * 100 >= assessment.passScore;
    const result = await prisma.result.create({
      data: {
        userId: req.user!.sub,
        assessmentId: assessment.id,
        score,
        totalPoints,
        passed,
        answers,
        startedAt: new Date(startedAt),
      },
    });
    return created(res, result, passed ? "Passed!" : "Submitted");
  })
);

r.get(
  "/:id/leaderboard",
  asyncHandler(async (req, res) => {
    const top = await prisma.result.findMany({
      where: { assessmentId: req.params.id },
      orderBy: { score: "desc" },
      take: 20,
      include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
    });
    return ok(res, top);
  })
);

export default r;
