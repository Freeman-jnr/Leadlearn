import { env } from "../config/env";
import crypto from "crypto";

const BASE = "https://api.paystack.co";

async function pk<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  const json = (await res.json()) as { status: boolean; message: string; data: T };
  if (!res.ok || !json.status) throw new Error(json.message || "Paystack error");
  return json.data;
}

export const paystack = {
  initialize: (payload: {
    email: string;
    amount: number; // kobo
    reference: string;
    callback_url?: string;
    metadata?: Record<string, unknown>;
  }) =>
    pk<{ authorization_url: string; access_code: string; reference: string }>(
      "/transaction/initialize",
      { method: "POST", body: JSON.stringify(payload) }
    ),

  verify: (reference: string) =>
    pk<{ status: string; amount: number; customer: { email: string } }>(
      `/transaction/verify/${reference}`
    ),

  verifyWebhook: (rawBody: string, signature: string) => {
    const hash = crypto
      .createHmac("sha512", env.PAYSTACK_SECRET_KEY!)
      .update(rawBody)
      .digest("hex");
    return hash === signature;
  },
};
