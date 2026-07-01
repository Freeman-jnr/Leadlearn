import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

const router = Router();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';
const JWT_ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m';
const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';

function generateTokens(userId: string, role: string) {
  const accessToken = jwt.sign({ userId, role }, JWT_ACCESS_SECRET, {
    expiresIn: 900, // 15 minutes
  });
  const refreshToken = jwt.sign({ userId, role }, JWT_REFRESH_SECRET, {
    expiresIn: 604800, // 7 days
  });
  return { accessToken, refreshToken };
}

function sanitizeUser(user: any) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}

// POST /auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    const firstName = req.body.firstName?.trim();
    const lastName = req.body.lastName?.trim();

    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ message: 'firstName, lastName, email, and password are required' });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'User with this email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        firstName: firstName!,
        lastName: lastName!,
        email,
        password: hashedPassword,
        role: role || 'STUDENT',
      },
    });

    const tokens = generateTokens(user.id, user.role);

    res.status(201).json({
      ...tokens,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const tokens = generateTokens(user.id, user.role);

    res.json({
      ...tokens,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /auth/logout
router.post('/logout', (_req: Request, res: Response) => {
  // With JWT, logout is handled client-side by discarding the token.
  // A more robust implementation would use a token blacklist.
  res.json({ message: 'Logged out successfully' });
});

// GET /auth/me
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as { userId: string };

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    res.json(sanitizeUser(user));
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// POST /auth/refresh-token
router.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token is required' });
      return;
    }

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
      userId: string;
      role: string;
    };

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    const tokens = generateTokens(user.id, user.role);

    res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
});

export default router;
