import { Queue, QueueEvents } from "bullmq";
import { redis } from "../config/redis";

const connection = { connection: redis };

export const emailQueue = new Queue("email", connection);
export const notificationQueue = new Queue("notification", connection);
export const videoQueue = new Queue("video-processing", connection);

export const queueEvents = {
  email: new QueueEvents("email", connection),
  notification: new QueueEvents("notification", connection),
};
