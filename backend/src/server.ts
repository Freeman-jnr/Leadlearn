import http from "http";
import { createApp } from "./app";
import { env } from "./config/env";
import { connectDb } from "./config/prisma";
import { logger } from "./utils/logger";
import { initWebsocket } from "./websocket";

async function bootstrap() {
  await connectDb();
  const app = createApp();
  const server = http.createServer(app);
  initWebsocket(server);

  server.listen(env.PORT, () => {
    logger.info(`🚀 LEAD LearnHub API running on :${env.PORT} (${env.NODE_ENV})`);
    logger.info(`📘 Docs: http://localhost:${env.PORT}/docs`);
  });

  const shutdown = async (sig: string) => {
    logger.info(`${sig} received, shutting down`);
    server.close(() => process.exit(0));
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

bootstrap().catch((e) => {
  logger.error(e, "Failed to start");
  process.exit(1);
});
