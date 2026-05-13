# LEAD LearnHub — Backend

Enterprise-grade Node.js / Express / TypeScript / Prisma backend for the
**LEAD LearnHub** EdTech ecosystem (LMS, live classrooms, CBT, marketplace,
tutor bookings, school management, payments).

> This is a **standalone backend** — separate from the Lovable frontend.
> Deploy it on Render, Railway, AWS, a VPS, or anywhere Node + Postgres + Redis run.

## 🧱 Stack

- Node.js 20 + Express 4 + TypeScript
- PostgreSQL + Prisma ORM
- Redis (rate-limit, BullMQ queues, cache)
- Socket.IO (live classrooms, chat, whiteboard)
- JWT (access + refresh)
- Cloudinary (file/image/video uploads) — AWS S3 also supported
- Paystack + Flutterwave payments
- Google OAuth (ID-token flow)
- Nodemailer (transactional email)
- BullMQ workers
- Swagger / OpenAPI 3 docs
- Helmet, CORS, compression, rate limiting, Zod validation
- Jest + Supertest

## 📁 Structure

```
backend/
├── prisma/
│   ├── schema.prisma     # 24+ models (Users, Courses, Live, Marketplace…)
│   └── seed.ts
├── src/
│   ├── app.ts            # Express app
│   ├── server.ts         # bootstrap
│   ├── config/           # env, prisma, redis
│   ├── middleware/       # auth, error, validate, rate-limit, upload
│   ├── services/         # email, cloudinary, paystack, flutterwave, google
│   ├── utils/            # jwt, crypto, errors, response, logger
│   ├── jobs/             # BullMQ queues + worker
│   ├── websocket/        # Socket.IO gateway
│   ├── docs/             # Swagger spec
│   └── modules/          # feature modules (auth, users, courses, …)
├── tests/
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

## 🚀 Quick start

```bash
cp .env.example .env
# Fill in DATABASE_URL, REDIS_URL, JWT secrets, etc.

npm install
npm run prisma:migrate          # creates tables
npm run prisma:seed             # seeds an admin user
npm run dev                     # API: http://localhost:4000
npm run worker                  # in another terminal: background jobs
```

Or with Docker:

```bash
docker compose up --build
```

## 📘 API Docs

- **Swagger UI**: `http://localhost:4000/docs`
- **Base URL**: `/api/v1`

## 🔐 Auth flow

`POST /api/v1/auth/register` → OTP emailed → `POST /api/v1/auth/verify-email`
→ `POST /api/v1/auth/login` → returns `{ accessToken, refreshToken }`.

Use `Authorization: Bearer <accessToken>` for protected routes.
Refresh via `POST /api/v1/auth/refresh`.

## 📡 WebSocket

Connect with `Authorization` token via `auth.token`:

```js
io("http://localhost:4000", { auth: { token: accessToken } })
  .emit("live:join", sessionId)
  .on("live:chat", console.log);
```

Events: `live:join`, `live:leave`, `live:chat`, `whiteboard:draw`,
`dm:send`, `dm:receive`, `live:status`.

## 💳 Payments

Initialize: `POST /api/v1/payments/initialize` (Paystack or Flutterwave).
Verify (server-to-server): `GET /api/v1/payments/verify/:reference`.
Webhooks: `/api/v1/payments/webhooks/paystack` and
`/api/v1/payments/webhooks/flutterwave` (signature-verified, raw body).

## 🧪 Tests

```bash
npm test
```

## 🛡️ Security

- Helmet, strict CORS allow-list (`CORS_ORIGIN` comma-separated)
- Redis-backed rate limiting (general + stricter for auth)
- Zod input validation on every mutating route
- Prisma parameterised queries (no raw SQL)
- Bcrypt password hashing (12 rounds)
- JWT access (15m) + rotating refresh tokens (7d, revoked on reset)
- OTP for email verification & password reset (15-min TTL)
- Webhook signature verification for Paystack & Flutterwave
- Soft deletes for users & courses; audit log table

## ☁️ Deployment

- **Render / Railway**: point at this directory; build = `npm run build`,
  start = `npm start`. Add a separate worker service running `npm run worker`.
- **AWS / VPS**: build the Docker image (`docker build -t learnhub-api .`)
  and run with `docker compose up`.
- Run `npm run prisma:deploy` on each release to apply migrations.

## 🔌 Connecting from the Lovable frontend

In the frontend, point requests to your deployed backend:

```ts
const API = import.meta.env.VITE_API_URL; // e.g. https://api.leadlearnhub.org/api/v1
fetch(`${API}/auth/login`, { ... })
```

Add the frontend origin to `CORS_ORIGIN` in `.env`.

---

Built for **LEAD – Leveraging on Education and Advocacy for Sustainable
Development Goals Initiative**.
