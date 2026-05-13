import { Router } from "express";
import { authController } from "./auth.controller";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/auth";
import { authLimiter } from "../../middleware/rateLimit";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  forgotSchema,
  resetSchema,
  verifyEmailSchema,
  googleSchema,
} from "./auth.validation";

const r = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 */
r.post("/register", authLimiter, validate({ body: registerSchema }), authController.register);
r.post("/login", authLimiter, validate({ body: loginSchema }), authController.login);
r.post("/logout", validate({ body: refreshSchema }), authController.logout);
r.post("/refresh", validate({ body: refreshSchema }), authController.refresh);
r.post("/forgot-password", authLimiter, validate({ body: forgotSchema }), authController.forgotPassword);
r.post("/reset-password", authLimiter, validate({ body: resetSchema }), authController.resetPassword);
r.post("/verify-email", validate({ body: verifyEmailSchema }), authController.verifyEmail);
r.post("/google", validate({ body: googleSchema }), authController.googleSignIn);
r.get("/me", authenticate, authController.me);

export default r;
