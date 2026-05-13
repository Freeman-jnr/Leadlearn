import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma";
import { authenticate, AuthedRequest } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created } from "../../utils/response";

const r = Router();
r.use(authenticate);

const PLAN_PRICING: Record<string, number> = {
  FREE: 0,
  BASIC: 2500,
  PREMIUM: 7500,
  SCHOOL: 50000,
};

const subscribeSchema = z.object({
  plan: z.enum(["FREE", "BASIC", "PREMIUM", "SCHOOL"]),
  durationDays: z.number().int().min(7).max(365).default(30),
});

r.post(
  "/",
  validate({ body: subscribeSchema }),
  asyncHandler(async (req: AuthedRequest, res) => {
    const { plan, durationDays } = req.body;
    const sub = await prisma.subscription.create({
      data: {
        userId: req.user!.sub,
        plan,
        amount: PLAN_PRICING[plan],
        endsAt: new Date(Date.now() + durationDays * 86400_000),
      },
    });
    return created(res, sub);
  })
);

r.get(
  "/me",
  asyncHandler(async (req: AuthedRequest, res) => {
    const subs = await prisma.subscription.findMany({
      where: { userId: req.user!.sub },
      orderBy: { createdAt: "desc" },
    });
    return ok(res, subs);
  })
);

r.post(
  "/:id/cancel",
  asyncHandler(async (req: AuthedRequest, res) => {
    const sub = await prisma.subscription.update({
      where: { id: req.params.id },
      data: { status: "CANCELLED", autoRenew: false },
    });
    return ok(res, sub);
  })
);

export default r;
