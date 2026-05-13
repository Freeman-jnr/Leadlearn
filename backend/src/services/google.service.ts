import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env";

export const googleClient = new OAuth2Client(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_CALLBACK_URL
);

export async function verifyGoogleIdToken(idToken: string) {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload?.email) throw new Error("Invalid Google token");
  return {
    googleId: payload.sub!,
    email: payload.email!,
    firstName: payload.given_name || "",
    lastName: payload.family_name || "",
    avatar: payload.picture || null,
    emailVerified: payload.email_verified ?? false,
  };
}
