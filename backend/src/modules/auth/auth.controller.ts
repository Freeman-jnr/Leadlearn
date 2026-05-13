import { Request, Response } from "express";
import { authService } from "./auth.service";
import { ok, created } from "../../utils/response";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthedRequest } from "../../middleware/auth";
import { prisma } from "../../config/prisma";

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    return created(res, result, "Registered. Verification code sent.");
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body.email, req.body.password);
    return ok(res, result, "Login successful");
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    await authService.logout(req.body.refreshToken);
    return ok(res, null, "Logged out");
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.refresh(req.body.refreshToken);
    return ok(res, result);
  }),

  forgotPassword: asyncHandler(async (req: Request, res: Response) => {
    await authService.forgotPassword(req.body.email);
    return ok(res, null, "If the email exists, an OTP has been sent.");
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    await authService.resetPassword(req.body.email, req.body.otp, req.body.newPassword);
    return ok(res, null, "Password reset successful");
  }),

  verifyEmail: asyncHandler(async (req: Request, res: Response) => {
    await authService.verifyEmail(req.body.email, req.body.otp);
    return ok(res, null, "Email verified");
  }),

  googleSignIn: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.googleSignIn(req.body.idToken);
    return ok(res, result);
  }),

  me: asyncHandler(async (req: AuthedRequest, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.sub },
      include: { studentProfile: true, tutorProfile: true, schoolProfile: true },
    });
    return ok(res, user);
  }),
};
