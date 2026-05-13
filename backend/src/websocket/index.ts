import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { verifyAccessToken } from "../utils/jwt";
import { env } from "../config/env";
import { logger } from "../utils/logger";

let io: Server | null = null;

export function initWebsocket(server: HttpServer) {
  io = new Server(server, {
    cors: { origin: env.CORS_ORIGIN.split(",").map((s) => s.trim()), credentials: true },
  });

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(new Error("Unauthorized"));
    try {
      const payload = verifyAccessToken(token);
      (socket.data as { user: typeof payload }).user = payload;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const user = (socket.data as { user: { sub: string } }).user;
    logger.info(`socket connected: ${user.sub}`);

    socket.on("live:join", (sessionId: string) => socket.join(`live:${sessionId}`));
    socket.on("live:leave", (sessionId: string) => socket.leave(`live:${sessionId}`));
    socket.on("live:chat", ({ sessionId, message }: { sessionId: string; message: string }) => {
      io?.to(`live:${sessionId}`).emit("live:chat", {
        from: user.sub,
        message,
        at: Date.now(),
      });
    });
    socket.on("whiteboard:draw", ({ sessionId, payload }: { sessionId: string; payload: unknown }) => {
      socket.to(`live:${sessionId}`).emit("whiteboard:draw", payload);
    });
    socket.on("dm:send", ({ to, message }: { to: string; message: string }) => {
      io?.to(`user:${to}`).emit("dm:receive", { from: user.sub, message, at: Date.now() });
    });

    socket.join(`user:${user.sub}`);
  });

  return io;
}

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialised");
  return io;
};
