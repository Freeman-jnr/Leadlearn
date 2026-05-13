import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodEffects } from "zod";

type Schema = AnyZodObject | ZodEffects<AnyZodObject>;

export const validate =
  (schema: { body?: Schema; query?: Schema; params?: Schema }) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schema.body) req.body = schema.body.parse(req.body);
      if (schema.query) req.query = schema.query.parse(req.query) as never;
      if (schema.params) req.params = schema.params.parse(req.params) as never;
      next();
    } catch (e) {
      next(e);
    }
  };
