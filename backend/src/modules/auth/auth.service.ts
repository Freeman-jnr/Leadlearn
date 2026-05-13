import { Role } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { hashPassword, comparePassword, generateOtp } from "../../utils/crypto";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import { BadRequest, Unauthorized, NotFound, Conflict } from "../../utils/errors";
import { emailQueue } from "../../jobs/queues";
import { verifyGoogleIdToken } from "../../services/google.service";
import { env } from "../../config/env";

const REFRESH_DAYS = 7;

async function issueTokens(user: { id: string; email: string; role: Role }) {
  const payload = { sub: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_DAYS * 86400_000),
    },
  });
  return { accessToken, refreshToken };
}

async function sendOtp(userId: string, email: string, purpose: string, subject: string) {
  const code = generateOtp(6);
  await prisma.otpCode.create({
    data: {
      userId,
      code,
      purpose,
      expiresAt: new Date(Date.now() + 15 * 60_000),
    },
  });
  await emailQueue.add("send", {
    to: email,
    subject,
    html: `<p>Your LEAD LearnHub verification code is <b>${code}</b>. It expires in 15 minutes.</p>`,
  });
}

export const authService = {
  async register(input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: Role;
  }) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw Conflict("Email already registered");

    const hashed = await hashPassword(input.password);
    const user = await prisma.user.create({
      data: {
        email: input.email,
        password: hashed,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        role: input.role,
        status: "PENDING",
      },
    });

    if (input.role === "STUDENT") {
      await prisma.studentProfile.create({ data: { userId: user.id } });
    } else if (input.role === "TUTOR") {
      await prisma.tutorProfile.create({ data: { userId: user.id } });
    } else if (input.role === "SCHOOL") {
      await prisma.schoolProfile.create({
        data: { userId: user.id, schoolName: `${input.firstName} ${input.lastName}` },
      });
    }

    await sendOtp(user.id, user.email, "EMAIL_VERIFY", "Verify your email");
    const tokens = await issueTokens(user);
    return { user: sanitize(user), ...tokens };
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) throw Unauthorized("Invalid credentials");
    if (user.status === "SUSPENDED") throw Unauthorized("Account suspended");
    const ok = await comparePassword(password, user.password);
    if (!ok) throw Unauthorized("Invalid credentials");
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
    const tokens = await issueTokens(user);
    return { user: sanitize(user), ...tokens };
  },

  async logout(refreshToken: string) {
    await prisma.refreshToken
      .update({ where: { token: refreshToken }, data: { revokedAt: new Date() } })
      .catch(() => undefined);
    return { success: true };
  },

  async refresh(refreshToken: string) {
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw Unauthorized("Invalid refresh token");
    }
    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored || stored.revokedAt || stored.expiresAt < new Date())
      throw Unauthorized("Refresh token expired");
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user) throw Unauthorized();
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });
    return issueTokens(user).then((t) => ({ ...t, user: sanitize(user) }));
  },

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { success: true }; // don't leak
    await sendOtp(user.id, user.email, "PASSWORD_RESET", "Reset your password");
    return { success: true };
  },

  async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw NotFound("User not found");
    const code = await prisma.otpCode.findFirst({
      where: {
        userId: user.id,
        code: otp,
        purpose: "PASSWORD_RESET",
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
    if (!code) throw BadRequest("Invalid or expired code");
    const hashed = await hashPassword(newPassword);
    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { password: hashed } }),
      prisma.otpCode.update({ where: { id: code.id }, data: { usedAt: new Date() } }),
      prisma.refreshToken.updateMany({
        where: { userId: user.id, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
    return { success: true };
  },

  async verifyEmail(email: string, otp: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw NotFound();
    const code = await prisma.otpCode.findFirst({
      where: {
        userId: user.id,
        code: otp,
        purpose: "EMAIL_VERIFY",
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
    if (!code) throw BadRequest("Invalid or expired code");
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true, status: "ACTIVE" },
      }),
      prisma.otpCode.update({ where: { id: code.id }, data: { usedAt: new Date() } }),
    ]);
    return { success: true };
  },

  async googleSignIn(idToken: string) {
    const profile = await verifyGoogleIdToken(idToken);
    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId: profile.googleId }, { email: profile.email }] },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: profile.email,
          googleId: profile.googleId,
          firstName: profile.firstName,
          lastName: profile.lastName,
          avatar: profile.avatar,
          emailVerified: true,
          status: "ACTIVE",
          role: "STUDENT",
        },
      });
      await prisma.studentProfile.create({ data: { userId: user.id } });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId: profile.googleId, emailVerified: true, status: "ACTIVE" },
      });
    }
    const tokens = await issueTokens(user);
    return { user: sanitize(user), ...tokens, redirect: env.FRONTEND_URL };
  },
};

function sanitize<T extends { password?: string | null }>(u: T) {
  const { password, ...rest } = u;
  return rest;
}
