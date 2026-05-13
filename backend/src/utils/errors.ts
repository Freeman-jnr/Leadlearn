export class AppError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const BadRequest = (m = "Bad Request", d?: unknown) => new AppError(400, m, d);
export const Unauthorized = (m = "Unauthorized") => new AppError(401, m);
export const Forbidden = (m = "Forbidden") => new AppError(403, m);
export const NotFound = (m = "Not Found") => new AppError(404, m);
export const Conflict = (m = "Conflict") => new AppError(409, m);
export const TooMany = (m = "Too many requests") => new AppError(429, m);
export const ServerError = (m = "Internal Server Error") => new AppError(500, m);
