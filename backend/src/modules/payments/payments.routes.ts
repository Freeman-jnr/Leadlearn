import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma";
import { authenticate, AuthedRequest } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created } from "../../utils/response";
import { paystack } from "../../services/paystack.service";
import { flutterwave } from "../../services/flutterwave.service";
import { env } from "../../config/env";
import { BadRequest } from "../../utils/errors";

const r = Router();

const initSchema = z.object({
  provider: z.enum(["PAYSTACK", "FLUTTERWAVE"]),
  amount: z.number().positive(),
  orderId: z.string().uuid().optional(),
  subscriptionId: z.string().uuid().optional(),
  email: z.string().email(),
});

// Initialize a payment
r.post(
  "/initialize",
  authenticate,
  validate({ body: initSchema }),
  asyncHandler(async (req: AuthedRequest, res) => {
    const { provider, amount, orderId, subscriptionId, email } = req.body;
    const reference = `LH-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    let url = "";
    if (provider === "PAYSTACK") {
      const data = await paystack.initialize({
        email,
        amount: Math.round(amount * 100),
        reference,
        callback_url: `${env.FRONTEND_URL}/payment/callback`,
      });
      url = data.authorization_url;
    } else {
      const data = await flutterwave.initiate({
        tx_ref: reference,
        amount,
        currency: "NGN",
        redirect_url: `${env.FRONTEND_URL}/payment/callback`,
        customer: { email, name: email },
      });
      url = data.link;
    }

    const payment = await prisma.payment.create({
      data: {
        reference,
        userId: req.user!.sub,
        amount,
        provider,
        orderId,
        subscriptionId,
      },
    });

    return created(res, { payment, url });
  })
);

// Verify
r.get(
  "/verify/:reference",
  authenticate,
  asyncHandler(async (req, res) => {
    const payment = await prisma.payment.findUnique({
      where: { reference: req.params.reference },
    });
    if (!payment) throw BadRequest("Unknown reference");
    if (payment.provider === "PAYSTACK") {
      const data = await paystack.verify(payment.reference);
      const success = data.status === "success";
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: success ? "SUCCESS" : "FAILED", metadata: data as never },
      });
      if (success && payment.orderId) {
        await prisma.order.update({
          where: { id: payment.orderId },
          data: { status: "PAID" },
        });
      }
    }
    return ok(res, await prisma.payment.findUnique({ where: { id: payment.id } }));
  })
);

// Paystack webhook (raw body required)
r.post(
  "/webhooks/paystack",
  asyncHandler(async (req, res) => {
    const sig = req.headers["x-paystack-signature"] as string;
    const raw = (req.body as Buffer).toString("utf8");
    if (!paystack.verifyWebhook(raw, sig)) return res.status(401).end();
    const event = JSON.parse(raw);
    if (event.event === "charge.success") {
      const ref = event.data.reference as string;
      await prisma.payment
        .update({ where: { reference: ref }, data: { status: "SUCCESS", metadata: event.data } })
        .catch(() => undefined);
      const payment = await prisma.payment.findUnique({ where: { reference: ref } });
      if (payment?.orderId) {
        await prisma.order.update({ where: { id: payment.orderId }, data: { status: "PAID" } });
      }
    }
    res.status(200).end();
  })
);

// Flutterwave webhook
r.post(
  "/webhooks/flutterwave",
  asyncHandler(async (req, res) => {
    const sig = req.headers["verif-hash"] as string;
    if (!flutterwave.verifyWebhook(sig)) return res.status(401).end();
    const event = JSON.parse((req.body as Buffer).toString("utf8"));
    if (event.event === "charge.completed" && event.data?.status === "successful") {
      const ref = event.data.tx_ref as string;
      await prisma.payment
        .update({ where: { reference: ref }, data: { status: "SUCCESS", metadata: event.data } })
        .catch(() => undefined);
    }
    res.status(200).end();
  })
);

export default r;
