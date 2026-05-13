import { Response } from "express";

export const ok = <T>(res: Response, data: T, message = "OK") =>
  res.status(200).json({ success: true, message, data });

export const created = <T>(res: Response, data: T, message = "Created") =>
  res.status(201).json({ success: true, message, data });

export const noContent = (res: Response) => res.status(204).send();

export const fail = (
  res: Response,
  status: number,
  message: string,
  errors?: unknown
) => res.status(status).json({ success: false, message, errors });

export function paginated<T>(
  res: Response,
  items: T[],
  total: number,
  page: number,
  pageSize: number
) {
  return res.status(200).json({
    success: true,
    data: items,
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  });
}
