import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { Unauthorized, Forbidden } from "../utils/errors";
import { verifyAccessToken, JwtPayload } from "../utils/jwt";

export interface AuthedRequest extends Request {
  user?: JwtPayload;
}

export function authenticate(req: AuthedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next(Unauthorized("Missing token"));
  try {
    req.user = verifyAccessToken(header.slice(7));
    next();
  } catch {
    next(Unauthorized("Invalid or expired token"));
  }
}

export const authorize =
  (...roles: Role[]) =>
  (req: AuthedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) return next(Unauthorized());
    if (!roles.includes(req.user.role as Role))
      return next(Forbidden("Insufficient permissions"));
    next();
  };

export function optionalAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    try {
      req.user = verifyAccessToken(header.slice(7));
    } catch {
      /* ignore */
    }
  }
  next();
}
