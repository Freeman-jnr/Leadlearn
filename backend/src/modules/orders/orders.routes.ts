import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma";
import { authenticate, AuthedRequest } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created, paginated } from "../../utils/response";
import { BadRequest } from "../../utils/errors";

const r = Router();
r.use(authenticate);

const checkoutSchema = z.object({
  items: z
    .array(z.object({ productId: z.string().uuid(), quantity: z.number().int().min(1) }))
    .min(1),
  shippingAddress: z.record(z.unknown()).optional(),
});

r.post(
  "/checkout",
  validate({ body: checkoutSchema }),
  asyncHandler(async (req: AuthedRequest, res) => {
    const { items, shippingAddress } = req.body;
    const products = await prisma.marketplaceProduct.findMany({
      where: { id: { in: items.map((i: { productId: string }) => i.productId) } },
    });
    if (products.length !== items.length) throw BadRequest("Invalid product");

    let subtotal = 0;
    const orderItems = items.map((i: { productId: string; quantity: number }) => {
      const p = products.find((x) => x.id === i.productId)!;
      const lineTotal = Number(p.price) * i.quantity;
      subtotal += lineTotal;
      return { productId: p.id, quantity: i.quantity, unitPrice: p.price };
    });

    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        userId: req.user!.sub,
        subtotal,
        total: subtotal,
        shippingAddress,
        items: { create: orderItems },
      },
      include: { items: true },
    });
    return created(res, order);
  })
);

r.get(
  "/me",
  asyncHandler(async (req: AuthedRequest, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;
    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: req.user!.sub },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: { items: { include: { product: true } } },
      }),
      prisma.order.count({ where: { userId: req.user!.sub } }),
    ]);
    return paginated(res, items, total, page, pageSize);
  })
);

r.get(
  "/:id",
  asyncHandler(async (req: AuthedRequest, res) => {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.user!.sub },
      include: { items: { include: { product: true } }, payments: true },
    });
    return ok(res, order);
  })
);

export default r;
