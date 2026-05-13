import nodemailer from "nodemailer";
import { env } from "../config/env";
import { logger } from "../utils/logger";

const enabled = !!(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASSWORD);

export const mailer = enabled
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: { user: env.SMTP_USER!, pass: env.SMTP_PASSWORD! },
    })
  : null;

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  if (!mailer) {
    logger.warn({ to: opts.to, subject: opts.subject }, "[email disabled] would send");
    return { mocked: true };
  }
  return mailer.sendMail({ from: env.SMTP_FROM, ...opts });
}
