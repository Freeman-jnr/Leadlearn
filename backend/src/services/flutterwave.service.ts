import { env } from "../config/env";
import crypto from "crypto";

const BASE = "https://api.flutterwave.com/v3";

async function fw<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.FLUTTERWAVE_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  const json = (await res.json()) as { status: string; message: string; data: T };
  if (!res.ok || json.status !== "success")
    throw new Error(json.message || "Flutterwave error");
  return json.data;
}

export const flutterwave = {
  initiate: (payload: {
    tx_ref: string;
    amount: number;
    currency?: string;
    redirect_url: string;
    customer: { email: string; name: string; phonenumber?: string };
    meta?: Record<string, unknown>;
  }) => fw<{ link: string }>("/payments", { method: "POST", body: JSON.stringify(payload) }),

  verify: (id: string) =>
    fw<{ status: string; amount: number; tx_ref: string }>(
      `/transactions/${id}/verify`
    ),

  verifyWebhook: (signature: string) =>
    !!env.FLUTTERWAVE_WEBHOOK_HASH &&
    crypto.timingSafeEqual(
      Buffer.from(signature || ""),
      Buffer.from(env.FLUTTERWAVE_WEBHOOK_HASH)
    ),
};
