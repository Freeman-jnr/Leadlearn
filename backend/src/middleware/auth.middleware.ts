import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized: No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as { userId: string; role: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        student: true,
        tutor: true,
        school: true,
      },
    });

    if (!user) {
      res.status(401).json({ message: 'Unauthorized: User not found' });
      return;
    }

    // Strip sensitive fields before attaching to request
    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized: No user found in request' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      return;
    }

    next();
  };
};
