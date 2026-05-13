import { Router } from "express";
import { prisma } from "../../config/prisma";
import { authenticate, authorize, AuthedRequest, optionalAuth } from "../../middleware/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created, paginated } from "../../utils/response";

const r = Router();

r.get(
  "/products",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;
    const { type, category, search } = req.query as Record<string, string>;
    const where = {
      isPublished: true,
      ...(type ? { type: type as never } : {}),
      ...(category ? { category } : {}),
      ...(search
        ? { title: { contains: search, mode: "insensitive" as const } }
        : {}),
    };
    const [items, total] = await Promise.all([
      prisma.marketplaceProduct.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { sales: "desc" },
      }),
      prisma.marketplaceProduct.count({ where }),
    ]);
    return paginated(res, items, total, page, pageSize);
  })
);

r.get(
  "/products/:slug",
  asyncHandler(async (req, res) => {
    const product = await prisma.marketplaceProduct.findUnique({
      where: { slug: req.params.slug },
      include: { reviews: { include: { user: true }, take: 10 } },
    });
    return ok(res, product);
  })
);

r.use(authenticate);

r.post(
  "/products",
  authorize("ADMIN", "SCHOOL", "TUTOR"),
  asyncHandler(async (req, res) => {
    const p = await prisma.marketplaceProduct.create({ data: req.body });
    return created(res, p);
  })
);

r.patch(
  "/products/:id",
  authorize("ADMIN", "SCHOOL", "TUTOR"),
  asyncHandler(async (req, res) => {
    const p = await prisma.marketplaceProduct.update({
      where: { id: req.params.id },
      data: req.body,
    });
    return ok(res, p);
  })
);

// Wishlist
r.get(
  "/wishlist",
  asyncHandler(async (req: AuthedRequest, res) => {
    const items = await prisma.wishlist.findMany({
      where: { userId: req.user!.sub },
      include: { product: true },
    });
    return ok(res, items);
  })
);

r.post(
  "/wishlist/:productId",
  asyncHandler(async (req: AuthedRequest, res) => {
    const w = await prisma.wishlist.upsert({
      where: { userId_productId: { userId: req.user!.sub, productId: req.params.productId } },
      update: {},
      create: { userId: req.user!.sub, productId: req.params.productId },
    });
    return created(res, w);
  })
);

r.delete(
  "/wishlist/:productId",
  asyncHandler(async (req: AuthedRequest, res) => {
    await prisma.wishlist
      .delete({
        where: { userId_productId: { userId: req.user!.sub, productId: req.params.productId } },
      })
      .catch(() => undefined);
    return ok(res, null);
  })
);

export default r;
