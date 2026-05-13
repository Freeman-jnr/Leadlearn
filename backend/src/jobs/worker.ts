import { Worker } from "bullmq";
import { redis } from "../config/redis";
import { sendEmail } from "../services/email.service";
import { logger } from "../utils/logger";
import { prisma } from "../config/prisma";

const connection = { connection: redis };

new Worker(
  "email",
  async (job) => {
    const { to, subject, html, text } = job.data as {
      to: string;
      subject: string;
      html: string;
      text?: string;
    };
    await sendEmail({ to, subject, html, text });
  },
  connection
);

new Worker(
  "notification",
  async (job) => {
    const { userId, type, title, body, data } = job.data;
    await prisma.notification.create({
      data: { userId, type, title, body, data },
    });
  },
  connection
);

logger.info("👷 Workers started: email, notification");
